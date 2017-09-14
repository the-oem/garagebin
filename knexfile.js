module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/garagebin',
    migrations: {
      directory: './src/server/db/migrations'
    },
    seeds: {
      directory: './src/server/db/seeds/dev'
    },
    useNullAsDefault: true
  },
  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/garagebintest',
    migrations: {
      directory: './src/server/db/migrations'
    },
    seeds: {
      directory: './src/server/db/seeds/test'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    migrations: {
      directory: './src/server/db/migrations'
    },
    seeds: {
      directory: './src/server/db/seeds/prod'
    },
    useNullAsDefault: true
  }
}
