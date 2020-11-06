const config = require('config');
const sqlite = require('better-sqlite3');

const DB = new sqlite(config.DBSOURCE, config.verbose ? { verbose: console.log } : null);

module.exports = DB;
