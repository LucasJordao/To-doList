const Sequelize = require('sequelize');
const configDatabase = require('../config/database');

// Importação dos models para receberem a conexão com o database
const User = require('../app/models/User');

// Array responsável por percorrer os models passando a conexão
const models = [User];

class Database{

  constructor(){
    this.init();
  }

// O método init será responsável por fazer a conexão do postgres e passar para os models

  init(){
    this.connection = new Sequelize(configDatabase);
    models.map(model => model.init(this.connection));
  }
}

module.exports = new Database();