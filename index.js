// index.js (ou app.js)
const express = require('express');
const app = express();
// Não é necessário usar body-parser se estiver usando express.json()
const produtosRotas = require('./produtosRotas'); // O nome correto do arquivo de rotas para produtos
const clientesRotas = require('./cliente/clientesRotas');

app.use(express.json()); // Middleware embutido do Express para JSON
app.use('/produtos', produtosRotas);
app.use('/clientes', clientesRotas); // Adicionado para clientes

// Iniciar o servidor
const port = 8000;
// app.listen(port, () => {
//     console.log(`Servidor rodando na porta ${port}`);
// });

module.exports = app;