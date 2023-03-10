var express = require('express');
var app = express();
const cors = require("cors");
var bodyparser = require('body-parser');
const { unique_string } = require('./unique_string');
const morgan = require('morgan');
require('dotenv').config();

app.use(bodyparser.urlencoded({
  limit: "50mb",
  extended: false,
}));

app.use(express.static('public'));

app.use(bodyparser.json({ limit: "50mb" }));
// app.use(morgan('combined'));
// var connection = require('./Connect/Dbconnection');
const logger = require('./route/logs');
// app.use(logger);
var testjson = require('./route/rJson');

var login = require('./route/rLogin');
var user = require('./route/rUser');
var table = require('./route/table/rTable');
var projects = require('./route/projects');

// var field = require('./route/table/rField');
var tk = require('./route/token');
var tables = require('./route/tables');
var table = require('./route/table');

app.get('/api/get/the/god/damn/api/key/with/ridiculous/long/url/string', (req, res) => {
  res.send({ unique_string })
})

//Middleware
const Auth = require('./Middleware/Auth');
app.use(cors());
//Token0
app.use('/token', tk);
//Middleware
// app.use(Auth.isAuth);
//Login
app.use(`/${unique_string}`, login);
//Middleware
// app.use(Auth.verifyToken);
//User
app.use(`/api/${unique_string}/user`, user);
app.use(`/api/${unique_string}/projects`, projects);
//Table
// app.use('/api/table',table);
//Field
// app.use('/api/field',field);
// app.use('/api/field',fields.router);
app.use(`/api/${unique_string}/json`, testjson.router);
app.use(`/api/${unique_string}/tables`, tables.router)
app.use(`/api/${unique_string}/table`, table.router)

app.use((req, res, next) => {
  res.status(404).send("404 - Page not found");
})

var server = app.listen(process.env.PORT, function () {
  console.log('Server listening on port ' + server.address().port);
});



module.exports = app;