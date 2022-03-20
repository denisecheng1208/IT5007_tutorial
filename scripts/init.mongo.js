/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 *   mongo issuetracker scripts/init.mongo.js
 * Atlas:
 *   mongo mongodb+srv://user:pwd@xxx.mongodb.net/issuetracker scripts/init.mongo.js
 * MLab:
 *   mongo mongodb://user:pwd@xxx.mlab.com:33533/issuetracker scripts/init.mongo.js
 */

db.travellers.remove({});

const travellerDB = [
  {
      id: 1,
      name: 'Alice',
      tel: '123456',
      timeStamp: "3/19/2022, 11:00:00 PM"
  },
  {
      id: 2,
      name: 'Bob',
      tel: '654321',
      timeStamp: "3/19/2022, 11:00:01 PM"
  }
];

db.travellers.insertMany(travellerDB);
const count = db.travellers.count();
print('Inserted', count, 'travellers');

db.counters.remove({ _id: 'travellers' });
db.counters.insert({ _id: 'travellers', current: count });

db.travellers.createIndex({ id: 1 }, { unique: true });
db.travellers.createIndex({ name: 1 });
db.travellers.createIndex({ tel: 1 });

db.blacklist.remove({});
db.blacklist.insert({name: 'Denise'});
