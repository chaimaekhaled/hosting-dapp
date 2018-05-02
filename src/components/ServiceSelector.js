import React, {Component} from 'react';
import {Badge, Col, Container, Input, Label, Row} from 'reactstrap';


class ServiceSelector extends Component {
    render() {
        return (
            <Container>
                <Row className="align-items-center">
                    <Col xs={12} md={5} lg={4}>
                        <Row><Label xs={5} lg={4} for="serviceSelector"
                                    style={{'font-weight': 'bold', 'font-size': '130%'}}>Service:</Label>
                            <Col xs={7}>
                                <Input type="select" id="serviceSelector">
                                    <option>Server 1</option>
                                    <option>Server 2</option>
                                    <option>Server 3</option>
                                </Input>
                            </Col>
                        </Row></Col>
                    <Col xs={12} md={7} lg={8} style={{'text-align': "right"}}>
                        <Badge color="light">Hash</Badge>
                        <span style={{'overflow-wrap': 'break-word'}}
                              color="dark">0x8eabce75a960e1c6f4d679a56732072bcb5be3e0
                            </span>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ServiceSelector;