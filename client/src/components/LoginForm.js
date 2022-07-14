import { useState } from "react";
import { Container, Row, Col, Alert, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function LoginForm(props) {
    const [username, setUsername] = useState('testuser1@polito.it');
    const [password, setPassword] = useState('password1');
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        setErrMsg('');
        const credentials = { username, password };

        let valid = true;
        if (username === '' || password === '')
            valid = false;

        if (valid)
            props.login(credentials);
        else
            setErrMsg("errore nell'inserimento dei dati");
    }

    return (
        <Container>
            <Row className="form-padding">
                <Col>
                    <h2>Login</h2>
                    { errMsg ?  <Alert variant="danger" onClose={() => setErrMsg('')} dismissible>{errMsg}</Alert> : false}
                    <Form onSubmit={(ev) => handleSubmit(ev)}>
                        <Form.Group controlId="mail">
                            <Form.Label>email</Form.Label>
                            <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>password</Form.Label>
                            <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                        </Form.Group>
                        <div className='d-grid gap-2 button-form'>
                            <Button type='submit'>Login</Button>
                            <Button onClick={() => navigate('/list/all')}>Cancel</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

function LogOutButton(props) {

    return (
        <Button variant="outline-danger" size='lg' onClick={props.logout}>Logout</Button>
    );
}

export { LoginForm, LogOutButton };