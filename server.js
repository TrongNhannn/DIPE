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
var rfid = require('./route/rf')
const Auth = require('./Middleware/Auth');
var tk = require('./route/token');

var tables = require('./route/tables');
var table = require('./route/table');

//RFID

app.get('/api/get/the/god/damn/api/key/with/ridiculous/long/url/string', (req, res) => {
  res.send({ unique_string })
})
app.use(cors());
//Token0
// app.use('/token', tk);
//Login
app.use(`/${unique_string}`, login);
//Middleware
// app.use(Auth.verifyToken);
//User
app.use(`/api/${unique_string}/user`, user);
app.use(`/api/${unique_string}/projects`, projects);
app.use( `/api/${unique_string}/`, rfid)
//Table
// app.use('/api/table',table);
//Field
// app.use('/api/field',field);
// app.use('/api/field',fields.router);
app.use(`/api/${unique_string}/json`, testjson.router);
app.use(`/api/${unique_string}/tables`, tables.router);
app.use(`/api/${unique_string}/table`, table.router);
// app.use(`/api/${unique_string}/rfid`, rfids.router);

app.use((req, res, next) => {
  const { url } = req;

  const splitted = url.split('/')[4]

  mongo( dbo => {
      dbo.collection('apis').findOne({ "url.id_str": splitted }, (err, result) => {
          const api = result;
          if( api && api.status ){
              apiResolving(req, api, ( { data } )=> {
                  res.status(200).send({ success: true, data })
              })
          }else{
              res.status(404).send({ success: false, content: "404 page not found" })
          }
      })
  })
})





var server = app.listen(process.env.PORT, function () {
  console.log('Server listening on port ' + server.address().port);
});

module.exports = app;