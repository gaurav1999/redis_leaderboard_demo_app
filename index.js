import express from 'express';
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import bodyParser from 'body-parser';
import getScore from './evaluateresult.js';
import redisModule from './redis/index.js';
import Redis from 'ioredis';


process.env.REDIS_URL = 'redis://localhost:6379';
const redis = new Redis();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors());


const answers = [
    {
        id: 1,
        ans: 'True',
    },
    {
        id: 2,
        ans: 'True'
    },
    {
        id: 3,
        ans: 'True'

    }
]

const questions = [
    {
        id: 1,
        title: "This answer is True",
    },
    {
        id: 2,
        title: "This answer is True",
    },
    {
        id: 3,
        title: "This answer is True"

    }
]

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'static/index.html'));
});

app.get('/leaderboardPage/:id', function(req, res) {
    res.sendFile(path.join(__dirname, 'static/leaderboard.html'));
});


app.get('/questions', function(req, res) {
    res.send(questions);
});

app.post('/submit', async function(req, res) {
    const { timetaken, username } = req.body;
    const score = getScore(req.body, answers);
    await redisModule.upsertScore({score,  timetaken, username}, { redis });
    res.send('Thanks for the quiz, your score is:' + score);
});


app.get('/leaderBoard', async function(req, res) {
   const username = req.query.username;
   const page = req.query.page || 1;
   const perPage = req.query.perPage || 10;
   console.log(username);
   const data = await redisModule.getLeaderBoard({page, perPage, username }, { redis });
   res.send(data);
});

const startServer = async() => {
    app.listen(port);
    console.log('Server started at http://localhost:' + port);
}
startServer();
