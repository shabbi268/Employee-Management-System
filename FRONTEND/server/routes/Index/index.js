const router = require(`express`).Router();
const { UserService } = require(`../../libs`);
const { IndexRoute } = require(`../../utils`);

router.get(`/`, IndexRoute);

exports.router = router;
exports.path = `/`;