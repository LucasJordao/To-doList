const Sequelize = require('sequelize');
const configDatabase = require('../config/database');
const mongoose = require('mongoose');

// Importação dos models para receberem a conexão com o database
const User = require('../app/models/User');
const File = require('../app/models/File');
const Task = require('../app/models/Task');

// Array responsável por percorrer os models passando a conexão
const models = [User, File, Task];

class Database{

  constructor(){
    this.init();
    this.mongo();
  }

// O método init será responsável por fazer a conexão do postgres e passar para os models, também faráas associações 
//entre tabelas

  init(){
    this.connection = new Sequelize(configDatabase);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  /**
   * @function mongo - Essa função irá fazer a conexão do banco mongo usando o mongoose
   */
  mongo(){
    this.mongoConnection = mongoose.connect(
      process.env.MONGO_URL,
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }

}

module.exports = new Database();