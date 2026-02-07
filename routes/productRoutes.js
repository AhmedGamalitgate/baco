const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware'); 
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  deleteProduct, 
  searchProducts 
} = require('../controllers/productController');


router.get('/', getProducts);


router.post('/', upload.single('image'), createProduct); 

router.get('/search/:keyword', searchProducts);

router.get('/:id', getProductById);

router.delete('/:id', deleteProduct);

module.exports = router;