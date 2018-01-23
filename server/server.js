const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const token          = require('./config/token');
const expressJwt     = require('express-jwt');
const session        = require('express-session');
const app            = express();
// server.js
const port = 9090;


app.use(bodyParser.urlencoded({extended:true}));

MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err)
    require('./app/routes')(app, database);
    app.listen(port, () => {
        console.log('Listening to ports: '+port);
    });               
})