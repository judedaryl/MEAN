// routes/index.js
const users = require('./users');
module.exports = function(app, db) {
  users(app, db);
  // Other route groups could go here, in the future
};