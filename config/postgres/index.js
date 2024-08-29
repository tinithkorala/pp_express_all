const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.PG_DB,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    dialect: process.env.PG_DIALECT,
    logging: process.env.PG_LOG === 'true' ? console.log : false,
  }
);

module.exports = sequelize;
