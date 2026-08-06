import { BadRequestException } from '@nestjs/common';
import { VentaService } from './venta.service';
import { createMockRepository, MockRepository } from '../common/testing/mock-repository';

jest.mock('./factura-pdf', () => ({
  generarFacturaPdf: jest.fn().mockResolvedValue(Buffer.from('pdf')),
  money: jest.fn((v: any) => String(v)),
  fechaCorta: jest.fn(() => '01/01/2026'),
}));
jest.mock('./nota-credito-pdf', () => ({
  generarNotaCreditoPdf: jest.fn().mockResolvedValue(Buffer.from('pdf')),
}));
jest.mock('./venta-excel', () => ({
  generarReporteExcel: jest.fn().mockResolvedValue(Buffer.from('xlsx')),
}));

describe('VentaService', () => {
  let service: VentaService;
  let ventaRepo: MockRepository;
  let clienteRepo: MockRepository;
  let usuarioRepo: MockRepository;
  let detalleVentaRepo: MockRepository;
  let productoRepo: MockRepository;
  let historialStockRepo: MockRepository;
  let facturaEmailService: { enviarFactura: jest.Mock };

  beforeEach(() => {
    ventaRepo = createMockRepository();
    clienteRepo = createMockRepository();
    usuarioRepo = createMockRepository();
    detalleVentaRepo = createMockRepository();
    productoRepo = createMockRepository();
    historialStockRepo = createMockRepository();
    facturaEmailService = { enviarFactura: jest.fn().mockResolvedValue(undefined) };

    service = new VentaService(
      ventaRepo as any,
      clienteRepo as any,
      usuarioRepo as any,
      detalleVentaRepo as any,
      productoRepo as any,
      historialStockRepo as any,
      facturaEmailService as any,
    );

    // findOne() usado internamente por calcularTotal()/cancelarVenta() (envío de factura fire-and-forget)
    ventaRepo.findOne.mockResolvedValue({
      id: 1,
      numero_venta: 'VZ-000001',
      estado: 'PAGADA',
      detalles_venta: [],
    });
  });

  describe('create — numeración de ventas', () => {
    it('busca la ultima venta incluyendo las eliminadas logicamente (withDeleted)', async () => {
      clienteRepo.findOneBy.mockResolvedValue({ id: 8 });
      usuarioRepo.findOneBy.mockResolvedValue({ id: 'user-1' });
      ventaRepo.findOne.mockResolvedValueOnce(null); // ninguna venta previa

      await service.create({ id_cliente: 8, id_usuario: 'user-1', impuesto: 0, total: 0 } as any);

      expect(ventaRepo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ withDeleted: true }),
      );
    });

    it('numera VZ-000001 cuando no hay ninguna venta previa', async () => {
      clienteRepo.findOneBy.mockResolvedValue({ id: 8 });
      usuarioRepo.findOneBy.mockResolvedValue({ id: 'user-1' });
      ventaRepo.findOne.mockResolvedValueOnce(null);

      await service.create({ id_cliente: 8, id_usuario: 'user-1', impuesto: 0, total: 0 } as any);

      expect(ventaRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ numero_venta: 'VZ-000001' }),
      );
    });

    it('continua la numeracion aunque la ultima venta (incluida por withDeleted) este eliminada', async () => {
      clienteRepo.findOneBy.mockResolvedValue({ id: 8 });
      usuarioRepo.findOneBy.mockResolvedValue({ id: 'user-1' });
      ventaRepo.findOne.mockResolvedValueOnce({ numero_venta: 'VZ-000032', deletedAt: new Date() });

      await service.create({ id_cliente: 8, id_usuario: 'user-1', impuesto: 0, total: 0 } as any);

      expect(ventaRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ numero_venta: 'VZ-000033' }),
      );
    });
  });

  describe('calcularTotal — venta a credito', () => {
    it('suma el total a la deuda del cliente cuando la venta esta PENDIENTE (fiado)', async () => {
      detalleVentaRepo.find.mockResolvedValue([
        { subtotal: '50000.00' },
        { subtotal: '60000.00' },
      ]);
      ventaRepo.findOneBy.mockResolvedValue({
        id: 1,
        estado: 'PENDIENTE',
        cliente: { id: 8, saldo_deuda: '10000.00' },
      });

      await service.calcularTotal(1);

      expect(clienteRepo.update).toHaveBeenCalledWith(8, { saldo_deuda: '120000.00' });
    });

    it('NO toca la deuda del cliente si la venta se pago de contado (PAGADA)', async () => {
      detalleVentaRepo.find.mockResolvedValue([{ subtotal: '50000.00' }]);
      ventaRepo.findOneBy.mockResolvedValue({
        id: 1,
        estado: 'PAGADA',
        cliente: { id: 8, saldo_deuda: '0.00' },
      });

      await service.calcularTotal(1);

      expect(clienteRepo.update).not.toHaveBeenCalled();
    });

    it('calcula el total como la suma de los subtotales de cada detalle', async () => {
      detalleVentaRepo.find.mockResolvedValue([
        { subtotal: '10.50' },
        { subtotal: '5.25' },
      ]);
      ventaRepo.findOneBy.mockResolvedValue({ id: 1, estado: 'PAGADA', cliente: null });

      const total = await service.calcularTotal(1);

      expect(total).toBe('15.75');
      expect(ventaRepo.update).toHaveBeenCalledWith(1, { total: '15.75' });
    });
  });

  describe('cancelarVenta — devolucion y reposicion de stock', () => {
    it('repone el stock de cada producto y crea el historial de entrada por devolucion', async () => {
      const producto = { id: 2, nombre: 'Mouse', stock: 93 };
      ventaRepo.findOne.mockResolvedValue({
        id: 1,
        numero_venta: 'VZ-000001',
        estado: 'PAGADA',
        detalles_venta: [{ producto, cantidad: 2 }],
      });

      await service.cancelarVenta(1, 'Producto defectuoso');

      expect(producto.stock).toBe(95);
      expect(productoRepo.save).toHaveBeenCalledWith(expect.objectContaining({ stock: 95 }));
      expect(historialStockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          tipo_movimiento: 'entrada_devolucion',
          cantidad: 2,
          stock_anterior: 93,
          stock_nuevo: 95,
        }),
      );
    });

    it('marca la venta como CANCELADA con motivo y fecha de cancelacion', async () => {
      const venta = {
        id: 1,
        numero_venta: 'VZ-000001',
        estado: 'PENDIENTE',
        detalles_venta: [],
      };
      ventaRepo.findOne.mockResolvedValue(venta);

      const resultado = await service.cancelarVenta(1, 'Ya no lo quiere');

      expect(resultado.estado).toBe('CANCELADA');
      expect(resultado.motivo_cancelacion).toBe('Ya no lo quiere');
      expect(resultado.fecha_cancelacion).toBeInstanceOf(Date);
      expect(ventaRepo.save).toHaveBeenCalledWith(resultado);
    });

    it('no permite cancelar una venta que ya esta cancelada', async () => {
      ventaRepo.findOne.mockResolvedValue({ id: 1, estado: 'CANCELADA', detalles_venta: [] });

      await expect(service.cancelarVenta(1)).rejects.toThrow(BadRequestException);
      expect(productoRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('remove/restaurar', () => {
    it('borra pasando el id (no el objeto) al softDelete del repositorio', async () => {
      await service.remove(1);

      expect(ventaRepo.softDelete).toHaveBeenCalledWith(1);
    });

    it('devuelve un objeto JSON serializable al eliminar', async () => {
      const resultado = await service.remove(1);

      expect(resultado).toEqual({ message: 'Venta eliminada exitosamente' });
    });
  });
});
