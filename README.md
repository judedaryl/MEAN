# Creating a MEAN stack
    MongoDB, Express, AngularJS, NodeJS

## Setting up a back-end server (Node using Express and MongoClient)

In a new directory, run npm init together with the following prompts.

    npm init
    name: <name>
    version: <1.0.0>
    description: <description>
    entry point: server.js
    test command:
    git repository: <your git>
    keywords: MonggoDB Express AngularJS NodeJS
    author: <author>
    license: (ISC)

We will be using Express for our framework and MongoDB as a database and
body-parser to process JSON requests.

    npm install --save express mongodb@2.2.19 body-parser

Install Nodemon as a dev dependecy. It automatically restarts your server when files change.

    npm install --save-dev nodem

Add this to package.json

    // package.json
    "scripts":{
        "dev": "nodemon server.js"
    }

Create a *server.js* file
    
    //server.js
    const express       = require('express');
    const MongoClient   = require('mongodb').MongoClient;
    const bodyParser    = require('body-parser');
    const app           = express();

To get our server to run, we need to tell it to start listening to a port for HTTP requests.
Let's use 9090 as our port.

    //server.js
    const port = 9090;

    app.listen(port, () =>{
        console.log('Listening to port: '+port);
    })
