const express     = require('express');
const bodyParser  = require('body-parser');
const mysql       = require('mysql');
const rp          = require('request-promise');
const app         = express();
require('dotenv').config({ path: '../.env' });

module.exports = {mysql, rp, app, bodyParser}

require('./bin/index');
