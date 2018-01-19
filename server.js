const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();
// server.js
const port = 8000;
const port = 9090;

app.listen(port, () =>{
    console.log('Listening to port: '+port);
})