const express = require('express');
const app = express();
const port = 3001;

const redis = require('redis'),
  client = redis.createClient();

const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);

/**
 * Returns junior jobs listed as stringified JSON
 */
app.get('/jobs', async(req, res) => {
  const jobs = await getAsync('github'); // jobs stored in redis under key 'github'
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.send(jobs);
});

app.listen(port, () => console.log(`API listening on port ${port}!`));
