import React, {Component} from 'react';
import {Button, Col, Container, Jumbotron, Row, Table} from 'reactstrap';
import MonthSelector from "../../components/MonthSelector";
import ServiceSelector from "../../components/ServiceSelector";

function BillCalculation() {
    return (
        <Container><h3>Bill Calculation</h3>
            <Table className="table-responsive-sm">
                <thead className="thead-light">
                <tr>
                    <th>Goal</th>
                    <th>Compliance</th>
                    <th>Cost</th>
                    <th>Refund</th>
                    <th>Sum</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>High</td>
                    <td>90%</td>
                    <td>18 ETH</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Middle</td>
                    <td>8%</td>
                    <td>1.2 ETH</td>
                    <td>0.4 ETH</td>
                </tr>
                <tr>
                    <td>Low</td>
                    <td>2%</td>
                    <td></td>
                    <td>0.4 ETH</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>19.2 ETH</td>
                </tr>
                </tbody>
            </Table>
        </Container>
    )
}

class Billing extends Component {
    render() {
        const rowGrid = {'margin-bottom': '15px'}; //TODO: move this to CSS

        return (
            <main>
                <Jumbotron><h1>Billing</h1></Jumbotron>
                <Container>
                    <ServiceSelector data={this.props.data} onChange={() => {
                    }}/>
                    <hr className="my-3"/>
                    <MonthSelector data={this.props.data} onChange={() => {
                    }}/>
                    <hr className="my-3"/>
                    <BillCalculation/>
                    <hr className="my-3"/>

                    <Row style={rowGrid}>
                        <Col xs={8} sm={6} md={{size: 4, offset: 6}} lg={{size: 3, offset: 7}}>Total bill of all
                            services: </Col>
                        <Col className="ml-auto col-auto">72 ETH</Col>
                    </Row>
                    <Row style={rowGrid}>
                        <Col xs={8} sm={6} md={{size: 4, offset: 6}} lg={{size: 3, offset: 7}}>Available refund for
                            payout: </Col>
                        <Col className="ml-auto col-auto">18 ETH</Col>
                        <Col xs={12} sm={{size:6, offset:6}} md={{size:3}} xl={{size:2}} className="ml-auto"><Button color="primary" size="sm" block>Receive refund</Button></Col>
                    </Row>
                </Container>
            </main>
        )
    }
}

export default Billing;
