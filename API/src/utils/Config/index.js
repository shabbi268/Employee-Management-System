const fs = require(`fs`);

const CONFIG_FILE_PATH = `${ __dirname }/../../../config.json`;
let config = {};
let server = {};

if (fs.existsSync(CONFIG_FILE_PATH)) {
  config = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, `utf8`));

  server = config.server;
}

module.exports = {
  server: {
    port: server.port || 3000,
    'ims-application': server[`ims-application`] || ``,
  },
  database: {
    host: process.env.DATABASE_HOST || `localhost`,
    port: process.env.DATABASE_PORT || 5432,
    username: process.env.DATABASE_USERNAME || `postgres`,
    password: process.env.DATABASE_PASSWORD || `paul`,
    name: process.env.DATABASE_NAME || `risk`,
    dialect: process.env.DATABASE_DIALECT || `pg`,
    minconnections: process.env.DATABASE_MINCONNECTIONS || 2
  }
};