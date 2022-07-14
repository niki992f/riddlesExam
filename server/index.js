'use strict';

const express = require('express');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator');
const dao = require('./dao');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const userDao = require('./user_dao');
const cors = require('cors');

passport.use(new LocalStrategy(
  async function verify(username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password' });
      return done(null, user);
    })
  }
));

passport.serializeUser((user, done) => {
  return done(null, user);
});

passport.deserializeUser((user, done) => {
  return done(null, user);
})

// init express
const app = new express();
const port = 3001;

app.use(morgan('dev'));
app.use(express.json());
const corsOption = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOption));

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  return res.status(401).json({ error: 'not authenticated' });
}

app.use(session({
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.authenticate('session'));

let timerArray = [];

app.get('/api/riddle/:riddleId', isLoggedIn, [check('riddleId').isInt({ min: 0 })], (req, res) => {
  dao.getRiddle(req.params.riddleId).then(async r => {
    if (r.status === 'open') {
      let remainingTime = r.duration;
      let position = timerArray.findIndex(val => val.riddleId === req.params.riddleId);
      if (position !== -1)
        remainingTime = r.duration - ((timer - timerArray[position].start) % 10000);
      if (remainingTime <= 0) {
        await dao.modifyStatus(r.id);
        if (remainingTime <= 0 && position !== -1) {
          timerArray.splice(position, 1);
        }
      }
      res.json({ id: r.id, question: r.question, difficulty: r.difficulty, duration: r.duration, timer: remainingTime, status: r.status, firstTip: r.firstTip, secondTip: r.secondTip, user: r.user })
    } else {
      res.json({ id: r.id, question: r.question, difficulty: r.difficulty, duration: r.duration, status: r.status, answer: r.answer, firstTip: r.firstTip, secondTip: r.secondTip, user: r.user })
    }
  }).catch(() => res.status(500).end());
});

app.get('/api/riddles/mine', isLoggedIn, (req, res) => {
  dao.getMyRiddles(req.user.id).then(async ris => {
    ris.map(async r => {
      if (r.status === 'open') {
        let remainingTime = r.duration;
        let position = timerArray.findIndex(val => val.riddleId == r.id);
        if (position !== -1)
          remainingTime = r.duration - ((timer - timerArray[position].start) % 10000);
        if (remainingTime <= 0) {
          await dao.modifyStatus(r.id);
          if (remainingTime <= 0 && position !== -1) {
            timerArray.splice(position, 1);
          }
        }
        return ({ id: r.id, question: r.question, difficulty: r.difficulty, duration: r.duration, timer: remainingTime, status: r.status, firstTip: r.firstTip, secondTip: r.secondTip, user: r.user });
      }
    });
    res.json(ris);
  }).catch(() => res.status(500).end());
});

app.get('/api/riddles/all', isLoggedIn, (req, res) => {
  dao.getRiddles(req.user.id).then(async ris => {
    ris.map(async r => {
      if (r.status === 'open') {
        let remainingTime = r.duration;
        let position = timerArray.findIndex(val => val.riddleId == r.id);
        if (position !== -1)
          remainingTime = r.duration - ((timer - timerArray[position].start) % 10000);
        if (remainingTime <= 0) {
          await dao.modifyStatus(r.id);
          if (remainingTime <= 0 && position !== -1) {
            timerArray.splice(position, 1);
          }
        }
        return ({ id: r.id, question: r.question, difficulty: r.difficulty, duration: r.duration, timer: remainingTime, status: r.status, firstTip: r.firstTip, secondTip: r.secondTip, user: r.user });
      }
    });
    res.json(ris);
  }).catch(() => res.status(500).end());
});

app.get('/api/riddles/all/noAuth', (req, res) => {
  dao.getRiddlesNoAuth().then(r => res.json(r)).catch(() => res.status(500).end());
})

app.post('/api/riddles', isLoggedIn, [check('question').isString(),
check('difficulty').isString(),
check('duration').isInt({ min: 30, max: 600 }),
check('answer').isString(),
check('firstTip').isString(),
check('secondTip').isString(),
check('user').isInt({ min: 0 })], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  const riddle = {
    question: req.body.question,
    difficulty: req.body.difficulty,
    duration: req.body.duration,
    answer: req.body.answer,
    firstTip: req.body.firstTip,
    secondTip: req.body.secondTip,
    user: req.body.user
  };

  try {
    await dao.createRiddle(riddle);
    res.status(201).end();
  } catch (err) {
    res.status(400).json({ error: `Database error during the creation of film ${req.params.id}.` });
  }
});

app.post('/api/answers', isLoggedIn, [check('riddleId').isInt({ min: 0 }),
check('user').isInt({ min: 0 }),
check('answer').isLength({ min: 1 }),
check('score').isInt({ min: 1, max: 3 })], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  const answer = {
    riddleId: req.body.riddleId,
    user: req.body.user,
    answer: req.body.answer
  };

  try {
    await dao.createAnswer(answer);
    let flag = true;
    for (let t of timerArray)
      if (t.riddleId === req.body.riddleId)
        flag = false;
    if (flag)
      timerArray.push({ riddleId: req.body.riddleId, start: timer });
    const riddle = await dao.getRiddle(answer.riddleId);
    const user = await userDao.getUserById(answer.user);
    if (riddle.answer === answer.answer) {
      const score = user.score + req.body.score;
      await userDao.modifyScore(user.id, score);
      await dao.modifyStatus(riddle.id);
      let position = timerArray.findIndex(val => val.riddleId === req.body.riddleId);
      if (position !== -1 && timerArray.length > 1) {
        timerArray[position] = timerArray[timerArray.length - 1];
        timerArray.pop();
      }
    }
    res.status(201).end();
  } catch (err) {
    res.status(400).json({ error: `Database error during the creation of answer.` });
  }
});

app.get('/api/answers/:riddleId/all', isLoggedIn, [check('riddleId').isInt({ min: 0 })], (req, res) => {
  dao.getAnswers(req.params.riddleId).then(a => res.json(a)).catch(() => res.status(500).end());
});

app.get('/api/answers/:riddleId/:userId', isLoggedIn, [check('riddleId').isInt({ min: 0 }), check('userId').isInt({ min: 0 })], (req, res) => {
  dao.getAnswer(req.params.riddleId, req.params.userId).then(a => res.json(a)).catch(() => res.status(500).end());
});

app.get('/api/users', (req, res) => {
  userDao.getUsers().then(u => res.json(u)).catch(() => res.status(500).end());
})

app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user)
      return res.status(401).json({ error: info });
    req.login(user, (err) => {
      if (err)
        return next(err);
      return res.json(req.user);
    });
  })(req, res, next);
});

app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => res.end());
});

app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated())
    res.status(200).json(req.user);
  else
    res.status(401).json({ error: 'unauthenticated user' });
});


let timer = 0;

setInterval(() => {
  timer = (timer % 10000) + 1;
}, 1000);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});