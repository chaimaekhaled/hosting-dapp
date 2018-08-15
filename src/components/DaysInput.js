import React, {Component} from 'react';
import {Button, Input, InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap';


/*
    This component allows the selection of days with + and - buttons
 */
class DaysInput extends Component {

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