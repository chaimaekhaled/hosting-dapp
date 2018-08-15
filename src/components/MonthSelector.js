import React, {Component} from 'react';
import {Col, Container, Row} from 'reactstrap';
import LabeledInput from './LabeledInput';

/*
    This component allows the selection of dates
 */

class MonthSelector extends Component {
    render() {
        //TODO: move badgeStyle and rowGrid to CSS
        const rowGrid = {marginBottom: 15 + 'px'};

        const xl = {size: 5};
        const lg = {size: 6};
        const md = {size: 6};
        const xs = {size: 12};
        const maxDate = new Date(new Date(this.props.selectedService.startDate).getTime() + this.props.selectedService.availability.length * 86400000).toISOString().slice(0, 10);

        return (
            <Container>
                <Row className="justify-content-lg-end">
                    {/*<Row className="align-items-center justify-content-between">*/}
                    <Col xs={xs} md={md} lg={lg} xl={xl} style={rowGrid}>
                        <LabeledInput id="fromSelector" onChange={this.props.onDateChanged} labelText="From:"
                                      inputId="fromSelector"
                                      value={this.props.fromDate} type="date"
                                      min={this.props.selectedService.startDate} max={maxDate}/>
                    </Col>
                    <Col xs={xs} md={md} lg={lg} xl={xl} style={rowGrid}>
                        <LabeledInput onChange={this.props.onDateChanged} labelText="Until:" inputId="untilSelector"
                                      value={this.props.untilDate} type="date"
                                      min={this.props.selectedService.startDate} max={maxDate}/>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default MonthSelector;