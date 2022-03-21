const cors = require('cors');
const express = require('express');

const db = require('./db');
const { getProductByID, searchProducts } = require('./handler.js');
const helmet = require('helmet');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', async (request, response) => {
  // set default values for query parameters
  const { brand = '', page = 1, size = 12 } = request.query;
  // calculate skip value
  const skip = (parseInt(page) - 1) * parseInt(size);
  let products = [];
  if(brand === '') {
    products = await db.find({});
  } else {
    products = await db.find({
      'brand': brand
    });
  }
  // create metadata for the response that includes pagination info
  const meta = {
    count: products.length,
    currentPage: parseInt(page),
    pageCount: Math.ceil(products.length / size),
    pageSize: parseInt(size)
  };
  // slice the products array to include only the products for the current page and return the result
  if(products.length > 0) {
    response.send({
      success: true,
      data: {
        meta,
        result: products.slice(skip, skip + parseInt(size)),
      },
    });
  } else {
    response.send({
      success: false,
      data: {
        result: [],
        meta,
      }
    });
  }
  
});

// endpoint to get a product by its id
app.get('/products/:id', async (request, response) => {
  const product = await getProductByID(request);
  response.send(product);
});

// endpoint called search, to search for products
// this endpoint accepts the following query parameters:
// - brand: the brand to search for (default: all brands)
// - price: the price to search for (default: all prices)
// - limit: the number of products to return (default: 12)


app.get('/search', async (request, response) => {  
  const products = await searchProducts(request);
  response.send(products);
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
