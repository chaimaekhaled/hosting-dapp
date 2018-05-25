import React, {Component} from 'react';
import {Button, Col, Container, Input, InputGroup, InputGroupAddon, Label, Row} from 'reactstrap';

class MonthSelector extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        const today = new Date().toISOString().slice(0, 10);
        this.state = {
            fromDate: this.props.fromDate ? this.props.fromDate : today,
            untilDate: this.props.untilDate ? this.props.untilDate : today,
        };
    };

    handleChange(e) {
        const newDate = e.target.value;
        switch (e.target.id) {
            case "fromSelector":
                this.setState({fromDate: newDate});
            case "untilSelector":
                this.setState({untilDate: newDate});
        }
        //this.props.onChange(newDate);
        console.log("New " + e.target.id + " date: " + newDate);
        console.log("Date: " + new Date(newDate));
    }

    render() {
        //TODO: move badgeStyle and rowGrid to CSS
        const rowGrid = {'margin-bottom': '15px'};

        const uniqueMonths = [...new Set(this.props.data.map(item => item.month))];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        return (
            <Container>
                <Row className="align-items-center justify-content-between">
                    <Col xs={12} md={6} xl={3} style={rowGrid}>
                        <Row>
                            <Label xs={5} lg={4} for="fromSelector"><h4>From:</h4></Label>
                            <Col xs={7} lg={5}>
                                <Input id="fromSelector" onChange={this.handleChange}
                                       value={this.state.fromDate}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} md={6} xl={3} style={rowGrid}>
                        <Row>
                            <Label xs={5} lg={4} for="untilSelector"><h4>Until:</h4></Label>
                            <Col xs={7} lg={5}>
                                <Input id="untilSelector" onChange={this.handleChange}
                                       value={this.state.untilDate}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={6} md={{size: 3, offset: 6}} xl={{size: 3, offset: 0}} style={rowGrid}>
                        <InputGroup>
                            <Input/>
                            <InputGroupAddon addonType="prepend"><Button
                                color="primary">Transfer</Button></InputGroupAddon>
                        </InputGroup>
                    </Col>
                    <Col xs={6} md={3} xl={3} style={rowGrid}>
                        <InputGroup>
                            <Input/>
                            <InputGroupAddon addonType="prepend"><Button
                                color="warning">Withdraw</Button></InputGroupAddon>
                        </InputGroup>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default MonthSelector;