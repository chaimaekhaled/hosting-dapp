import React, {Component} from 'react';
import {Alert, Button, Col, Container, Jumbotron, Row, Table} from 'reactstrap';
import MonthSelector from "../../components/MonthSelector";
import ServiceSelector from "../../components/ServiceSelector";
import Service from "../../contracts/Service.json";
import LabeledInput from '../../components/LabeledInput';

const contract = require('truffle-contract');

const BillCalculation = (props) => {
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
};

class Billing extends Component {
    constructor(props) {
        super(props);
        const today = new Date().toISOString().slice(0, 10);
        let contracts = this.props.serviceContracts.length > 0 ? this.props.serviceContracts[0] : null;
        this.state = {
            selectedService: contracts,
            selectedServiceId: null,
            fromDate: today,
            untilDate: today,
            compliance: [0],
            cost: [0],
            refund: [0],
            sum: 0,
            monitoringDataRaw: "",
            monitoringData: null,
            generatedHash: 0,
            v: 0,
            r: 0,
            s: 0,
        };
        this.handleServiceChanged = this.handleServiceChanged.bind(this);
        this.handleDateChanged = this.handleDateChanged.bind(this);
        this.handleBuyWithdrawClicked = this.handleBuyWithdrawClicked.bind(this);
        this.generateHash = this.generateHash.bind(this);
        this.handleHashChanged = this.handleHashChanged.bind(this);
        this.submitMonitoringData = this.submitMonitoringData.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        // if there are serviceContracts in the nextProps and the state.selectedService is null,
        // set the selected service to the first contract of nextProps
        if (nextProps.serviceContracts.length > 0 && this.state.selectedService === null) {
            console.log(nextProps);
            this.setState({
                selectedService: nextProps.serviceContracts[0],
                selectedServiceId: nextProps.serviceContracts[0].id,
                fromDate: nextProps.serviceContracts[0].startDate,
                untilDate: nextProps.serviceContracts[0].endDate,
            }, () => this.calculateComplianceAndCost(
                this.state.fromDate,
                this.state.untilDate,
                this.state.selectedService));
            return true;
        } else if (nextProps.serviceContracts.length > this.props.serviceContracts.length) {
            return true;
        }
        return true;
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
        let selectedService = this.props.serviceContracts[id];
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

    handleBuyWithdrawClicked(selectedDays) {
        // buy or withdraw?
        let ServiceC = contract(Service);
        ServiceC.setProvider(this.props.web3.currentProvider);
        if (typeof ServiceC.currentProvider.sendAsync !== "function") {
            ServiceC.currentProvider.sendAsync = function () {
                return ServiceC.currentProvider.send.apply(
                    ServiceC.currentProvider, arguments
                );
            };
        }
        let serviceContractInstance = ServiceC.at(this.state.selectedService.hash);
        let transferValue = selectedDays * this.state.selectedService.costPerDay;
        if (selectedDays > 0) {
            // deposit ether to contract
            this.props.web3.eth.getAccounts((error, accounts) =>
                serviceContractInstance.deposit({from: accounts[0], value: transferValue}))
                .then((balance) => console.log("Extended contract."))
        } else if (selectedDays < 0) {
            // Withdraw ether from contract
            this.props.web3.eth.getAccounts((error, accounts) => {
                console.log("Trying to withdraw with account: " + accounts[0]);
                serviceContractInstance.withdraw(-1 * transferValue, {from: accounts[0]})
                    .catch(error => {
                        let err = error;
                        console.log(err);
                    })
            })
        }
    }

    handleHashChanged(e) {
        switch (e.target.id) {
            case "generatedHash":
                this.setState({generatedHash: e.target.value});
                break;
            case "inputV":
                this.setState({v: e.target.value});
                break;
            case "inputR":
                this.setState({r: e.target.value});
                break;
            case "inputS":
                this.setState({s: e.target.value});
                break;
            case "monitoringData":
                this.setState({monitoringDataRaw: e.target.value});
                break;
            default:
                break;
        }
    }

    generateHash() {
        if (this.state.monitoringDataRaw === "") return;
        const monitoringData = this.state.monitoringDataRaw.split(",").map(function (x) {
            return parseInt(x, 10);
        });
        let hash = this.props.web3.utils.soliditySha3({t: 'address', v: this.state.selectedService.hash}, {
            t: 'uint[]',
            v: monitoringData
        });
        console.log(hash);
        //let signedHash = null;
        this.props.web3.eth.getAccounts((error, accounts) => {
            this.props.web3.eth.sign(hash, accounts[0]).then((signedHash) => {
                let r = signedHash.slice(0, 66);
                let s = '0x' + signedHash.slice(66, 130);
                let v = this.props.web3.utils.hexToNumber('0x' + signedHash.slice(130, 132));
                if (v < 2) v = v + 27;
                this.setState({v: v, r: r, s: s, generatedHash: hash, monitoringData: monitoringData})
            })
        });
    }

    submitMonitoringData() {
        let ServiceC = contract(Service);
        ServiceC.setProvider(this.props.web3.currentProvider);
        if (typeof ServiceC.currentProvider.sendAsync !== "function") {
            ServiceC.currentProvider.sendAsync = function () {
                return ServiceC.currentProvider.send.apply(
                    ServiceC.currentProvider, arguments
                );
            };
        }
        let serviceContractInstance = ServiceC.at(this.state.selectedService.hash);
        this.props.web3.eth.getAccounts((error, accounts) =>
            serviceContractInstance.addAvailabilityData(this.state.generatedHash, this.state.v, this.state.r, this.state.s, this.state.monitoringData, {from: accounts[0]})
                .catch(error => {
                    console.log(error);
                })
        )
        //     function addAvailabilityData(bytes32 h, uint8 v, bytes32 r, bytes32 s, uint[] availabilityData) public {
    }


    render() {
        const rowGrid = {marginBottom: 15 + 'px'};

        let content = <Container><Alert>Please wait until services have been retrieved...</Alert></Container>;
        if (this.state.selectedService !== null) {
            content = <Container>
                <ServiceSelector serviceContracts={this.props.serviceContracts}
                                 selectedService={this.state.selectedService}
                                 onChange={this.handleServiceChanged}
                                 onClick={this.handleBuyWithdrawClicked}
                                 value={this.state.selectedServiceId}/>
                <hr className="my-3"/>
                <BillCalculation selectedService={this.state.selectedService}
                                 fromDate={this.state.fromDate} untilDate={this.state.untilDate}
                                 onDateChanged={this.handleDateChanged}
                                 info={this.state}/>
                <hr className="my-3"/>
                <Container>
                    <Row><Col><h3>Generate hash for monitoring data</h3></Col></Row>
                    <Row>
                        <Col>
                            Please input the monitoring data (separate values with comma)
                        </Col>
                    </Row>
                    <Row>
                        <Col style={rowGrid}>
                            <LabeledInput inputId="monitoringData" type="text" labelText="Monitoring data"
                                          value={this.state.monitoringDataRaw}
                                          onChange={this.handleHashChanged}/>
                        </Col>
                    </Row>
                    <Row style={rowGrid}>
                        <Col xs={8} md={{size: 6, offset: 6}}>
                            <Button id="generateHashBtn" color="primary" className="" block onClick={this.generateHash}>
                                Generate signed Hash
                            </Button>
                        </Col>
                    </Row>
                    <Row style={rowGrid}>
                        <Col xs={12}
                             style={{textAlign: "right", marginBottom: 15 + 'px'}}>
                            <LabeledInput inputId="generatedHash" type="text" labelText={"Hash"}
                                          value={this.state.generatedHash} onChange={this.handleHashChanged}/>
                        </Col>
                        <Col xs={12} md={{size: 8, offset: 4}}>
                            <LabeledInput inputId="inputV" type="text" labelText={"v"}
                                          value={this.state.v} onChange={this.handleHashChanged}/>
                        </Col>
                        <Col xs={12} md={{size: 8, offset: 4}}>
                            <LabeledInput inputId="inputR" type="text" labelText={"r"}
                                          value={this.state.r} onChange={this.handleHashChanged}/>
                        </Col>
                        <Col xs={12} md={{size: 8, offset: 4}}>
                            <LabeledInput inputId="inputS" type="text" labelText={"s"}
                                          value={this.state.s} onChange={this.handleHashChanged}/>
                        </Col>
                    </Row>
                    <Row style={rowGrid}>
                        <Col xs={8} md={{size: 6, offset: 6}}>
                            <Button id={"submitMonitoringData"} color={"primary"} block
                                    onClick={this.submitMonitoringData}>Submit to Smart Contract</Button>
                        </Col>
                    </Row>
                </Container>
            </Container>
        }

        return (
            <main>
                <Jumbotron><h1>Billing</h1></Jumbotron>
                {content}
            </main>
        )
    }
}

export default Billing;
