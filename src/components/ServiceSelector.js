import React, {Component} from 'react';
import {Button, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row} from 'reactstrap';
import LabeledInput from './LabeledInput';
import DaysInput from './DaysInput';

class ServiceSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDays: 0,
        };
    }

    render() {
        const badgeStyle = {'font-size': '85%', 'margin-top': '5px', 'margin-bottom': '5px', 'float': 'right'};
        const rowGrid = {marginBottom: 15 + 'px'};
        let services = this.props.data.map(item => {
            return {value: item.id, text: item.name + " " + item.id}
        });
        const lg = {size: 3};
        const sm = {size: 6, offset: 0};
        const btn = this.state.selectedDays >= 0 ?
            <Button color="primary">Extend</Button> : <Button color="warning">Withdraw</Button>;


        let info = {
            color: '#fff',
            backgroundColor: '#138496',
            borderColor: '#117a8b'
        };

        return (
            <Container>
                <Row className="align-items-center">
                    <Col xs={12} lg={5} style={rowGrid}>
                        <LabeledInput inputId="serviceSelector" onChange={this.props.onChange} labelText="Service:"
                                      value={this.props.selectedServiceId} type="select"
                                      options={services}/>
                        {/*<Row><Label xs={5} lg={4} for="serviceSelector"><h4>Service: </h4></Label>
                            <Col xs={7} lg={5}>
                                <Input type="select" id="serviceSelector" onChange={this.handleChange}
                                       value={this.props.selectedService}>
                                    {
                                        this.state.uniqueServices.map(id => <option value={id}>Server {id}</option>)
                                    }
                                </Input>
                            </Col>
                        </Row>*/}
                    </Col>
                    <Col xs={12} lg={{size: 7}} xl={{size: 6, offset: 1}}
                         style={{textAlign: "right", marginBottom: 15 + 'px'}}>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend"><InputGroupText style={info}>Hash</InputGroupText>
                            </InputGroupAddon>
                            <Input style={{textAlign: 'right',}} value={this.props.selectedService.hash} disabled/>
                        </InputGroup>
                        {/*<Badge color="light">Hash</Badge>*/}
                        {/*<span style={{overflowWrap: 'break-word'}} color="dark">*/}
                        {/*{this.getHash(this.props.selectedService)}*/}
                        {/*</span>*/}
                    </Col>
                    <Col xs={12} sm={sm} lg={lg} style={rowGrid}>
                        {/*<Badge style={badgeStyle} color="dark">25 ETH</Badge>*/}
                        <InputGroup>
                            <InputGroupAddon addonType="prepend"><InputGroupText style={info}>Balance</InputGroupText>
                            </InputGroupAddon>
                            <Input style={{textAlign: 'right',}} value={this.props.selectedService.balance + " ETH"}
                                   disabled/>
                        </InputGroup>
                    </Col>
                    <Col xs={12} sm={sm} lg={lg} style={rowGrid}>
                        {/*<Badge style={badgeStyle} color="dark">25 ETH</Badge>*/}
                        <InputGroup>
                            <InputGroupAddon addonType="prepend"><InputGroupText style={info}>End Date</InputGroupText>
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
                                   value={this.state.selectedDays * this.props.selectedService.costPerDay + " ETH"}
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