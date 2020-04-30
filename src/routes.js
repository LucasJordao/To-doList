const { Router } = require('express');

// Criamos a variável routes armazenando a função Router do express que serve para definirmos rotas

const routes = Router();

// Aqui ficará todas as rotas definida

routes.get('/', (req, res) => {
  return res.json({message: 'hello world'});
});

module.exports = routes;