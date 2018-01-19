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
```javascript
    // package.json
    "scripts":{
        "dev": "nodemon server.js"
    }
```
Create a *server.js* file
```javascript
    //server.js
    const express       = require('express');
    const MongoClient   = require('mongodb').MongoClient;
    const bodyParser    = require('body-parser');
    const app           = express();
```
To get our server to run, we need to tell it to start listening to a port for HTTP requests.
Let's use 9090 as our port.
```javascript
    //server.js
    const port = 9090;

    app.use(bodyParser.urlencoded)({extended:true});
    app.listen(port, () =>{
        console.log('Listening to port: '+port);
    })
```
Now try to run *npm run dev* or if Nodemon wasnt installed you can run *node server.js*
You should see 'Listening to port: 9090' in the terminal.

Congrats! You have a running server. It doesn't do much now, but it will later on.

## Setting up our MongoDB

The fastest and easiest way to setup a Mongo database is by using [mLab].

Once you have an account and a MongoDB database, *add a user* to the database with a
*username* and *password*

Then copy the URL, it's the one boxed on the image below.
![monggodb](https://github.com/judedaryl/MEAN/tree/master/images/mongodb.png)

## CRUD routes (create, read, update and delete)
We will be creating 5 routes, a *CREATE* route, *READ* route (read 1 and read all),
*UPDATE* route, and *DELETE* route.

This will give you an idea on how to structure any basic route with _Node_.
To test our routes, install [postman].

### Organizing routes
For good readability and to make our app more manageable, it's best practice to organize our
work by creating separate folders and files for our routes and other components.

Create an *app* folder with a *routes* folder inside. Place a *index.js* and a *users.js* route
file inside it.

    root > app > routes > [index.js, users.js]

Setup *index.js* with
```javascript
    // routes/index.js
    const noteRoutes = require('./note_routes');
    module.exports = function(app, db) {
    noteRoutes(app, db);
    // Other route groups could go here, in the future
    };
```

Setup *users.js* with
```javascript
    // routes/users.js
    module.exports = function(app, db) {
    };
```

### Create route
Let's try creating a user

[mLab]: https://mlab.com/
[postman]: https://www.getpostman.com/
