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
          'id', 'name', 'staleness_reason', 'cleanliness', 'created_at', 'updated_at')
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

  describe('POST /api/v1/items', () => {
    it('should respond with the newly added item', (done) => {
      chai.request(server)
            .post('/api/v1/items')
            .send({
              name: 'An old shoe',
              staleness_reason: 'I lost this shoe years ago. Now I know where it has been!',
              cleanliness: 'Rancid'
            })
            .end((err, res) => {
              should.not.exist(err)
              res.status.should.equal(201)
              res.type.should.equal('application/json')
              res.body.data.should.include.keys(
                'id', 'name', 'staleness_reason', 'cleanliness', 'created_at', 'updated_at')
              done()
            })
    })

    it('should respond with a 422 error if required parameters are missing.', (done) => {
      chai.request(server)
            .post('/api/v1/items')
            .send({
              staleness_reason: 'I lost this shoe years ago. Now I know where it has been!',
              cleanliness: 'Rancid'
            })
            .end((err, res) => {
              should.exist(err)
              res.status.should.equal(422)
              res.type.should.equal('application/json')
              res.body.error.should.equal('Missing required parameter of (name).')
              done()
            })
    })
  })
})
