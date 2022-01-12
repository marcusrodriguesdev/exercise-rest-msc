const mongodb = require('mongodb');

const MONGO_DB_URL = 'mongodb://localhost:27017/ExerciseRest';
const DB_NAME = 'ExerciseRest';

module.exports = () => mongodb.connect(MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((connection) => connection.db(DB_NAME))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
