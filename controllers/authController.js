const testing = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'working'
  });
};


module.exports = {
  testing
};
