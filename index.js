const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = "mongodb+srv://asikur1:UYjouRH7bPpJr0c9@cluster0.xjikz.mongodb.net/crudDB?retryWrites=true&w=majority";
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
        res.send('Successfully added.')
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

  //   delete user
  app.delete('/delete/:id', (req, res) => {
    //   console.log(req.params.id)
    userCollection.deleteOne({
        _id: ObjectId(req.params.id)
    })
    .then( result => {
        console.log( result)
    })
    
  })
  console.log('database connected.')
//   client.close();
});


app.listen(3000, ()=> console.log('Port open on 3000'))