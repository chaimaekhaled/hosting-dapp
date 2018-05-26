import React, {Component} from 'react';
import {Button, Input, InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap';

class DaysInput extends Component {

    /*
    props.selectedDays;
    props.onClick();
    props.onChange();

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.selectedDays !== undefined ? this.props.selectedDays : 0,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            value: parseInt(e.target.value, 10),
        });
        this.props.onChange(this.state.value);
    }*/

    render() {
        let info = {
            color: '#fff',
            backgroundColor: '#138496',
            borderColor: '#117a8b'
        };

        return (
            <InputGroup>
                <InputGroupAddon addonType="prepend">
                    <InputGroupText style={info}>Days</InputGroupText>
                    <Button color="primary" onClick={() => {
                        this.props.onClick(-1);
                    }}>-</Button>
                </InputGroupAddon>
                <Input value={this.props.selectedDays} onChange={this.props.onChange} type="number"/>
                <InputGroupAddon addonType="append">
                    <Button color="primary" onClick={() => {
                        this.props.onClick(+1)
                    }}>+</Button>
                </InputGroupAddon>
            </InputGroup>
        )
    }
}

export default DaysInput;