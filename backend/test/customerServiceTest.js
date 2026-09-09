const customerService = require('../services/customerService');

console.log('--- ÖSSZES ÜGYFÉL ---');

const customers = customerService.getAllCustomers();

console.log(customers);

console.log('--- ÚJ ÜGYFÉL LÉTREHOZÁSA ---');

const newCustomer = customerService.createCustomer(
    'Teszt János',
    '06201234567',
    'teszt@example.com'
);

console.log(newCustomer);

console.log('--- ÜGYFELEK ÚJRALEKÉRÉSE ---');

console.log(customerService.getAllCustomers());