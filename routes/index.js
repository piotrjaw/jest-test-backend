var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var url = 'mongodb://localhost:27017/todo';
var collectionName = 'todos';

function connectToDB (callback) {
  MongoClient.connect(url, function (err, db) {
    var col = db.collection(collectionName);
    callback(col, function () {
      db.close();
    });
  });
}

router.get('/', function (req, res, next) {
  res.render('Home');
});

router.get('/todos', function (req, res, next) {
  connectToDB(function (col, callback) {
    col.find({}).toArray(
      function (err, docs) {
        res.json(docs);
        callback();
      }
    );
  })
});

router.get('/todos/:_id', function (req, res, next) {
  connectToDB(function (col, callback) {
    col.findOne(
      { _id: ObjectID(req.params._id) },
      function (err, doc) {
        res.json(doc);
        callback();
      }
    );
  });
});

router.post('/todos', function (req, res, next) {
  connectToDB(function (col, callback) {
    col.insertOne(
      {
        text: req.body.text
      }, function (err, msg) {
        res.send(msg);
        callback();
      }
    );
  });
});

router.delete('/todos', function (req, res, next) {
  connectToDB(function (col, callback) {
    col.deleteMany(
      {},
      function (err, msg) {
        res.send(msg);
        callback();
      }
    );
  });
});

router.delete('/todos/:_id', function (req, res, next) {
  connectToDB(function (col, callback) {
    col.deleteOne(
      { _id: ObjectID(req.params._id) },
      function (err, msg) {
        res.send(msg);
        callback();
      }
    );
  });
});

router.put('/todos/:_id', function (req, res, next) {
  connectToDB(function (col, callback) {
    const updateObject = Object.assign(
      {},
      typeof req.body.checked === 'boolean' ? { checked: req.body.checked } : {},
      req.body.text ? { text: req.body.text } : {}
    );
    col.updateOne(
      { _id: ObjectID(req.params._id) },
      { $set: updateObject },
      function (err, msg) {
        res.send(msg);
        callback();
      }
    );
  });
});

module.exports = router;
