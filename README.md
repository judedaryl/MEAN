# Creating a MEAN stack
MongoDB, Express, AngularJS, NodeJS

This will be a step-by-step walkthrough with explanation and codes. No worries if you 
have trouble with the code, you can check the codes in the folders inside this git.

# Setting up a back-end server (Node using Express and MongoClient)

## Getting our node and express working
Install [node].
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

    app.use(bodyParser.urlencoded({extended:true}));
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
![mongodb]

Add a *config* directory in our root folder and create a *db.js* file.
    
    root > config > db.js

Inside, add the URL of our database.

```javascript
    module.exports = {
        url : '<monggodb_url>'
    }
```
Let's declare this with our `server.js`
```javascript
    const db             = require('./config/db');
```

Note that we've only declared this in our `server.js`, we will be listening to our
port and sending the received data to our `MongoDB` later on.

## CRUD routes (create, read, update and delete)
We will be creating 5 routes, a *CREATE* route, *READ* route (read 1 and read all),
*UPDATE* route, and *DELETE* route. This will give you an idea on how to structure any basic route with _Node_.
To test our routes, install [Postman].

## Organizing routes
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

## Linking our server.js to our MongoDB
Now that we have our route files setup, let's change our `server.js` file

Remove

```javascript
    //server.js
    app.listen(port, () =>{
        console.log('Listening to port: '+port);
    })
```

Replace with

```javascript
    //server.js
    MongoClient.connect(db.url, (err, database) => {
        if (err) return console.log(err)
        require('./app/routes')(app, database);
        app.listen(port, () => {
            console.log('Listening to port: '+port);
        });               
    })
```

## CREATE route
Setup a create route in *users.js*. Note that this is using a `POST` method

```javascript
    //users.js
    const error = { 'error': 'An error occurred' };
    module.exports = function(app, db) {

        app.post('/users', (req, res) => {
            //Place parameters inside a JSON structure
            const userdetails = { email: req.body.email, password: req.body.password }
            
            //Connect to our database        
                db.collection('users').insert(userdetails, (err,results) => {
                    if(err) res.send(error);
                    else res.send(results.ops[0]);
                });      

            //Lets display this on our server console.
            console.log(userdetails)
        });

    };
```

Let's test! Run your server using `npm run dev` and test this using `Postman`. Send a x-www-form-urlencoded POST request with
a `email` and `password` set under the `Body` tab. Your Postman windows should look like this:
![create]


MongoDB auto generates a `unique id` for each entry, now take note of the _id. We will
be using this in the next route.

## READ route 
For this example, we will be retrieving a user using the unique ID. This
ID is a mongoDB objectID. 
Add this on the top portion of `users.js`
```javascript
    var objectid = require('mongodb').ObjectID;
```

## READ route (Single entry)
Setup a read route in `users.js` just below our create route. Note that this is using a `GET` method.
```javascript
    //users.js
    app.get('/users/:id', (req,res) =>{
        const id = req.params.id;
        const details = {'_id': new objectid(id) };
        db.collection('users').findOne(details, (err,item)=>{
            if(err) res.send(error);
            else res.send(item);
        })
    });
```

Let's try this using Postman. Use the _id you created from the `CREATE` route, In your Postman, don't forget to set the 
method to `GET` and use "http://localhost:9090/users/<_id>".

![read-one]


## READ route (All entries)
Add this code below the read single entry route.
```javascript
    //users.js
    app.get('/users',(req,res) =>{
        db.collection('users').find().toArray(function(err,items){
            if(err) res.send(error);
            else res.send(items);
        });
    });
```
You can test this again using postman, using `GET` method and the url "http://localhost:9090/users"

![read-all]

## UPDATE route (Updating all fields)
This route shares the characteristic of both the `CREATE` route and the `READ` route, place this code below the *read* routes.
Note that this is using a `PUT` method.

```javascript
    //users.js
    app.put('/users/:id', (req, res) => {
        const id = req.params.id;
        const userdetails = { email: req.body.email, password: req.body.password };
        const details = {'_id': new objectid(id) };     
        //Connect to our database        
            db.collection('users').update(userdetails, (err,results) => {
                if(err) res.send(error);
                else res.send(userdetails);
            });

        //Lets display this on our server console.
        console.log(userdetails)
    });
``` 

Let's try to update the user we used earlier. Using Postman set the method to `PUT` and use the url "http://localhost:9090/users/<_id>".
Don't forget to fill-up the `Body` > `x-www-form-urlencoded` with a new set of user details.


![update-all]

## UPDATE route (Updating a specific field)
The route above will update all data with respect to the `_id` provided. And this is not what happens in most cases, when updating
data we usually update a portion leaving the rest of it untouched. The code for this is the same for the above but we will be using the 
`$set` operator. We will also change our route, so that it's unique. 

For this example we will only be updating the email field of the user we used earlier.

```javascript
    //users.js
    //app.put('/users/:id', (req, res) => {
    app.put('/users/email/:id', (req, res) => {
        const id = req.params.id;
        //const userdetails = { email: req.body.email, password: req.body.password }
        const userdetails = { $set:{ email: req.body.email } };
        const details = {'_id': new objectid(id) };     
        //Connect to our database        
            db.collection('users').update(userdetails, (err,results) => {
                if(err) res.send(error);
                else res.send(userdetails);
            });

        //Lets display this on our server console.
        console.log(userdetails)
    });
``` 
Using Postman set the method to `PUT` and use the url "http://localhost:9090/users/<_id>".
Fill up the email field of `Body` > `x-www-form-urlencoded` with new details and disable the password field (Although this won't matter
since our route only processes the email portion of the data).

![update-email]

## DELETE route
Deleting an entry shares the characteristics as finding one, place this below the `UPDATE` route.

```javascript
    //users.js
    app.delete('/users/:id', (req, res) => {
        //Place parameters inside a JSON structure
        const id = req.params.id;
        const details = {'_id': new objectid(id) };
        //Connect to our database        
            db.collection('users').remove(details, (err,results) => {
                if(err) res.send(error);
                else res.send('Deleted user with id: '+id);
            });      
        console.log('Deleted user with id: '+id);
    });
``` 
Finally, let's try getting rid of the user with the _id we used for all the other routes.
Use Postman and set the method to `Delete`, use the url "http://localhost:9090/users/<_id>".

![delete]

## Backend Complete!
You now have a working NodeJS API which can process the CREATE, READ, UPDATE, and DELTE! Now let's start working on our frontend.



# Setting up our Frontend using AngularJS

Create a new folder named `public` under the root folder, this is where we will place all front-end related stuff.

    root > public

Open `cmd.exe` as `administrator` and go to the public folder

    cd C:\Users\<user>\mean\public
    
    // install angular command line
    npm install -g @angular/cli

## Create a new application

Let's name our new project "homunculi"

    ng new homunculi
    
## Try serving the application

    cd homunculi
    ng serve --open --host localhost --port 9091

If ever you experience an error such as

    Error: Cannot find module '@angular-devkit/core'
    at Function.Module._resolveFilename (module.js:469:15)
    at Function.Module._load (module.js:417:25)
    at Module.require (module.js:497:17)
    at require (internal/module.js:20:19)
    at Object.<anonymous> (C:\......\node_modules\@schematics\schematics\schematic\factory.js:10:16)
    at Module._compile (module.js:570:32)
    at Object.Module._extensions..js (module.js:579:10)
    at Module.load (module.js:487:32)
    at tryModuleLoad (module.js:446:12)
    at Function.Module._load (module.js:438:3)

Just go back to the comand line, and run the following:

    cd homunculi
    npm install -g @angular-devkit/core
    npm i -D @angular-devkit/core

    
## Add semantic-ui to the application

I've been using this user interface for quite some time now, so for those who aren't yet familiar with this you can check its documentation on the official [semantic-ui site].

### Install the Out of the box Semantic UI

Semantic UI is available on npm, we will install semantic through the command line. Go back to your angular root folder. Also note that semantic ui depends on `jquery` so let's include that too.

    cd public/homunculi
    npm install semantic-ui-css jquery --save

This will install the **out of the box** `semantic-ui` components that we will need inside the node_module folder of our project.
After this installs let's go ahead and update `.angular-cli.json`

    Open root > public > homunculi > .angular-cli.json

Find `"styles"` and `"scripts"` and add the following:

      "styles": [
        "styles.css",
        **"../node_modules/semantic-ui-css/semantic.min.css"**
      ],
      "scripts": [
        **"../node_modules/jquery/dist/jquery.min.js",**
        **"../node_modules/semantic-ui-css/semantic.min.js"**
      ],


Now that our UI is ready, let's proceed with customizing our application.

## Change the application title

Open the component class file ( app.component.ts ) and change the value of the `title` property to 'Homunculi'
    
```typescript
    //app.component.ts
    title = 'Homunculi';
```

Open the template file and replace the auto generated template by the Angular CLI.

```html
    <!--app.component.html-->
    <h1>{{title}}</h1>
```
## Add some global styles

Open `styles.css` and place the following css code:

```css
    .p-0 {
        padding: 0 !important;
    }
    .px-3 {
        padding-right: 16px !important;
        padding-left: 16px !important;
    }
    .mt-3 {
        margin-top: 16px !important;
    }
    .pt-5 {
        padding-top: 32px !important;
    }
    .pb-4 {
        padding-bottom: 24px !important;
    }
    .width-full{
        width: 100% !important;
    }
    .text-center{
        text-align: center !important;
    }
    .secondary.pointing.menu.toc.item {
        display: none;
    }
```
## Create a home component

Use Angular CLI to generate a new component `home`

    ng generate component home

The CLI will create a new folder, `src/app/home` and generate three files. Open `home.component.html` and copy the code below.

```html
    <div class="ui text container">
        <h1 class="ui inverted header">
            {{title}}
        </h1>
        <h2>Do whatever you want when you want to.</h2>
        <div class="ui huge primary button">Get Started <i class="right arrow icon"></i></div>
    </div>
```
## Create a login component

Use Angular CLI to generate a new component `login`

    ng generate component login

Open `login.component.html` and copy the code below.
```html
    <div class="header width-full pt-5">
        <div class="container clearfix width-full text-center">
        <img src="assets/images/ouroboros.png" width="100px">
        </div>
    </div>
    <div class="ui container">
        <div class="auth-form px-3">
            <form class="ui form">
            <div class="auth-form-header p-0">
                <h1 class="inverted">Sign in to Homunculi</h1>
            </div>
            <div class="auth-form-body mt-3">
                <div class="field">
                    <label>Email address</label>
                    <input type="text" name="email" placeholder="Email@email.com"/>
                    </div>
                    <div class="field">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Password"/>
                    </div>
                    <button class="ui primary button mt-3">
                    Sign In
                    </button>
                </div>
            </form>
            <p class="mt-3 register-callout">
            New to Homunculi? <a href=#>Create an account.</a>
            </p>
        </div>
    </div>
```
Add some style to our login component by opening `login.component.css` and copying the code below.

```css
    .auth-form{
        width:340px;
        margin: 0 auto 0 auto;
    }

    .auth-form-header {
        margin-bottom: 15px;
        color: #333;
        text-align: center;
        text-shadow: none;
        background-color: transparent;
        border: 0;
    }

    .auth-form-header h1{
        font-size: 24px;
        color: white;
        font-weight: 300;
        letter-spacing:  -0.5px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }

    .auth-form-body {
        padding: 20px;
        font-size: 14px;
        background-color: #fff;
        border: 1px solid #d8dee2;
        border-radius: 4px;
    }

    .auth-form-body button{
        width: -webkit-fill-available;
    }

    .register-callout {
        padding: 15px 20px 15px 20px;
        text-align: center;
        border: 1px solid #d8dee2;
        border-radius: 5px;
    }
```

## Create a register component

Create the component

    ng generate component register

Open `register.component.html` and copy the code:

```html
    <div class="header width-full pt-5">
        <div class="container clearfix width-full text-center">
        <img src="assets/images/ouroboros.png" width="100px">
        </div>
    </div>

    <div class="ui container reg-form mt-3">
    <div class="ui vertical segment">
        <h1 class="ui huge header">
        Be a Homunculus
        <div class="sub header">Join the league of esteemed Developers</div>
        </h1>
    </div>

    <div class="ui">
        <div class="reg-form-container">
            <form class="ui form">
                <h2 class="f2-light mb-1">
                Create your own account
                </h2>
                <dl class="form-group">
                    <div class="field">
                        <label>Display name</label>
                        <input type="text" name="display-name" placeholder="Display Name">
                        <p class="note">This will be the name displayed on your profile.</p>
                    </div>
                    <div class="field">
                        <label>Email address</label>
                        <input type="text" name="email" placeholder="Email@email.com">
                        <p class="note">Your email will be used for logging in. We're keeping this
                        to ourselves.
                        </p>
                    </div>
                    <div class="field">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="Password">
                        <p class="note">Use at least one lowercase letter and seven characters.</p>
                        </div>
        
                    <button class="ui button primary mt-3" type="submit">Register</button>
                </dl>
            </form>
            </div>
    </div>
    </div>
```

Let's add some style to our `register.component.css`:

```css
    .reg-form{
        width:400px;
        padding: 10px 20px 10px 20px;
        border: 1px solid #d8dee2;
        border-radius: 5px;
        margin: 0 auto 0 auto;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        background: white;
    }

    .f2-light{
        font-size: 22px !important;
        font-weight: 300 !important;
        color: #333;
    }

    .note {
        min-height: 17px;
        margin: 4px 0 2px 0;
        font-size: 12px;
        color: #333;        
    }
``` 
## Routing

Now that we've finished setting up our pages let's handle the routing between them.

    ng generate module app-routing --flat --module=app

Open the generated file `app-routing.module.ts`. You should see something like this.

```typescript
    //app-routing.module.ts
    import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';

    @NgModule({
    imports: [
        CommonModule
    ],
    declarations: []
    })
    export class AppRoutingModule { }
```

Let's clean this up by deleting some unnecessary code. Since we won't be using them, delete the `@NgModule.declarations` array and `CommonModule` references.
We'll be configuring the router with `Routes` in the `RouterModule` so import those two symbols from the `@angular/router` library.
Add an `@NgModule.exports` array with `RouterModule` in it. Exporting `RouterModule` makes router directives available for use in the `AppModule` components that will need them.

`AppRoutingModule` looks like this now:
```typescript
    //app-routing.module.ts
    import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';

    @NgModule({
    exports: [ RouterModule ],
    imports: [ RouterModule.forRoot(routes)]
    })

    export class AppRoutingModule {}
```

### Add some routes

A typical Angular `Route` needs a `path` (string that matches url in browser address bar) and a `component` (the component the router will point to).

Import our components `HomeComponent` `LoginComponent`, and `RegisterComponent`. Then define an array of routes with a single `route` to that component.
Then initialize the `router` and start it listening for browser location changes. We can do this by Adding `RouterModule` to the `@NgModule.imports` array and configure it
with the `routes` in one step by calling `RouterModule.forRoot()` within the `imports` array.

Your `app-routing.module.ts` should look like this now.

```typescript
    //app-routing.module.ts
    import { HomeComponent } from './home/home.component';
    import { LoginComponent } from './login/login.component';
    import { RegisterComponent } from './register/register.component';
    import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';

    const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    ];
    @NgModule({
    exports: [ RouterModule ],
    imports: [ RouterModule.forRoot(routes)]
    })

    export class AppRoutingModule {}
```

### Add RouterOutlet

Open `app.component.html` and place 

```html 
    <router-outlet></router-outlet>
```

### Test our routes

We can test our routes by serving our application.

    `ng serve --open --host localhost --port 9091`

Then try navigating to our different routes `http:\\localhost:9091\home`, `http:\\localhost:9091\login`, `http:\\localhost:9091\register`.
You should be able to see your different pages.

## Binding some routes to our links

## Create the User model class

As users enter form data, we need to capture these changes and update an instance of a model. A model can be as simple as a "proprty bag" that holds facts
about a thing of application importance. That describes `User` class with its three required fields (`displayname`, `email`, `password`).

Using Angular CLI, generate a new class named `User`

    ng generate class User

With this content

```typescript
    export class User {

        constructor(
        public displayname: string,
        public username: string,
        public password: string,
        ) {  }
    }
```

## Revise app.module.ts

`app.module.ts` defines the application's root module. In it you identify the external modules you'll use in the application and declare components that belong to this module,
such as the `HeroComponent`, `LoginComponent` and `RegisterComponent`. Because template-driven forms are in their own module, you need to **add** the `FormsModule` to the array of
`imports` for the application module before you can use forms.

Update it with:

```typescript
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
    import { FormsModule } from '@angular/forms';

    import { AppComponent } from './app.component';
    import { HomeComponent } from './home/home.component';
    import { LoginComponent } from './login/login.component';
    import { RegisterComponent } from './register/register.component';
    import { AppRoutingModule } from './/app-routing.module';


    @NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
    })
    export class AppModule { }

```
    There are only two changes.
        1. You import `FormsModule`
        2. You add `FormsModule` to the list of imports


[node]: https://docs.npmjs.com/getting-started/installing-node
[mLab]: https://mlab.com/
[Postman]: https://www.getpostman.com/

[mongodb]: https://raw.githubusercontent.com/judedaryl/MEAN/master/images/mongodb.png
[create]: https://raw.githubusercontent.com/judedaryl/MEAN/master/images/create.png
[read-one]: https://raw.githubusercontent.com/judedaryl/MEAN/master/images/read-one.png
[read-all]: https://raw.githubusercontent.com/judedaryl/MEAN/master/images/read-all.png
[update-all]: https://raw.githubusercontent.com/judedaryl/MEAN/master/images/update-all.png
[update-email]: https://raw.githubusercontent.com/judedaryl/MEAN/master/images/update-email.png
[delete]: https://raw.githubusercontent.com/judedaryl/MEAN/master/images/delete.png

[semantic-ui site]: https://semantic-ui.com/introduction/getting-started.html