'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('tasks', { 
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 'undefined'
        },
        content: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 'undefined',
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        concluded: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        provider_id: {
          type: Sequelize.INTEGER,
          references: { model: 'users', key: 'id'},
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: false,
        },
        employee_id: {
          type: Sequelize.INTEGER,
          references: { model: 'users', key: 'id'},
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
       });
  },

  down: (queryInterface) => {
      return queryInterface.dropTable('tasks');
  }
};
