require('dotenv').config();
module.exports = {
  development: {
    username: "postgres",
    password: "190702",
    database: "challenge-08",
    host: "127.0.0.1",
    dialect: "postgres"
  },
  test: {
    username: "postgres",
    password: "190702",
    database: "challenge-07-lanjutan",
    host: "127.0.0.1",
    dialect: "postgres"
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: parseInt(process.env.PROD_DB_PORT),
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}
