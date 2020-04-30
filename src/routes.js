const { Router } = require('express');

// Aqui fica todas as importações dos controllers
const UserController = require('./app/controllers/UserController');

// Criamos a variável routes armazenando a função Router do express que serve para definirmos rotas
const routes = Router();


// Aqui ficará todas as rotas definida

// Rotas POST sem JWT
routes.post('/users', UserController.store);


module.exports = routes;