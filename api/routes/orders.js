const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/authorization');

const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.getAll);

router.post('/', checkAuth, OrdersController.create);

router.get('/:id', checkAuth, OrdersController.get);

router.delete('/:id', checkAuth, OrdersController.delete);

module.exports = router;