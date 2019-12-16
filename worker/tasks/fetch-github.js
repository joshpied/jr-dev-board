const fetch = require('node-fetch');
const redis = require('redis'),
  client = redis.createClient();
const {promisify} = require('util');
const setAsync = promisify(client.set).bind(client);

const baseUrl = `https://jobs.github.com/positions.json`;

async function fetchGithub() {

  let resultCount = 1, onPage = 0;
  let allJobs = [];

  // fetch all jobs posted
  while(resultCount > 0) {
    const res = await fetch(`${baseUrl}?page=${onPage}`);
    const jobs = await res.json();
    allJobs.push(...jobs);
    resultCount = jobs.length;
    console.log('got', resultCount, 'jobs');
    onPage++;
  }
  console.log('total: ' + allJobs.length);

  // filter jobs to just get junior postings
  const jrJobs = allJobs.filter(job => {
    const jobTitle = job.title.toLowerCase();
    // non-junior keywords:
    if (jobTitle.includes('senior') ||
        jobTitle.includes('sr.') ||
        jobTitle.includes('manager') ||
        jobTitle.includes('architect')
    ) {
      return false
    }
    return true;
  });
  console.log('filtered down to', jrJobs.length);

  // set redis store
  const success = await setAsync('github', JSON.stringify(jrJobs));
  console.log({success});
}

// fetchGithub();

module.exports = fetchGithub;
