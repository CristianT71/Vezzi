import ExcelJS from 'exceljs';
import { Venta } from './entities/venta.entity';
import { fechaCorta } from './factura-pdf';

const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF0F172A' },
};
const CURRENCY_FORMAT = '"$" #,##0.00';

export async function generarReporteExcel(ventas: Venta[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'VEZZI';
  workbook.created = new Date();

  const hojaVentas = workbook.addWorksheet('Ventas');
  hojaVentas.columns = [
    { header: 'Nº Venta', key: 'numero_venta', width: 16 },
    { header: 'Fecha', key: 'fecha', width: 14 },
    { header: 'Cliente', key: 'cliente', width: 26 },
    { header: 'Vendedor', key: 'vendedor', width: 22 },
    { header: 'Estado', key: 'estado', width: 14 },
    { header: 'Subtotal', key: 'subtotal', width: 16 },
    { header: 'Impuesto', key: 'impuesto', width: 16 },
    { header: 'Total', key: 'total', width: 16 },
  ];

  for (const venta of ventas) {
    const subtotal = (venta.detalles_venta ?? []).reduce((sum, d) => sum + (Number(d.subtotal) || 0), 0);
    hojaVentas.addRow({
      numero_venta: venta.numero_venta,
      fecha: fechaCorta(venta.fecha_venta),
      cliente: venta.cliente?.nombre ?? 'Sin cliente',
      vendedor: venta.usuario?.nombre_completo ?? '-',
      estado: venta.estado,
      subtotal,
      impuesto: Number(venta.impuesto) || 0,
      total: Number(venta.total) || 0,
    });
  }
  ['subtotal', 'impuesto', 'total'].forEach((key) => {
    hojaVentas.getColumn(key).numFmt = CURRENCY_FORMAT;
  });

  const hojaDetalle = workbook.addWorksheet('Detalle de productos');
  hojaDetalle.columns = [
    { header: 'Nº Venta', key: 'numero_venta', width: 16 },
    { header: 'Producto', key: 'producto', width: 32 },
    { header: 'Cantidad', key: 'cantidad', width: 12 },
    { header: 'Precio unitario', key: 'precio_unitario', width: 16 },
    { header: 'Subtotal', key: 'subtotal', width: 16 },
  ];

  for (const venta of ventas) {
    for (const detalle of venta.detalles_venta ?? []) {
      hojaDetalle.addRow({
        numero_venta: venta.numero_venta,
        producto: detalle.producto?.nombre ?? '-',
        cantidad: detalle.cantidad,
        precio_unitario: Number(detalle.precio_unitario) || 0,
        subtotal: Number(detalle.subtotal) || 0,
      });
    }
  }
  ['precio_unitario', 'subtotal'].forEach((key) => {
    hojaDetalle.getColumn(key).numFmt = CURRENCY_FORMAT;
  });

  for (const hoja of [hojaVentas, hojaDetalle]) {
    const filaEncabezado = hoja.getRow(1);
    filaEncabezado.eachCell((cell) => {
      cell.fill = HEADER_FILL;
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      cell.alignment = { vertical: 'middle' };
    });
    filaEncabezado.height = 20;
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
