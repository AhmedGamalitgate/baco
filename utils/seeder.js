const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const categoriesData = [
  {
    category: 'Electronics',
    brands: ['Apple iPhone', 'Samsung Galaxy', 'Google Pixel', 'Oppo', 'Huawei', 'Xiaomi'],
    models: ['Pro Max', 'Ultra', 'Plus', 'Lite', 'Neo', 'Series X'],
    keywords: 'smartphone,mobile,phone'
  },
  {
    category: 'Laptops',
    brands: ['MacBook', 'Dell XPS', 'HP Spectre', 'Lenovo ThinkPad', 'Asus ROG', 'Acer Predator'],
    models: ['2024 Edition', 'Gaming Laptop', 'Business Pro', 'Slim Book', 'Touchscreen'],
    keywords: 'laptop,computer'
  },
  {
    category: 'Medical Supplies',
    brands: ['Omron', 'Beurer', 'Philips', 'Dettol', '3M', 'Rossmax'],
    models: ['Digital Monitor', 'Infrared Thermometer', 'Pulse Oximeter', 'First Aid Kit', 'Nebulizer'],
    keywords: 'medical,health,pharmacy'
  },
  {
    category: 'Home & Kitchen',
    brands: ['LG', 'Sony', 'Panasonic', 'Black & Decker', 'Toshiba', 'Kenwood'],
    models: ['Smart TV', 'Air Fryer', 'Microwave Oven', 'Vacuum Cleaner', 'Coffee Maker'],
    keywords: 'home,kitchen,appliance'
  },
  {
    category: 'Fashion',
    brands: ['Nike', 'Adidas', 'Zara', 'H&M', 'Puma', 'Gucci'],
    models: ['Sport Edition', 'Summer Collection', 'Cotton T-Shirt', 'Running Shoes', 'Leather Jacket'],
    keywords: 'fashion,clothes,shoes'
  },
  {
    category: 'Beauty',
    brands: ['L’Oréal', 'Nivea', 'Dove', 'Maybelline', 'Vichy', 'Clinique'],
    models: ['Skin Care Cream', 'Moisturizer', 'Hair Serum', 'Perfume Gold', 'Face Wash'],
    keywords: 'beauty,makeup,cosmetic'
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    const products = [];

    categoriesData.forEach((cat) => {
      for (let i = 1; i <= 100; i++) {
        const brand = cat.brands[Math.floor(Math.random() * cat.brands.length)];
        const model = cat.models[Math.floor(Math.random() * cat.models.length)];
        const productName = `${brand} ${model} #${i}`;
        
        products.push({
          name: productName,
          description: `The all-new ${productName}. This high-quality ${cat.category.toLowerCase()} item from ${brand} is designed to provide the best performance and durability. Features include modern design and premium materials.`,
          price: Math.floor(Math.random() * (1500 - 20 + 1)) + 20, 
          rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1), 
          image: `https://loremflickr.com/400/400/${cat.keywords}?lock=${cat.category}${i}`,
          category: cat.category,
          stock: Math.floor(Math.random() * 50) + 1,
        });
      }
    });

    await Product.insertMany(products);
    console.log('✅ Done! 600 unique products across 6 categories added successfully.');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();