'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const role = [
      //API
      //Auth
      {
        endpoint: '/api/v1/register',
        method: 'POST',
        description: 'register',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        endpoint: '/api/v1/login',
        method: 'POST',
        description: 'login',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //USER GAMES
      {
        endpoint: '/user-games',
        method: 'GET',
        description: ' getAlluser-games',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        endpoint: '/user-game',
        method: 'POST',
        description: 'add by req Body user-games',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        endpoint: '/user-game',
        method: 'GET',
        description: ' get by id user-games',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        endpoint: '/user-game',
        method: 'PUT',
        description: 'update user-games',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        endpoint: '/user-game',
        method: 'DELETE',
        description: 'delete by id user-games',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //USER GAMES BIODATA
      {
        endpoint: '/user-games-biodata',
        method: 'GET',
        description: ' getAlluser-games-biodata',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        endpoint: '/user-game-biodata',
        method: 'POST',
        description: 'add by req Body user-games-biodata',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        endpoint: '/user-game-biodata',
        method: 'GET',
        description: ' get by id user-games-biodata',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        endpoint: '/user-game-biodata',
        method: 'PUT',
        description: ' update user-games-biodata',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        endpoint: '/user-game-biodata',
        method: 'DELETE',
        description: 'delete by id user-games-biodata',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //USER GAMES HISTORY
      {
        endpoint: '/user-games-history',
        method: 'GET',
        description: ' getAlluser-games-history',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        endpoint: '/user-game-history',
        method: 'POST',
        description: 'add by req Body user-games-history',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        endpoint: '/user-game-history',
        method: 'GET',
        description: ' get by id user-games-history',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        endpoint: '/user-game-history',
        method: 'PUT',
        description: ' update user-games-history',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        endpoint: '/user-game-history',
        method: 'DELETE',
        description: 'delete by id user-games-history',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //END ENDPOINT
      //DOC
      {
        endpoint: '/docs',
        method: 'GET',
        description: 'swagger',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //auth
      {
        endpoint: '/forgot-password',
        method: 'POST',
        description: 'swagger',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        endpoint: '/reset-password',
        method: 'POST',
        description: 'swagger',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    await queryInterface.bulkInsert('endpoint', role, {} );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('endpoint', null, {});
  }
};
