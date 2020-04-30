const { Model, Sequelize } = require('sequelize');

// Model de usuários

class User extends Model{
// O segundo parametro do init do super é a conexão do banco de dados,
// ele será passado pelo this.init no arquivo datababse>index.js
  static init(sequelize){
    super.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password_hash: Sequelize.STRING,
      provider: Sequelize.STRING,
    },
    {
      sequelize
    });
  }
}

module.exports = User;