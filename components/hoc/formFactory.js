import React, { Component } from 'react';
import { Button, Form, FormText } from 'reactstrap';

import { toFloat } from '../../lib/converters';
import { isNumber } from '../../lib/validators';
import FormInputGroup from '../common/FormInputGroup';

const TYPES = {
  number: {
    inputType: 'number',
    validators: [isNumber()],
    converter: toFloat,
  },
};

export default ({
  fields,
  state = {},
  submit,
  subtitle,
  title,
  buttonInfo = {},
  WrapperComponent,
  fetchData = () => {},
}) => (
  class FormSuite extends Component {
    constructor(props) {
      super(props);
      this.state = Object.entries(fields).reduce(
        (result, [name, data]) => {
          result[name] = {
            value: data.default,
            type: data.type,
            error: null,
          };
          return result;
        }, {});
      Object.assign(this.state, state);
      this.state.formError = '';
    }

    async componentDidMount() {
      await fetchData.call(this);
    }

    onSubmit = async (event) => {
      event.preventDefault();
      const stateChanges = {};
      let hasError = false;
      const values = {};
      // set all values
      Object.entries(fields).forEach(([name, { type, converter }]) => {
        const valueHolder = { ...this.state[name] };
        stateChanges[name] = valueHolder;
        const { [type]: { converter: typeConverter } = {} } = TYPES;
        if (converter) {
          values[name] = converter(valueHolder.value);
        } else if (typeConverter) {
          values[name] = typeConverter(valueHolder.value);
        } else {
          values[name] = valueHolder.value;
        }
      });
      // run validators
      Object.entries(fields).forEach(([name, { type, validators = [] }]) => {
        let error = false;
        const valueHolder = { ...this.state[name] };
        stateChanges[name] = valueHolder;
        const { [type]: { validators: typeValidators = [] } = {} } = TYPES;
        [...typeValidators, ...validators].some((validator) => {
          error = validator(valueHolder.value, values);
          return error;
        });
        valueHolder.error = error;
        hasError = hasError || Boolean(error);
      });
      if (hasError) {
        this.setState({
          ...this.state,
          ...stateChanges,
          formError: 'The form has errors. Fix them and retry.',
        });
        return;
      }
      try {
        const newValueObject = await submit.call(this, values, this.props);
        if (!newValueObject) {
          const newFieldState = Object.entries(fields).reduce(
            (result, [name, data]) => {
              result[name] = {
                value: data.default,
                type: data.type,
                error: null,
              };
              return result;
            }, {});
          this.setState({ ...this.state, ...newFieldState, formError: '' });
        } else {
          this.setValuesForValueHolders(newValueObject, { formError: '' });
        }
        const { onAfterSubmit } = this.props;
        if (onAfterSubmit) {
          onAfterSubmit();
        }
      } catch (err) {
        this.handleServerError(err);
      }
    };

    setValuesForValueHolders(valueObject, extraState) {
      const newState = Object.entries(valueObject).reduce((result, [fieldName, fieldValue]) => {
        const valueHolder = this.state[fieldName];
        if (valueHolder) {
          valueHolder.value = fieldValue;
          result[fieldName] = valueHolder;
        }
        return result;
      }, {});
      this.setState({ ...this.state, ...newState, ...extraState });
    }

    setValueForValueHolder(fieldName, value) {
      const valueHolder = this.state[fieldName];
      if (valueHolder) {
        valueHolder.value = value;
        this.setState({ ...this.state, [fieldName]: valueHolder });
      }
    }

    handleChange = (valueHolder, name) => {
      const { onChangeValue } = fields[name];
      if (onChangeValue) {
        onChangeValue(valueHolder.value, this);
      }
      this.setState({ [name]: valueHolder });
    };

    handleServerError(err) {
      // clean field error state
      const newFieldState = Object.entries(fields).reduce(
        (result, [name]) => {
          const { value } = this.state[name];
          result[name] = { value, error: null };
          return result;
        }, {});
      this.setState({ ...this.state, ...newFieldState });

      let showFormError = false;
      const stateChanges = {};
      if (err.error === 'ValidationError' && err.details) {
        // trying to pass error to field controls
        Object.entries(err.details).forEach(([key, value]) => {
          if (this.state[key]) {
            stateChanges[key] = { ...this.state[key], error: value.message };
          } else {
            showFormError = true;
          }
        });
      } else {
        showFormError = true;
      }
      this.setState({
        ...this.state,
        ...stateChanges,
        formError: showFormError ? err.message || err.error_description : false,
      });
    }

    render() {
      const { formError } = this.state;
      const formBody = Object.entries(fields).map(([name, {
        inputType,
        label,
        hint,
        placeholder,
        type,
        WrapperComponent: InputWrapperComponentData,
        validators,
        default: defaultValue,
        onChangeValue,
        render,
        ...restProps
      }]) => {
        const InputWrapperComponent = Array.isArray(InputWrapperComponentData) ?
          InputWrapperComponentData[0] : InputWrapperComponentData;
        const inputWrapperComponentParams = Array.isArray(InputWrapperComponentData) ?
          InputWrapperComponentData[1] : {};
        const props = {
          key: name,
          inputType: inputType || (TYPES[type] || {}).inputType || 'string',
          name,
          label,
          hint,
          placeholder,
          valueHolder: this.state[name],
          handler: this.handleChange,
          ...restProps,
        };
        const input = render ? render(FormInputGroup, props, this) : <FormInputGroup {...props} />;
        return InputWrapperComponent ?
          <InputWrapperComponent key={name} {...inputWrapperComponentParams}>
            {input}
          </InputWrapperComponent> :
          input;
      });
      const { ButtonWrapperComponentData } = buttonInfo;
      const ButtonWrapperComponent = Array.isArray(ButtonWrapperComponentData) ?
        ButtonWrapperComponentData[0] : ButtonWrapperComponentData;
      const buttonWrapperComponentParams = Array.isArray(ButtonWrapperComponentData) ?
        ButtonWrapperComponentData[1] : {};
      const button = (
        <div className="submit-button-container" key="submitButton">
          <Button className="submit-button" outline color="primary">
            {buttonInfo.buttonName || 'Submit'}
          </Button>
        </div>
      );
      formBody.push(
        ButtonWrapperComponent ?
          <ButtonWrapperComponent key="submitButton" {...buttonWrapperComponentParams}>
            {button}
          </ButtonWrapperComponent> :
          button,
      );
      return (
        <Form onSubmit={this.onSubmit}>
          {title && <h2 className="form-title">{title}</h2>}
          {subtitle && <div className="form-subtitle">{subtitle}</div>}
          {WrapperComponent ? <WrapperComponent>{formBody}</WrapperComponent> : formBody}
          {formError && <FormText className="invalid-form-feedback">{formError}</FormText>}
        </Form>
      );
    }
  }
);
