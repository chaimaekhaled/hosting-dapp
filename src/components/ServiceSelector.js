import React, {Component} from 'react';
import {Button, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row} from 'reactstrap';
import LabeledInput from './LabeledInput';
import DaysInput from './DaysInput';

/*
    This component is used in the billing view to select a service.
 */

class ServiceSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDays: 0,
        };
    }

    render() {
        const rowGrid = {marginBottom: 15 + 'px'};
        const services = this.props.serviceContracts.map(item => {
            return {value: item.id, text: item.name + " " + item.id}
        });
        const lg = {size: 3};
        const sm = {size: 6, offset: 0};
        const btn = this.state.selectedDays >= 0 ?
            <Button color="primary" onClick={() => this.props.onClick(this.state.selectedDays)}>Extend</Button> :
            <Button color="warning" onClick={() => this.props.onClick(this.state.selectedDays)}>Withdraw</Button>;


        let infoColors = {
            color: '#fff',
            backgroundColor: '#138496',
            borderColor: '#117a8b'
        };

        return (
            <Container>
                <Row className="align-items-center">
                    <Col xs={12} lg={5} style={rowGrid}>
                        <LabeledInput inputId="serviceSelector" onChange={this.props.onChange} labelText="Service:"
                                      value={this.props.selectedService.id} type="select"
                                      options={services}/>

                    </Col>
                    <Col xs={12} lg={{size: 7}} xl={{size: 6, offset: 1}}
                         style={{textAlign: "right", marginBottom: 15 + 'px'}}>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend"><InputGroupText
                                style={infoColors}>Hash</InputGroupText>
                            </InputGroupAddon>
                            <Input style={{textAlign: 'right',}} value={this.props.selectedService.hash} disabled/>
                        </InputGroup>

                    </Col>
                    <Col xs={12} sm={sm} lg={lg} style={rowGrid}>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend"><InputGroupText
                                style={infoColors}>Balance</InputGroupText>
                            </InputGroupAddon>
                            <Input style={{textAlign: 'right',}}
                                   value={this.props.selectedService.balance + " " + this.props.currency}
                                   disabled/>
                        </InputGroup>
                    </Col>
                    <Col xs={12} sm={sm} lg={lg} style={rowGrid}>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend"><InputGroupText style={infoColors}>End
                                Date</InputGroupText>
                            </InputGroupAddon>
                            <Input style={{textAlign: 'right',}}
                                   value={new Date(this.props.selectedService.endDate).toLocaleDateString()} disabled/>
                        </InputGroup>
                    </Col>
                    <Col xs={12} sm={sm} lg={lg} style={rowGrid}>
                        <DaysInput selectedDays={this.state.selectedDays}
                                   onChange={(e) => {
                                       let newDays = parseInt(e.target.value, 10);
                                       this.setState({selectedDays: newDays});
                                   }}
                                   onClick={(n) => this.setState({selectedDays: this.state.selectedDays + n})}/>
                    </Col>
                    <Col xs={12} sm={sm} lg={lg} style={rowGrid}>
                        <InputGroup>
                            <Input style={{textAlign: 'right',}}
                                   value={this.state.selectedDays * this.props.selectedService.costPerDay + " " + this.props.currency}
                                   disabled/>
                            <InputGroupAddon addonType="prepend">{btn}</InputGroupAddon>
                        </InputGroup>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ServiceSelector;