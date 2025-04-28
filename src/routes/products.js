// src/routes/products.js
import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('productos.json');

// GET productos
router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

// POST agregar producto
router.post('/', async (req, res) => {
  const newProduct = req.body;
  await productManager.addProduct(newProduct);

  // Emitir evento a todos los clientes
  const io = req.app.locals.io;
  const products = await productManager.getProducts();
  io.emit('updateProducts', products);

  res.status(201).json({ message: 'Producto agregado exitosamente' });
});


// Actualizar producto por ID
router.put('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid);
  const updatedData = req.body;

  const products = await productManager.getProducts();
  const index = products.findIndex(p => p.id === pid);

  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  products[index] = { ...products[index], ...updatedData };
  await productManager.saveProducts(products);

  // Emitimos actualización a todos los clientes
  const io = req.app.locals.io;
  io.emit('updateProducts', products);

  res.json(products[index]);
});


// Eliminar producto por ID
router.delete('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid);

  const products = await productManager.getProducts();
  const index = products.findIndex(p => p.id === pid);

  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  products.splice(index, 1);
  await productManager.saveProducts(products);

  // Emitimos actualización en tiempo real
  const io = req.app.locals.io;
  io.emit('updateProducts', products);

  res.json({ message: 'Producto eliminado correctamente' });
});



export default router;
