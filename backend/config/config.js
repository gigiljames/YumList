require('dotenv').config();

const parseDbConfig = () => {
  const url = process.env.MYSQL_URL || process.env.DATABASE_URL;
  if (url) {
    return {
      url: url,
      dialect: 'mysql',
      dialectOptions: {
        connectTimeout: 60000
      }
    };
  }
  return {
    username: process.env.MYSQL_DB_USER || 'root',
    password: process.env.MYSQL_DB_PASSWORD || 'password',
    database: process.env.MYSQL_DB_NAME || 'yumlist',
    host: process.env.MYSQL_DB_HOST || '127.0.0.1',
    port: process.env.MYSQL_DB_PORT ? Number(process.env.MYSQL_DB_PORT) : 3306,
    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: 60000
    }
  };
};

const dbConfig = parseDbConfig();

module.exports = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig
};
