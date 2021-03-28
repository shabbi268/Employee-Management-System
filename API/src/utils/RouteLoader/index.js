const path = require(`path`);
const find = require(`find`);

const ROUTE_BASE = path.resolve(`${ __dirname }/../../routes`);

function getDirectories(srcpath) {
  return find.dirSync(srcpath);
}

exports.load = function(server) {
  const directories = getDirectories(ROUTE_BASE);

  directories.forEach(function(directory) {
    require(`${ directory }`)(server); // eslint-disable-line
  });
};