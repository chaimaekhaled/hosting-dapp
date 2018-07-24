import React, {Component} from 'react';
import {Container, Jumbotron} from 'reactstrap';

class Home extends Component {

    render() {

        return (
            <main>
                <Jumbotron>
                    <h1>dApp Hosting</h1>
                </Jumbotron>
                <Container>
                    Home
                </Container>
            </main>
        )
    }
}

export default Home;