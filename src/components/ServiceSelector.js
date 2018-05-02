import React, {Component} from 'react';
import {Badge, Col, Container, Input, Label, Row} from 'reactstrap';


class ServiceSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedService: this.props.selectedService ? this.props.selectedService : 0,
            uniqueServices: [...new Set(this.props.data.map(item => item.id))],
        };
        this.handleChange = this.handleChange.bind(this);
        this.getHash = this.getHash.bind(this);
    }

    handleChange(e) {
        const val = parseInt(e.target.value, 10);
        this.setState({selectedService: val});
        console.log("New Service selected: " + val);
        this.props.onChange(val);
    }

    getHash() {
        for (let i = 0; i < this.props.data.length; i++) {
            if (this.props.data[i].id === this.state.selectedService) return this.props.data[i].hash;
        }
    }

    render() {
        return (
            <Container>
                <Row className="align-items-center">
                    <Col xs={12} md={5} lg={4}>
                        <Row><Label xs={5} lg={4} for="serviceSelector"><h4>Service: </h4></Label>
                            <Col xs={7}>
                                <Input type="select" id="serviceSelector" onChange={this.handleChange}
                                       value={this.state.selectedService}>
                                    {
                                        this.state.uniqueServices.map(id => <option value={id}>Server {id}</option>)
                                    }
                                </Input>
                            </Col>
                        </Row></Col>
                    <Col xs={12} md={7} lg={8} style={{'text-align': "right"}}>
                        <Badge color="light">Hash</Badge>
                        <span style={{'overflow-wrap': 'break-word'}}
                              color="dark">
                            {this.getHash(this.state.selectedService)}
                            </span>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ServiceSelector;