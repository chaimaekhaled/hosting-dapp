import React, {Component} from 'react';
import {
    Alert,
    Button,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    Jumbotron,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table
} from 'reactstrap';
import StoreCard from '../../components/StoreCard';
import DaysInput from '../../components/DaysInput';
import Web3 from 'web3';

const Sla = (props) => {
    if (props.service == null) {
        return (<Container><Alert>Select a service to show the SLA terms.</Alert></Container>)
    } else {
        return (
            <Container>
                <Row><Col><h3>SLA</h3></Col></Row>
                <Row><Col>
                    <Table className="table-responsive-sm">
                        <thead>
                        <tr>
                            <th>Goal</th>
                            <th>Availability</th>
                            <th>Refund</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>High</td>
                            <td>&ge;{props.service.sla[1]}%</td>
                        </tr>
                        <tr>
                            <td>Middle</td>
                            <td>&ge;{props.service.sla[2]}%</td>
                            <td>{props.service.sla[3]}%</td>
                        </tr>
                        <tr>
                            <td>Low</td>
                            <td>&lt;{props.service.sla[2]}%</td>
                            <td>{props.service.sla[4]}%</td>
                        </tr>
                        </tbody>
                    </Table>
                </Col></Row>
            </Container>
        );
    }


};


class Store extends Component {
    constructor(props) {
        super(props);
        this.handleClickOnStoreCard = this.handleClickOnStoreCard.bind(this);
        this.handleClickDaysSelection = this.handleClickDaysSelection.bind(this);
        this.handleClickBuyProduct = this.handleClickBuyProduct.bind(this);
        this.handlePubKeyChange = this.handlePubKeyChange.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.state = {
            activeStoreCardId: null,
            selectedProduct: null,
            selectedDays: 1,
            pubKey: "",
            modalServiceBought: false,
            lastTx: null,
            account: null,
        };
    }

    toggleModal() {
        this.setState({
            modalServiceBought: !this.state.modalServiceBought,
        })
    }

    handleClickOnStoreCard(id) {
        this.setState({
            activeStoreCardId: id,
            selectedProduct: this.props.products[id],
        })
    }

    handleClickDaysSelection(n) {
        let days = this.state.selectedDays + n >= 0 ? this.state.selectedDays + n : 0;
        this.setState({
            selectedDays: days,
        })
    }

    handlePubKeyChange(e) {
        this.setState({
            pubKey: e.target.value,
        })
    }

    handleClickBuyProduct() {
        let providerInstance = this.props.providerInstance;
        let pubKey = this.state.pubKey;

        let transferValue = this.state.selectedDays * this.state.selectedProduct.costPerDay;
        transferValue = Web3.utils.toWei(transferValue.toString(), "ether");

        console.log("Trying to buy product (id: " + this.state.selectedProduct.id + ") with value: " + transferValue);
        this.props.web3.eth.getAccounts((error, accounts) =>
            providerInstance.buyService.estimateGas(
                this.state.selectedProduct.id,
                pubKey,
                {from: accounts[0],}
            ).then(gasEstimate => {
                providerInstance.buyService(
                    this.state.selectedProduct.id,
                    pubKey,
                    {from: accounts[0], gas: 2 * gasEstimate, value: transferValue}
                ).catch(error => {
                    console.log("Error in tx buyService!");
                    console.log(error)
                }).then((txResultBuyService) => {
                    console.log("Succesfully bought a service with account: " + accounts[0]);
                    console.log(txResultBuyService);
                    this.setState({
                        lastTx: txResultBuyService,
                        account: accounts[0],
                    }, this.toggleModal)
                })
            }));
    }

    render() {
        let StoreCards;
        if (this.props.products === null || this.props.products === undefined) {
            console.log("props.products = null / undefined");
            StoreCards = <Col><Alert color="info">Products are being loaded...</Alert></Col>;
        } else if (this.props.products.length === 0) {
            console.log("props.products.length: " + this.props.products.length);
            StoreCards = <Col><Alert color="info">The provider does not offer any products.</Alert></Col>
        } else {
            StoreCards = this.props.products.map((product) =>
                <Col key={product.id}><StoreCard activeId={this.state.activeStoreCardId}
                                                 title={product.name}
                                                 id={product.id}
                                                 onClick={this.handleClickOnStoreCard}
                                                 details={product.details}
                                                 price={product.costPerDay}/></Col>)
        }

        let btn;
        if (this.state.activeStoreCardId === null) {
            btn = <Button id="orderButton" disabled className="btn-lg" block>Buy</Button>;
        } else {
            btn =
                <Button id="orderButton" color="primary" className="btn-lg" block onClick={this.handleClickBuyProduct}>
                    {this.state.selectedProduct.costPerDay * this.state.selectedDays + "ETH - Buy"}
                </Button>;
        }
        //TODO: move rowGrid to CSS
        const rowGrid = {marginBottom: 15 + 'px'};

        let modal = "";
        if (this.state.modalServiceBought) {
            modal = <Modal isOpen={this.state.modalServiceBought} toggle={this.toggleModal}>
                <ModalHeader>
                    Successfully bought {this.state.selectedProduct.name}
                </ModalHeader>
                <ModalBody>
                    Thank you for purchasing {this.state.selectedProduct.name} for {this.state.selectedDays} days.
                    Please note the following data:<br/>
                    <Table style={{tableLayout: "fixed"}}>
                        <tbody>
                        <tr>
                            <th scope="row">TX Hash</th>
                            <td style={{wordWrap: "break-word"}}>{this.state.lastTx.tx}</td>
                        </tr>
                        <tr>
                            <th scope="row">Block #</th>
                            <td style={{wordWrap: "break-word"}}>{this.state.lastTx.receipt.blockNumber}</td>
                        </tr>
                        <tr>
                            <th scope="row">cumGasUsed</th>
                            <td style={{wordWrap: "break-word"}}>{this.state.lastTx.receipt.cumulativeGasUsed}</td>
                        </tr>
                        <tr>
                            <th scope="row">Service Address</th>
                            <td style={{wordWrap: "break-word"}}>{this.state.lastTx.logs[1].address}</td>
                        </tr>
                        <tr>
                            <th scope="row">From Account</th>
                            <td style={{wordWrap: "break-word"}}>{this.state.account}</td>
                        </tr>
                        </tbody>
                    </Table>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.toggleModal}>Ok</Button>
                </ModalFooter>
            </Modal>
        }

        return (
            <React.Fragment>
                <Jumbotron>
                    <h1>Store</h1>
                </Jumbotron>

                <Container>
                    <Row><Col><h3>Select a Service</h3></Col></Row>
                    <hr className="my-3"/>
                    <Row className="flex-row flex-nowrap" style={{overflowX: 'auto'}}>
                        {StoreCards}
                    </Row>
                    <hr className="my-3"/>
                </Container>

                <Sla service={this.state.selectedProduct}/>

                <Container>
                    <Row><Col><h3>Details</h3></Col></Row>
                    <hr className="my-3"/>
                    <Form className="">
                        <FormGroup row className="justify-content-md-between">
                            <Col xs={12} sm={12} lg={6} style={rowGrid}>
                                <Row><Label for="sshkey" xs={3}>SSH Key</Label>
                                    <Col xs={9}>
                                        <Input type="textarea" name="sshkey" id="sshkey" placeholder=""
                                               value={this.state.pubKey} onChange={this.handlePubKeyChange}/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12} sm={6} lg={3} style={rowGrid}>
                                <DaysInput selectedDays={this.state.selectedDays}
                                           onClick={(n) => this.handleClickDaysSelection(n)}
                                           onChange={(e) => {
                                               let newDays = parseInt(e.target.value, 10);
                                               this.setState({selectedDays: newDays});
                                           }}/>

                            </Col>
                            <Col xs={12} sm={6} lg={3} className="align-content-md-end" style={rowGrid}>
                                {btn}
                            </Col>
                        </FormGroup>
                    </Form>
                </Container>
                {modal}

            </React.Fragment>
        )
    }
}

export default Store
