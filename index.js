const { config } = require(`./server/libs`);
const express = require(`express`);
const app = express();
const server = require(`http`).Server(app);

const { RouteLoader, IndexRoute } = require(`./server/utils`);

const bodyParser = require(`body-parser`);
const favicon = require(`serve-favicon`);
const compression = require(`compression`);

app.use(compression());
app.use(favicon(`${__dirname}/public/img/favicon.ico`));
app.use(express.static(`${__dirname}/public`));
app.set(`view engine`, `ejs`);
app.set(`views`, `${__dirname}/views`);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(`/public`, (req, res) => {
  res
    .status(404)
    .send(`resource not found`);
});

RouteLoader(app)
  .then(() => {
    app.all(`/*`, IndexRoute);

    server.listen(config.server.port);

    console.log(`Listening on port: ${config.server.port}!`); // eslint-disable-line
  })
  .catch((err) => {
    if (process.env.NODE_ENV !== `production`) {
      console.log(err);  // eslint-disable-line
    }
    process.exit(1);
  });