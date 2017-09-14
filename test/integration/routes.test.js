process.env.NODE_ENV = 'test'
const chai = require('chai')

const should = chai.should()
const chaiHttp = require('chai-http')

const knex = require('../../src/server/db/knex')
const server = require('../../src/server/server.js')

chai.use(chaiHttp)

describe('Testing GarageBin API Routes', () => {
  beforeEach((done) => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            knex.seed.run()
              .then(() => {
                done()
              })
          })
      })
  })

  describe('GET /api/v1/items', () => {
    it('does a thing', (done) => {
      done()
    })
  })
})
