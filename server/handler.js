const db = require('./db');

async function getProductByID(request) {
    const { id } = request.query;
    return await db.find({
      '_id': id
    });
  }

  async function searchProducts(request){
    const { brand = 'all', price = 'all', limit = 12 } = request.query;
    let products = [];
    if(brand === 'all' && price === 'all') {
      products = await db.find_limit({}, parseInt(limit));
    } else if(brand === 'all') {
      products = await db.find_limit({'price': parseInt(price)}, parseInt(limit));
  
    } else if(price === 'all') {
      products = await db.find_limit({'brand': brand}, parseInt(limit));
    } else {
      products = await db.find_limit({
        'brand': brand,
        'price': parseInt(price)
      },
        parseInt(limit)
      );
    }
    return products;
  }

  module.exports = {
    getProductByID,
    searchProducts,
    };