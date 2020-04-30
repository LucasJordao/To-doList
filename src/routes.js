const { Router } = require('express');
const User = require('./app/models/User');

// Criamos a variável routes armazenando a função Router do express que serve para definirmos rotas

const routes = Router();

// Aqui ficará todas as rotas definida

routes.get('/', async (req, res) => {
  await User.create({
    name: 'Lucas William Silva Jordão',
    email: 'çls@hotmail.com',
    password_hash: 'docker',
    provider: true
  });
});

module.exports = routes;