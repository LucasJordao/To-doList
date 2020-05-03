const { Model, Sequelize } = require('sequelize');
const { isBefore } = require('date-fns');
// Model de tarefas

class Task extends Model{
// O segundo parametro do init do super é a conexão do banco de dados,
// ele será passado pelo this.init no arquivo datababse>index.js
  static init(sequelize){
    super.init({
      title: Sequelize.STRING,
      content: Sequelize.STRING,
      concluded: Sequelize.BOOLEAN,
      date: Sequelize.DATE,
      canceled: Sequelize.DATE,
      past:  {
        type: Sequelize.VIRTUAL,
        get(){
          return isBefore(this.date, new Date());
        }
      }
    },
    {
      sequelize
    });

    return this;
  }


// Esse método serve para fazer o relacionamento entre tabelas, nesse caso vamos relacionar a tabela files com a Tasks
  static associate(models){
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
    this.belongsTo(models.User, { foreignKey: 'employee_id', as: 'employee'});
  }

}

module.exports = Task;