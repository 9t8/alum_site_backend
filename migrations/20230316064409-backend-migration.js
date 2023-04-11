'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *a
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterfase.sequelize.query(sql `
    CREATE TABLE users (
      id INT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password BLOB NOT NULL
      bio TEXT NOT NULL
    ) STRICT;

    INSERT INTO users (id, email, password) VALUES
      (0, '', x'')
  `);
    await queryInterfase.sequelize.query(sql `
    CREATE TABLE people (
      name TEXT NOT NULL,
      grad_year INT,
      user_id INT UNIQUE
    ) STRICT;

    INSERT INTO people (name, grad_year) VALUES
      ('Bobby Boomer', 2000),
      ('David Li', 2024),
      ('Veeee Eeeer', 2024),
      ('Zobby Zoomer', 2040),
      ('Gunn Alumni Dylan', 1984),
      ('Shitty Staff', NULL),
      ('Example User', 1999)
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterfase.sequelize.query(sql `
    DROP TABLE users
    `);
    await queryInterfase.sequelize.query(sql `
    DROP TABLE people
    `);
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
