const router = require(`express`).Router();
const { AssessmentService } = require(`../../libs`);
const { ErrorHandler } = require(`../../utils`);

exports.router = router;
exports.path = `/api/assessment`;