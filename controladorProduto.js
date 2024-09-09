const db = require('./db.json');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const listProdutos = async (req, res) => {
    const produtos = db.produtos;
    res.json(produtos);
};

const getProduto = async (req, res) => {
    const _id = req.params.id;
    const produto = db.produtos.find(produto => produto.id == _id);
    produto ? res.json(produto) : res.status(404).json({ error: 'not found' });
};

const createProduto = async (req, res) => {
    const dados = req.body;
    if (!dados.nome || !dados.preco) {
        return res.status(406).json({ error: 'Nome e preço devem ser informados' });
    }
    const _id = uuidv4();
    dados.id = _id;
    db.produtos.push(dados);
    fs.writeFile('./db.json', JSON.stringify(db), err => {
        if (err) {
            return res.status(500).json({ error: 'erro no servidor' });
        }
    });
    res.status(201).json(dados);
};

const updateProduto = async (req, res) => {
    const _id = req.params.id;
    const dados = req.body;
    const index = db.produtos.findIndex(produto => produto.id == _id);
    if (index === -1) {
        return res.status(404).json({ error: 'not found' });
    }
    db.produtos[index] = { ...db.produtos[index], ...dados };
    fs.writeFile('./db.json', JSON.stringify(db), err => {
        if (err) {
            return res.status(500).json({ error: 'erro no servidor' });
        }
    });
    res.json(db.produtos[index]);
};

const deleteProduto = async (req, res) => {
    const _id = req.params.id;
    const index = db.produtos.findIndex(produto => produto.id === _id);
    if (index === -1) {
        return res.status(404).json({ error: 'not found' });
    }
    db.produtos.splice(index, 1);
    fs.writeFile('./db.json', JSON.stringify(db), err => {
        if (err) {
            return res.status(500).json({ error: 'erro no servidor' });
        }
    });
    res.status(204).send();
};

module.exports = { listProdutos, getProduto, createProduto, updateProduto, deleteProduto };
