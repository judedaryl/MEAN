//users.js
var objectid = require('mongodb').ObjectID;
const error = { 'error': 'An error occurred' };

module.exports = function(app, db) {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });
    //CREATE route
    app.post('/users', (req, res) => {
        //Place parameters inside a JSON structure
        const userdetails = { 
            displayname: req.body.displayname,
            email: req.body.email, 
            password: req.body.password 
        }
        
        //Connect to our database        
            db.collection('users').insert(userdetails, (err,results) => {
                if(err) res.send(error);
                else res.send(results.ops[0]);
            });      

        //Lets display this on our server console.
        console.log(req.body)
        console.log(userdetails)
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


};