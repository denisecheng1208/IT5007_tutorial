const fs = require('fs');
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/travellertracker';

let db;

const resolvers = {
  Query: {
    travellerList,
    inBlackList,
  },
  Mutation: {
    travellerAdd,
    travellerDelete,
    createBlackList,
  },
};

async function travellerList() {
  const travellers = await db.collection('travellers').find({}).toArray();
  return travellers;
}

async function inBlackList(_, { traveller }) {
  const result = await db.collection('blacklist').find(traveller).toArray();
  if (result.length > 0) 
    return true;
  else
    return false;
}

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

async function travellerAdd(_, { traveller }) {
  traveller.timeStamp = (new Date()).toLocaleString();
  traveller.id = await getNextSequence('travellers');

  const result = await db.collection('travellers').insertOne(traveller);
  const savedTraveller = await db.collection('travellers')
    .findOne({ _id: result.insertedId });
  return savedTraveller;
}

async function travellerDelete(_, { tid }) {
  const result = await db.collection('travellers').deleteOne({ id: tid });
  return "Done";
}

async function createBlackList(_, {traveller})
{
	console.log("**Entering BlackList function**");
  	result = await db.collection('blacklist').insertOne(traveller);

	return "Done";
}

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
});

const app = express();

app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

(async function () {
  try {
    await connectToDb();
    app.listen(3000, function () {
      console.log('App started on port 3000');
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();