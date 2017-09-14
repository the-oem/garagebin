const express = require('express')

const router = express.Router()
const controller = require('./controller')

router.get('/v1/items', controller.getItems)

module.exports = router
