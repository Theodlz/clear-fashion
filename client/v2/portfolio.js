// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const selectSort = document.querySelector('#sort-select');

const filterPrice = document.querySelector('#btn-price');
const filterRecent = document.querySelector('#btn-recent');
const filterFavorite = document.querySelector('#btn-fav');

const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanLastRelease = document.querySelector('#lastRealease');

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
  sectionProducts.innerHTML = `
    <thead>
      <tr>
          <th>Brand</th>
          <th>Link</th>
          <th>Price</th>
          <th>Favorite</th>
      </tr>
    </thead>
  `
  const template = products
    .map(product => {
      return `
      <tr class="product" id=${product.uuid}>
        <td>${product.brand}</td>
        <td><a href="${product.link}" target="_blank">${product.name}</a></td>
        <td>${product.price}</td>
        <td><div id="fav-${product.uuid}" class="notFill" onclick="addFavorite('fav-${product.uuid}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
        </svg></div></td>
      </tr>
    `;
    })
    .join('');

  sectionProducts.innerHTML = sectionProducts.innerHTML + template;
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
const renderIndicators = (products, pagination) => {
  const {count} = pagination;
  var last_release = (products.sort(function(a,b) {
    return Date.parse(b.released) - Date.parse(a.released);
    }))[0].released
  
  spanNbProducts.innerHTML = count;
  spanLastRelease.innerHTML = last_release;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(products,pagination);
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

selectSort.addEventListener('change', async (event) => {
  if (event.target.value == "price-desc"){
    currentProducts.sort(function(a,b) {
      return b.price - a.price;
      });
  }
  if (event.target.value == "price-asc"){
    currentProducts.sort(function(a,b) {
      return a.price - b.price;
      });
  }
  if (event.target.value == "date-desc"){
    currentProducts.sort(function(a,b) {
      return Date.parse(b.released) - Date.parse(a.released);
      });
  }
  if (event.target.value == "date-asc"){
    currentProducts.sort(function(a,b) {
      return Date.parse(a.released) - Date.parse(b.released);
      });
  }
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

filterFavorite.addEventListener('click', async (event) => {
  currentProducts.sort(function (a){
    return a.fav;
    });

  render(currentProducts, currentPagination);
});


document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);

  $('#products').DataTable({
    "lengthChange": false
  });
});

function addFavorite(fav_id){
  const heartClicked = document.querySelector('#'+fav_id);

  var index = currentProducts.findIndex(x=> x.uuid === fav_id.substring(4));

  if (heartClicked.getAttribute("class") == "notFill"){
    currentProducts[index]["fav"] = true
    heartClicked.setAttribute("class","Fill")
    heartClicked.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
  </svg>
  `
  }
  else{
    delete currentProducts[index]["fav"] 
    heartClicked.setAttribute("class","notFill")
    heartClicked.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"></path>
  </svg>`
  }
  
}
