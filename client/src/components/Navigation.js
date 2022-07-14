import { Navbar, Nav, Popover, OverlayTrigger, Button } from 'react-bootstrap';
import { LogOutButton } from './LoginForm';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate } from 'react-router-dom';

function Navigation(props) {

    const navigate = useNavigate();

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">{props.name}</Popover.Header>
            <Popover.Body className='d-grid gap-2'>
                <Button size='lg' onClick={() => navigate('/list/all')}>All</Button>
                <Button size='lg' onClick={() => navigate('/list/mine')}>My riddles</Button>
                <LogOutButton logout={props.logout} />
            </Popover.Body>
        </Popover>
    );

    return (
        <Navbar className="navbar-expand-md navbar-dark bg-primary fixed-top navbar-padding">
            <Navbar.Brand >
                <i className="bi bi-question-square icon-size icon-padding"></i>
                Indovinelli
            </Navbar.Brand>
            <Nav className="ms-md-auto">
                <Button className='icon-nav-position' variant='warning' onClick={() => navigate('/top3')}><i className="bi bi-trophy"></i></Button>
                {props.loggedIn ? (<OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
                    <Nav.Item>
                        <i className='bi bi-person-circle icon-size'></i>
                    </Nav.Item>
                </OverlayTrigger>) : (<Nav.Item>
                    <Nav.Link as={Link} to='/login'>
                        <i className='bi bi-person-circle icon-size'></i>
                    </Nav.Link>
                </Nav.Item>)}
            </Nav>
        </Navbar>
    );
}

export { Navigation };