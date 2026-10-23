const express = require('express');
const { randomUUID } = require('crypto');

const app = express();
app.use(express.json());

// Persistencia en memoria: se pierde al reiniciar el proceso.
const productos = [];

function validarProducto(body) {
  const { nombre, precio, stock } = body ?? {};

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return 'nombre debe ser un string no vacío';
  }
  if (typeof precio !== 'number' || precio < 0) {
    return 'precio debe ser un número mayor o igual a 0';
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return 'stock debe ser un entero mayor o igual a 0';
  }
  return null;
}

app.get('/productos', (req, res) => {
  res.json(productos);
});

app.post('/productos', (req, res) => {
  const error = validarProducto(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const { nombre, precio, stock } = req.body;
  const producto = { id: randomUUID(), nombre: nombre.trim(), precio, stock };
  productos.push(producto);

  res.status(201).json(producto);
});

app.put('/productos/:id', (req, res) => {
  const producto = productos.find((p) => p.id === req.params.id);
  if (!producto) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  const error = validarProducto(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const { nombre, precio, stock } = req.body;
  Object.assign(producto, { nombre: nombre.trim(), precio, stock });

  res.json(producto);
});

app.delete('/productos/:id', (req, res) => {
  const index = productos.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  productos.splice(index, 1);
  res.status(204).send();
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`API escuchando en el puerto ${port}`);
});
