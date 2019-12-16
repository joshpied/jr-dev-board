# jr-dev-board
Web app to view junior software developer postings using GitHub Jobs API. 

## worker directory
Cron job fetches postings from a task that filters junior level positiongs from https://jobs.github.com/positions.json. 
Every minute postings are put into a Redis store.

## api directory
Returns JSON job listings that have been cached in Redis.

## client directory
Simple create-react-app that fetches junior developer jobs from a script in api.
