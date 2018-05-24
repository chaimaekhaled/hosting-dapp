import React, {Component} from 'react';
import {Button, Col, Container, Form, FormGroup, Input, Jumbotron, Label, Row, Table} from 'reactstrap';
import StoreCard from '../../components/StoreCard'

function SLA() {
    return (
        <Container>
            <Row><Col><h3>SLA</h3></Col></Row>
            <Row><Col>
                <Table className="table-responsive-sm">
                    <thead>
                    <tr>
                        <th>Goal</th>
                        <th>Availability</th>
                        <th>Refund</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>High</td>
                        <td>&ge;99%</td>
                    </tr>
                    <tr>
                        <td>Middle</td>
                        <td>&ge;90%</td>
                        <td>25%</td>
                    </tr>
                    <tr>
                        <td>Low</td>
                        <td>&lt;90%</td>
                        <td>100%</td>
                    </tr>
                    </tbody>
                </Table>
            </Col></Row>
        </Container>
    );
}


function DealClosing(props) {
    let btn;
    if (props.activeStoreCard === '') {
        btn = <Button id="orderButton" disabled className="btn-lg" block>Buy</Button>;
    } else {
        btn = <Button id="orderButton" color="primary" className="btn-lg" block>Buy</Button>;
    }
    //TODO: move rowGrid to CSS
    const rowGrid = {'margin-bottom': '15px'};
    return (
        <Container>
            <Row><Col><h3>Details</h3></Col></Row>
            <hr className="my-3"/>
            <Form className="">
                <FormGroup row className="justify-content-md-between">
                    <Col xs={12} sm={6} style={rowGrid}>
                        <Row><Label for="email" xs={3}>Email</Label>
                            <Col xs={9}><Input type="email" name="email" id="email" placeholder=""/></Col>
                        </Row>
                    </Col>
                    <Col xs={12} sm={5} style={rowGrid}>
                        <Row><Label for="duration" xs={3}>Duration</Label>
                            <Col xs={9}>
                                <Input type="select" name="duration" id="duration">
                                    <option value="30">1 month</option>
                                    <option value="7">1 week</option>
                                    <option value="1">1 day</option>
                                </Input></Col>
                        </Row>
                    </Col>
                    <Col xs={12} sm={6} style={rowGrid}>
                        <Row><Label for="sshkey" xs={3}>SSH Key</Label>
                            <Col xs={9}>
                                <Input type="textarea" name="sshkey" id="sshkey" placeholder=""/>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} sm={5} className="align-content-md-end" style={rowGrid}>
                        {btn}
                    </Col>
                </FormGroup>
            </Form>
        </Container>
    );
}

class Store extends Component {
    constructor(props) {
        super(props);
        this.handleClickStore = this.handleClickStore.bind(this);
        this.state = {
            activeStoreCard: '',
        };
    }

    handleClickStore(id) {
        this.setState({
            activeStoreCard: id,
        })
    }

    render() {
        return (
            <main>
                <Jumbotron>
                    <h1>Store</h1>
                </Jumbotron>

                <Container>
                    <Row><Col><h3>Select a Service</h3></Col></Row>
                    <hr className="my-3"/>
                    <Row className="flex-row flex-nowrap" style={{'overflow-x': 'auto'}}>
                        <Col><StoreCard activeId={this.state.activeStoreCard} title="Small" id="sm"
                                        onClick={this.handleClickStore} details={{cpu: 1, ram: 2, ssd: 25, price: 5}}/></Col>
                        <Col><StoreCard activeId={this.state.activeStoreCard} title="Medium" id="md"
                                        onClick={this.handleClickStore} details={{cpu: 2, ram: 4, ssd: 50, price: 10}}/></Col>
                        <Col><StoreCard activeId={this.state.activeStoreCard} title="Large" id="la"
                                        onClick={this.handleClickStore}
                                        details={{cpu: 8, ram: 16, ssd: 100, price: 20}}/></Col>
                    </Row>
                    <hr className="my-3"/>
                </Container>

                <SLA/>
                <DealClosing activeStoreCard={this.state.activeStoreCard}/>
            </main>
        )
    }

}

export default Store
