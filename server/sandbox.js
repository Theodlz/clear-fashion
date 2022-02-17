/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimartbrand = require('./sources/montlimartbrand');
const adressebrand = require('./sources/adressebrand');

var fs = require('fs');

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    //console.log(`🕵️‍♀️  browsing ${eshop} source`);

      const productsDedicated = await dedicatedbrand.scrape("https://www.dedicatedbrand.com/en/men/news");
      const productsMontlimart = await montlimartbrand.scrape("https://www.montlimart.com/toute-la-collection.html");
      const productsAdresse = await adressebrand.scrape("https://adresse.paris/630-toute-la-collection");
      console.log('done');
      fs.writeFileSync('dedicated.json', JSON.stringify(productsDedicated, null, 2));
      fs.writeFileSync('montlimart.json', JSON.stringify(productsMontlimart, null, 2));
      fs.writeFileSync('adresse.json', JSON.stringify(productsAdresse, null, 2));

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
