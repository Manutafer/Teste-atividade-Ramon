const db = require('../db.json');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Listar os clientes
const listClientes = async (req, res) => {
    const clientes = db.clientes;
    res.json(clientes);
};

// Obter um cliente específico por ID
const getCliente = async (req, res) => {
    const _id = req.params.id;
    const cliente = db.clientes.find(cliente => cliente.id == _id);
    cliente ? res.json(cliente) : res.status(404).json({ error: 'not found' });
};

// Criar um novo cliente
const createCliente = async (req, res) => {
    const dados = req.body;
    if (!dados.nome || !dados.email || !dados.senha) {
        return res.status(406).json({ error: 'Nome, email e senha devem ser informados' });
    }
    const senhaCriptografada = await bcrypt.hash(dados.senha, 10);
    dados.senha = senhaCriptografada;
    const _id = uuidv4();
    dados.id = _id;
    db.clientes.push(dados);
    fs.writeFile('./db.json', JSON.stringify(db), err => {
        if (err) {
            return res.status(500).json({ error: 'erro no servidor' });
        }
    });
    res.status(201).json(dados);
};

// Atualizar um cliente existente
const updateCliente = async (req, res) => {
    const _id = req.params.id;
    const dados = req.body;
    const index = db.clientes.findIndex(cliente => cliente.id == _id);
    if (index === -1) {
        return res.status(404).json({ error: 'not found' });
    }
    db.clientes[index] = { ...db.clientes[index], ...dados };
    fs.writeFile('./db.json', JSON.stringify(db), err => {
        if (err) {
            return res.status(500).json({ error: 'erro no servidor' });
        }
    });
    res.json(db.clientes[index]);
};

// Deletar um cliente
const deleteCliente = async (req, res) => {
    const _id = req.params.id;
    const index = db.clientes.findIndex(cliente => cliente.id === _id);
    if (index === -1) {
        return res.status(404).json({ error: 'not found' });
    }
    db.clientes.splice(index, 1);
    fs.writeFile('./db.json', JSON.stringify(db), err => {
        if (err) {
            return res.status(500).json({ error: 'erro no servidor' });
        }
    });
    res.status(204).send();
};

module.exports = { listClientes, getCliente, createCliente, updateCliente, deleteCliente };
