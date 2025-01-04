const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

// Customer routes
router.post('/customers', controllers.createCustomer);
router.get('/customers', controllers.getAllCustomers);

// Account routes
router.post('/accounts', controllers.createAccount);
router.post('/accounts/:id/deposit', controllers.makeDeposit);

// Transfer routes
router.post('/transfers', controllers.makeTransfer);

module.exports = router;