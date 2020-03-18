const { Pool } = require('pg');

const myURI = 'postgres://vtnbzemj:NElV7CmtQAQw1_i-20u7jb7wAeTjeI4Y@drona.db.elephantsql.com:5432/vtnbzemj'

const connectionString = process.env.PG_URI || myURI;

const pool = new Pool({
  connectionString: myURI
})
  
pool.on('connect', () => {
  console.log(`Connected to the ElephantSQL database`);
});
  
module.exports = {
  query: (text, params, callback) => {
    console.log(`Executed query ${text}`);
    return pool.query(text, params, callback);
  }
}