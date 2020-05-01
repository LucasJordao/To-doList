const { Router } = require('express');
const tokenValidation = require('./app/middlewares/tokenValidation');
const multer = require('multer');
const multerConfig = require('./config/multer')

// Aqui fica todas as importações dos controllers
const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const FileController = require('./app/controllers/FileController');

// Criamos a variável routes armazenando a função Router do express que serve para definirmos rotas
const routes = Router();

// Criamos a variável upload que será responsável por trabalhar com arquivos nas rotas com multer
const upload = multer(multerConfig);

// Aqui ficará todas as rotas definida

// Rotas POST sem JWT
routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

// Middleware responsável por validar token jwt
routes.use(tokenValidation);

// Rotas POST com JWT
routes.post('/files', upload.single('file'), FileController.store);

// Rotas GET com JWT
routes.get('/users', UserController.index);

// Rotas UPDATE com JWT
routes.put('/users', UserController.update);

// Rotas DELETE com JWT
routes.delete('/users/:id', UserController.delete);


module.exports = routes;