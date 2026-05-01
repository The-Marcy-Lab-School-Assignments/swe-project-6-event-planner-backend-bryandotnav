// server/test.js — delete after testing
require('dotenv').config();
const userModel = require('./models/userModel');

const test = async () => {
  console.log(await userModel.list()); // list all events with username and rsvp_count

  // more model methods...

  // Kill the process (the open pool connections) after running queries
  process.exit();
}
test();