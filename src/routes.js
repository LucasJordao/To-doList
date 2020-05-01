const { Router } = require('express');
const tokenValidation = require('./app/middlewares/tokenValidation');

// Aqui fica todas as importações dos controllers
const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');

// Criamos a variável routes armazenando a função Router do express que serve para definirmos rotas
const routes = Router();


// Aqui ficará todas as rotas definida

// Rotas POST sem JWT
routes.post('/sessions', SessionController.store);

// Middleware responsável por validar token jwt
routes.use(tokenValidation);

// Rotas POST com JWT
routes.post('/users', UserController.store);

// Rotas GET com JWT
routes.get('/users', UserController.index);

// Rotas UPDATE com JWT
routes.put('/users', UserController.update);

// Rotas DELETE com JWT
routes.delete('/delete/:id', UserController.delete);


module.exports = routes;