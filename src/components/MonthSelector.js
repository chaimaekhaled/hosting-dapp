import React, {Component} from 'react';
import {Row, Col, Label, Badge, Button, Input, Container} from 'reactstrap';

class MonthSelector extends Component {
    render() {
        //TODO: move badgeStyle and rowGrid to CSS
        const badgeStyle = {'font-size': '85%', 'margin-top': '5px', 'margin-bottom': '5px', 'float': 'right'};
        const rowGrid = {'margin-bottom': '15px'};

        return (
            <Container>
                <Row className="align-items-center justify-content-between">
                    <Col xs={12} md={6} xl={4} style={rowGrid}>
                        <Row><Label xs={3} for="monthSelector">Month:</Label>
                            <Col xs={9}><Input type="select" id="monthSelector">
                                <option value="2018_04">2018 April</option>
                                <option value="2018_03">2018 March</option>
                                <option value="2018_02">2018 February</option>
                            </Input>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={6} md={3} xl={2} style={rowGrid}><span>Deposit: </span><Badge style={badgeStyle} color="dark">25 ETH</Badge></Col>
                    <Col xs={6} md={3} xl={2} style={rowGrid}>Refund: <Badge style={badgeStyle} color="dark">0.4 ETH</Badge></Col>
                    <Col xs={6} md={{size:3, offset:6}} xl={{size:2, offset:0}} style={rowGrid}><Button color="primary" block outline size={"sm"}>Extend</Button></Col>
                    <Col xs={6} md={3} xl={2} style={rowGrid}><Button color="warning" block outline size={"sm"}>Terminate</Button></Col>
                </Row>
            </Container>
        )
    };
}

export default MonthSelector;