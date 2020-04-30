const { Router } = require('express');

// Aqui fica todas as importações dos controllers
const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');

// Criamos a variável routes armazenando a função Router do express que serve para definirmos rotas
const routes = Router();


// Aqui ficará todas as rotas definida

// Rotas POST sem JWT
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);


module.exports = routes;