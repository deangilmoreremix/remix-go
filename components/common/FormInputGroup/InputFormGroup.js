import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormFeedback, FormGroup, FormText, Input, Label } from 'reactstrap';

export default class InputFormGroup extends Component {
    static propTypes = {
      handler: PropTypes.func.isRequired,
      hint: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      inputType: PropTypes.string,
      label: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.bool.isRequired]),
      name: PropTypes.string.isRequired,
      placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      valueHolder: PropTypes.shape({
        error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        type: PropTypes.any,
        value: PropTypes.any,
      }).isRequired,
      step: PropTypes.number,
    };

    static defaultProps = {
      inputType: 'text',
    };

    handleChange = (event) => {
      const { name, handler, valueHolder } = this.props;
      const { value } = event.target;
      handler({ ...valueHolder, value }, name);
    };

    renderInput() {
      const {
        name,
        label,
        placeholder = label,
        valueHolder,
        inputType,
        step,
      } = this.props;
      return (
        <Input
          type={inputType}
          id={name}
          name={name}
          placeholder={placeholder}
          valid={!valueHolder.error}
          value={valueHolder.value || ''}
          onChange={this.handleChange}
          step={step}
        />
      );
    }

    render() {
      const {
        name,
        label,
        placeholder = label,
        hint = placeholder,
        valueHolder,
        inputType, handler,
        ...restProps
      } = this.props;
      return (
        <FormGroup {...restProps}>
          {label && <Label for={name}>{label}</Label>}
          {this.renderInput()}
          <FormFeedback>
            {valueHolder.error}
          </FormFeedback>
          {hint && <FormText color="muted">{hint}</FormText>}
        </FormGroup>
      );
    }
}
