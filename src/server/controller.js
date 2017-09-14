const DB = require('./db/knex')

const getItems = (req, res) => {
  DB('items')
    .where(req.query)
    .select()
    .then(items => res.status(200).json({
      data: items
    }))
    .catch(error => res.status(500).json({ error }))
}

module.exports = {
  getItems
}
