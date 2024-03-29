const Router = require('express');
const router = new Router();
const ordersController = require('../controllers/orders.controller.js');

router.post('/', ordersController.getOrders);

module.exports = router;
