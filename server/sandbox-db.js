/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sites/dedicatedbrand');
const loom = require('./sites/loom');
const db = require('./db');

async function sandbox () {
  try {
    let products = [];
    let pages = [
      'https://www.dedicatedbrand.com/en/men/basics',
      'https://www.dedicatedbrand.com/en/men/sale'
    ];

    console.log(`🕵️‍♀️  browsing ${pages.length} pages with for...of`);

    // Way 1 with for of: we scrape page by page
    for (let page of pages) {
      console.log(`🕵️‍♀️  scraping ${page}`);

      let results = await dedicatedbrand.scrape(page);

      console.log(`👕 ${results.length} products found`);

      products.push(results);
    }

    pages = [
      'https://www.loom.fr/collections/hauts-homme',
      'https://www.loom.fr/collections/bas-homme'
    ];

    console.log('\n');

    console.log(`🕵️‍♀️  browsing ${pages.length} pages with Promise.all`);

    const promises = pages.map(page => loom.scrape(page));
    const results = await Promise.all(promises);

    console.log(`👕 ${results.length} results of promises found`);
    console.log(`👕 ${results.flat().length} products found`);

    console.log(results);
    console.log(results.flat());

    products.push(results.flat());
    products = products.flat();

    console.log('\n');

    console.log(`👕 ${products.length} total of products found`);

    console.log('\n');

    const result = await db.insert(products);

    console.log(`💽  ${result.insertedCount} inserted products`);

    console.log('\n');
    
    console.log('💽  Find Loom products only');

    const loomOnly = await db.find({'brand': 'loom'});

    console.log(`👕 ${loomOnly.length} total of products found for Loom`);
    console.log(loomOnly);

    console.log('💽  Find products less than 60 euros');

    const lessThan60 = await db.find({'price': {'$lt': 60}});

    console.log(`👕 ${lessThan60.length} total of products found for less than 60 euros`);
    console.log(lessThan60);

    console.log('💽  Find products sorted by price');

    const sortedByPrice = await db.find_sort({},{'price': 1});

    console.log(`👕 ${sortedByPrice.length} total of products found sorted by price`);
    console.log(sortedByPrice);

    console.log('💽  Find products sorted by date');

    const sortedByDate = await db.find_sort({},{'date': -1});

    console.log(`👕 ${sortedByDate.length} total of products found sorted by date`);
    console.log(sortedByDate);

    console.log('💽  Find products scraped less than 2 weeks ago');

    const scrapedLessThan2Weeks = await db.find({'date': {'$gt': new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)}});

    console.log(`👕 ${scrapedLessThan2Weeks.length} total of products found scraped less than 2 weeks ago`);
    console.log(scrapedLessThan2Weeks);

    db.close();
  } catch (e) {
    console.error(e);
  }
}

sandbox();
