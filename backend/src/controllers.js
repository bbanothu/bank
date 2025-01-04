const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createCustomer = async (req, res) => {
  try {
    const { name, email } = req.body;
    const customer = await prisma.customer.create({
      data: { name, email }
    });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: { accounts: true }
    });
    res.json(customers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createAccount = async (req, res) => {
  try {
    const { customerId, initialDeposit } = req.body;
    const accountNumber = Math.random().toString(36).substring(2, 12).toUpperCase();
    
    const account = await prisma.account.create({
      data: {
        accountNumber,
        balance: initialDeposit,
        customerId
      }
    });
    res.json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.makeTransfer = async (req, res) => {
  const { fromAccountId, toAccountId, amount } = req.body;
  
  try {
    const transfer = await prisma.$transaction(async (prisma) => {
      const [fromAccount, toAccount] = await Promise.all([
        prisma.account.findUnique({ where: { id: fromAccountId } }),
        prisma.account.findUnique({ where: { id: toAccountId } })
      ]);
      
      if (!fromAccount || !toAccount) {
        throw new Error('One or both accounts not found');
      }
      
      if (fromAccount.balance < amount) {
        throw new Error('Insufficient funds');
      }
      
      await Promise.all([
        prisma.account.update({
          where: { id: fromAccountId },
          data: { balance: fromAccount.balance - amount }
        }),
        prisma.account.update({
          where: { id: toAccountId },
          data: { balance: toAccount.balance + amount }
        })
      ]);
      
      return prisma.transfer.create({
        data: { amount, fromAccountId, toAccountId }
      });
    });
    
    res.json(transfer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.makeDeposit = async (req, res) => {
  const { amount } = req.body;
  const accountId = parseInt(req.params.id);
  
  try {
    if (amount <= 0) {
      throw new Error('Deposit amount must be greater than 0');
    }

    const account = await prisma.account.findUnique({
      where: { id: accountId }
    });

    if (!account) {
      throw new Error('Account not found');
    }

    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: { balance: account.balance + parseFloat(amount) }
    });

    res.json(updatedAccount);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};