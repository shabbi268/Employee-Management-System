const { createServer, plugins, pre } = require(`restify`);

const pkg = require(`./package.json`);
const { config, RouteLoader, ErrorHandler } = require(`./src/utils`);

const corsMiddleware = require(`restify-cors-middleware`);
const uuid = require(`uuid`);

const server = createServer({
  name: pkg.name,
  version: pkg.version,
  ignoreTrailingSlash: true
});

new ErrorHandler(server);

const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: [ `*` ],
  allowHeaders: [ `ims-application` ],
  exposeHeaders: []
});

server.pre(cors.preflight);
server.use(cors.actual);

server.use(function requestId(req, res, next) {
  req.id = uuid.v4();
  next();
});

server.use(pre.sanitizePath());
server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.dateParser());
server.use(plugins.queryParser({ mapParams: true }));
server.use(plugins.jsonp());
server.use(plugins.gzipResponse());
server.use(plugins.bodyParser({ mapParams: true }));

RouteLoader.load(server);

if (require.main === module) {
  server.listen(config.server.port);
  console.log(`Listening on port: ${ config.server.port }`); // eslint-disable-line
} else {
  module.exports = server;
}