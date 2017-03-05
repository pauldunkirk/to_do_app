console.log('Starting up the server');
var express = require('express');
var app = express();
app.use(express.static('public'));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
var port = 5000;
app.listen(port, function() {
    console.log('We are running on port: ', port);
});
var pg = require('pg');
var config = {
    database: 'phi', // the name of the database
    host: 'localhost', // where is your database
    port: 5432, // the port number for your database
    max: 10, // how many connections at one time
    idleTimeoutMillis: 30000 // 30 seconds to try to connect
};
var pool = new pg.Pool(config);

app.get('/toDoTable', function(req, res) {
    pool.connect(function(err, client, done) {
        if (err) {
            console.log('Error connecting to database: ', err);
            res.sendStatus(500);
        } else {
            client.query('SELECT * FROM to_do;', function(err, result) {
                done();
                if (err) {
                    console.log('Error making the database query: ', err);
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                    console.log(result.rows);
                } //end else final send results
            }); //end query function
        } //end else into query
    }); //end pool connect
}); //end app.get

app.post('/newTask', function(req, res) {
    var newTask = req.body; // comes in as newTaskObject
    console.log('newTask', newTask);
    pool.connect(function(err, client, done) {
        if (err) {
            console.log('Error connecting to database: ', err);
            res.sendStatus(500);
        } else {
            client.query('INSERT INTO to_do (description) VALUES($1);', [newTask.description],
                function(err, result) {
                    done();
                    if (err) {
                        console.log('Error making the database query: ', err);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                        console.log('newTask with newTaskDescription', newTask);
                    } // end else
                }); //end query
        } // end else
    }); //end pool connect
}); // end router.post


app.delete('/delete/:id', function(req, res) {
    var taskId = req.params.id;
    console.log('id of task to delete: ', taskId);
    pool.connect(function(err, client, done) {
        if (err) {
            console.log('Error connecting to database: ', err);
            res.sendStatus(500);
        } else {
            client.query('DELETE FROM to_do WHERE id=$1;', [taskId],
                function(err, result) {
                    if (err) {
                        console.log('Error making the database query: ', err);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(202);
                    }
                });
        }
    });
}); // closing delete request


// for update -> /save/48
app.put('/update/:id', function(req, res) {
    var taskId = req.params.id;
    console.log('id of task to save: ', taskId);
    // var taskObject = req.body;
    // console.log('taskObject', taskObject);
    pool.connect(function(err, client, done) {
        if (err) {
            console.log('Error connecting to database: ', err);
            res.sendStatus(500);
        } else {
            client.query('UPDATE to_do SET complete = TRUE WHERE id = $1;', // This is the SQL query
                [taskId], // This is the array of things that replaces the $1 in the query
                function(err, result) { // This is the function that runs after the query takes place
                    done();
                    if (err) {
                        console.log('Error making the database query: ', err);
                        res.status(500).send('Error making the database query: ', err);
                    } else {
                        res.sendStatus(202);
                    } // end 202 else
                });//end result function
        } //end else before query
    }); //end connect
}); // closing put request
