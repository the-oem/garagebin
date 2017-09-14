const DB = require('./db/knex')

const getItems = (req, res) => {
  DB('items')
    .where(req.query)
    .select()
    .then(items => res.status(200).json({ data: items }))
    .catch(error => res.status(500).json({ error }))
}

const getItem = (req, res) => {
  DB('items').where('id', parseInt(req.params.id, 10)).select()
    .then(item => {
      if (item.length) {
        res.status(200).json({ data: item })
      } else {
        res.status(404).json({ error: `Item with id (${parseInt(req.params.id, 10)}) was not found.` })
      }
    })
    .catch(error => res.status(500).json({ error }))
}

const addItem = (req, res) => {
  const item = req.body
  for (const requiredParameter of ['name', 'staleness_reason', 'cleanliness']) {
    if (!item[requiredParameter]) {
      return res.status(422).json({error: `Missing required parameter of (${requiredParameter}).`
      })
    }
  }

  DB('items').insert(req.body, '*')
    .then(item => res.status(201).json({ data: item[0] }))
    .catch(error => res.status(500).json({ error }))
}

const updateItem = (req, res) => {
  DB('items')
      .update(req.body, '*')
      .where('id', parseInt(req.params.id, 10))
      .returning('*')
      .then((item) => res.status(200).json({ data: item }))
      .catch((error) => res.status(500).json({ error }))
}

module.exports = {
  getItems,
  getItem,
  addItem,
  updateItem
}
