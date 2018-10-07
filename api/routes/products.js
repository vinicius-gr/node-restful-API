const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/authorization');

// Organazing image uploading
const fileFilter = (req, file, cb) => {
    (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') 
        ? cb(null, true) 
        : cb(new Error('File type not supported'), false);
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toDateString() + file.originalname);
    }
});

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: Math.pow(1024,2) * 5
    },
    fileFilter: fileFilter
});
// Organazing image uploading

const ProductsController = require('../controllers/products');

router.get('/', ProductsController.getAll);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.create);

router.get('/:id', ProductsController.get);

router.patch('/:id', checkAuth, ProductsController.update);

router.delete('/:id', checkAuth, ProductsController.delete);

module.exports = router;