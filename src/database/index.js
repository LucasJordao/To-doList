const Sequelize = require('sequelize');
const configDatabase = require('../config/database');

// Importação dos models para receberem a conexão com o database
const User = require('../app/models/User');
const File = require('../app/models/File');

// Array responsável por percorrer os models passando a conexão
const models = [User, File];

class Database{

  constructor(){
    this.init();
  }

// O método init será responsável por fazer a conexão do postgres e passar para os models, também faráas associações 
//entre tabelas

  init(){
    this.connection = new Sequelize(configDatabase);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

module.exports = new Database();