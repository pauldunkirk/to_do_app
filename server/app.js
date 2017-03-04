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
//
//
// // for update -> /save/48
// router.put('/save/:id', function(req, res) {
//     var bookId = req.params.id;
//     var bookObject = req.body;
//     console.log('book of id to save: ', bookId);
//     pool.connect(function(errorConnectingToDatabase, client, done) {
//         if (errorConnectingToDatabase) {
//             console.log('Error connecting to database: ', errorConnectingToDatabase);
//             res.sendStatus(500);
//         } else {
//             // We connected to the database!!!
//             // Now, we're gonna' update stuff!!!!!
//             client.query('UPDATE books SET title=$1, author=$2, edition=$3, publisher=$4 WHERE id=$5;', // This is the SQL query
//                 [bookObject.title, bookObject.author, bookObject.edition, bookObject.publsiher, bookId], // This is the array of things that replaces the $1, $2, $3 in the query
//                 function(errorMakingQuery, result) { // This is the function that runs after the query takes place
//                     done();
//                     if (errorMakingQuery) {
//                         console.log('Error making the database query: ', errorMakingQuery);
//                         res.status(500).send('Error making the database query: ', errorMakingQuery);
//                     } else {
//                         res.sendStatus(202);
//                     }
//                 });
//         }
//     });
// }); // closing put request
