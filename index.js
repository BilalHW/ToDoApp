const express = require('express');
// const session = require('session');
const path = require('path');
const { MongoClient } = require('mongodb');
var mongo = require('mongodb');

const app = express();
app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





MongoClient.connect("mongodb+srv://bhw03:SnHSXK9a5yeItxYs@cluster0.gpnw1.mongodb.net/toDoApp?retryWrites=true&w=majority").then(client => {
    const db = client.db('toDoApp')
    const toDolst = db.collection('todolist')
    console.log("connected to database")

    app.get('/', function (request, response) {
        db.collection('todolist').find().toArray()
            .then(results => {
                return response.render('index.ejs', { tasks: results })
            })
            .catch(error => console.error(error));
    });

    // POST
    app.post('/task', (req, res) => {
        toDolst.insertOne({
            description: req.body.description,
            isComplete: false,
        })
            .then(result => {
                res.redirect("/")
            })
            .catch(error => console.error(error))
    })

    // GET
    app.get('/task', (req, res) => {
        db.collection('todolist').find().toArray()
            .then(results => {
                res.jsonp(results)

            })
            .catch(error => console.error(error))
    })

    //  DELETE
    app.delete('/task/:id', (req, res) => {
        toDolst.deleteOne(
            { _id: new mongo.ObjectID(req.body.id) },
        ).then(result => {
            if (result.deletedCount === 0) {
                return res.json('toDo Unavailable')
            }
            res.json('deleted todo')
        })
            .catch(error => console.error(error))
    })

    // PUT
    app.put('/task/toggle/:id', (req, res) => {
        console.log("inside put")
        console.log(req.body.id)
        db.collection('todolist').find({ _id: new mongo.ObjectID(req.body.id) }).toArray().then(results => {
            if (results[0]['isComplete']) {
                db.collection("todolist").updateOne({ _id: new mongo.ObjectID(req.body.id) },
                    { $set: { isComplete: false, } },
                    function (err, resr) {
                        if (err) throw err;
                        res.json("updated")
                    })

            }
            
            else {
                db.collection("todolist").updateOne({ _id: new mongo.ObjectID(req.body.id) },
                    { $set: { isComplete: true, } },
                    function (err, resr) {
                        if (err) throw err;
                        console.log("updated");
                        res.json("updated")
                    }
                )
            }
        })
    })

})
    .catch(console.error)



app.listen(process.env.PORT || 8000);


