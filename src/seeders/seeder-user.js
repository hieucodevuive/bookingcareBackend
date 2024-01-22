'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@admin.com',
      password: '123456',
      firstName: 'Leo',
      lastName: 'Pham',
      address: 'USA',
      gender: 1,
      typeRole: 'ROLE',
      keyRole: 'R1',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
