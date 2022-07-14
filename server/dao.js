'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('riddles.db', (err) => {
    if (err) throw err;
});

exports.getMyRiddles = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM riddles WHERE user = ?';
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const riddles = rows.map((r) => ({ id: r.id, question: r.question, difficulty: r.difficulty, duration: r.duration, status: r.status, answer: r.answer, firstTip: r.tip1, secondTip: r.tip2, user: r.user }));
            resolve(riddles);
        });
    });
}

exports.getRiddles = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM riddles WHERE user != ?';
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const riddles = rows.map((r) => {
                if(r.status === 'open')
                    return { id: r.id, question: r.question, difficulty: r.difficulty, duration: r.duration, status: r.status, firstTip: r.tip1, secondTip: r.tip2, user: r.user };
                else
                    return { id: r.id, question: r.question, difficulty: r.difficulty, duration: r.duration, status: r.status, answer: r.answer, firstTip: r.tip1, secondTip: r.tip2, user: r.user };
                });
            resolve(riddles);
        });
    });
}

exports.getRiddle = (riddleId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM riddles WHERE id = ?';
        db.all(sql, [riddleId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row[0] == undefined) {
                resolve({ error: 'riddle not found.' });
            } else {
                const r = row[0];
                const riddle = { id: r.id, question: r.question, difficulty: r.difficulty, duration: r.duration, status: r.status, answer: r.answer, firstTip: r.tip1, secondTip: r.tip2, user: r.user };
                resolve(riddle);
            }
        });
    });
}

exports.getRiddlesNoAuth = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM riddles';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const riddles = rows.map((r) => ({ id: r.id, question: r.question, difficulty: r.difficulty, status: r.status}));
            resolve(riddles);
        });
    });
}

exports.createRiddle = (riddle) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO riddles(question, difficulty, duration, status, answer, tip1, tip2, user) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
        db.run(sql, [riddle.question, riddle.difficulty, riddle.duration, 'open', riddle.answer, riddle.firstTip, riddle.secondTip, riddle.user], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.createAnswer = (answer) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO answers(riddleId, user, answer) VALUES(?, ?, ?)';
        db.run(sql, [answer.riddleId, answer.user, answer.answer], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.modifyStatus = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE riddles SET status = ? WHERE id = ?';
        db.run(sql, ['closed', id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.getAnswers = (riddleId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM answers INNER JOIN users ON (answers.user = users.id) WHERE riddleId = ?';
        db.all(sql, [riddleId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            } else {
                const answers = rows.map((r) => ({user: r.id, riddleId: r.riddleId, name: r.name, answer: r.answer}));
                resolve(answers);
            }
        });
    });
}

exports.getAnswer = (riddleId, userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM answers WHERE riddleId = ? AND user = ?';
        db.all(sql, [riddleId, userId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row[0] == undefined) {
                resolve({ error: 'answer not found.' });
            } else {
                const r = row[0];
                const answer = { riddleId: r.riddleId, user: r.user, answer: r.answer };
                resolve(answer);
            }
        });
    });
}

