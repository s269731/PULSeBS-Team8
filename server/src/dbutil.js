const db = require('./db');

const begin = db.prepare('BEGIN');
const commit = db.prepare('COMMIT');
const rollback = db.prepare('ROLLBACK');

function asTransaction(func) {
  return function (...args) {
    begin.run();
    try {
      func(...args);
      commit.run();
    } finally {
      if (db.inTransaction) rollback.run();
    }
  };
}

module.exports = asTransaction;
