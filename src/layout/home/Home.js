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
                    Please submit a valid address of a Provider Smart Contract into the footer's input field.
                    Service offerings and their corresponding SLA are listed in the Store view.
                    The Billing shows information on active service contracts and offers inputs for submitting
                    monitoring data.
                </Container>
            </main>
        )
    }
}

export default Home;