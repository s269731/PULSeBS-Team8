const config = require('config');
const Sqlite = require('better-sqlite3');

const DB = new Sqlite(config.DBSOURCE, config.verbose ? { verbose: console.log } : null);

module.exports = DB;
