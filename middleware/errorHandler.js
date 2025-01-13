

function errorHandler(err, req, res) {
    console.error(err.stack);
    res.status(500).json({ msg: 'Server Error' });
  }
  
  module.exports = errorHandler;