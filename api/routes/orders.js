const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order
        .find()
        .select('product quantity _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        ...doc._doc,
                        request: {
                            type: 'GET',
                            description: 'GET_THIS_ORDER',
                            url: process.env.URL + '/orders/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });

            return order.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                request: {
                    type: 'GET',
                    description: 'GET_THIS_ORDER',
                    url: process.env.URL + '/orders/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

router.get('/:id', (req, res, next) => {
    Order
        .findById(req.params.id)
        .select('_id product quantity')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                });
            }
            res.status(200).json({
                ...order._doc,
                request: {
                    type: 'GET',
                    description: 'GET_ALL_ORDERS',
                    url: process.env.URL + '/orders'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.delete('/:id', (req, res, next) => {
    Order
        .remove({ _id: req.params.id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'GET',
                    description: 'GET_ALL_ORDERS',
                    url: process.env.URL + '/orders'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;