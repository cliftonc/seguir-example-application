var config = require('../config/seguir');
var Seguir = require('seguir/client');
var seguir = new Seguir(config);
module.exports = seguir;
