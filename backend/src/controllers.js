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
      
      if (amount <= 0) {
        throw new Error('Deposit amount must be greater than 0');
      }
  
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

    const result = await prisma.$transaction(async (prisma) => {
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

      const transfer = await prisma.transfer.create({
        data: {
          amount: parseFloat(amount),
          fromAccountId: accountId,
          toAccountId: accountId
        }
      });

      return { account: updatedAccount, transfer };
    });

    res.json(result.account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  const accountId = parseInt(req.params.id);
  
  try {
    const account = await prisma.account.findUnique({
      where: { id: accountId }
    });

    if (!account) {
      throw new Error('Account not found');
    }

    if (account.balance > 0) {
      throw new Error('Cannot delete account with non-zero balance');
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.transfer.deleteMany({
        where: {
          OR: [
            { fromAccountId: accountId },
            { toAccountId: accountId }
          ]
        }
      });

      await prisma.account.delete({
        where: { id: accountId }
      });
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  const customerId = parseInt(req.params.id);
  
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: { accounts: true }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const hasBalance = customer.accounts.some(account => account.balance > 0);
    if (hasBalance) {
      throw new Error('Cannot delete customer with non-zero balance accounts');
    }

    await prisma.$transaction(async (prisma) => {
      const accountIds = customer.accounts.map(acc => acc.id);

      await prisma.transfer.deleteMany({
        where: {
          OR: [
            { fromAccountId: { in: accountIds } },
            { toAccountId: { in: accountIds } }
          ]
        }
      });

      await prisma.account.deleteMany({
        where: {
          customerId: customerId
        }
      });

      await prisma.customer.delete({
        where: { id: customerId }
      });
    });

    res.json({ message: 'Customer and associated data deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transfer.findMany({
      include: {
        fromAccount: {
          include: {
            customer: true
          }
        },
        toAccount: {
          include: {
            customer: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      amount: transaction.amount,
      date: transaction.createdAt,
      from: {
        customer: transaction.fromAccount.customer.name,
        account: transaction.fromAccount.accountNumber,
      },
      to: {
        customer: transaction.toAccount.customer.name,
        account: transaction.toAccount.accountNumber,
      }
    }));

    res.json(formattedTransactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


