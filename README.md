#Creating a MEAN stack
MonggoDB, Express, AngularJS, NodeJS

##Setting up a back-end server (Node using Express and MonggoClient)

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

npm install --save express mongodb@2.2.19 body-parser
npm install --save-dev nodem

// package.json
"scripts":{
    "dev": "nodemon server.js"
}
