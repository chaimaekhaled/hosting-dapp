import React, {Component} from 'react';
import {Alert, Button, Col, Container, Form, FormGroup, Input, Jumbotron, Label, Row, Table} from 'reactstrap';
import StoreCard from '../../components/StoreCard';
import DaysInput from '../../components/DaysInput';

const Sla = (props) => {
    if (props.service == null) {
        return (<Container><Alert>Select a service to show the SLA terms.</Alert></Container>)
    } else {
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
                            <td>&ge;{props.service.sla[1]}%</td>
                        </tr>
                        <tr>
                            <td>Middle</td>
                            <td>&ge;{props.service.sla[2]}%</td>
                            <td>{props.service.sla[3]}%</td>
                        </tr>
                        <tr>
                            <td>Low</td>
                            <td>&lt;{props.service.sla[2]}%</td>
                            <td>{props.service.sla[4]}%</td>
                        </tr>
                        </tbody>
                    </Table>
                </Col></Row>
            </Container>
        );
    }


};


class Store extends Component {
    constructor(props) {
        super(props);
        this.handleClickStore = this.handleClickStore.bind(this);
        this.handleClickDaysSelection = this.handleClickDaysSelection.bind(this);
        this.state = {
            activeStoreCardId: null,
            selectedProduct: null,
            selectedDays: 1,
        };
    }

    handleClickStore(id) {
        this.setState({
            activeStoreCardId: id,
            selectedProduct: this.props.products[id],
        })
    }

    handleClickDaysSelection(n) {
        let days = this.state.selectedDays + n >= 0 ? this.state.selectedDays + n : 0;
        this.setState({
            selectedDays: days,
        })
    }

    render() {
        const getStoreCards = (products) => {
            return products.map((product) =>
                <Col><StoreCard activeId={this.state.activeStoreCardId} title={product.name} id={product.id}
                                onClick={this.handleClickStore} details={product.details}/></Col>)
        };

        let btn;
        if (this.state.activeStoreCardId === null) {
            btn = <Button id="orderButton" disabled className="btn-lg" block>Buy</Button>;
        } else {
            btn = <Button id="orderButton" color="primary" className="btn-lg"
                          block>{this.state.selectedProduct.costPerDay * this.state.selectedDays + "ETH - Buy"}</Button>;
        }
        //TODO: move rowGrid to CSS
        const rowGrid = {marginBottom: 15 + 'px'};

        return (<React.Fragment>
                <Jumbotron>
                    <h1>Store</h1>
                </Jumbotron>

                <Container>
                    <Row><Col><h3>Select a Service</h3></Col></Row>
                    <hr className="my-3"/>
                    <Row className="flex-row flex-nowrap" style={{overflowX: 'auto'}}>
                        {getStoreCards(this.props.products)}
                    </Row>
                    <hr className="my-3"/>
                </Container>

                <Sla service={this.state.selectedProduct}/>

                <Container>
                    <Row><Col><h3>Details</h3></Col></Row>
                    <hr className="my-3"/>
                    <Form className="">
                        <FormGroup row className="justify-content-md-between">
                            <Col xs={12} sm={12} lg={6} style={rowGrid}>
                                <Row><Label for="sshkey" xs={3}>SSH Key</Label>
                                    <Col xs={9}>
                                        <Input type="textarea" name="sshkey" id="sshkey" placeholder=""/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12} sm={6} lg={3} style={rowGrid}>
                                <DaysInput selectedDays={this.state.selectedDays}
                                           onClick={(n) => this.handleClickDaysSelection(n)}
                                           onChange={(e) => {
                                               let newDays = parseInt(e.target.value, 10);
                                               this.setState({selectedDays: newDays});
                                           }}/>

                            </Col>
                            <Col xs={12} sm={6} lg={3} className="align-content-md-end" style={rowGrid}>
                                {btn}
                            </Col>
                        </FormGroup>
                    </Form>
                </Container></React.Fragment>
        )
    }
}

export default Store
