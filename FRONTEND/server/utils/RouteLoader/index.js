const fs = require(`fs`);
const path = require(`path`);

const getDirectories = (srcpath) => {
  return fs.readdirSync(srcpath).filter((file) => {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
};
const DEFAULT_ROUTES_DIR = __dirname + `/../../routes`;

module.exports = (app, routeDirectoryPath = DEFAULT_ROUTES_DIR) => {
  return new Promise((resolve, reject) => {
    if (!app) {
      return reject(`No app provided`);
    }

    if (!routeDirectoryPath) {
      return reject(`No path provided`);
    }

    const routeDirectories = getDirectories(routeDirectoryPath);

    routeDirectories.forEach(route => {
      const routerPath = path.resolve(`${ routeDirectoryPath }/${ route }`);
      const router = require(routerPath); // eslint-disable-line

      let params = [ router.path ];

      params.push(router.router); // eslint-disable-line

      app.use.apply(app, params);
    });

    resolve();
  });
};
