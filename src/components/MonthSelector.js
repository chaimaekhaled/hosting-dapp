import React, {Component} from 'react';
import {Badge, Button, Col, Container, Input, Label, Row} from 'reactstrap';

class MonthSelector extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        const today = (new Date()).getFullYear() + "-" + (new Date()).getMonth();
        this.state = {
            selectedMonth: this.props.selectedMonth ? this.props.selectedMonth : today,
        };
    };

    handleChange(e) {
        const newMonth = e.target.value;
        this.setState({selectedMonth: newMonth});
        this.props.onChange(newMonth);
        console.log("New month selected: " + newMonth);
    }

    render() {
        //TODO: move badgeStyle and rowGrid to CSS
        const badgeStyle = {'font-size': '85%', 'margin-top': '5px', 'margin-bottom': '5px', 'float': 'right'};
        const rowGrid = {'margin-bottom': '15px'};

        const uniqueMonths = [...new Set(this.props.data.map(item => item.month))];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        return (
            <Container>
                <Row className="align-items-center justify-content-between">
                    <Col xs={12} md={6} xl={4} style={rowGrid}>
                        <Row>
                            <Label xs={5} lg={4} for="monthSelector"><h4>Month:</h4></Label>
                            <Col xs={7}>
                                <Input type="select" id="monthSelector" onChange={this.handleChange}
                                       value={this.state.selectedMonth}>
                                    {
                                        uniqueMonths.map(monthId =>
                                            <option value={monthId}>
                                                {(new Date(monthId)).getFullYear() + " "
                                                + months[(new Date(monthId)).getMonth()]}
                                            </option>)
                                    }
                                </Input>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={6} md={3} xl={2} style={rowGrid}>Deposit:
                        <Badge style={badgeStyle} color="dark">25 ETH</Badge>
                    </Col>
                    <Col xs={6} md={3} xl={2} style={rowGrid}>Refund:
                        <Badge style={badgeStyle} color="dark">0.4 ETH</Badge>
                    </Col>
                    <Col xs={6} md={{size: 3, offset: 6}} xl={{size: 2, offset: 0}} style={rowGrid}>
                        <Button color="primary" block outline size={"sm"}>Extend</Button>
                    </Col>
                    <Col xs={6} md={3} xl={2} style={rowGrid}>
                        <Button color="warning" block outline size={"sm"}>Terminate</Button>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default MonthSelector;