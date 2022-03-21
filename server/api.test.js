const { getProductByID, searchProducts } = require('./handler.js');
const db = require('./db');
jest.mock('./db');



test('getting product by its unique id', async() => {
    const request = {
        query: {
            id: '678384c9-20bd-5151-9e1a-382984501eb8'
        }
    };

    const products = await getProductByID(request);


    // expect(products).toBeDefined();
    // expect(products.length).toBe(1);
    // expect(products[0]._id).toBe('678384c9-20bd-5151-9e1a-382984501eb8');
    expect(db.find).toHaveBeenCalledWith({'_id': '678384c9-20bd-5151-9e1a-382984501eb8'});
});

test('getting the list of products (limit of 12)', async() => {
    const request = {
        query: {
            brand: 'all',
            price: 'all',
            limit: 12
        }
    };
    const products = await searchProducts(request);
    expect(db.find_limit).toHaveBeenCalledWith({}, 12);
});

test('getting the list of products at a specific price (limit of 12)', async() => {
    const request = {
        query: {
            brand: 'all',
            price: '100',
            limit: 12
        }
    };
    const products = await searchProducts(request);
    expect(db.find_limit).toHaveBeenCalledWith({'price': 100}, 12);
});

test('getting the list of products at a specific brand (limit of 12)', async() => {
    const request = {
        query: {
            brand: 'dedicated',
            price: 'all',
            limit: 12
        }
    };
    const products = await searchProducts(request);
    expect(db.find_limit).toHaveBeenCalledWith({'brand': 'dedicated'}, 12);
});

test('getting the list of products at a specific brand and price (limit of 12)', async() => {
    const request = {
        query: {
            brand: 'dedicated',
            price: '59',
            limit: 12
        }
    };
    const products = await searchProducts(request);
    expect(db.find_limit).toHaveBeenCalledWith({'brand': 'dedicated', 'price': 59}, 12);
});

test('getting the list of products with a limit of 5', async() => {
    const request = {
        query: {
            brand: 'all',
            price: 'all',
            limit: 5
        }
    };
    const products = await searchProducts(request);
    expect(db.find_limit).toHaveBeenCalledWith({}, 5);
});

test('getting the list of products with a limit of 5, a specific brand and a specific price', async() => {
    const request = {
        query: {
            brand: 'dedicated',
            price: '59',
            limit: 5
        }
    };
    const products = await searchProducts(request);
    expect(db.find_limit).toHaveBeenCalledWith({'brand': 'dedicated', 'price': 59}, 5);
});