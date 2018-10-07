const mongoose = require('mongoose');

const Product = require('../models/product');

exports.getAll = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {

            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        ...doc._doc,
                        request: {
                            type: 'GET',
                            description: 'GET_THIS_PRODUCT',
                            url: process.env.URL + '/products/' + doc._id
                        }
                    }
                })
            };

            if (docs.length > 0) {
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: 'No products found'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.create = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Product created successfully',
                createdProduct: {
                    ...result._doc,
                    request: {
                        type: 'GET',
                        description: 'GET_THIS_PRODUCT',
                        url: process.env.URL + '/products/' + result._doc._id
                    }
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
    const id = req.params.id;

    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'GET_ALL_PRODUCT',
                        url: process.env.URL + '/products'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No valid entry found for the provided ID'
                });
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        });

}

exports.update = (req, res, next) => {
    const id = req.params.id;

    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated succesfully',
                request: {
                    type: 'GET',
                    description: 'GET_THIS_PRODUCT',
                    url: process.env.URL + '/products/' + doc._id
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

exports.delete = (req, res, next) => {
    const id = req.params.id;

    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: `Product deleted sucssesfully`,
                request: {
                    type: 'GET',
                    description: 'GET_ALL_PRODUCT',
                    url: process.env.URL + '/products'
                }
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        });
}