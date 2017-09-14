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
    it('should respond with all items in the garage', (done) => {
      chai.request(server)
      .get('/api/v1/items')
      .end((err, res) => {
        should.not.exist(err)
        res.status.should.equal(200)
        res.type.should.equal('application/json')
        res.body.data[0].should.include.keys(
          'id', 'name', 'staleness_reason', 'cleanliness')
        done()
      })
    })

    it('should respond with all items in the garage, filtered by a query param', (done) => {
      chai.request(server)
      .get('/api/v1/items?cleanliness=Dusty')
      .end((err, res) => {
        should.not.exist(err)
        res.status.should.equal(200)
        res.type.should.equal('application/json')
        res.body.data.length.should.equal(3)
        res.body.data[0].should.include.keys(
          'id', 'name', 'staleness_reason', 'cleanliness')
        done()
      })
    })

    it('should respond with an empty array if no filtered items are found', (done) => {
      chai.request(server)
      .get('/api/v1/items?cleanliness=Clean')
      .end((err, res) => {
        should.not.exist(err)
        res.status.should.equal(200)
        res.type.should.equal('application/json')
        res.body.data.length.should.equal(0)

        done()
      })
    })

    it('should respond with a 500 error if a filter query param is misspelled', (done) => {
      chai.request(server)
      .get('/api/v1/items?cleaniness=Dusty')
      .end((err, res) => {
        should.exist(err)
        res.status.should.equal(500)
        res.type.should.equal('application/json')
        res.body.error.severity.should.equal('ERROR')
        res.body.error.routine.should.equal('errorMissingColumn')
        done()
      })
    })
  })
})
