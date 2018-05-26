import React, {Component} from 'react';
import {Button, Col, Container, Form, FormGroup, Input, Jumbotron, Label, Row, Table} from 'reactstrap';
import StoreCard from '../../components/StoreCard';
import DaysInput from '../../components/DaysInput';

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
    if (props.activeStoreCard === null) {
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
                        <Row><Label for="sshkey" xs={3}>SSH Key</Label>
                            <Col xs={9}>
                                <Input type="textarea" name="sshkey" id="sshkey" placeholder=""/>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} sm={3} style={rowGrid}>
                        <DaysInput selectedDays={this.state.selectedDays}
                                   onClick={() => {
                                   }}
                                   onChange={() => {
                                   }}/>
                        {/*<Row><Label for="daysInput" xs={3}>Days</Label>*/}
                        {/*<Col xs={9}>*/}
                        {/*<InputGroup id="daysInput">*/}
                        {/*<InputGroupAddon addonType="prepend">*/}
                        {/*<Button onClick={() => {*/}
                        {/*props.handleClickDaysSelection(-1)*/}
                        {/*}}>-</Button>*/}
                        {/*</InputGroupAddon>*/}
                        {/*<Input value={props.selectedDays}/>*/}
                        {/*<InputGroupAddon addonType="append">*/}
                        {/*<Button onClick={() => {*/}
                        {/*props.handleClickDaysSelection(1)*/}
                        {/*}}>+</Button>*/}
                        {/*</InputGroupAddon>*/}
                        {/*</InputGroup>*/}
                        {/*</Col>*/}
                        {/*</Row>*/}
                    </Col>
                    <Col xs={12} sm={3} className="align-content-md-end" style={rowGrid}>
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
        this.handleClickDaysSelection = this.handleClickDaysSelection.bind(this);
        this.state = {
            activeStoreCard: null,
            selectedDays: 1,
        };
    }

    handleClickStore(id) {
        this.setState({
            activeStoreCard: id,
        })
    }

    handleClickDaysSelection(n) {
        let days = this.state.selectedDays + n >= 0 ? this.state.selectedDays + n : 0;
        this.setState({
            selectedDays: days,
        })
    }

    render() {
        const storeCards = this.props.services.map((service) =>
            <Col><StoreCard activeId={this.state.activeStoreCard} title={service.name} id={service.id}
                            onClick={this.handleClickStore} details={service.details}/></Col>
        );

        return (
            <main>
                <Jumbotron>
                    <h1>Store</h1>
                </Jumbotron>

                <Container>
                    <Row><Col><h3>Select a Service</h3></Col></Row>
                    <hr className="my-3"/>
                    <Row className="flex-row flex-nowrap" style={{'overflow-x': 'auto'}}>
                        {storeCards}
                        {/*<Col><StoreCard activeId={this.state.activeStoreCard} title="Small" id="sm"
                                        onClick={this.handleClickStore} details={{cpu: 1, ram: 2, ssd: 25, price: 5}}/></Col>
                        <Col><StoreCard activeId={this.state.activeStoreCard} title="Medium" id="md"
                                        onClick={this.handleClickStore} details={{cpu: 2, ram: 4, ssd: 50, price: 10}}/></Col>
                        <Col><StoreCard activeId={this.state.activeStoreCard} title="Large" id="la"
                                        onClick={this.handleClickStore}
                                        details={{cpu: 8, ram: 16, ssd: 100, price: 20}}/></Col>*/}
                    </Row>
                    <hr className="my-3"/>
                </Container>

                <SLA/>
                <DealClosing {...this.props} activeStoreCard={this.state.activeStoreCard}
                             selectedDays={this.state.selectedDays}
                             handleClickDaysSelection={this.handleClickDaysSelection}/>
            </main>
        )
    }

}

export default Store
