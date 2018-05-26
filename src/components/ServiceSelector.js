import React, {Component} from 'react';
import {Button, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row} from 'reactstrap';
import LabeledInput from './LabeledInput';
import DaysInput from './DaysInput';

class ServiceSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedServiceId: this.props.selectedService ? this.props.selectedService : 0,
            selectedService: this.props.data[0],
            selectedDays: 0,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const id = parseInt(e.target.value, 10);
        this.setState({
            selectedServiceId: id,
            selectedService: this.props.data[id],
        });
        console.log("New ServiceContract selected: " + id);
        //this.props.onChange(id);
    }

    render() {
        const badgeStyle = {'font-size': '85%', 'margin-top': '5px', 'margin-bottom': '5px', 'float': 'right'};
        const rowGrid = {'margin-bottom': '15px'};
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
                        <LabeledInput inputId="serviceSelector" onChange={this.handleChange} labelText="Service:"
                                      value={this.state.selectedServiceId} type="select"
                                      options={services}/>
                        {/*<Row><Label xs={5} lg={4} for="serviceSelector"><h4>Service: </h4></Label>
                            <Col xs={7} lg={5}>
                                <Input type="select" id="serviceSelector" onChange={this.handleChange}
                                       value={this.state.selectedService}>
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
                            <Input style={{textAlign: 'right',}} value={this.state.selectedService.hash} disabled/>
                        </InputGroup>
                        {/*<Badge color="light">Hash</Badge>*/}
                        {/*<span style={{overflowWrap: 'break-word'}} color="dark">*/}
                        {/*{this.getHash(this.state.selectedService)}*/}
                        {/*</span>*/}
                    </Col>
                    <Col xs={12} sm={sm} lg={lg} style={rowGrid}>
                        {/*<Badge style={badgeStyle} color="dark">25 ETH</Badge>*/}
                        <InputGroup>
                            <InputGroupAddon addonType="prepend"><InputGroupText style={info}>Balance</InputGroupText>
                            </InputGroupAddon>
                            <Input style={{textAlign: 'right',}} value={this.state.selectedService.balance + " ETH"}
                                   disabled/>
                        </InputGroup>
                    </Col>
                    <Col xs={12} sm={sm} lg={lg} style={rowGrid}>
                        {/*<Badge style={badgeStyle} color="dark">25 ETH</Badge>*/}
                        <InputGroup>
                            <InputGroupAddon addonType="prepend"><InputGroupText style={info}>End Date</InputGroupText>
                            </InputGroupAddon>
                            <Input style={{textAlign: 'right',}}
                                   value={new Date(this.state.selectedService.endDate).toLocaleDateString()} disabled/>
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
                            <Input type="number" style={{textAlign: 'right',}}/>
                            <InputGroupAddon addonType="prepend">{btn}</InputGroupAddon>
                        </InputGroup>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ServiceSelector;