const { Model, Sequelize } = require('sequelize');
const bcryptjs = require('bcryptjs');

// Model de usuários

class User extends Model{
// O segundo parametro do init do super é a conexão do banco de dados,
// ele será passado pelo this.init no arquivo datababse>index.js
  static init(sequelize){
    super.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL,
      password_hash: Sequelize.STRING,
      provider: Sequelize.BOOLEAN,
      valid: Sequelize.BOOLEAN
    },
    {
      sequelize
    });

// Esse hook vai executar uma função no processamento dos dados, no qual vai codificar a senha  do usuário
    this.addHook('beforeSave', async (user)=> {
      if(user.password){
        user.password_hash = await bcryptjs.hash(user.password, 8);
      }
    });

    return this;
  }

// Método para fazer a comparação entre senhas. Vai ser usado em tentativas de acesso a conta do usuário
  checkPassword(password){
    return bcryptjs.compare(password, this.password_hash);
  }

}

module.exports = User;