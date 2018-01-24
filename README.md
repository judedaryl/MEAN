<div style="text-align:center">
<img src="https://raw.githubusercontent.com/judedaryl/MEAN/master/public/homunculi/src/assets/images/ouroboros.png" width="150" height="150">
</div>

# Homunculi
## A MEAN stack that handles login and registration

[MongoDB] [Express.js] [Angular] [Node.js]

This is a step-by-step walkthrough with explanation and codes. Don't worry if you 
have trouble with the code, you can check the codes in the folders inside this git.

## Setting up a back-end server (Node using Express and MongoClient)

### Getting our node and express working
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
Now try to run `npm run dev` or if Nodemon wasnt installed you can run `node server.js`
You should see 'Listening to port: 9090' in the terminal.

Congrats! You have a running server. It doesn't do much now, but it will later on.

## Setting up our MongoDB

The fastest and easiest way to setup a Mongo database is by using [mLab].

Once you have an account and a MongoDB database, **add a user** to the database with a **username** and **password**
Then copy the URL, it's the one boxed on the image below.
![mongodb_]

Add a *config* directory in our root folder and create a `db.js` file.
    
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
We will be creating 5 routes, a `CREATE` route, `READ` route (read 1 and read all),
`UDPATE` route, and `DELETE` route. This will give you an idea on how to structure any basic route with _Node_.
To test our routes, install [Postman].

## Organizing routes
For good readability and to make our app more manageable, it's best practice to organize our
work by creating separate folders and files for our routes and other components.

Create an *app* folder with a *routes* folder inside. Place a `index.js` and a `users.js` route
file inside it.

    root > app > routes > [index.js, users.js]

Setup `index.js` with
```javascript
    // routes/index.js
    const noteRoutes = require('./note_routes');
    module.exports = function(app, db) {
    noteRoutes(app, db);
    // Other route groups could go here, in the future
    };
```

Setup `users.js` with
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
## CORS (Cross-Origin Resource Sharing)

Every browser has this security feature that secures HTTP requests. Since in this project our front-end will be using `port: 9091` running on the `host: localhost`
we can add it to our access control-allow-origin.

```javascript
    //users.js
    const error = { 'error': 'An error occurred' };

    module.exports = function(app, db) {
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "http://localhost:9091");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    };
```
## CREATE route
Setup a create route in *users.js*. Note that this is using a `POST` method. `/users` will be the route we will be utilizing for `Registration`. Another route `/users/login` will be for `Login`. The main difference between the two is that `/users` will be **inserting** new data while `/users/login` will be **finding** the matching entry on the database with data we will be providing namely **email** and **password**.

Since `/users/login` is for user `Registration` it will also need to cross check if the data provided by the user exists or not. We will be adding a multi-layer checking that finds if the `email` exists or if the `displayname` exists and returns a corresponding `error` if they do.

```javascript
    //users.js
    const error = { 'error': 'An error occurred' };
    module.exports = function(app, db) {
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "http://localhost:9091");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        //Registration route
        app.post('/users', (req, res) => {
            const userdetails = {
                displayname: req.body.displayname,
                password: req.body.password,
                email: req.body.email
            }
            //check if display name exists
            db.collection('users')
            .find( {email: req.body.displayname})
            .toArray(function(err,item) {
                if(err) res.send(err);
                else {
                    if(Object.keys(item).length != 0) res.send({exists: 'displayname'})
                    else {
                        //check if email exists
                        db.collection('users')
                        .find({displayname: req.body.email})
                        .toArray(function(err,item){
                            if(Object.keys(item).length != 0) res.send({exists: 'email'})
                            else {
                                //add new user
                                db.collection('users')
                                .insert(userdetails, (err,item)=>{
                                    if(err) res.send({error: err})
                                    else res.send({ status: 'ok', data: item['ops'] })
                                })
                            }
                        })
                    }
                }
                
            })        
        });
        //Login route
        app.post('/users/login', (req,res) =>{
            const email = req.body.email;
            const password = req.body.password;
            const details = {'email': email, 'password': password };
            db.collection('users').findOne(details, (err,item)=>{
                if(err) res.send(error);
                else res.send(item);
            })
        });

    };
```

Let's test! Run your server using `npm run dev` and test this using `Postman`. Send a x-www-form-urlencoded POST request with
a `email` and `password` set under the `Body` tab. Your Postman window should look like this:
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
    .items-center{
        justify-content: center !important;
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
        <img src="https://raw.githubusercontent.com/judedaryl/MEAN/master/public/homunculi/src/assets/images/ouroboros.png" width="100px">
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
            New to Homunculi? <a>Create an account.</a>
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
        width: 100%;
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

    <div class="ui grid two items-center">
        <div name="form" class="two">
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
                            {{ livedata }}
                            <dl class="form-group">
                                <div class="field">
                                    <label>Display name</label>
                                    <input type="text" placeholder="Display Name">
                                    <p class="note">This will be the name displayed on your profile.</p>
                                </div>
                                <div class="field">
                                    <label>Email address</label>
                                    <input type="text" placeholder="Email@email.com">
                                    <p class="note">Your email will be used for logging in. We're keeping this
                                    to ourselves.
                                    </p>
                                </div>
                                <div class="field">
                                    <label>Password</label>
                                    <input type="password" placeholder="Password">
                                    <p class="note">Use at least one lowercase letter and seven characters.</p>
                                </div>                
                                <button class="ui button primary mt-3" type="submit">Register</button>
                            </dl>
                        </form>                    
                    </div>
                </div>
            </div>
        </div>
        <div name="form-info" class="two">
            <div class="header pt-5">
                <div class="container clearfix text-center">
                <img src="https://raw.githubusercontent.com/judedaryl/MEAN/master/public/homunculi/src/assets/images/ouroboros.png" width="400px">
                </div>
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
    .form-info{
        width: 300px !important;
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
    { path: '', redirectTo: '/home', pathMatch: 'full' }
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
### Configure some links to have a route

Inside the `login.component.html`, there is a link named **Create an account** we can bind the `Register Component` to this link by adding the `routerLink` method of `Angular`

```html
    New to Homunculi? <a routerLink="/register">Create an account.</a>
```
### Test our routes

We can test our routes by serving our application.

    `ng serve --open --host localhost --port 9091`

Then try navigating to our different routes `http:\\localhost:9091\home`, `http:\\localhost:9091\login`, `http:\\localhost:9091\register`.
You should be able to see your different pages.

## Adding our pages and other necessary modules to our application.

`app.module.ts` defines the application's root module. In it you identify the external modules you'll use in the application and declare components that belong to this module, such as the `HeroComponent`,`LoginComponent` and `RegisterComponent`. 

Because template-driven forms are in their own module, you need to **add** the `FormsModule` and `ReactiveFormsModule` to the array of `imports` for the application module so that we can use forms.

We will also add `HttpClientModule` to handle the HTTP requests we will be using later.

Update it `app.module.ts` with:

```typescript
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
    import { FormsModule, ReactiveFormsModule } from '@angular/forms';
    import { HttpClientModule } from '@angular/common/http';

    import { AppComponent } from './app.component';
    import { HomeComponent } from './home/home.component';
    import { LoginComponent } from './login/login.component';
    import { RegisterComponent } from './register/register.component';
    import { AppRoutingModule } from './/app-routing.module';
    import { HttpRequestService } from './http-request.service';


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
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [HttpRequestService],
    bootstrap: [AppComponent]
    })
    export class AppModule { }

```

# Communication between front-end and back-end

Now that we have our pages and our serving running, let's try to send some form data from our `register` module to our server's `CREATE` api.

### Creating a HTTP service.

To follow some good practices, let's create a configuration file named `app.ts` inside a `config` folder, the folder structure should follow:

    root > public > homunculi > config > app.ts

Open app.ts and let's place our server url.

```typescript
    //app.ts
    export const Config = {
        api = "localhost://9090"
    }
```  

Create the service using `AngularCLI`

    ng generate service http-request --module=app

Using the `AngularCLI`, our service will automatically be registered in our `app.module.ts` so we don't have to worry about that any more. 

Since this project is concerned with login and registration, a generic `post` method will be implemented. Although a generic `get` has the same structure with the `post`. By generic, this service can be used in any project.

Open `http-request.service.ts` and add the code below:

```typescript
    import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
    import { Injectable } from '@angular/core';
    import { Config } from '../config/app';

    declare var $: any;

    @Injectable()
    export class HttpRequestService {

        result: Object[];
        constructor(private hc: HttpClient) {
        }

        async post(params, ext): Promise<any> {
            let body = new HttpParams();
            $.each(params, function(k, v) {
            body = body.append(k, v);
            });
            try {
            return await this.hc.post(Config.api + ext, body).toPromise();
            } catch (error) {}
        }

    }

```

### Creating a User service

Create the service

    ng generate service user --module=app

The service created earlier is a generic one, this service will be more specific on the data we want to send and where to send them. We will create a `Login method` and a `Register method` and use the `http-request service` we created earlier to do the heavy lifting.

### Creating a User class

Since afterall this will handle user information, let's create a user class. You can do this by using the `AngularCLI` command **BUT** personally i prefer manually making the file so we can maintain the arrangement of our files.

Create a `model` folder inside the app folder and make a new `user.ts` file inside it

    > root > public > homunculi > src > app > models

Open `user.ts` and copy the code:

```typescript
export const User: Object = {
  displayname: '',
  email: '',
  password: '',
};

```

Now that a `user` object is made, import this and the `http-request service`
Open `user.service.ts`

```typescript
//user.service.ts
import { User } from './models/user';
import { HttpRequestService } from './http-request.service';
import { Injectable } from '@angular/core';
```

Inside the class, assign a variable to the `user` object and add our `http-request service` to the constructor.

```typescript
//user.service.ts
@Injectable()
export class UserService {
    user = User;
    constructor(private request: HttpRequestService){}
}
```

Add a `login`, `signout` and `register` method. Both `login` and `register` should be `async`. When the user is trying to log-in and is successful in doing so, store the `displayname` and `email` to our model.

```typescript
//user.service.ts
  async login(params): Promise<any> {
    const response =  await this.request.post(params, '/users/login');
    if (response['status'] === 'ok' ) {
      console.log(response['data']);
      if (response['data'] !== null) {
        this.user['displayname'] = response['data']['displayname'];
        this.user['email'] = response['data']['email'];
        this.user['loggedin'] = true;
      }
    }
    return response;
  }

  async register(params): Promise<any> {
    try {
        return await this.request.post(params, '/users');
    } catch (error) {}
  }

  signout(): void {
      this.user['loggedin'] = false;
  }
```
## Using localStorage

The `user service` will be managing all the data about a user and as such it will also be handling the storage of this data. Angular already has this method `localStorage`. Angular uses cookies for this. 

Add this method to the `user service` to save user data after the user has successfully logged-in. Modify the `signout` to remove the user details from the `localStorage`. 

If a user has logged-in simply change the property `loggedin` of the model `user` to true, and false otherwise.

```typescript
//user.service.ts
async login(params): Promise<any> {
    const response =  await this.request.post(params, '/users/login');
    if (response['status'] === 'ok' ) {
        console.log(response['data']);
        if (response['data'] !== null) {
        this.user['displayname'] = response['data']['displayname'];
        this.user['email'] = response['data']['email'];
        this.user['loggedin'] = true;
        //STORE INFORMATION
        localStorage.setItem('user', JSON.stringify(this.user));
        }
    }
    return response;
}

signout(): void {
    localStorage.removeItem('user');
    this.user['loggedin'] = false;
}
```

Leave these services be for the moment and let's continue on with our forms.

## Binding the values of our registration form

Let's start by opening `register.component.ts`. Here we will see the default boiler text setup by the `AngularCLI` when we made the register component. Since we will be using forms module, import the following to the file.

```typescript
    //register.component.ts
    import { FormGroup, FormBuilder, Validators } from '@angular/forms';
```

Let's create a `FormGroup` with the name `registrationForm` inside the **class**, and use `FormBuilder` to create the form for us with the necessary data we need to register a user namely the **Display name**, **Email Address**, and **Password**. We can do this by creating a method that we will name **generateForm()** and call this method in our class' `constructor`.

```typescript
    //register.component.ts
    export class RegisterComponent implements OnInit {

        registrationForm: FormGroup;

        ngOnInit() {

        }
        constructor(private builder: FormBuilder) {
            this.generateForm();
        }

        generateForm() {
            this.registrationForm = this.builder.group({
            displayname: '',
            email: '',
            password: ''
            });
        }
    }   
```
`registrationForm` is our `FormGroup` while it's contents `displayname`, `email`, and `password` are our `FormControl`. The `FormControl` can also act the same way as models which have **bindings** with our application. To see this in action we can add a `livedata` method and call this in our template page.

```typescript
    //register.component.ts
    get livedata() { return JSON.stringify(this.registrationForm.value); }
```

Add some bindings to our `register.component.html`, and call the `livedata` method to see the binding in action.

```html
    //register.component.html
    ...
    <h2 class="f2-light mb-1">
        Create your own account
    </h2>
    {{ livedata }}

    ...
    <form class="ui form" [formGroup]="registrationForm">

    ...
    <input type="text" placeholder="Display Name" formControlName="displayname">

    ...
    <input type="text" placeholder="Email@email.com" formControlName="email">

    ...
    <input type="password" placeholder="Password" formControlName="password">
```

Notice that as your type, you can see how the values of the `FormGroup` and `FormControl` change instantaneously.

To call their values inside our template `register.component.html` and in our component `register.component.ts`. You can use the functions below.

```html
    {{ registerForm.get('displayname').value }}
    {{ registerForm.get('email').value }}
    {{ registerForm.get('password').value }}
```

```typescript
    registerForm.get('displayname').value
    registerForm.get('email').value
    registerForm.get('password').value
```

Once you're done testing don't forget to remove the `{{ livedata }}` call we did inside our html.

## Adding validation to our form

Earlier we added an import to `Validators` to `register.component.ts`. We can modify the `generateForm()` method to add validation. We can add as many validations as we want by creating an array.

In this example, let's provide our form values with some rules.

For `displayname`:
    * Should have atleast 4 characters
    * Should not be blank (required)

For `email`:
    * Should be a valid email
    * Should not be blank (required)

For `password`:
    * Should have atleast 6 characters
    * Should not be blank (required)

For `Register` button:
    * Should be disabled if the form is **invalid**

Let's implement this by modifying `generateForm()` with the code below.

```typescript
    //register.component.ts
  generateForm() {
      this.registrationForm = this.builder.group({
        displayname: ['', [Validators.minLength(4), Validators.required]],
        email: ['', Validators.required ],
        password: ['', [Validators.minLength(6), Validators.required]]
      });
  }
```
We need angular to know that the input for an email is actually for an email.

```html
    //register.component.html
    <input type="email" placeholder="Email@email.com" email formControlName="email">
```
```html
    //register.component.html
    <button class="ui button primary mt-3" type="submit" [disabled]="registrationForm.invalid">Register</button>
```

Add some warning messages at the bottom of the `Ouroboros logo`. 
We want the warning message to show errors according to the rules we set earlier.
Modify the div with `name="form-info"` with the code below.

```html
    //register.component.html
    <div name="form-info" class="two form-info">
        <div class="header pt-5">
            <div class="container clearfix text-center centered">
            <img src="https://raw.githubusercontent.com/judedaryl/MEAN/master/public/homunculi/src/assets/images/ouroboros.png" width="200px">
            </div>
        </div>
        <div class="ui">
            <div *ngIf="registrationForm.get('displayname').status === 'INVALID' && (registrationForm.get('displayname').dirty || registrationForm.get('displayname').touched)" class="ui warning mini message">
                <ul class="list">
                    <li *ngIf="registrationForm.get('displayname').errors.minlength">Display name must be 4 characters long</li>
                    <li *ngIf="registrationForm.get('displayname').errors.required">Please input a display name</li>
                </ul>
            </div>
            <div *ngIf="registrationForm.get('email').status === 'INVALID' && (registrationForm.get('email').dirty || registrationForm.get('email').touched)" class="ui warning mini message">
                <ul class="list">
                    <li>Please enter a valid email address.</li>
                </ul>
            </div>
            <div *ngIf="registrationForm.get('password').status === 'INVALID' && (registrationForm.get('password').dirty || registrationForm.get('password').touched)" class="ui warning mini message">
                <ul class="list">
                    <li *ngIf="registrationForm.get('password').errors.minlength">Password must be atleast 6 characters long.</li>
                    <li *ngIf="registrationForm.get('password').errors.required">Please input a password</li>
                </ul>
            </div>
        </div>
    </div>
```

So that we can obtain further visualization of a validation error occuring, let's add some new styles in `register.component.css`

```css
    /* register.component.css */
    .ng-valid[required], .ng-valid.required input {
        border: 1px solid #42A948 !important; /* green */
    }
    .ng-invalid.ng-dirty:not(form) {
        border: 1px solid #a94442 !important; /* red */ 
    }
    .ui.form .warning.message, .ui.form {
    display: block;
    }  
    .ui.input.error input { 
        background-color: #fff6f6 !important; 
        border-color: #e0b4b4 !important; 
    }
```
## Sending our data to our Node server using our http-request service
  
Now that we finished our form validation, we can send our data to our `node` using the `http-request.service` we created earlier.

## Registration
Inject the `http-request.service` to the `register.component.ts` by adding it to the constructor and importing it. Import our configuration file too.

```typescript
    ...
    import { HttpRequestService } from './../http-request.service';
    ...
    constructor(private builder: FormBuilder, private request: HttpRequestService) {
        this.generateForm();
    }
```

Let's assign a `onSubmit()` method to our form and add this method to our component. 

The good thing about semantic is that the `forms` already have a `loading` view if we add a `loading` class inside the form. we can also place this feature in our `onSubmit()` method.

Angular also implements the `async` and `await` api's similar to C#, we'll be using this to create a `blocking` of our code while it waits for a response to our request.

Our `Node-Express` back-end has already been configured to give us errors, we can place this response inside a `response` object. Import and assign a variable to this object inside our class. Data handling will be assigned to a method named `handleResponse`.

Create the `response` object inside our `models` folder.

    root > public > homunculi > src > app > models > response.ts

```typescript
export const Response: Object = {
    mess: null,
    error: null,
    haserror: false
};
```

```typescript
    //register.component.ts
    import { Response } from './../models/response';
```
```typescript
    //register.component.ts
    response = Response;
    async onSubmit() {
        $('.ui.form').addClass('loading');
        this.handleResponse(await this.request.registerUser(this.registrationForm.value));
        $('.ui.form').removeClass('loading');
    }

    handleResponse(response: Object) {
        console.log(response);
        if (response['exists']) {
        let mess: string;
        switch (response['exists'] ) {
            case 'displayname':
            mess = 'Display name already exists.';
            break;
            case 'email':
            mess = 'Email address already exists.';
            break;
        }
        this.response['error'] = mess;
        this.response['haserror'] = true;
        }
        if (response['status'] === 'ok') {
        this.response['mess'] = 'Registration success';
        this.response['haserror'] = false;
        this.router.navigateByUrl('/login');
        }
    }
```

We will also add an additional `div` to handle our errors.
```html
    //register.component.html
    ...
    <form class="ui form" [formGroup]="registrationForm" (ngSubmit)="onSubmit()">

    ...
    <!-- Add this beside the other errors inside <div name="form-info"></div>-->
    <div *ngIf="response.haserror" class="ui warning mini message">
        <ul class="list">
            <li>{{response.error}}</li>
        </ul>
    </div>
    
```



## Logging in

This will be good practice for you to setup the `Login Component` on your own. Just follow the same steps as the `Register Component`, just remember these steps.

* Import the following:
    - `FormsModule`
    - `FormGroup`
    - `FormControl`
    - `FormBuilder`
    - `UserService`
    - `Router`
    - `Response`

* Use the `Response` object
* Creating a `FormGroup` and bind it with your form template inside the `component.html` file.
* Create `Validators` to validate your form. Note that this is for logging in so we can ease up on the validation.
* Bind some styles in the `component.css` to give some additional visualization of your form.
* Handle submission by assign a `(ngSubmit)`
* Process data for errors

You can check on this codes below to check if your code is on the right track.

`login.component.ts`
```typescript
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../user.service';
import { Router } from '@angular/router';
import { Response } from './../models/response';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  response = Response;
  loginForm: FormGroup;

  constructor(private builder: FormBuilder, private userService: UserService, private router: Router) {
    this.generateForm();
  }

  generateForm() {
    this.loginForm = this.builder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

  }
  ngOnInit() {
  }

  async onSubmit() {
    $('.ui.form').addClass('loading');
    this.handleResponse(await this.userService.login(this.loginForm.value));
    $('.ui.form').removeClass('loading');
  }

  handleResponse(response: Object) {
    if (response['data']) {
      this.response['haserror'] = false;
      this.checkLogin();
    } else {
      this.response['error'] = 'Invalid email address or password';
      this.response['haserror'] = true;
    }
  }
}

```

`login.component.html`
```html
<div class="header width-full pt-5">
    <div class="container clearfix width-full text-center">
    <img src="https://raw.githubusercontent.com/judedaryl/MEAN/master/public/homunculi/src/assets/images/ouroboros.png" width="100px">
    </div>
</div>
<div class="ui container">
    <div class="auth-form px-3">
        <div class="auth-form-header p-0">
                <h1 class="inverted">Sign in to Homunculi</h1>
        </div>
        <div *ngIf="response.haserror" class="ui error mini message">
            <div class="header">{{response.error}}</div>      
        </div>
        <form class="ui form" [formGroup]="loginForm" (ngSubmit)="onSubmit()"> 

        <div class="auth-form-body mt-3">
            <div class="field">
                <label>Email address</label>
                <input type="email" email name="email" placeholder="Email@email.com" formControlName="email"/>
                </div>
                <div class="field">
                <label>Password</label>
                <input type="password" name="password" placeholder="Password" formControlName="password"/>
                </div>
                <button class="ui primary button mt-3" [disabled]="loginForm.invalid">
                Sign In
                </button>
            </div>
        </form>
        <p class="mt-3 register-callout">
        New to Homunculi? <a routerLink="/register">Create an account.</a>
        </p>
    </div>
</div>
```

`login.component.css`
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
    color: black;
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
    width: 100%;
}

.register-callout {
    padding: 15px 20px 15px 20px;
    text-align: center;
    border: 1px solid #d8dee2;
    border-radius: 5px;
}

.ng-valid[required], .ng-valid.required input {
    border: 1px solid #42A948 !important; /* green */
}
.ng-invalid.ng-dirty:not(form) {
    border: 1px solid #a94442 !important; /* red */ 
}
.ui.form .warning.message, .ui.form {
display: block;
}  
.ui.input.error input { 
    background-color: #fff6f6 !important; 
    border-color: #e0b4b4 !important; 
}
```

## Routing inside the typescript file
If errors occur this will be shown on the right side of our page. However if registration succeeds let's try routing the user to the `Login Component` using `Router`. To do this we need to modify some parts of `register.component.ts` with the codes below:

```typescript
    //register.component.ts -> constructor
    constructor(private builder: FormBuilder, private request: HttpRequestService, private router: Router) {
        this.generateForm();
    }

    //register.component.ts -> handleResponse
    if (response['status'] === 'ok') {
        this.response['mess'] = 'Registration success';
        this.response['haserror'] = false;
        //route the user to the login page if registration succeeds
        this.router.navigateByUrl('/login');
    }
```

Add this feature to the `Login Component`. If a user is logged-in and goes to the `/login` route, the user should be redirected to the `/home` route.

Create a `checkLogin` method and call this in the constructor of `login.component.ts`. You can check if a user is actually logged in by using the `loggedin` property of `user` object from the `user service`.

Since `login.component.ts` was modeled after `register.component.ts` we should already have the `Router service` that we will use. 

```typescript
  //login.component.ts
  constructor(private builder: FormBuilder, private userService: UserService, private router: Router) {
    this.checkLogin();
    this.generateForm();
  }

    checkLogin() {
    if (this.userService.user['loggedin'] === true) { this.router.navigateByUrl('/home'); }
  }
```

## Revisit home page

Let's add a some new features to our `Home` component and a new view. Our `Home` component should be able to tell if a user is `logged-in` or not.

Go back and open `home.component.ts`, include the `user service` and call the property `loggedin` of the model `user`. Create a `get` method named `userLoggedIn` to retrieve and return the `loggedin` property, include another `get` method which retrieves the `displayname` of the `user` object.

The `get` method in Angular is a mixture of both a `property` and `method`. You can call it directly in other classes or in your view and it returns the object you intend it to return. We used this earlier to check our live form data `{{ livedata }}`.


```typescript
//home.component.ts
import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  get displayname() {
    const temp = JSON.parse(localStorage.getItem('user'));
    return temp['displayname'];
  }

  get userLoggedIn(): boolean {
    return this.userService.user['loggedin'];
  }
}
```

In your view `home.component.html`, use `ngIf` and call on `userLoggedIn`

```html
<!--home.component.html-->
<div *ngIf="userLoggedIn"> Hello there user {{ displayname }}</div>
<div *ngIf="!userLoggedIn"> No one logged in </div>
```

### Models

To add some visuals to the `home` component, we can add some [cards] and create a model and an array of that model for the content. We can also utilize another Angular function named `ngFor`, it is similar to the for loop that we are used to but it can be injected to our html properties.

Create model `technology.ts` and object `technologies.ts` inside the `models` folder. `technologies.ts` is simply an array of `technology.ts` models.

    root > public > homunculi > src > app > models > [technology.ts, technologies.ts]

`technology.ts`

```typescript
///technology.ts
export class Technology {
    name: string;
    type: string;
    description: string;
}
```

`technologies.ts`

```typescript
///technologies.ts
import { Technology } from './technology';
export const Technologies: Technology[] = [
    {
        name: 'MongoDB', type: 'Database',
        description: 'MongoDB is the leading modern, general purpose database platform.'
    },
    {
        name: 'Express.js', type: 'Back-end',
        description: 'Express.js, or simply Express, is a web application framework for Node.js.'
    },
    {
        name: 'Angular', type: 'Front end',
        description: 'AngularJS is a JavaScript-based open-source front-end web application framework.'
    },
    {
        name: 'Node.js', type: 'Back end',
        description: 'Node.js is an open-source, cross-platform JavaScript run-time environment for executing JavaScript code server-side. '
    },
];
```

Open `home.component.ts` and import the `Technologies` object.

```typescript
//home.component.ts
import { Technologies } from './../models/technologies';
```
Then assign a variable `technologies` to the `Technologies` object inside the class.

```typescript
//home.component.ts
    export class HomeComponent implements OnInit {

    technologies = Technologies;
    ...
```

Open `home.component.html` and add the code below. This code implements a separate view if a user is **logged in** or not. It also uses `*ngFor` to automatically generate divs for each `Technology` we created.


```html
<!--home.component.html-->
<div *ngIf="!userLoggedIn" class="ui text container masthead">
  <h1 class="ui header">Homunculi</h1>
  <h2>Developers who change the world</h2>
  <a class="ui huge primary button" routerLink="/register">
    Join us now <i class="right arrow icon"></i>
  </a>
</div>
<div *ngIf="userLoggedIn" class="grid ui text stackable container">
  <div class="container">
      <div class="ui vertical menu">
          <div class="item mini">
            <div class="header">
              Hello
            </div>
            {{displayname}}
          </div>
        </div>
  </div>

  <div class="ui panel">
    <div class="ui link cards">
        <a class="ui card" href="{{ tech.link }}" *ngFor="let tech of technologies">
          <div class="content">
            <div class="header">{{ tech.name }}</div>
            <div class="meta">{{ tech.type }}</div>
            <div class="description">
                {{ tech.description }}
            </div>
          </div>
        </a>
    </div>
  </div>
</div>
```

Add some styles to `html.component.css`
```css
.ui.text.container {
    max-width: 1000px !important;
}
.ui.panel {
    max-width: 750px !important;
}
.masthead h1.ui.header {
    margin-top: 1em !important;
    margin-bottom: 0em !important;
    font-size: 4em !important;
    font-weight: normal !important;
}
.masthead h2 {
    font-size: 1.7em !important;
    font-weight: normal !important;
}
```

## Adding a Sign-In, Register and Sign-Out menu.

Revisit `app.component.html` and `app.component.ts`, Modify the application component so that it has the following features:

- A menu with a sign-in button and register button that shows only if the user isn't logged in.
- Another button in the menu with a sign-out button that shows only if the user is logged in.
- A home button that redirects to `/home`

You can check the one you've made with the code below.

`app.component.html`

```html
<!--app.component.html-->
<div class="ui vertical masthead aligned segment">
        <div class="ui menu">
                <a class="active item" routerLink="/home">
                        Home
                </a>
                <div class="right menu">                
                <div class="item">
                <a *ngIf="!userLoggedIn" class="ui primary button" routerLink="/login">Sign in</a>
                <a *ngIf="!userLoggedIn" class="ui button" routerLink="/register">Register</a>
                <a *ngIf="userLoggedIn" class="ui red button" (click)="signOut()">Sign out</a>
                </div>
                </div>
                
        </div>
        <router-outlet></router-outlet>
</div>
```
`app.component.css`

```css
.masthead.segment {
    min-height:700px;
    padding: 0em !important;
}

.masthead .ui.menu .ui.button {
    margin-left: 0.5em;
}

.masthead h1.ui.header {
    margin-top: 3em;
    margin-bottom: 0em;
    font-size: 4em;
    font-weight: normal;
}
.ui.menu {
    margin-bottom: 5em;
}
```

`app.component.ts`
```typescript
import { UserService } from './user.service';
import { Component } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Homunculi';
  constructor(private userService: UserService) {

  }

  get userLoggedIn(): boolean {
    return this.userService.user['loggedin'];
  }

  signOut(): void {
    this.userService.signout();
  }
}
```

# Implementing Authentication using JWT
... Ongoing

[node]: https://docs.npmjs.com/getting-started/installing-node
[mLab]: https://mlab.com/
[Postman]: https://www.getpostman.com/
[MongoDB]: https://mongodb.com/
[Express.js]: https://expressjs.com
[Angular]: https://angular.io
[Node.js]: https://nodejs.org
[cards]: https://semantic-ui.com/views/card.html
[ouroboros]: https://raw.githubusercontent.com/judedaryl/MEAN/master/public/homunculi/src/assets/images/ouroboros.png
[mongodb_]: https://raw.githubusercontent.com/judedaryl/MEAN/master/images/mongodb.png
[create]: https://raw.githubusercontent.com/judedaryl/MEAN/master/images/create.png
[read-one]: https://raw.githubusercontent.com/judedaryl/MEAN/master/images/read-one.png
[read-all]: https://raw.githubusercontent.com/judedaryl/MEAN/master/images/read-all.png
[update-all]: https://raw.githubusercontent.com/judedaryl/MEAN/master/images/update-all.png
[update-email]: https://raw.githubusercontent.com/judedaryl/MEAN/master/images/update-email.png
[delete]: https://raw.githubusercontent.com/judedaryl/MEAN/master/images/delete.png

[semantic-ui site]: https://semantic-ui.com/introduction/getting-started.html