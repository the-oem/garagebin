const DB = require('./db/knex')

const getItems = (req, res) => {
  res.status(200).json({
      message: "Garage Bin has been opened!"
    })
}

module.exports = {
  getItems
}
