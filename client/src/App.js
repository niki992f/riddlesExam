import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Alert, Container, Row } from 'react-bootstrap';
import { LoginForm } from './components/LoginForm';
import { ShowForm } from './components/ShowForm';
import { Riddle } from './components/Riddle';
import { Answer } from './components/Answer';
import { Top } from './components/Top';
import API from './API';

function App() {
  return (
    <Router>
      <App2 />
    </Router>
  );
}

function App2() {

  const [riddles, setRiddles] = useState([]);
  const [myRiddles, setMyRiddles] = useState([]);

  const [dirty, setDirty] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        if (!user.error){
          setLoggedIn(true);
          setUser(user);
        }
      } catch (err) {}
    }
    checkAuth();
  }, []);

  useEffect(() => {
    let intervalId;
    if (loggedIn)
      intervalId = setInterval(() => setDirty(true), 1000);
    return () => { clearInterval(intervalId) };
  }, [loggedIn]);

  useEffect(() => {
    if (dirty && !loggedIn) {
      API.getRiddlesNotAuthenticated().then(r => {
        setRiddles(r);
        setDirty(false);
      }).catch(err => handleError(err));
    }
    if (dirty && loggedIn) {
      API.getRiddles(user.id).then(r => {
        setRiddles(r);
      }).catch(err => handleError(err));
      API.getMyRiddles(user.id).then(r => {
        setMyRiddles(r);
        setDirty(false);
      }).catch(err => handleError(err));
    }
  }, [dirty, loggedIn, user.id]);

  const handleError = (err) => {
    let msg = '';
    if (err.error) 
        msg = err.error;
    else if (String(err) === "string") 
        msg = String(err);
    else 
        msg = "Unknown Error";
    setMessage(msg);
}

  function addRiddle(riddle) {
    setMyRiddles((oldMyRiddles) => {
      return [...oldMyRiddles, riddle];
    });
    API.addRiddle(riddle, user.id).then(() => setDirty(true)).catch(err => handleError(err));
  }

  function addAnswer(answer) {
    API.addAnswer(answer).catch(err => handleError(err));
  }

  const doLogin = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        setDirty(true);
        setMessage('');
        navigate('/list/all');
      }).catch(err => handleError(err));
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setDirty(true);
    setUser({});
    setRiddles([]);
    setMyRiddles([]);
    navigate('/list/all');
  }

  return (
    <Container fluid>
      <Navigation loggedIn={loggedIn} name={user.name} logout={doLogOut} />
      <Row className='below-nav padding-left'>
        {message ? <Alert variant="danger" onClose={() => setMessage('')} dismissible>{message}</Alert> : false}
      </Row>
      <Row>
        <Routes>
          <Route path='/list/:groupList' element={<Riddle riddles={riddles} myRiddles={myRiddles} isLoggedIn={loggedIn} />} />
          <Route path='/add' element={<ShowForm addRiddle={addRiddle} user={user} />} />
          <Route path='/login' element={<LoginForm login={doLogin} />} />
          <Route path='/answer/:groupList/:riddleId/:group' element={<Answer userId={user.id} addAnswer={addAnswer} />} />
          <Route path='/top3' element={<Top />} />
          <Route path='*' element={<Navigate to={'/list/all'} />} />
        </Routes>
      </Row>
    </Container>
  );
}

export default App;
