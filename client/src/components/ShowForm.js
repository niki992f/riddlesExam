import { useState } from 'react';
import { Form, Button, Alert, Container, ButtonGroup, ToggleButton, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ShowForm(props) {
    const [question, setQuestion] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [duration, setDuration] = useState(30);
    const [answer, setAnswer] = useState('');
    const [firstTip, setFirstTip] = useState('');
    const [secondTip, setSecondTip] = useState('');

    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    const diff = ['easy', 'medium', 'hard'];

    function handleSubmit(event, props) {
        event.preventDefault();
        if (question !== '' && diff.some(d => d === difficulty) && duration>=30 && duration<=600 && answer !== '' && firstTip !== '' && secondTip !== ''){
            const riddle = {question: question, difficulty: difficulty, duration: duration, status: 'open', answer: answer, firstTip: firstTip, secondTip: secondTip, user: props.user.id};
            props.addRiddle(riddle);
            setErrorMsg('');
        } else {
            setErrorMsg('errore nella compilazione del form');
        }
        navigate('/list/all');
    }

    return (
        <Container fluid>
            <Row className='form-padding'>
                { errorMsg ?  <Alert variant="danger" onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
            </Row>
            <Form className='form-padding' onSubmit={(event) => handleSubmit(event, props)}>
                <Form.Group>
                    <Form.Label>Question</Form.Label>
                    <Form.Control value={question} onChange={ev => setQuestion(ev.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Difficulty</Form.Label><br />
                    <ButtonGroup>
                        <ToggleButton variant="outline-primary" type='radio' checked={difficulty === 'easy'} onClick={() => setDifficulty('easy')}>Easy</ToggleButton>
                        <ToggleButton variant="outline-primary" type='radio' checked={difficulty === 'medium'} onClick={() => setDifficulty('medium')}>Medium</ToggleButton>
                        <ToggleButton variant="outline-primary" type='radio' checked={difficulty === 'hard'} onClick={() => setDifficulty('hard')}>Hard</ToggleButton>
                    </ButtonGroup>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Duration</Form.Label>
                    <Form.Control value={duration} onChange={ev => setDuration(ev.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Answer</Form.Label>
                    <Form.Control value={answer} onChange={ev => setAnswer(ev.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>First tip</Form.Label>
                    <Form.Control value={firstTip} onChange={ev => setFirstTip(ev.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Second tip</Form.Label>
                    <Form.Control value={secondTip} onChange={ev => setSecondTip(ev.target.value)}></Form.Control>
                </Form.Group>
                <div className='d-grid gap-2 button-form'>
                    <Button className="btn btn-lg btn-primary" type='submit'>Save</Button>
                    <Button className="btn btn-lg btn-primary" onClick={() => navigate('/list/all')}>Cancel</Button>
                </div>
            </Form>
        </Container >
    );
}

export { ShowForm };