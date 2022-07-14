import { Table, Button, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

function RiddleRow(props) {

    const navigate = useNavigate();
    const { groupList } = useParams();

    function handleClick(riddleId) {
        if(props.isLoggedIn)
            navigate(`/answer/${groupList}/${riddleId}/${props.riddles.status}`);
    }

    return (
        <tr onClick={() => handleClick(props.riddles.id)}>
            <td>
                <p>
                    {props.riddles.question}
                </p>
            </td>
            <td>
                <p>
                    {props.riddles.difficulty}
                </p>
            </td>
            <td>
                <p className={['keep-white-space', (props.riddles.status === 'open') ? "status-open" : "status-closed"].join(' ')}>
                    {props.riddles.status}
                </p>
            </td>
            <td>
                <p>
                    <i className="bi bi-arrow-right-circle"></i>
                </p>
            </td>
        </tr>
    );
}

function Riddle(props) {

    const navigate = useNavigate();
    const { groupList } = useParams();

    function compare(a, b) {
        if (a.status <= b.status)
            return 1;
        else
            return -1;
    }

    function Heading() {

        return(
            <>
                <thead>
                    <tr>
                        <td>
                            <p>
                                Question
                            </p>
                        </td>
                        <td>
                            <p>
                                Difficulty
                            </p>
                        </td>
                        <td>
                            <p>
                                Status
                            </p>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {props.isLoggedIn ?
                        ((groupList === 'all') ? (props.riddles.sort((a, b) => compare(a, b)).map(r => <RiddleRow riddles={r} key={r.id} isLoggedIn={props.isLoggedIn}/>)) :
                            (props.myRiddles.sort((a, b) => compare(a, b)).map(r => <RiddleRow riddles={r} key={r.id} isLoggedIn={props.isLoggedIn}/>))) :
                        (props.riddles.sort((a, b) => compare(a, b)).map(r => <RiddleRow riddles={r} key={r.id} isLoggedIn={props.isLoggedIn}/>))}
                </tbody>
            </>
        );
    }

    return (
        <Container>
            {props.isLoggedIn ? (<Table hover size="sm"><Heading/></Table>) : (<Table size="sm"><Heading/></Table>)}
            { props.isLoggedIn ? (<Button className="btn btn-lg btn-primary fixed-right-bottom" onClick={() => navigate('/add')}>&#43;</Button>) : 
                (<Button className="btn btn-lg btn-primary fixed-right-bottom" onClick={() => navigate('/add')} disabled>&#43;</Button>)}
            
        </Container>
    );
}

export { Riddle };