const fs = require(`fs`);

try {
  const configFile = fs.readFileSync(`${__dirname}/../../../config.json`, `utf8`);

  const config = JSON.parse(configFile);

  module.exports = config;
} catch (err) {
  module.exports = {
    name: process.env.NAME || `EMS`,
    server: {
      url: process.env.URL || `http://localhost:8000`,
      port: process.env.PORT || 4567,
    },
    api: {
      url: process.env.API_URL || `localhost:3000`, // required
      appId: process.env.API_APP_ID || `` //required
    },
    reassessment_period_limit: 365
  };
}