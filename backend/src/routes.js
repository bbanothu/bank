const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

// Customer routes
router.post('/customers', controllers.createCustomer);
router.get('/customers', controllers.getAllCustomers);
router.get('/customers', controllers.getAllCustomers);
router.delete('/customers/:id/delete', controllers.deleteCustomer);


// Account routes
router.post('/accounts', controllers.createAccount);
router.post('/accounts/:id/deposit', controllers.makeDeposit);
router.post('/accounts/:id/deposit', controllers.makeDeposit);
router.delete('/accounts/:id/delete', controllers.deleteAccount);

// Transfer routes
router.post('/transfers', controllers.makeTransfer);
router.get('/transactions', controllers.getAllTransactions);


module.exports = router;