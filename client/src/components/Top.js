import { useEffect, useState } from 'react';
import { Button, Container, ListGroup, Row, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../API';


function Top(props) {

    const [users, setusers] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        API.getUsers()
            .then((users) => setusers(users))
            .catch(err => handleError(err));
    }, []);

    const handleError = (err) => {
        let msg = '';
        if (err.error) 
            msg = err.error;
        else if (String(err) === "string") 
            msg = String(err);
        else 
            msg = "Unknown Error";
        setErrorMsg(msg);
    }

    return (
        <Container>
            <Row className='top-error-padding'>
                { errorMsg ? <Alert variant="danger" onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
            </Row>
            <Button className='fixed-left-top' size='lg' onClick={() => navigate('/list/all')}><i className="bi bi-arrow-left"></i></Button>
            <Row className='central'>
                <ListGroup className='padding-top'>
                    {users.sort((a, b) => b.score - a.score).slice(0, 3).map((u) => <ListGroup.Item key={u.id}>{u.name} score: {u.score}</ListGroup.Item>)}
                </ListGroup>
            </Row>
        </Container>
    );
}

export { Top };