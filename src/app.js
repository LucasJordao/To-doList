const express = require('express');
const routes = require('./routes');

class App{
  
// Quando a classe for instanciada ela vai chamar o constructor lançando todas as outras funções

  constructor(){
    this.server = express();
    this.middlewares();
    this.routes();
  }

// Essa função serve para adicionar os middlewares nas rotas

  middlewares(){
    this.server.use(express.json());
  }

// Essa função serve pra adicionar as rotas que estão presentes no arquivo routes.js

  routes(){
    this.server.use(routes);
  }
}


module.exports = new App().server;