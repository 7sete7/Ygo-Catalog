const express     = require('express');
const bodyParser  = require('body-parser');
const mysql       = require('mysql');
const rp          = require('request-promise');
const app         = express();

module.exports = {mysql, rp, app, bodyParser, express}

require('./bin/index');
