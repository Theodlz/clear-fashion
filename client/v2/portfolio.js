// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');

const filterPrice = document.querySelector('#btn-price');
const filterRecent = document.querySelector('#btn-recent');

const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12, brand="") => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}&brand=${brand}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(selectPage.value, parseInt(event.target.value),selectBrand.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectPage.addEventListener('change', async (event) => {
  const products = await fetchProducts(parseInt(event.target.value),selectShow.value,selectBrand.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectBrand.addEventListener('change', async (event) => {
  const products = await fetchProducts(selectPage.value,selectShow.value,event.target.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

filterRecent.addEventListener('click', async (event) => {
  const products = await fetchProducts(selectPage.value,selectShow.value,selectBrand.value);

  if(filterRecent.style.backgroundColor == "lightblue"){
    filterRecent.style.backgroundColor = "lightgrey";
      
  }
  else{
    filterRecent.style.backgroundColor = "lightblue"
    for (let i = 0; i < products.result.length; i++) {
      var miliseconds = (new Date()) - (new Date(products.result[i].released))
      var days = miliseconds/1000/3600/24
      if(days>30){
        delete products.result[i]
      }
    }
  }

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

filterPrice.addEventListener('click', async (event) => {
  const products = await fetchProducts(selectPage.value,selectShow.value,selectBrand.value);

  if(filterPrice.style.backgroundColor == "lightblue"){
    filterPrice.style.backgroundColor = "lightgrey";
      
  }
  else{
    filterPrice.style.backgroundColor = "lightblue"
    for (let i = 0; i < products.result.length; i++) {
      if(products.result[i].price > 50){
        delete products.result[i]
      }
    }
  }

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});
