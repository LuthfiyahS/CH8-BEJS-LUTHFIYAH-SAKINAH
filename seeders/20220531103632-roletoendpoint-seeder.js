'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const role = [
      //ENDPOINT API FOR ADMIN
      {
        role_id: 1,
        endpoint_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 1,
        endpoint_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 1,
        endpoint_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 1,
        endpoint_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 1,
        endpoint_id: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 1,
        endpoint_id: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 1,
        endpoint_id: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 1,
        endpoint_id: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 1,
        endpoint_id: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 1,
        endpoint_id: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 1,
        endpoint_id: 11,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 1,
        endpoint_id: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 1,
        endpoint_id: 13,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 1,
        endpoint_id: 14,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 1,
        endpoint_id: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 1,
        endpoint_id: 16,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 1,
        endpoint_id: 17,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 1,
        endpoint_id: 18,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //END ENDPOINT API FOR ADMIN
      //ENDPOINT API FOR USER
      {
        role_id: 2,
        endpoint_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 2,
        endpoint_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // {
      //   role_id: 2,
      //   endpoint_id: 3,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      {
        role_id: 2,
        endpoint_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 2,
        endpoint_id: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 2,
        endpoint_id: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 2,
        endpoint_id: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // {
      //   role_id: 2,
      //   endpoint_id: 8,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      {
        role_id: 2,
        endpoint_id: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 2,
        endpoint_id: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 2,
        endpoint_id: 11,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 2,
        endpoint_id: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // {
      //   role_id: 2,
      //   endpoint_id: 13,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      {
        role_id: 2,
        endpoint_id: 14,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 2,
        endpoint_id: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 2,
        endpoint_id: 16,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 2,
        endpoint_id: 17,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 2,
        endpoint_id: 18,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //END ENDPOINT API FOR USER
      
      {
        role_id: 1,
        endpoint_id: 19,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 1,
        endpoint_id: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 2,
        endpoint_id: 19,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 2,
        endpoint_id: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    await queryInterface.bulkInsert('role_to_endpoint', role, {} );
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('role_to_endpoint', null, {});
  }
};
