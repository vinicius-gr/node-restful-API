const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.getAll = (req, res, next) => {
    Order
        .find()
        .select('product quantity _id')
        .populate('product', 'name')
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
}

exports.create = (req, res, next) => {
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
}

exports.get = (req, res, next) => {
    Order
        .findById(req.params.id)
        .select('_id product quantity')
        .populate('product')
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
}

exports.delete = (req, res, next) => {
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
}