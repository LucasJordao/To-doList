const { Model, Sequelize } = require('sequelize');

// Model de avatares

class File extends Model{
// O segundo parametro do init do super é a conexão do banco de dados,
// ele será passado pelo this.init no arquivo datababse>index.js
  static init(sequelize){
    super.init({
      name: Sequelize.STRING,
      path: Sequelize.STRING,
      url: {
        type: Sequelize.VIRTUAL,
        get(){
          return `http://localhost:3333/files/${this.path}`
        }
      }
    },
    {
      sequelize
    });

    return this;
  }

}

module.exports = File;