module.exports = {
  development: {
    url: 'postgres://sqljs:foobar123@localhost:5432/odn_beta',
    dialect: 'postgres',
    logging: true
  },
    production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  },
    staging: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  },
    test: {
    url: process.env.DATABASE_URL || 'postgres://sqljs:foobar123@localhost:5432/odn_beta_test',
    dialect: 'postgres'
  }
};
