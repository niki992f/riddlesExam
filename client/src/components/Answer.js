import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, ListGroup, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../API';

function OpenAllAnswer(props) {

    const { riddleId, groupList } = useParams();
    const [riddle, setRiddle] = useState({});
    const [answer, setAnswer] = useState('');
    const [dirty, setDirty] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    const diff = { easy: 1, medium: 2, hard: 3 };

    useEffect(() => {
        let intervalId;
        if (riddle.status === 'open')
            intervalId = setInterval(() => setDirty(true), 1000);
        else if (riddle.status === 'closed')
            clearInterval(intervalId);
        return () => { clearInterval(intervalId) };
    }, [riddle.status]);

    useEffect(() => {
        if (dirty) {
            API.getRiddle(riddleId)
                .then(riddle => {
                    setRiddle(riddle);
                    setDirty(false);
                })
                .catch(e => {
                    handleError(e);
                });
        }
    }, [riddleId, dirty]);

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

    async function handleSubmit(event) {
        event.preventDefault();
        const ans = await API.getAnswer(riddleId, props.userId);
        if (ans.error) {
            if (answer !== '' && riddle.status === 'open' && riddle.timer > 0) {
                const obj = { riddleId: riddleId, user: props.userId, answer: answer, score: diff[riddle.difficulty] };
                props.addAnswer(obj);
                setErrorMsg('');
                navigate(`/list/${groupList}`);
            } else {
                setErrorMsg('risposta non valida e/o tempo scaduto');
            }
        } else {
            setErrorMsg('risposta già inserita');
        }
    }

    return (
        <>
            <Row className='form-padding'>
                {errorMsg ? <Alert variant="danger" onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
            </Row>
            <Row className='form-padding'>
                <Col md={10} className='border-answer text-padding'>
                    <p>Question: {riddle.question}</p>
                    <p>Difficulty: {riddle.difficulty} </p>
                    {(riddle.timer <= riddle.duration / 2) ? (<p>first tip: {riddle.firstTip} </p>) : false}
                    {(riddle.timer <= riddle.duration / 4) ? (<p>second tip: {riddle.secondTip} </p>) : false}
                    <Form onSubmit={(event) => handleSubmit(event)}>
                        <Form.Group>
                            <Form.Label>Answer</Form.Label>
                            <Form.Control value={answer} onChange={ev => setAnswer(ev.target.value)}></Form.Control>
                        </Form.Group>
                        <div className='button-padding-save'>
                            <Button variant='primary' size='lg' type='submit'>Save</Button>{' '}
                            <Button variant='outline-danger' size='lg' onClick={() => navigate(`/list/${groupList}`)}>Cancel</Button>
                        </div>
                    </Form>
                </Col>
                <Col md={2} className='border-time text-padding'>
                    <p className='white-text'>remaining time:</p>
                    {(riddle.timer>=0) ? (<p className='white-text'>{Math.floor(riddle.timer / 60)}: {Math.floor(riddle.timer % 60)}</p>) : <p className='white-text'>0: 0</p>}
                </Col>
            </Row>
        </>);
}

function ClosedOrMineAnswer(props) {

    const { riddleId, groupList } = useParams();
    const [dirty, setDirty] = useState(true);
    const [answers, setAnswers] = useState([]);
    const [riddle, setRiddle] = useState({});

    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        let intervalId;
        if (riddle.status === 'open')
            intervalId = setInterval(() => setDirty(true), 1000);
        else if (riddle.status === 'closed')
            clearInterval(intervalId);
        return () => { clearInterval(intervalId) };
    }, [riddle.status]);

    useEffect(() => {
        if (dirty) {
            API.getRiddle(riddleId)
                .then(riddle => {
                    setRiddle(riddle);
                    setDirty(false);
                }).catch(e => {
                    handleError(e);
                });
            API.getAllAnswer(riddleId)
                .then(answers => {
                    setAnswers(answers);
                    setDirty(false);
                }).catch(e => {
                    handleError(e);
                });
        }
    }, [dirty, riddleId, riddle.status]);

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
        <>
            <Row className='form-padding'>
                {errorMsg ? <Alert variant="danger" onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
            </Row>
            <Row className='form-padding'>
                <Col>
                    {(riddle.status === 'closed') ? (<p className='border-correct-answer text-padding'>Correct Answer: {riddle.answer}</p>) : false}
                    <ListGroup className='bottom-padding'>
                        {answers.map(a => {
                            return (<ListGroup.Item key={a.user} variant={(riddle.answer === a.answer) ? 'warning' : false}>
                                {a.name}: {a.answer}
                                {(riddle.answer === a.answer) ? <i className="bi bi-star-fill icon-position"></i> : false}
                            </ListGroup.Item>);
                        })}
                    </ListGroup>
                </Col>
            </Row>
            {(riddle.status === 'open') ? (<Row className='form-padding'>
                <Col className='border-time text-padding'>
                    <p className='white-text'>remaining time:</p>
                    {(riddle.timer>=0) ? (<p className='white-text'>{Math.floor(riddle.timer / 60)}: {Math.floor(riddle.timer % 60)}</p>) : <p className='white-text'>0: 0</p>}
                </Col>
            </Row>) : false}
            <Row className='form-padding padding-top'>
                <Col md={2}>
                <Button size='lg' onClick={() => navigate(`/list/${groupList}`)}><i className="bi bi-arrow-left"></i></Button></Col>
            </Row>
        </>);
}

function Answer(props) {

    const { groupList, group } = useParams();

    return (
        <Container>
            {(group === 'open' && groupList === 'all') ? <OpenAllAnswer addAnswer={props.addAnswer} userId={props.userId} /> : <ClosedOrMineAnswer />}
        </Container>
    );
}

export { Answer };