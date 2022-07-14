# Exam #2: "Indovinelli"
## Student: s305996 GALLO NICOLÒ

## React Client Application Routes

- Route `*`: redirect to `/list/all` for all the route that isn't matching the other route
- Route `/list/:groupList`: page containing the riddles' list divided by status. If the user isn't logged in the list contain all the riddles from all the users, while, if he is logged in, the list contains all the riddles expect mine if groupList: `all` and it contains only mine if groupList: `mine`
- Route `/add`: page containing the form to add a new riddle
- Route `/login`: page containing the form to login
- Route `/answer/:groupList/:riddleId/:group`: containing all the page divided by groupList: `all` or `mine` and by group: `open` or `closed` and riddleId represent the id of the clicked riddle in the list
- Route `/top3`: page containing the top 3 users list ordered by score

## API Server

### Riddle Management

#### Get riddle by id

* HTTP method: `GET`  URL: `/api/riddle/:riddleId`
* Description: Get the riddle by its id with timer if its open without if is not
* Request body: _None_
* Response: `200 OK` (success)
* Response body: objects describing a riddle:

``` json
{
  "id": 1,
  "question": "2+0",
  "difficulty": "easy",
  "duration": 45,
  "timer": 32,
  "status": "open",
  "firstTip": "primo suggerimento",
  "secondTip": "secondo suggerimento",
  "user": 3
}
```

* Error responses:  `500 Internal Server Error` (generic error)

#### Get my riddles

* HTTP method: `GET`  URL: `/api/riddles/mine`
* Description: Get my riddle
* Request body: _None_
* Response: `200 OK` (success)
* Response body: an array containing my riddles

``` json
[
  {
    "id": 1,
    "question": "2+0",
    "difficulty": "easy",
    "duration": 45,
    "status": "open",
    "answer": 2,
    "firstTip": "primo suggerimento",
    "secondTip": "secondo suggerimento",
    "user": 3
  },
  {
    "id": 2,
    "question": "2+1",
    "difficulty": "easy",
    "duration": 60,
    "status": "open",
    "answer": 3,
    "firstTip": "primo suggerimento",
    "secondTip": "secondo suggerimento",
    "user": 3
  },
  ...
]
```

* Error responses:  `500 Internal Server Error` (generic error)

#### Get all the riddles

* HTTP method: `GET`  URL: `/api/riddles/all`
* Description: Get all the riddles except mine with the answer if the status is closed, without it otherwise
* Request body: _None_
* Response: `200 OK` (success)
* Response body: an array containing all the riddles except mine

``` json
[
  {
    "id": 1,
    "question": "2+0",
    "difficulty": "easy",
    "duration": 45,
    "status": "open",
    "firstTip": "primo suggerimento",
    "secondTip": "secondo suggerimento",
    "user": 4
  },
  {
    "id": 2,
    "question": "2+1",
    "difficulty": "easy",
    "duration": 60,
    "status": "open",
    "firstTip": "primo suggerimento",
    "secondTip": "secondo suggerimento",
    "user": 2
  },
  ...
]
```

* Error responses:  `500 Internal Server Error` (generic error)

#### Get all the riddles

* HTTP method: `GET`  URL: `/api/riddles/all/noAuth`
* Description: Get all the riddles
* Request body: _None_
* Response: `200 OK` (success)
* Response body: an array containing all the riddles

``` json
[
  {
    "id": 1,
    "question": "2+0",
    "difficulty": "easy",
    "status": "open",
  },
  {
    "id": 2,
    "question": "2+1",
    "difficulty": "easy",
    "status": "open",
  },
  ...
]
```

* Error responses:  `500 Internal Server Error` (generic error)

#### Add a new riddle

* HTTP method: `POST`  URL: `/api/riddles`
* Description: Add a new riddle to the riddle of the logged user
* Request body: description of the object to add

``` JSON
{
    "question": "2+0",
    "difficulty": "easy",
    "duration": 45,
    "answer": 2,
    "firstTip": "primo suggerimento",
    "secondTip": "secondo suggerimento",
    "user": 4
}
```

* Response: `201 OK` (success)
* Response body: _None_

* Error responses:  `422 Unprocessable Entity` (values do not satisfy validators), `503 Service Unavailable` (database error)


### Answers management

#### Add a new answer

* HTTP method: `POST`  URL: `/api/answers`
* Description: Add a new answers to the answers of the logged user linked to a specified riddle
* Request body: description of the object to add

``` JSON
{
    "riddleId": 4,
    "user": 1,
    "answer": 4
}
```

* Response: `201 OK` (success)
* Response body: _None_

* Error responses:  `422 Unprocessable Entity` (values do not satisfy validators), `503 Service Unavailable` (database error)

#### Get all the answers linked to a riddles

* HTTP method: `GET`  URL: `/api/answers/:riddleId/all`
* Description: Get all the answers for a certain riddle
* Request body: _None_
* Response: `200 OK` (success)
* Response body: an array containing all the answers

``` json
[
  {
    "riddleId": 4,
    "user": 1,
    "answer": 4
  },
  {
    "riddleId": 4,
    "user": 3,
    "answer": 5
  },
  ...
]
```

* Error responses:  `500 Internal Server Error` (generic error)

#### Get the answer

* HTTP method: `GET`  URL: `/api/answers/:riddleId/:userId`
* Description: Get the answer linked to a riddles given by a user
* Request body: _None_
* Response: `200 OK` (success)
* Response body: an object containing an answer

``` json
{
  "riddleId": 4,
  "user": 1,
  "answer": 4
}
```

* Error responses:  `500 Internal Server Error` (generic error)


### Users management

#### get all users

* HTTP method: `GET`  URL: `/api/users`
* Description: check if current user is logged in and get her data
* Request body: _None_
* Response: `200 OK` (success)

* Response body: array with all the users of the application

``` JSON
[
  {
    "id": 1,
    "name": "testuser1", 
    "score": "4"
  },
  {
    "id": 2,
    "name": "testuser2", 
    "score": "3"
  }
  ...
]
```

* Error responses:  `500 Internal Server Error` (generic error)

#### Login

* HTTP method: `POST`  URL: `/api/sessions`
* Description: authenticate the user who is trying to login
* Request body: credentials of the user who is trying to login

``` JSON
{
    "username": "username",
    "password": "password"
}
```

* Response: `200 OK` (success)
* Response body: authenticated user

``` JSON
{
    "id": 1,
    "username": "john.doe@polito.it", 
    "name": "John"
}
```
* Error responses:  `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)


#### Check if user is logged in

* HTTP method: `GET`  URL: `/api/sessions/current`
* Description: check if current user is logged in and get her data
* Request body: _None_
* Response: `200 OK` (success)

* Response body: authenticated user

``` JSON
{
    "id": 1,
    "username": "john.doe@polito.it", 
    "name": "John"
}
```

* Error responses:  `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)


#### Logout

* HTTP method: `DELETE`  URL: `/api/sessions/current`
* Description: logout current user
* Request body: _None_
* Response: `200 OK` (success)

* Response body: _None_

* Error responses:  `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)

## Database Tables

- Table `users` - contains id, email, name, hash, salt, score and it store the users of the application
- Table `riddles` - contains id, question, difficulty, duration, status, answer, tip1, tip2, user and it store the riddles of the application
- Table `answers` - contains riddleId, user, answer and it store all the answers linked to the riddle and to the user

## Main React Components

- `Riddle` (in `Riddle.js`): used to setup the table that will contains all the riddle
- `RiddleRow` (in `Riddle.js`): it represents a row of the table and it's used to render all the riddle
- `ShowForm` (in `ShowForm.js`): it renders the form to add a film
- `Answer` (in `Answer.js`): container class for the various type of answer
- `OpenAllAnswer` (in `Answer.js`): render the form of the open riddles and it's used to give an answer to them
- `ClosedOrMineAnswer` (in `Answer.js`): render the form of the closed or mine riddles and it's used to see the answers given to a riddle
- `LoginForm` (in `LoginForm.js`): it render the form used to do the login
- `LogOutButton` (in `LoginForm.js`): it render the logoutbutton
- `Navigation` (in `Navigation.js`): it render the navigation bar where there is the button to the top 3 users and a link to the login page that it became a Popover when logged in
- `Top` (in `Top.js`): it render the list of the top 3 users

## Screenshot

![Screenshot](./img/screenshot.png)

## Users Credentials

- testuser1@polito.it, password1
- testuser2@polito.it, password2
- testuser3@polito.it, password3
- testuser4@polito.it, password4
- testuser5@polito.it, password5