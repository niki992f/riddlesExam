'use strict';

const sqlite = require('sqlite3');
const crypto = require('crypto');


const db = new sqlite.Database('riddles.db', (err) => {
    if (err) throw err;
});

exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) reject(err);
            else if (row === undefined) resolve(false);
            else {
                const user = { id: row.id, username: row.email, name: row.name, score: row.score };
                const salt = row.salt;
                crypto.scrypt(password, salt, 32, (err, hashedPasword) => {
                    if (err) reject(err);
                    const passwordHex = Buffer.from(row.hash, 'hex');

                    if (!crypto.timingSafeEqual(passwordHex, hashedPasword))
                        resolve(false);
                    else
                        resolve(user);
                });
            }
        });
    });
}

exports.getUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users';
        db.all(sql, [], (err, rows) => {
            if (err) 
                reject(err);
            else {
                const users = rows.map((u) => ({id: u.id, name: u.name, score: u.score }));
                resolve(users);
            }
        });
    });
}

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                const user = { id: row.id, username: row.email, name: row.name, score: row.score };
                resolve(user);
            }
        });
    });
};

exports.modifyScore = (id, score) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE users SET score = ? WHERE id = ?';
        db.run(sql, [score, id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}