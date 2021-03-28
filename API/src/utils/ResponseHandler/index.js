module.exports = (res, message, data = {}, next) => {
  res.json({
    status: `SUCCESS`,
    message,
    data
  });
  
  next();
};