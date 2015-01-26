/**
 * Don't do this in production
 */
var Datastore = require('nedb'),
    dataFile = 'database.json',
    db = new Datastore({ filename: dataFile, autoload: true });

module.exports = db;
