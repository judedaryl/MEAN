//users.js
var objectid = require('mongodb').ObjectID;
const error = { 'error': 'An error occurred' };

module.exports = function(app, db) {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost:9091");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });

    //Registration routes
    app.post('/users', (req, res) => {
        const userdetails = {
            displayname: req.body.displayname,
            password: req.body.password,
            email: req.body.email
        }
        //check if display name exists
        db.collection('users')
        .find( {displayname: req.body.displayname})
        .toArray(function(err,item) {
            if(err) res.send(err);
            else {
                if(Object.keys(item).length != 0) res.send({exists: 'displayname'})
                else {
                    //check if email exists
                    db.collection('users')
                    .find({email: req.body.email})
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

    //LOGIN ROUTES
    app.post('/users/login', (req,res) =>{
        const email = req.body.email;
        const password = req.body.password;
        const details = {'email': email, 'password': password };
        db.collection('users').findOne(details, (err,item)=>{
            if(err) res.send({error: err});
            else res.send({status: 'ok', data: item});
        })
    });

    //READ routes
    //Read by _id
    app.get('/users/:id', (req,res) =>{
        const id = req.params.id;
        const details = {'_id': new objectid(id) };
        db.collection('users').findOne(details, (err,item)=>{
            if(err) res.send(error);
            else res.send(item);
        })
    });

    //Read all
    app.get('/users',(req,res) =>{
        db.collection('users').find().toArray(function(err,items){
            if(err) res.send(error);
            else res.send(items);
        });
    });

    //UPDATE route
    app.put('/users/:id', (req, res) => {
        const id = req.params.id;
        const userdetails = { 
            displayname: req.body.displayname,
            email: req.body.email, 
            password: req.body.password 
        }
        const details = {'_id': new objectid(id) };     
        //Connect to our database        
            db.collection('users').update(details, userdetails, (err,results) => {
                if(err) res.send(error);
                else res.send(userdetails);
            });

        //Lets display this on our server console.
        console.log(userdetails)
    });

    app.put('/users/email/:id', (req, res) => {
        const id = req.params.id;
        const userdetails =  { $set:{ email: req.body.email} }
        const details = {'_id': new objectid(id) };     
        //Connect to our database        
            db.collection('users').update(details, userdetails, (err,results) => {
                if(err) res.send(error);
                else res.send(userdetails);
            });
        //Lets display this on our server console.
        console.log(userdetails)
    });

    //DELETE route
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

    //Troubleshooting
    app.get('/users/reset', (req,res) => {
        db.collection('users').drop((function(err,item){
          if(err) res.send(err);
          else res.send(item);
      }));
    })
};