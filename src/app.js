const express = require('express');
require('express-async-errors');
const routes = require('./routes');
const { resolve } = require('path');
const sentry = require('@sentry/node');
const sentryConfig = require('./config/sentry');
const Youch = require('youch');

// Aqui estanciamos a classe responsável pela conexão ao database

require('./database/index');

class App{
  
// Quando a classe for instanciada ela vai chamar o constructor lançando todas as outras funções

  constructor(){
    this.server = express();

    sentry.init(sentryConfig);
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

// Essa função serve para adicionar os middlewares nas rotas

  middlewares(){
    this.server.use(sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use('/files', express.static(resolve(__dirname, '..', 'tmp', 'uploads')));
  }

// Essa função serve pra adicionar as rotas que estão presentes no arquivo routes.js

  routes(){
    this.server.use(routes);
    this.server.use(sentry.Handlers.errorHandler());
  }

  exceptionHandler(){
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();

      return res.status(500).json(errors);
    });
  }
}


module.exports = new App().server;