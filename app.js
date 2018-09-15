const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

const DB_URL = 'mongodb+srv://user-0:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop-1dihy.mongodb.net/test?retryWrites=true'

mongoose.connect(
    DB_URL,
    { useMongoClient: true },
    (err, db) => {
        db ? console.log('Connected to the database') : console.log(err);
    }
);

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header(
        'Access-Control-Allow-Origin',
        '*'
    );

    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Acces-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
        return res.status(200).json({});
    }

    next();
});

app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;