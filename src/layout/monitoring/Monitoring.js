import React, {Component} from 'react';
import {Jumbotron, Container, Table} from 'reactstrap';
import MonthSelector from "../../components/MonthSelector";
import ServiceSelector from "../../components/ServiceSelector";

class Monitoring extends Component {
    render() {
        return (
            <main>
                <Jumbotron><h1>Monitoring</h1></Jumbotron>
                <Container>
                    <ServiceSelector/>
                    <hr className="my-3"/>
                    <MonthSelector/>
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
                            <td> </td>
                            <td>2%</td>
                            <td>99.99%</td>
                        </tr>
                        <tr className="table-warning">
                            <td>Middle</td>
                            <td>55ms</td>
                            <td> </td>
                            <td> </td>
                        </tr>
                        <tr className="table-danger">
                            <td>Low</td>
                            <td> </td>
                            <td> </td>
                            <td> </td>
                        </tr>
                        </tbody>
                    </Table>
                </Container>
            </main>
        )
    }
}

export default Monitoring
