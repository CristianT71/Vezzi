// Carga el catalogo inicial (categorias y productos) de VEZZI llamando a la API REST.
// Uso:
//   API_BASE_URL=http://localhost:3000/api ADMIN_USER=admin ADMIN_PASS=admin123 node scripts/seed-catalogo.js
// Si no se definen las variables de entorno, apunta a http://localhost:3000/api con admin/admin123.

const API = process.env.API_BASE_URL || 'http://localhost:3000/api';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

const categorias = [
  { nombre: 'Bebidas', descripcion: 'Gaseosas, jugos, aguas y energéticas' },
  { nombre: 'Snacks', descripcion: 'Papas, chitos, galletas, chocolates y dulces' },
  { nombre: 'Lácteos', descripcion: 'Leches, yogures, quesos y mantequillas' },
  { nombre: 'Abarrotes', descripcion: 'Arroz, aceites, granos, enlatados y despensa' },
  { nombre: 'Limpieza', descripcion: 'Detergentes, jabones, desinfectantes y papel higiénico' },
  { nombre: 'Cuidado Personal', descripcion: 'Shampoo, jabones, cremas, desodorantes e higiene' },
  { nombre: 'Frutas y Verduras', descripcion: 'Frutas frescas y verduras de temporada' },
  { nombre: 'Carnes y Embutidos', descripcion: 'Carne, pollo, cerdo, salchichas y jamones' },
  { nombre: 'Panadería', descripcion: 'Pan, arepas, bollos y productos de panadería' },
  { nombre: 'Congelados', descripcion: 'Helados, comidas congeladas y vegetales congelados' },
  { nombre: 'Licores', descripcion: 'Cervezas, vinos, aguardientes y licores' },
  { nombre: 'Cigarrillos', descripcion: 'Cigarrillos y productos de tabaco' },
  { nombre: 'Mascotas', descripcion: 'Alimento, arena y accesorios para perros y gatos' },
  { nombre: 'Bebés', descripcion: 'Pañales, leche de fórmula y productos para bebé' },
  { nombre: 'Farmacia Básica', descripcion: 'Analgésicos, vitaminas y medicamentos de venta libre' },
  { nombre: 'Hogar', descripcion: 'Artículos de cocina, limpieza del hogar y utensilios' },
  { nombre: 'Papelería', descripcion: 'Cuadernos, lápices, bolígrafos y útiles escolares' },
  { nombre: 'Tecnología Básica', descripcion: 'Cargadores, audífonos y accesorios electrónicos' },
  { nombre: 'Deportes', descripcion: 'Pelotas, guantes y artículos deportivos básicos' },
  { nombre: 'Automotriz', descripcion: 'Aceites de motor, lubricantes y accesorios de carro' },
  { nombre: 'Jardinería', descripcion: 'Tierra, fertilizantes y herramientas de jardín' },
  { nombre: 'Dulces y Confitería', descripcion: 'Chocolates, confites, gomas y dulces colombianos' },
];

// Nota: en la lista original "Pañales Pampers" traia el mismo codigo BEB-001
// que "Coca-Cola 400ml" (error de copiado, ambos con prefijo BEB pero categorias
// distintas). Se le asigno el codigo BB-001 (Bebes) para no duplicar codigo.
const productos = [
  ['BEB-001', 'Coca-Cola 400ml', 1800, 3200, 150, 30, 'Bebidas'],
  ['BEB-002', 'Postobón Manzana 400ml', 1500, 2800, 180, 30, 'Bebidas'],
  ['BEB-003', 'Agua Brisa 600ml', 800, 1800, 250, 40, 'Bebidas'],
  ['BEB-004', 'Gatorade Naranja 500ml', 2200, 4500, 80, 15, 'Bebidas'],
  ['BEB-005', 'Red Bull 250ml', 4500, 8900, 50, 10, 'Bebidas'],
  ['SNK-001', 'Papas Margarita Natural 150g', 2800, 5500, 120, 25, 'Snacks'],
  ['SNK-002', 'Chitos Queso 150g', 2500, 5000, 100, 20, 'Snacks'],
  ['SNK-003', 'DeTodito BBQ 150g', 2600, 5200, 90, 20, 'Snacks'],
  ['SNK-004', 'Chocolatina Jet 12g', 400, 900, 300, 50, 'Snacks'],
  ['SNK-005', 'Galletas Festival 6 und', 1800, 3500, 110, 20, 'Snacks'],
  ['LAC-001', 'Leche Alquería Entera 1L', 3200, 5800, 140, 25, 'Lácteos'],
  ['LAC-002', 'Yogurt Alpina Fresa 1L', 4500, 8200, 70, 15, 'Lácteos'],
  ['LAC-003', 'Queso Campesino Colanta 500g', 8500, 14900, 45, 10, 'Lácteos'],
  ['LAC-004', 'Mantequilla La Fina 250g', 5200, 9500, 60, 12, 'Lácteos'],
  ['ABA-001', 'Arroz Diana 1kg', 3800, 6500, 200, 40, 'Abarrotes'],
  ['ABA-002', 'Aceite Premier 1L', 7500, 12900, 90, 20, 'Abarrotes'],
  ['ABA-003', 'Fríjol Cargamanto 500g', 4200, 7800, 80, 15, 'Abarrotes'],
  ['ABA-004', "Atún Van Camp's 170g", 3500, 6900, 100, 20, 'Abarrotes'],
  ['ABA-005', 'Azúcar Manuelita 1kg', 3000, 5500, 150, 30, 'Abarrotes'],
  ['LIM-001', 'Detergente Fab 1kg', 9500, 16900, 55, 12, 'Limpieza'],
  ['LIM-002', 'Cloro Blanqueador 1L', 2800, 5500, 80, 15, 'Limpieza'],
  ['LIM-003', 'Papel Higiénico Familia 4 rollos', 5500, 10900, 100, 20, 'Limpieza'],
  ['LIM-004', 'Jabón Rey 3 und', 3200, 6500, 70, 15, 'Limpieza'],
  ['CUI-001', 'Shampoo Head & Shoulders 400ml', 14500, 26900, 40, 10, 'Cuidado Personal'],
  ['CUI-002', 'Jabón Dove 90g', 2800, 5500, 90, 20, 'Cuidado Personal'],
  ['CUI-003', 'Pasta Dental Colgate 90g', 4200, 8500, 75, 15, 'Cuidado Personal'],
  ['CUI-004', 'Desodorante Rexona 150ml', 7800, 14900, 55, 12, 'Cuidado Personal'],
  ['FYV-001', 'Banano (kg)', 1800, 3500, 80, 15, 'Frutas y Verduras'],
  ['FYV-002', 'Tomate Chonto (kg)', 2500, 4800, 60, 12, 'Frutas y Verduras'],
  ['FYV-003', 'Papa Criolla (kg)', 2200, 4200, 90, 20, 'Frutas y Verduras'],
  ['FYV-004', 'Aguacate Hass (unidad)', 2800, 5500, 50, 10, 'Frutas y Verduras'],
  ['CAR-001', 'Pechuga de Pollo (kg)', 9500, 15900, 40, 8, 'Carnes y Embutidos'],
  ['CAR-002', 'Carne de Res Molida (kg)', 14500, 24900, 30, 8, 'Carnes y Embutidos'],
  ['CAR-003', 'Salchicha Ranchera 500g', 6500, 12500, 55, 12, 'Carnes y Embutidos'],
  ['PAN-001', 'Arepa de Maíz (paquete x10)', 3500, 6900, 80, 15, 'Panadería'],
  ['PAN-002', 'Pan Tajado Bimbo 500g', 4200, 7900, 60, 12, 'Panadería'],
  ['CON-001', 'Helado Popsy Vainilla 1L', 8500, 15900, 35, 8, 'Congelados'],
  ['CON-002', 'Pizza Congelada Familiar', 12500, 22900, 25, 6, 'Congelados'],
  ['LIC-001', 'Cerveza Águila 330ml (x6)', 9500, 16900, 70, 15, 'Licores'],
  ['LIC-002', 'Club Colombia Dorada 330ml (x6)', 12500, 22900, 50, 12, 'Licores'],
  ['LIC-003', 'Aguardiente Antioqueño 750ml', 28000, 48900, 30, 8, 'Licores'],
  ['CIG-001', 'Marlboro Rojo 20 und', 8500, 14500, 60, 15, 'Cigarrillos'],
  ['MAS-001', 'Dog Chow Adulto 2kg', 18500, 32900, 40, 10, 'Mascotas'],
  ['MAS-002', 'Arena para Gato 4kg', 12500, 22900, 35, 8, 'Mascotas'],
  ['BB-001', 'Pañales Pampers Etapa 3 (x30)', 32000, 54900, 25, 6, 'Bebés'],
  ['FAR-001', 'Acetaminofén 500mg (x20)', 3500, 7500, 80, 15, 'Farmacia Básica'],
  ['FAR-002', 'Vitamina C 500mg (x30)', 8500, 15900, 45, 10, 'Farmacia Básica'],
  ['HOG-001', 'Esponja Scotch Brite 2 und', 2800, 5500, 70, 15, 'Hogar'],
  ['PAP-001', 'Cuaderno Norma 100 hojas', 3200, 6500, 90, 20, 'Papelería'],
  ['TEC-001', 'Cargador USB Tipo C', 8500, 16900, 40, 10, 'Tecnología Básica'],
  ['DEP-001', 'Pelota de Fútbol N°5', 18000, 34900, 20, 5, 'Deportes'],
  ['AUT-001', 'Aceite de Motor 20W50 1L', 14500, 26900, 30, 8, 'Automotriz'],
  ['JAR-001', 'Tierra Abonada 5kg', 6500, 12500, 40, 10, 'Jardinería'],
  ['DUL-001', 'Chocolatina Jet Clásica 12g', 400, 900, 250, 50, 'Dulces y Confitería'],
  ['DUL-002', 'Bombones Rellenos 100g', 2500, 5200, 80, 15, 'Dulces y Confitería'],
  ['DUL-003', 'Gomas Trululu 100g', 1800, 3800, 100, 20, 'Dulces y Confitería'],
];

async function main() {
  const loginRes = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre_usuario: ADMIN_USER, password: ADMIN_PASS }),
  });
  if (!loginRes.ok) {
    console.error('Login fallo:', loginRes.status, await loginRes.text());
    process.exit(1);
  }
  const { access_token } = await loginRes.json();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`,
  };

  const idPorNombre = {};
  for (const cat of categorias) {
    const res = await fetch(`${API}/categoria`, {
      method: 'POST',
      headers,
      body: JSON.stringify(cat),
    });
    if (res.ok) {
      const data = await res.json();
      idPorNombre[cat.nombre] = data.id;
      console.log(`OK categoria: ${cat.nombre} -> id ${data.id}`);
    } else {
      const err = await res.json().catch(() => ({}));
      console.error(`FALLO categoria ${cat.nombre}:`, res.status, err.message || err);
    }
  }

  // Por si alguna categoria ya existia (409), busca su id real
  const faltantes = categorias.filter((c) => !idPorNombre[c.nombre]);
  if (faltantes.length) {
    const listRes = await fetch(`${API}/categoria?limit=100`, { headers });
    const listData = await listRes.json();
    for (const c of listData.data || []) {
      if (!idPorNombre[c.nombre]) idPorNombre[c.nombre] = c.id;
    }
  }

  let ok = 0;
  let fail = 0;
  for (const [codigo, nombre, costo, precio_venta, stock, stock_minimo, catNombre] of productos) {
    const id_categoria = idPorNombre[catNombre];
    if (!id_categoria) {
      console.error(`SIN CATEGORIA para producto ${codigo} (${catNombre})`);
      fail++;
      continue;
    }
    const res = await fetch(`${API}/producto`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ codigo, nombre, costo, precio_venta, stock, stock_minimo, id_categoria }),
    });
    if (res.ok) {
      ok++;
    } else {
      fail++;
      const err = await res.json().catch(() => ({}));
      console.error(`FALLO producto ${codigo} - ${nombre}:`, res.status, err.message || err);
    }
  }
  console.log(`\nProductos creados: ${ok}, fallidos: ${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
