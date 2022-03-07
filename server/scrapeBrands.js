/* eslint-disable no-console, no-process-exit */
const montlimartbrand = require('./sources/montlimartbrand');
const dedicatedbrand = require('./sources/dedicatedbrand');
const adressebrand = require('./sources/adressebrand');

const fs = require('fs');

async function scrape() {
    
    try {
        let products = []
        console.log(`🕵️‍♀️  browsing dedicatedbrand.com source`);
        products.push(...await dedicatedbrand.scrape('https://www.dedicatedbrand.com/en/men/all-men'));
        products.push(...await dedicatedbrand.scrape('https://www.dedicatedbrand.com/en/women/all-women'));
        console.log(`🕵️‍♀️  browsing montlimart.com source`);
        products.push(...await montlimartbrand.scrape('https://www.montlimart.com/toute-la-collection.html'));
        console.log(`🕵️‍♀️  browsing adresse.com source`);
        products.push(...await adressebrand.scrape('https://adresse.paris/630-toute-la-collection'));
        products = products.filter(product => product.price != NaN && product.name != '');
        products = [...new Set(products)];
        console.log(products);
        console.log('saving to file');
        fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
        console.log('done');

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}



scrape();
