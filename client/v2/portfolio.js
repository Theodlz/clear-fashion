// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const filterReasonable = document.querySelector('#reasonable-price');
const filterRecentlyReleased = document.querySelector('#recently-released')
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
const fetchProducts = async (page = 1, size = 12, brand="", reasonnable_price=false, recently_released=false) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}&brand=${brand}`
    );
    let body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
      }
    if (reasonnable_price) {
        body.data.result = body.data.result.filter(item => item.price < 50);
    }
    if (recently_released) {
        body.data.result = body.data.result.filter(item => ((new Date() - new Date(item.released)) / (1000 * 3600 * 24 * 7) ) < 8);
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
        <button style="border: none; background : none; color:#8FB8C1; font-size : 20px;" onclick= AddToFavorites('${product.uuid}')>${"&#10084;"}</button>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

const AddToFavorites = function (uuid) {

}

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
    const products = await fetchProducts(currentPagination.value, parseInt(event.target.value), selectBrand.value, filterReasonable.checked, filterRecentlyReleased.checked);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});
/*
 Feature 1 - Browse pages
As a user
I want to browse available pages
So that I can load more products
*/
selectPage.addEventListener('change', async (event) => {
    const products = await fetchProducts(parseInt(event.target.value), selectShow.value, selectBrand.value, filterReasonable.checked, filterRecentlyReleased.checked);
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});
/*
Feature 2 - Filter by brands
As a user
I want to filter by brands name
So that I can browse product for a specific brand
*/
selectBrand.addEventListener('change', async (event) => {
    let products = await fetchProducts(currentPagination.value, selectShow.value, event.target.value, filterReasonable.checked, filterRecentlyReleased.checked);
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});

/*

Feature 3 - Filter by recent products
As a user
I want to filter by by recent products
So that I can browse the new released products (less than 2 weeks)
*/
filterRecentlyReleased.addEventListener('click', async (event) => {
    let products = await fetchProducts(currentPagination.value, selectShow.value, selectBrand.value, filterReasonable.checked, event.target.checked);
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});


/*
Feature 4 - Filter by reasonable price
As a user
I want to filter by reasonable price
So that I can buy affordable product i.e less than 50€
*/

filterReasonable.addEventListener('click', async (event) => {
    let products = await fetchProducts(currentPagination.value, selectShow.value, selectBrand.value, event.target.checked, filterRecentlyReleased.checked);
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});

/*
Feature 5 - Sort by price
As a user
I want to sort by price
So that I can easily identify cheapest and expensive products

Feature 6 - Sort by date
As a user
I want to sort by price
So that I can easily identify recent and old products



Feature 8 - Number of products indicator
As a user
I want to indicate the total number of products
So that I can understand how many products is available



Feature 9 - Number of recent products indicator
As a user
I want to indicate the total number of recent products
So that I can understand how many new products are available

Feature 10 - p50, p90 and p95 price value indicator
As a user
I want to indicate the p50, p90 and p95 price value
So that I can understand the price values of the products

Feature 11 - Last released date indicator
As a user
I want to indicate the last released date
So that I can understand if we have new products

Feature 12 - Open product link
As a user
I want to open product link in a new page
So that I can buy the product easily

Feature 13 - Save as favorite
As a user
I want to save a product as favorite
So that I can retreive this product later

Feature 14 - Filter by favorite
As a user
I want to filter by favorite products
So that I can load only my favorite products

Feature 15 - Usable and pleasant UX
As a user
I want to parse a usable and pleasant web page
So that I can find valuable and useful content
 */