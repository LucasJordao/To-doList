'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn(
        'tasks',
        'canceled',
        {
          type: Sequelize.DATE,
          allowNull: true,
        }
      );
  },

  down: (queryInterface) => {
      return queryInterface.removeColumn('tasks', 'canceled');
  }
};
