const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const router = require('./router')
const app = express()
const PORT = process.env.PORT || 3000

app.locals.title = 'Garage Bin'

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api', router)

app.get('/', function (req, res) {
  res.status(200).sendFile(path.join(__dirname, '../../public/index.html'))
})

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '../../public/404.html'))
})

app.listen(PORT, error => {
  error
  ? console.error(error)
  : console.info(`Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`)
})

module.exports = app
