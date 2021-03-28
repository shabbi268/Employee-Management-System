class ErrorHandler {
  constructor(server) {
    // Documentation: http://restify.com/docs/server-api/#errors
    server.on(`Forbidden`, this.forbiddenErrorHandler);
  
    server.on(`restifyError`, this.defaultErrorHandler);
  }
  
  defaultErrorHandler(req, res, err, callback) {
    if(err.message.includes(`Forbidden`)) return callback();
    console.log(`${req.id} - ${err.status} - ${err.message} - ${req.url} - ${req.method}`); // eslint-disable-line
  
    return callback();
  }
  
  forbiddenErrorHandler(req, res, err, callback) {
    console.log(`${req.id} - ${err.status || 403} - ${err} - ${req.url} - ${req.method}`); // eslint-disable-line
  
    return callback();
  }
}
module.exports = ErrorHandler;