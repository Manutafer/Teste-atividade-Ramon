const request = require('supertest');
const app = require('../index'); 

describe('Produtos API', () => {
    let produtoId;

    // criando produto
    describe('POST /produtos', () => {
        it('deve criar um novo produto com sucesso', async () => {
            const res = await request(app).post('/produtos').send({
                nome: "Produto Teste",
                preco: 100.00,
                descricao: "Descrição do Produto Teste"
            });
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('nome', 'Produto Teste');
            expect(res.body).toHaveProperty('preco', 100.00);
            expect(res.body).toHaveProperty('descricao', 'Descrição do Produto Teste');
            produtoId = res.body.id;
        });
    });

    describe('GET /produtos', () => {
        it('deve retornar a lista de produtos com sucesso', async () => {
            const res = await request(app).get('/produtos').send();
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });
    });

    describe('GET /produtos/:id', () => {
        it('deve retornar um produto específico pelo ID com sucesso', async () => {
            const res = await request(app).get(`/produtos/${produtoId}`).send();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', produtoId);
        });

        it('deve retornar 404 para um produto não encontrado', async () => {
            const res = await request(app).get('/produtos/999').send();
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('not found');
        });
    });

    describe('PUT /produtos/:id', () => {
        it('deve atualizar um produto existente com sucesso', async () => {
            const res = await request(app).put(`/produtos/${produtoId}`).send({
                nome: "Produto Atualizado",
                preco: 150.00,
                descricao: "Descrição Atualizada"
            });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('nome', 'Produto Atualizado');
            expect(res.body).toHaveProperty('preco', 150.00);
            expect(res.body).toHaveProperty('descricao', 'Descrição Atualizada');
        });
    });

    describe('DELETE /produtos/:id', () => {
        it('deve deletar um produto existente com sucesso', async () => {
            const res = await request(app).delete(`/produtos/${produtoId}`).send();
            expect(res.status).toBe(204);
        });
    });

    afterAll(async () => {
        
        if (produtoId) {
            await request(app).delete(`/produtos/${produtoId}`);
        }
    });
});