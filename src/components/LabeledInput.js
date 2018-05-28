import React, {Component} from 'react';
import {Col, Input, Label, Row} from 'reactstrap';

class LabeledInput extends Component {
    /*  constructor(props) {
          super(props);
      };
  */
    render() {
        let options = null;
        if (this.props.type === "select" && typeof this.props.options !== undefined && this.props.options.length > 0) {
            options = this.props.options.map(option => <option value={option.value}
                                                               key={option.value}>{option.text}</option>);
        }
        let min = null;
        let max = null;
        if (typeof this.props.min !== undefined) min = this.props.min;
        if (typeof this.props.max !== undefined) max = this.props.max;

        return (
            <Row>
                <Label xs={12} md={4} for={this.props.InputId}><h5>{this.props.labelText}</h5></Label>
                <Col xs={12} md={8}>
                    <Input id={this.props.inputId} onChange={this.props.onChange} type={this.props.type}
                           value={this.props.value} min={min} max={max}>
                        {options}
                    </Input>
                </Col>
            </Row>
        )
    }
}

export default LabeledInput;