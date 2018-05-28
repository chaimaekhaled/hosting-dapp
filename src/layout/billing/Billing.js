import React, {Component} from 'react';
import {Col, Container, Jumbotron, Row, Table} from 'reactstrap';
import MonthSelector from "../../components/MonthSelector";
import ServiceSelector from "../../components/ServiceSelector";

function BillCalculation(props) {
    console.log(props);
    return (
        <Container>
            <Row>
                <Col xs={12} lg={4}><h3>Bill Calculation</h3></Col>
                <Col xs={12} lg={8}>
                    <MonthSelector {...props}/>
                </Col>
            </Row>
            <Table className="table-responsive-sm">
                <thead className="thead-light">
                <tr>
                    <th>Goal</th>
                    <th>Compliance</th>
                    <th>Cost</th>
                    <th>Refund</th>
                    <th>Sum</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>High</td>
                    <td>{props.info.compliance[2]}%</td>
                    <td>{props.info.cost[2]} ETH</td>
                    <td>{props.info.refund[2]} ETH</td>
                </tr>
                <tr>
                    <td>Middle</td>
                    <td>{props.info.compliance[1]}%</td>
                    <td>{props.info.cost[1]} ETH</td>
                    <td>{props.info.refund[1]} ETH</td>
                </tr>
                <tr>
                    <td>Low</td>
                    <td>{props.info.compliance[0]}%</td>
                    <td>{props.info.cost[0]} ETH</td>
                    <td>{props.info.refund[0]} ETH</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{props.info.sum} ETH</td>
                </tr>
                </tbody>
            </Table>
        </Container>
    )
}

class Billing extends Component {
    constructor(props) {
        super(props);
        const today = new Date().toISOString().slice(0, 10);
        this.state = {
            selectedService: props.data[0],
            selectedServiceId: 0,
            fromDate: this.props.fromDate ? this.props.fromDate : today,
            untilDate: this.props.untilDate ? this.props.untilDate : today,
            compliance: [0],
            cost: [0],
            refund: [0],
            sum: 0,
        };
        this.handleServiceChanged = this.handleServiceChanged.bind(this);
        this.handleDateChanged = this.handleDateChanged.bind(this);
    }

    componentDidMount() {
        this.calculateComplianceAndCost(this.state.fromDate, this.state.untilDate, this.state.selectedService);
    }

    calculateComplianceAndCost(fromDate, untilDate, selectedService) {
        const round = (number, precision) => {
            let shift = function (number, precision) {
                let numArray = ("" + number).split("e");
                return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
            };
            return shift(Math.round(shift(number, +precision)), -precision);
        }; //https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Math/round#Eine_Bessere_L%C3%B6sung

        let fromIndex = ((new Date(fromDate)).getTime()
            - (new Date(selectedService.startDate).getTime())) / 86400000;
        let untilIndex = 1 + ((new Date(untilDate)).getTime()
            - (new Date(selectedService.startDate).getTime())) / 86400000;
        console.log("FromIndex: " + fromIndex);
        console.log("UntilIndex: " + untilIndex);
        // console.log(this.state.selectedService.startDate);
        let sla = selectedService.sla;
        //  sla = [_metric, _highGoal, _middleGoal, _refundMiddle, _refundLow];
        let availabilities = selectedService.availability.slice(fromIndex, untilIndex);
        let count = [0, 0, 0]; // low, middle, high
        for (let i = 0; i < availabilities.length; i++) {
            if (availabilities[i] > sla[1]) {
                count[2]++;   // highGoal achieved
            } else if (availabilities[i] > sla[2]) {
                count[1]++;   // middleGoal achieved
            } else {
                count[0]++;  // lowGoal achieved
            }
        }
        let newCompliance = [
            round(100 * count[0] / availabilities.length, 2), // LOW
            round(100 * count[1] / availabilities.length, 2),       // MIDDLE
            round(100 * count[2] / availabilities.length, 2)];  // HIGH
        let newCost = [
            round(count[0] * selectedService.costPerDay * (100 - sla[4]) / 100, 2),
            round(count[1] * selectedService.costPerDay * (100 - sla[3]) / 100, 2),
            round(count[2] * selectedService.costPerDay, 2),
        ];
        let newRefund = [
            round(count[0] * selectedService.costPerDay * sla[4] / 100, 2),
            round(count[1] * selectedService.costPerDay * sla[3] / 100, 2),
            0,
        ];
        let newSum = newCost.reduce((pv, cv) => pv + cv);
        this.setState({
            compliance: newCompliance,
            cost: newCost,
            refund: newRefund,
            sum: newSum,
        })
    }

    handleServiceChanged(e) {
        const id = parseInt(e.target.value, 10);
        let selectedService = this.props.data[id];
        this.setState({
            selectedServiceId: id,
            selectedService: selectedService,
        });
        console.log("New ServiceContract selected: " + id);
        this.calculateComplianceAndCost(this.state.fromDate, this.state.untilDate, selectedService);
        //this.props.onChange(id);
    }

    handleDateChanged(e) {
        const newDate = e.target.value;
        switch (e.target.id) {
            case "fromSelector":
                if (newDate > this.state.untilDate) break;
                this.setState({fromDate: newDate});
                this.calculateComplianceAndCost(newDate, this.state.untilDate, this.state.selectedService);
                break;
            case "untilSelector":
                if (newDate < this.state.fromDate) break;
                this.setState({untilDate: newDate});
                this.calculateComplianceAndCost(this.state.fromDate, newDate, this.state.selectedService);
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

        return (
            <main>
                <Jumbotron><h1>Billing</h1></Jumbotron>
                <Container>
                    <ServiceSelector {...this.props} selectedService={this.state.selectedService}
                                     onChange={this.handleServiceChanged}
                                     value={this.state.selectedServiceId}/>
                    <hr className="my-3"/>
                    {/*<MonthSelector data={this.props.data} onChange={() => {*/}
                    {/*}}/>*/}
                    <hr className="my-3"/>
                    <BillCalculation selectedService={this.state.selectedService}
                                     fromDate={this.state.fromDate} untilDate={this.state.untilDate}
                                     onDateChanged={this.handleDateChanged}
                                     info={this.state}/>
                    <hr className="my-3"/>

                    {/*<Row style={rowGrid}>
                        <Col xs={8} sm={6} md={{size: 4, offset: 6}} lg={{size: 3, offset: 7}}>Total bill of all
                            services: </Col>
                        <Col className="ml-auto col-auto">72 ETH</Col>
                    </Row>*/}
                </Container>
            </main>
        )
    }
}

export default Billing;
