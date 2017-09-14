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

const getItem = (req, res) => {
  DB('items').where('id', parseInt(req.params.id, 10)).select()
    .then(item => (item.length ? res.status(200).json({
      data: item
    }) : res.status(404).json({
      data: {
        error: `Item with id (${parseInt(req.params.id, 10)}) was not found.`
      }
    })))
    .catch(error => res.status(500).json({ error }))
}

module.exports = {
  getItems,
  getItem
}
