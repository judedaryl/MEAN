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