const URL = 'http://localhost:3001/api';

async function getMyRiddles() {
    const response = await fetch(URL + '/riddles/mine', { credentials: 'include' });
    const riddleJson = await response.json();
    if (response.ok)
        return riddleJson.map(r => ({ id: r.id, question: r.question, difficulty: r.difficulty, duration: r.duration, status: r.status, answer: r.answer, firstTip: r.tip1, secondTip: r.tip2, user: r.user }));
    else
        throw riddleJson;
}

async function getRiddles() {
    const response = await fetch(URL + '/riddles/all', { credentials: 'include' });
    const riddleJson = await response.json();
    if (response.ok)
        return riddleJson.map(r => ({ id: r.id, question: r.question, difficulty: r.difficulty, duration: r.duration, status: r.status, firstTip: r.tip1, secondTip: r.tip2, user: r.user }));
    else
        throw riddleJson;
}

async function getRiddle(riddleId) {
    const response = await fetch(URL + `/riddle/${riddleId}`, { credentials: 'include' });
    const riddleJson = await response.json();
    if (response.ok)
        return riddleJson;
    else
        throw riddleJson;
}

async function getRiddlesNotAuthenticated() {
    const response = await fetch(URL + '/riddles/all/noAuth', { credentials: 'include' });
    const riddleJson = await response.json();
    if (response.ok)
        return riddleJson.map(r => ({ id: r.id, question: r.question, difficulty: r.difficulty, status: r.status}));
    else
        throw riddleJson;
}

async function addRiddle(riddle, userId) {
    return new Promise((resolve, reject) => {
        fetch(URL + '/riddles', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: riddle.question, difficulty: riddle.difficulty, duration: riddle.duration, status: riddle.status, answer: riddle.answer, firstTip: riddle.firstTip, secondTip: riddle.secondTip, user: userId })
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((message) => { reject(message); })
                    .catch(() => { reject({ error: 'Cannot parse server response' }) });
            }
        }).catch(() => { reject({ error: 'Cannot communicate with the server.' }) });
    });
}

async function addAnswer(answer) {
    return new Promise((resolve, reject) => {
        fetch(URL + '/answers', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answer)
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((message) => { reject(message); })
                    .catch(() => { reject({ error: 'Cannot parse server response' }) });
            }
        }).catch(() => { reject({ error: 'Cannot communicate with the server.' }) });
    });
}

async function getAllAnswer(riddleId) {
    const response = await fetch(URL + `/answers/${riddleId}/all`, {credentials: 'include'});
    const answerJson = await response.json();
    if (response.ok)
        return answerJson.map(a => ({user: a.user, riddleId: a.riddleId, name: a.name, answer: a.answer}));
    else
        throw answerJson;
}

async function getAnswer(riddleId, userId) {
    const response = await fetch(URL + `/answers/${riddleId}/${userId}`, {credentials: 'include'});
    const answerJson = await response.json();
    if (response.ok)
        return answerJson;
    else
        throw answerJson;
}

async function getUsers() {
    const response = await fetch(URL + '/users', {credentials: 'include'});
    const userJson = await response.json();
    if (response.ok)
        return userJson.map(u => ({id: u.id, name: u.name, score: u.score}));
    else
        throw userJson;
}

async function logIn(credentials) {
    let response = await fetch(URL + '/sessions', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function logOut() {
    await fetch(URL + '/sessions/current', { method: 'DELETE', credentials: 'include' });
}

async function getUserInfo() {
    const response = await fetch(URL + '/sessions/current', { credentials: 'include' });
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;
    }
}

const API = { getMyRiddles, getRiddles, getRiddle, getRiddlesNotAuthenticated, addRiddle, addAnswer, getAllAnswer, getAnswer, getUsers, logIn, logOut, getUserInfo };
export default API;