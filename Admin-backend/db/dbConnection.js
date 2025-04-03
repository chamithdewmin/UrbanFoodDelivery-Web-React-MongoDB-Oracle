const oracledb = require('oracledb');

// Oracle DB connection configuration
const dbConfig = {
  user: 'SYS',
  password: 'admin@#!',
  connectString: 'localhost:1521/XE',
  privilege: oracledb.SYSDBA
};

// Connect to the Oracle DB
async function initializeDB() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log('Connected to Oracle Database');
    return connection;
  } catch (error) {
    console.error('Error connecting to Oracle DB:', error);
    throw error;
  }
}

module.exports = { initializeDB };
