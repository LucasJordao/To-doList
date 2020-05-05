require('dotenv').config();

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
// Aqui iniciamos o sentry
    sentry.init(sentryConfig);
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

// Essa função serve para adicionar os middlewares nas rotas

  middlewares(){
// Usamos o requestHandler para a captura dos errors
    this.server.use(sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use('/files', express.static(resolve(__dirname, '..', 'tmp', 'uploads')));
  }

// Essa função serve pra adicionar as rotas que estão presentes no arquivo routes.js

  routes(){
    this.server.use(routes);
// Aqui recuperamos o erro
    this.server.use(sentry.Handlers.errorHandler());
  }

// Criamos a função exception handler para imprimir o erro como json
  exceptionHandler(){
    this.server.use(async (err, req, res, next) => {
      if(process.env.NODE_ENV == 'development'){
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({error: 'Internal server error'});
    });
  }
}


module.exports = new App().server;