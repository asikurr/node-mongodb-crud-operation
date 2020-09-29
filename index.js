const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = "mongodb+srv://<user:pass>@cluster0.xjikz.mongodb.net/crudDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})


client.connect(err => {
  const userCollection = client.db("crudDB").collection("userInfo");

//   create user
  app.post("/adduser", (req, res) => {
    const users = req.body;
    userCollection.insertOne(users)
    .then(result => {
        console.log('One user Added successfully.')
        res.redirect('/')
    })
    // console.log(req.body)

  })

//   read user
  app.get('/alluser', (req, res) => {
    userCollection.find({})
    .toArray((err, documents) => {
        res.send(documents)
    })
    
  })

    //   load Single user
    app.get('/singleuser/:id', (req, res) => {
      userCollection.find({
          _id: ObjectId(req.params.id)
      })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
      
    })

  //   update user
  app.patch('/update/:id', (req, res) => {
    // console.log(req.body)
    userCollection.updateOne({ _id: ObjectId(req.params.id)}, {
      $set: {
        name: req.body.name,
        salary: req.body.salary,
        age: req.body.age
      }
    })
    .then(result => {
      res.send(result.modifiedCount > 0)
    })
  })

  //   delete user
  app.delete('/delete/:id', (req, res) => {
    //   console.log(req.params.id)
    userCollection.deleteOne({
        _id: ObjectId(req.params.id)
    })
    .then( result => {
        res.send(result.deletedCount > 0)
    })
    
  })
  console.log('database connected.')
//   client.close();
});


app.listen(3000, ()=> console.log('Port open on 3000'))