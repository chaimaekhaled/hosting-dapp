import React, {Component} from 'react';
import {Container, Jumbotron, Table} from 'reactstrap';
import MonthSelector from "../../components/MonthSelector";
import ServiceSelector from "../../components/ServiceSelector";

class Monitoring extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMonth: props.data[0].month,
            selectedService: props.data[0].id,
            latency: props.data[0].latency,
            dropPackets: props.data[0].dropPackets,
            availability: props.data[0].availability
        };
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.handleServiceChange = this.handleServiceChange.bind(this);
    }

    handleServiceChange(val) {
        const item = this.getValues(val, this.state.selectedMonth);
        this.setState({
            selectedService: val,
            latency: item.latency,
            dropPackets: item.dropPackets,
            availability: item.availability,
        });
    }

    handleMonthChange(val) {
        const item = this.getValues(this.state.selectedService, val);
        this.setState({
            selectedMonth: val,
            latency: item.latency,
            dropPackets: item.dropPackets,
            availability: item.availability,
        });
    }

    getValues(service, month) {
        for (let i = 0; i < this.props.data.length; i++) {
            const dService = this.props.data[i].id;
            const dMonth = this.props.data[i].month;
            if (service === dService && month === dMonth) {
                return this.props.data[i];
            }
        }
    }

    render() {
        return (
            <main>
                <Jumbotron><h1>Monitoring</h1></Jumbotron>
                <Container>
                    <ServiceSelector data={this.props.data} onChange={this.handleServiceChange}/>
                    <hr className="my-3"/>
                    <MonthSelector data={this.props.data} onChange={this.handleMonthChange}/>
                    <hr className="my-3"/>

                    <h3>Stats</h3>
                    <Table className="table-responsive-sm">
                        <thead className="thead-light">
                        <tr>
                            <th>Goal</th>
                            <th>Latency</th>
                            <th>Packets dropped</th>
                            <th>Availability</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="table-success">
                            <td>High</td>
                            <td>{this.state.latency <= 5 ? this.state.latency + "ms" : ''}</td>
                            <td>{this.state.dropPackets <= 2 ? this.state.dropPackets + "%" : ''}</td>
                            <td>{this.state.availability >= 99.99 ? this.state.availability + "%" : ''}</td>
                        </tr>
                        <tr className="table-warning">
                            <td>Middle</td>
                            <td>{this.state.latency > 5 && this.state.latency <= 50 ? this.state.latency + "ms" : ''}</td>
                            <td>{this.state.dropPackets <= 10 && this.state.dropPackets > 2 ? this.state.dropPackets + "%" : ''}</td>
                            <td>{this.state.availability >= 95 && this.state.availability < 99.99 ? this.state.availability + "%" : ''}</td>
                        </tr>
                        <tr className="table-danger">
                            <td>Low</td>
                            <td>{this.state.latency > 50 ? this.state.latency + "ms" : ''}</td>
                            <td>{this.state.dropPackets > 10 ? this.state.dropPackets + "%" : ''}</td>
                            <td>{this.state.availability < 95 ? this.state.availability + "%" : ''}</td>
                        </tr>
                        </tbody>
                    </Table>
                </Container>
            </main>
        )
    }
}

export default Monitoring
