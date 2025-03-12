/ Updated index.js
const transactionService = require('./TransactionService');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/health', (req, res) => {
    res.json("This is the health check");
});

app.post('/transaction', async (req, res) => {
    try {
        const success = await transactionService.addTransaction(req.body.amount, req.body.desc);
        if (success === 200) return res.json({ message: 'Transaction added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});

app.get('/transaction', (req, res) => {
    transactionService.getAllTransactions((err, results) => {
        if (err) return res.status(500).json({ message: 'Error retrieving transactions', error: err.message });
        res.json({ result: results });
    });
});

app.delete('/transaction', (req, res) => {
    transactionService.deleteAllTransactions((err, result) => {
        if (err) return res.status(500).json({ message: 'Error deleting transactions', error: err.message });
        res.json({ message: "Deleted all transactions successfully" });
    });
});

app.delete('/transaction/id', (req, res) => {
    transactionService.deleteTransactionById(req.body.id, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error deleting transaction', error: err.message });
        res.json({ message: `Transaction with id ${req.body.id} deleted` });
    });
});

app.get('/transaction/id', (req, res) => {
    transactionService.findTransactionById(req.body.id, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error retrieving transaction', error: err.message });
        if (result.length === 0) return res.status(404).json({ message: 'Transaction not found' });
        const { id, amount, description } = result[0];
        res.json({ id, amount, description });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});