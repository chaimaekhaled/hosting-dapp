import React, {Component} from 'react';
import {Badge, Button, Col, Container, Input, Label, Row} from 'reactstrap';

class MonthSelector extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: this.props.activeMonth,
        };
    }

    handleChange(e) {
        const val = e.target.value;
        this.setState({value: val});
        //this.props.onChange(val);
        console.log("Value: " + val);
    }

    render() {
        //TODO: move badgeStyle and rowGrid to CSS
        const badgeStyle = {'font-size': '85%', 'margin-top': '5px', 'margin-bottom': '5px', 'float': 'right'};
        const rowGrid = {'margin-bottom': '15px'};
        const data = [
            {month: "2018-04"},
            {month: "2018-03"},
            {month: "2018-02"},
        ];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        return (
            <Container>
                <Row className="align-items-center justify-content-between">
                    <Col xs={12} md={6} xl={4} style={rowGrid}>
                        <Row><Label xs={3} for="monthSelector">Month:</Label>
                            <Col xs={9}><Input type="select" id="monthSelector" onChange={this.handleChange}
                                               value={this.state.value}>
                                {data.map(dt => <option
                                    value={dt.month}>{(new Date(dt.month)).getFullYear() + " " + months[(new Date(dt.month)).getMonth()]}</option>)}
                            </Input>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={6} md={3} xl={2} style={rowGrid}><span>Deposit: </span><Badge style={badgeStyle}
                                                                                           color="dark">25
                        ETH</Badge></Col>
                    <Col xs={6} md={3} xl={2} style={rowGrid}>Refund: <Badge style={badgeStyle} color="dark">0.4
                        ETH</Badge></Col>
                    <Col xs={6} md={{size: 3, offset: 6}} xl={{size: 2, offset: 0}} style={rowGrid}><Button
                        color="primary" block outline size={"sm"}>Extend</Button></Col>
                    <Col xs={6} md={3} xl={2} style={rowGrid}><Button color="warning" block outline
                                                                      size={"sm"}>Terminate</Button></Col>
                </Row>
            </Container>
        )
    }
}

export default MonthSelector;