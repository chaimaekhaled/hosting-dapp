import React, {Component} from 'react';
import {Col, Container, Row} from 'reactstrap';
import LabeledInput from './LabeledInput';

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
                break;
            case "untilSelector":
                this.setState({untilDate: newDate});
                break;
            default:
                console.log("Error in MonthSelector.handleChange. Target: ");
                console.log(e.target);

        }
        //this.props.onChange(newDate);
        console.log("New " + e.target.id + " date: " + newDate);
        console.log("Date: " + new Date(newDate));
    }

    render() {
        //TODO: move badgeStyle and rowGrid to CSS
        const rowGrid = {marginBottom: 15 + 'px'};

        //const uniqueMonths = [...new Set(this.props.data.map(item => item.month))];
        //const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const xl = {size: 5};
        const lg = {size: 6};
        const md = {size: 6};
        const xs = {size: 12};
        return (
            <Container>
                <Row className="justify-content-lg-end">
                    {/*<Row className="align-items-center justify-content-between">*/}
                    <Col xs={xs} md={md} lg={lg} xl={xl} style={rowGrid}>
                        <LabeledInput id="fromSelector" onChange={this.handleChange} labelText="From:"
                                      inputId="fromSelector"
                                      value={this.state.fromDate} type="date"/>
                        {/*<Row>*/}
                        {/*<Label xs={5} lg={4} for="fromSelector"><h4>From:</h4></Label>*/}
                        {/*<Col xs={7} lg={5}>*/}
                        {/*<Input id="fromSelector" onChange={this.handleChange}*/}
                        {/*value={this.state.fromDate}/>*/}
                        {/*</Col>*/}
                        {/*</Row>*/}
                    </Col>
                    <Col xs={xs} md={md} lg={lg} xl={xl} style={rowGrid}>
                        <LabeledInput onChange={this.handleChange} labelText="Until:" inputId="untilSelector"
                                      value={this.state.untilDate} type="date"/>
                        {/*<Row>*/}
                        {/*<Label xs={5} lg={4} for="untilSelector"><h4>Until:</h4></Label>*/}
                        {/*<Col xs={7} lg={5}>*/}
                        {/*<Input id="untilSelector" onChange={this.handleChange}*/}
                        {/*value={this.state.untilDate}/>*/}
                        {/*</Col>*/}
                        {/*</Row>*/}
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default MonthSelector;