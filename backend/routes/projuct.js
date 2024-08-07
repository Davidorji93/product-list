
const express = require('express');
const jwt = require('jsonwebtoken');
const Product = require('../model/Product');
const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, 'secret');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

router.get('/products', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

router.post('/products', authMiddleware, async (req, res) => {
  const product = new Product({ ...req.body, createdBy: req.userId });
  await product.save();
  res.send(product);
});

router.put('/products/:id', authMiddleware, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(product);
});

router.delete('/products/:id', authMiddleware, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.send({ message: 'Product deleted' });
});

module.exports = router;
