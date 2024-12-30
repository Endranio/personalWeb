'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('Blogs', [
      {
        title: 'Test 1',
        content: ' remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset shecd personal-webets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker incl',
        image: "https://picsum.photos/200/300",
        start: '0003-02-12',
        end: '0002-02-12',
        duration: ' 12 moths',
        icons:  ['lni lni-typescript'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { 
        title: 'Test 2',
        content: ' remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker incl',
        image: "https://picsum.photos/200/300",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Blogs', null, {});
  }
};
