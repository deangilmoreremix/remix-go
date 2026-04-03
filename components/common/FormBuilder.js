import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

@inject('store')
@observer
export default class FormBuilder extends Component {
  @observable
  formConfig = {
    title: 'Contact Us',
    description: 'Get in touch with our team',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
        validation: {
          minLength: 2,
          maxLength: 50
        }
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email address',
        required: true,
        validation: {
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
        }
      },
      {
        id: 'message',
        type: 'textarea',
        label: 'Message',
        placeholder: 'Tell us how we can help you',
        required: true,
        validation: {
          minLength: 10,
          maxLength: 500
        }
      }
    ],
    styling: {
      layout: 'stacked', // stacked, inline, grid
      theme: 'light', // light, dark, custom
      borderRadius: '8px',
      spacing: '16px',
      backgroundColor: '#ffffff',
      borderColor: '#e9ecef',
      textColor: '#212529',
      labelColor: '#495057'
    },
    actions: {
      submitText: 'Send Message',
      submitStyle: 'primary',
      showReset: false,
      resetText: 'Reset Form',
      redirectUrl: '',
      successMessage: 'Thank you! Your message has been sent successfully.',
      errorMessage: 'There was an error sending your message. Please try again.'
    },
    integrations: {
      emailService: '', // mailchimp, sendgrid, etc.
      webhookUrl: '',
      googleSheets: false,
      spreadsheetId: '',
      airtable: false,
      baseId: '',
      tableName: ''
    }
  };

  @observable
  activeTab = 'fields';

  @observable
  selectedFieldIndex = -1;

  @observable
  isPreviewMode = true;

  @observable
  formData = {};

  fieldTypes = [
    { id: 'text', name: 'Text Input', icon: 'fa-font' },
    { id: 'email', name: 'Email', icon: 'fa-envelope' },
    { id: 'password', name: 'Password', icon: 'fa-lock' },
    { id: 'number', name: 'Number', icon: 'fa-hashtag' },
    { id: 'tel', name: 'Phone', icon: 'fa-phone' },
    { id: 'url', name: 'URL', icon: 'fa-link' },
    { id: 'textarea', name: 'Text Area', icon: 'fa-paragraph' },
    { id: 'select', name: 'Select Dropdown', icon: 'fa-chevron-down' },
    { id: 'radio', name: 'Radio Buttons', icon: 'fa-dot-circle' },
    { id: 'checkbox', name: 'Checkboxes', icon: 'fa-check-square' },
    { id: 'date', name: 'Date Picker', icon: 'fa-calendar' },
    { id: 'file', name: 'File Upload', icon: 'fa-upload' },
    { id: 'hidden', name: 'Hidden Field', icon: 'fa-eye-slash' }
  ];

  validationRules = [
    { id: 'required', name: 'Required', type: 'boolean' },
    { id: 'minLength', name: 'Minimum Length', type: 'number' },
    { id: 'maxLength', name: 'Maximum Length', type: 'number' },
    { id: 'pattern', name: 'Pattern (Regex)', type: 'text' },
    { id: 'min', name: 'Minimum Value', type: 'number' },
    { id: 'max', name: 'Maximum Value', type: 'number' },
    { id: 'email', name: 'Email Format', type: 'boolean' },
    { id: 'url', name: 'URL Format', type: 'boolean' }
  ];

  @action
  updateFormConfig = (path, value) => {
    const keys = path.split('.');
    let current = this.formConfig;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
  };

  @action
  setActiveTab = (tab) => {
    this.activeTab = tab;
  };

  @action
  selectField = (index) => {
    this.selectedFieldIndex = index;
  };

  @action
  addField = (fieldType) => {
    const newField = {
      id: `field_${Date.now()}`,
      type: fieldType,
      label: `New ${fieldType} field`,
      placeholder: `Enter ${fieldType}`,
      required: false,
      validation: {}
    };

    // Add field-specific properties
    switch (fieldType) {
      case 'select':
      case 'radio':
      case 'checkbox':
        newField.options = ['Option 1', 'Option 2', 'Option 3'];
        break;
      case 'textarea':
        newField.rows = 4;
        break;
      case 'file':
        newField.accept = '*/*';
        newField.multiple = false;
        break;
    }

    this.formConfig.fields.push(newField);
    this.selectedFieldIndex = this.formConfig.fields.length - 1;
  };

  @action
  removeField = (index) => {
    this.formConfig.fields.splice(index, 1);
    if (this.selectedFieldIndex === index) {
      this.selectedFieldIndex = -1;
    } else if (this.selectedFieldIndex > index) {
      this.selectedFieldIndex--;
    }
  };

  @action
  moveField = (fromIndex, toIndex) => {
    const field = this.formConfig.fields.splice(fromIndex, 1)[0];
    this.formConfig.fields.splice(toIndex, 0, field);
    this.selectedFieldIndex = toIndex;
  };

  @action
  updateField = (index, property, value) => {
    if (property.includes('.')) {
      const [parent, child] = property.split('.');
      if (!this.formConfig.fields[index][parent]) {
        this.formConfig.fields[index][parent] = {};
      }
      this.formConfig.fields[index][parent][child] = value;
    } else {
      this.formConfig.fields[index][property] = value;
    }
  };

  @action
  duplicateField = (index) => {
    const field = { ...this.formConfig.fields[index] };
    field.id = `field_${Date.now()}`;
    field.label = `${field.label} (Copy)`;
    this.formConfig.fields.splice(index + 1, 0, field);
    this.selectedFieldIndex = index + 1;
  };

  @action
  togglePreview = () => {
    this.isPreviewMode = !this.isPreviewMode;
  };

  @action
  updateFormData = (fieldId, value) => {
    this.formData[fieldId] = value;
  };

  @action
  submitForm = () => {
    // Validate form
    const errors = this.validateForm();
    if (errors.length === 0) {
      // Submit form data
      console.log('Form submitted:', this.formData);
      if (this.props.onFormSubmit) {
        this.props.onFormSubmit(this.formData);
      }
    } else {
      console.log('Validation errors:', errors);
    }
  };

  @action
  resetForm = () => {
    this.formData = {};
  };

  validateForm = () => {
    const errors = [];

    this.formConfig.fields.forEach((field, index) => {
      const value = this.formData[field.id] || '';

      // Required validation
      if (field.required && (!value || value.toString().trim() === '')) {
        errors.push(`${field.label} is required`);
        return;
      }

      // Skip other validations if field is empty and not required
      if (!field.required && (!value || value.toString().trim() === '')) {
        return;
      }

      // Type-specific validations
      if (field.validation) {
        const { minLength, maxLength, pattern, min, max } = field.validation;

        if (minLength && value.length < minLength) {
          errors.push(`${field.label} must be at least ${minLength} characters`);
        }

        if (maxLength && value.length > maxLength) {
          errors.push(`${field.label} must be no more than ${maxLength} characters`);
        }

        if (pattern && !new RegExp(pattern).test(value)) {
          errors.push(`${field.label} format is invalid`);
        }

        if (field.type === 'number') {
          const numValue = parseFloat(value);
          if (min !== undefined && numValue < min) {
            errors.push(`${field.label} must be at least ${min}`);
          }
          if (max !== undefined && numValue > max) {
            errors.push(`${field.label} must be no more than ${max}`);
          }
        }

        if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`${field.label} must be a valid email address`);
        }

        if (field.type === 'url' && !/^https?:\/\/.+/.test(value)) {
          errors.push(`${field.label} must be a valid URL`);
        }
      }
    });

    return errors;
  };

  @action
  applyForm = () => {
    if (this.props.onFormApply) {
      this.props.onFormApply(this.formConfig);
    }
  };

  @action
  resetToDefault = () => {
    this.formConfig = {
      title: 'Contact Us',
      description: 'Get in touch with our team',
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
          validation: { minLength: 2, maxLength: 50 }
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email address',
          required: true,
          validation: { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' }
        },
        {
          id: 'message',
          type: 'textarea',
          label: 'Message',
          placeholder: 'Tell us how we can help you',
          required: true,
          validation: { minLength: 10, maxLength: 500 }
        }
      ],
      styling: {
        layout: 'stacked',
        theme: 'light',
        borderRadius: '8px',
        spacing: '16px',
        backgroundColor: '#ffffff',
        borderColor: '#e9ecef',
        textColor: '#212529',
        labelColor: '#495057'
      },
      actions: {
        submitText: 'Send Message',
        submitStyle: 'primary',
        showReset: false,
        resetText: 'Reset Form',
        redirectUrl: '',
        successMessage: 'Thank you! Your message has been sent successfully.',
        errorMessage: 'There was an error sending your message. Please try again.'
      },
      integrations: {
        emailService: '',
        webhookUrl: '',
        googleSheets: false,
        spreadsheetId: '',
        airtable: false,
        baseId: '',
        tableName: ''
      }
    };
    this.selectedFieldIndex = -1;
    this.formData = {};
  };

  renderPreview() {
    const { styling } = this.formConfig;

    return (
      <div className="form-preview-container">
        <div
          className="form-preview"
          style={{
            backgroundColor: styling.backgroundColor,
            border: `1px solid ${styling.borderColor}`,
            borderRadius: styling.borderRadius,
            padding: '24px',
            color: styling.textColor
          }}
        >
          {this.formConfig.title && (
            <h3 style={{
              margin: '0 0 8px 0',
              color: styling.textColor,
              fontSize: '24px',
              fontWeight: '600'
            }}>
              {this.formConfig.title}
            </h3>
          )}

          {this.formConfig.description && (
            <p style={{
              margin: '0 0 24px 0',
              color: styling.labelColor,
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              {this.formConfig.description}
            </p>
          )}

          <form
            className={`form-fields layout-${styling.layout}`}
            style={{ gap: styling.spacing }}
          >
            {this.formConfig.fields.map((field, index) => (
              <div key={field.id} className="form-field">
                <label
                  style={{
                    display: 'block',
                    marginBottom: '4px',
                    color: styling.labelColor,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {field.label}
                  {field.required && <span style={{ color: '#dc3545' }}> *</span>}
                </label>

                {this.renderFieldPreview(field, index)}
              </div>
            ))}
          </form>

          <div className="form-actions" style={{ marginTop: '24px' }}>
            <button
              type="button"
              onClick={this.submitForm}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              {this.formConfig.actions.submitText}
            </button>

            {this.formConfig.actions.showReset && (
              <button
                type="button"
                onClick={this.resetForm}
                style={{
                  backgroundColor: 'transparent',
                  color: styling.labelColor,
                  border: '1px solid #ced4da',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginLeft: '12px'
                }}
              >
                {this.formConfig.actions.resetText}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  renderFieldPreview(field, index) {
    const value = this.formData[field.id] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'url':
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => this.updateFormData(field.id, e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => this.updateFormData(field.id, e.target.value)}
            rows={field.rows || 4}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: 'white',
              resize: 'vertical'
            }}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => this.updateFormData(field.id, e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {field.options?.map((option, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => this.updateFormData(field.id, e.target.value)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        if (field.options && field.options.length > 1) {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {field.options.map((option, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    value={option}
                    checked={(value || []).includes(option)}
                    onChange={(e) => {
                      const currentValues = value || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter(v => v !== option);
                      this.updateFormData(field.id, newValues);
                    }}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          );
        } else {
          return (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => this.updateFormData(field.id, e.target.checked)}
              />
              <span>{field.label}</span>
            </label>
          );
        }

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => this.updateFormData(field.id, e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          />
        );

      case 'file':
        return (
          <input
            type="file"
            accept={field.accept}
            multiple={field.multiple}
            onChange={(e) => {
              const files = Array.from(e.target.files);
              this.updateFormData(field.id, field.multiple ? files : files[0]);
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          />
        );

      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  }

  render() {
    const { className } = this.props;

    return (
      <div className={classnames('form-builder', className)}>
        <div className="builder-header">
          <h2>Form Builder</h2>
          <div className="header-actions">
            <button className="action-btn" onClick={this.togglePreview}>
              <i className={`fa ${this.isPreviewMode ? 'fa-edit' : 'fa-eye'}`} />
              {this.isPreviewMode ? 'Edit' : 'Preview'}
            </button>
            <button className="action-btn" onClick={this.resetToDefault}>
              <i className="fa fa-refresh" /> Reset
            </button>
            <button className="action-btn primary" onClick={this.applyForm}>
              <i className="fa fa-plus" /> Add Form
            </button>
          </div>
        </div>

        <div className="builder-content">
          <div className="builder-tabs">
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'fields' })}
              onClick={() => this.setActiveTab('fields')}
            >
              <i className="fa fa-list" /> Fields
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'settings' })}
              onClick={() => this.setActiveTab('settings')}
            >
              <i className="fa fa-cog" /> Settings
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'styling' })}
              onClick={() => this.setActiveTab('styling')}
            >
              <i className="fa fa-paint-brush" /> Styling
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'actions' })}
              onClick={() => this.setActiveTab('actions')}
            >
              <i className="fa fa-mouse-pointer" /> Actions
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'integrations' })}
              onClick={() => this.setActiveTab('integrations')}
            >
              <i className="fa fa-plug" /> Integrations
            </button>
          </div>

          <div className="builder-panel">
            {this.activeTab === 'fields' && this.renderFieldsTab()}
            {this.activeTab === 'settings' && this.renderSettingsTab()}
            {this.activeTab === 'styling' && this.renderStylingTab()}
            {this.activeTab === 'actions' && this.renderActionsTab()}
            {this.activeTab === 'integrations' && this.renderIntegrationsTab()}
          </div>

          <div className="builder-preview">
            <div className="preview-header">
              <h3>Live Preview</h3>
              <div className="preview-info">
                <span>Fill out the form to test validation</span>
              </div>
            </div>
            {this.renderPreview()}
          </div>
        </div>

        <style jsx>{`
          .form-builder {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #f8f9fa;
          }

          .builder-header {
            padding: 20px;
            background: white;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .builder-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }

          .header-actions {
            display: flex;
            gap: 8px;
          }

          .action-btn {
            padding: 8px 16px;
            border: 1px solid #ced4da;
            background: white;
            color: #6c757d;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
          }

          .action-btn:hover {
            background: #f8f9fa;
            border-color: #adb5bd;
          }

          .action-btn.primary {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }

          .action-btn.primary:hover {
            background: #0056b3;
          }

          .builder-content {
            display: flex;
            flex: 1;
            overflow: hidden;
          }

          .builder-tabs {
            width: 200px;
            background: white;
            border-right: 1px solid #e9ecef;
            display: flex;
            flex-direction: column;
          }

          .tab-btn {
            padding: 16px 20px;
            border: none;
            background: none;
            text-align: left;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #6c757d;
            border-bottom: 1px solid #f8f9fa;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
          }

          .tab-btn.active {
            background: #007bff;
            color: white;
            border-bottom-color: #007bff;
          }

          .tab-btn:hover:not(.active) {
            background: #f8f9fa;
            color: #495057;
          }

          .builder-panel {
            width: 320px;
            background: white;
            border-right: 1px solid #e9ecef;
            overflow-y: auto;
            padding: 20px;
          }

          .builder-preview {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: #f8f9fa;
          }

          .preview-header {
            padding: 16px 20px;
            background: white;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .preview-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
          }

          .preview-info {
            font-size: 12px;
            color: #6c757d;
          }

          .form-preview-container {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
          }

          .form-fields.layout-stacked {
            display: flex;
            flex-direction: column;
          }

          .form-fields.layout-inline {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
          }

          .form-fields.layout-inline .form-field {
            flex: 1;
            min-width: 200px;
          }

          .form-fields.layout-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
          }

          .field-types {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin-bottom: 20px;
          }

          .field-type-btn {
            padding: 12px;
            border: 2px solid #e9ecef;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
          }

          .field-type-btn:hover {
            border-color: #007bff;
            background: #f8f9fa;
          }

          .field-type-btn i {
            font-size: 18px;
            color: #6c757d;
          }

          .field-type-btn span {
            font-size: 12px;
            font-weight: 500;
            text-align: center;
          }

          .fields-list {
            margin-bottom: 20px;
          }

          .field-item {
            display: flex;
            align-items: center;
            padding: 12px;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            margin-bottom: 8px;
            background: white;
            cursor: pointer;
            transition: all 0.2s;
          }

          .field-item.selected {
            border-color: #007bff;
            background: #f8f9fa;
          }

          .field-item:hover {
            border-color: #007bff;
          }

          .field-icon {
            width: 32px;
            height: 32px;
            background: #007bff;
            color: white;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
          }

          .field-info {
            flex: 1;
          }

          .field-name {
            font-weight: 500;
            margin-bottom: 2px;
          }

          .field-type {
            font-size: 12px;
            color: #6c757d;
          }

          .field-actions {
            display: flex;
            gap: 4px;
          }

          .field-action-btn {
            padding: 6px;
            border: none;
            background: none;
            color: #6c757d;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s;
          }

          .field-action-btn:hover {
            background: #e9ecef;
            color: #495057;
          }

          .field-action-btn.danger:hover {
            background: #f8d7da;
            color: #721c24;
          }

          .form-group {
            margin-bottom: 16px;
          }

          .form-group label {
            display: block;
            margin-bottom: 4px;
            font-size: 12px;
            font-weight: 500;
            color: #495057;
            text-transform: uppercase;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
          }

          .form-group input:focus,
          .form-group select:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
          }

          .form-group textarea {
            resize: vertical;
            min-height: 80px;
          }

          .validation-rules {
            margin-top: 12px;
          }

          .validation-rule {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
          }

          .validation-rule input[type="checkbox"] {
            width: auto;
            margin: 0;
          }

          .validation-rule input[type="number"],
          .validation-rule input[type="text"] {
            flex: 1;
            margin: 0;
          }

          .options-editor {
            margin-top: 12px;
          }

          .option-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
          }

          .option-input {
            flex: 1;
          }

          .remove-option {
            padding: 4px 8px;
            border: none;
            background: #dc3545;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          }

          .add-option {
            padding: 8px 12px;
            border: 1px solid #007bff;
            background: #007bff;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }

          @media (max-width: 1200px) {
            .builder-content {
              flex-direction: column;
            }

            .builder-tabs, .builder-panel {
              width: 100%;
              border-right: none;
              border-bottom: 1px solid #e9ecef;
            }

            .builder-tabs {
              flex-direction: row;
              overflow-x: auto;
            }

            .tab-btn {
              flex: 1;
              min-width: 120px;
              justify-content: center;
              border-bottom: none;
              border-right: 1px solid #f8f9fa;
            }

            .field-types {
              grid-template-columns: repeat(4, 1fr);
            }
          }
        `}</style>
      </div>
    );
  }

  renderFieldsTab() {
    return (
      <div className="fields-tab">
        <div className="field-types">
          {this.fieldTypes.map(fieldType => (
            <button
              key={fieldType.id}
              className="field-type-btn"
              onClick={() => this.addField(fieldType.id)}
            >
              <i className={`fa ${fieldType.icon}`} />
              <span>{fieldType.name}</span>
            </button>
          ))}
        </div>

        <div className="fields-list">
          <h4>Form Fields ({this.formConfig.fields.length})</h4>
          {this.formConfig.fields.map((field, index) => (
            <div
              key={field.id}
              className={classnames('field-item', {
                selected: this.selectedFieldIndex === index
              })}
              onClick={() => this.selectField(index)}
            >
              <div className="field-icon">
                <i className={`fa ${this.fieldTypes.find(ft => ft.id === field.type)?.icon}`} />
              </div>
              <div className="field-info">
                <div className="field-name">{field.label}</div>
                <div className="field-type">{field.type}{field.required ? ' *' : ''}</div>
              </div>
              <div className="field-actions">
                <button
                  className="field-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.duplicateField(index);
                  }}
                  title="Duplicate field"
                >
                  <i className="fa fa-copy" />
                </button>
                <button
                  className="field-action-btn danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.removeField(index);
                  }}
                  title="Remove field"
                >
                  <i className="fa fa-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {this.selectedFieldIndex >= 0 && (
          <div className="field-editor">
            <h4>Edit Field</h4>
            {this.renderFieldEditor()}
          </div>
        )}
      </div>
    );
  }

  renderFieldEditor() {
    const field = this.formConfig.fields[this.selectedFieldIndex];
    if (!field) return null;

    return (
      <div className="field-editor-content">
        <div className="form-group">
          <label>Field Label</label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => this.updateField(this.selectedFieldIndex, 'label', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Placeholder</label>
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={(e) => this.updateField(this.selectedFieldIndex, 'placeholder', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => this.updateField(this.selectedFieldIndex, 'required', e.target.checked)}
            />
            Required field
          </label>
        </div>

        {(field.type === 'textarea') && (
          <div className="form-group">
            <label>Rows</label>
            <input
              type="number"
              min="1"
              max="20"
              value={field.rows || 4}
              onChange={(e) => this.updateField(this.selectedFieldIndex, 'rows', parseInt(e.target.value))}
            />
          </div>
        )}

        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
          <div className="options-editor">
            <label>Options</label>
            {field.options?.map((option, i) => (
              <div key={i} className="option-item">
                <input
                  type="text"
                  className="option-input"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...field.options];
                    newOptions[i] = e.target.value;
                    this.updateField(this.selectedFieldIndex, 'options', newOptions);
                  }}
                />
                <button
                  className="remove-option"
                  onClick={() => {
                    const newOptions = field.options.filter((_, idx) => idx !== i);
                    this.updateField(this.selectedFieldIndex, 'options', newOptions);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="add-option"
              onClick={() => {
                const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
                this.updateField(this.selectedFieldIndex, 'options', newOptions);
              }}
            >
              Add Option
            </button>
          </div>
        )}

        {field.type === 'file' && (
          <>
            <div className="form-group">
              <label>Accepted File Types</label>
              <input
                type="text"
                value={field.accept || '*/*'}
                onChange={(e) => this.updateField(this.selectedFieldIndex, 'accept', e.target.value)}
                placeholder="image/*, .pdf, .doc"
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={field.multiple}
                  onChange={(e) => this.updateField(this.selectedFieldIndex, 'multiple', e.target.checked)}
                />
                Allow multiple files
              </label>
            </div>
          </>
        )}

        <div className="validation-rules">
          <h5>Validation Rules</h5>
          {this.validationRules.map(rule => {
            if (rule.type === 'boolean') {
              return (
                <div key={rule.id} className="validation-rule">
                  <input
                    type="checkbox"
                    checked={field.validation?.[rule.id] || false}
                    onChange={(e) => this.updateField(this.selectedFieldIndex, `validation.${rule.id}`, e.target.checked)}
                  />
                  <label>{rule.name}</label>
                </div>
              );
            } else {
              return (
                <div key={rule.id} className="validation-rule">
                  <label>{rule.name}</label>
                  <input
                    type={rule.type}
                    value={field.validation?.[rule.id] || ''}
                    onChange={(e) => this.updateField(this.selectedFieldIndex, `validation.${rule.id}`, rule.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }

  renderSettingsTab() {
    return (
      <div className="settings-tab">
        <div className="form-group">
          <label>Form Title</label>
          <input
            type="text"
            value={this.formConfig.title}
            onChange={(e) => this.updateFormConfig('title', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Form Description</label>
          <textarea
            value={this.formConfig.description}
            onChange={(e) => this.updateFormConfig('description', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    );
  }

  renderStylingTab() {
    return (
      <div className="styling-tab">
        <div className="form-group">
          <label>Layout</label>
          <select
            value={this.formConfig.styling.layout}
            onChange={(e) => this.updateFormConfig('styling.layout', e.target.value)}
          >
            <option value="stacked">Stacked</option>
            <option value="inline">Inline</option>
            <option value="grid">Grid</option>
          </select>
        </div>

        <div className="form-group">
          <label>Theme</label>
          <select
            value={this.formConfig.styling.theme}
            onChange={(e) => this.updateFormConfig('styling.theme', e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="form-group">
          <label>Background Color</label>
          <input
            type="color"
            value={this.formConfig.styling.backgroundColor}
            onChange={(e) => this.updateFormConfig('styling.backgroundColor', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Border Color</label>
          <input
            type="color"
            value={this.formConfig.styling.borderColor}
            onChange={(e) => this.updateFormConfig('styling.borderColor', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Text Color</label>
          <input
            type="color"
            value={this.formConfig.styling.textColor}
            onChange={(e) => this.updateFormConfig('styling.textColor', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Label Color</label>
          <input
            type="color"
            value={this.formConfig.styling.labelColor}
            onChange={(e) => this.updateFormConfig('styling.labelColor', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Border Radius</label>
          <input
            type="text"
            value={this.formConfig.styling.borderRadius}
            onChange={(e) => this.updateFormConfig('styling.borderRadius', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Spacing</label>
          <input
            type="text"
            value={this.formConfig.styling.spacing}
            onChange={(e) => this.updateFormConfig('styling.spacing', e.target.value)}
          />
        </div>
      </div>
    );
  }

  renderActionsTab() {
    return (
      <div className="actions-tab">
        <div className="form-group">
          <label>Submit Button Text</label>
          <input
            type="text"
            value={this.formConfig.actions.submitText}
            onChange={(e) => this.updateFormConfig('actions.submitText', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Submit Button Style</label>
          <select
            value={this.formConfig.actions.submitStyle}
            onChange={(e) => this.updateFormConfig('actions.submitStyle', e.target.value)}
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="outline">Outline</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={this.formConfig.actions.showReset}
              onChange={(e) => this.updateFormConfig('actions.showReset', e.target.checked)}
            />
            Show Reset Button
          </label>
        </div>

        {this.formConfig.actions.showReset && (
          <div className="form-group">
            <label>Reset Button Text</label>
            <input
              type="text"
              value={this.formConfig.actions.resetText}
              onChange={(e) => this.updateFormConfig('actions.resetText', e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label>Redirect URL (Optional)</label>
          <input
            type="url"
            value={this.formConfig.actions.redirectUrl}
            onChange={(e) => this.updateFormConfig('actions.redirectUrl', e.target.value)}
            placeholder="https://example.com/thank-you"
          />
        </div>

        <div className="form-group">
          <label>Success Message</label>
          <textarea
            value={this.formConfig.actions.successMessage}
            onChange={(e) => this.updateFormConfig('actions.successMessage', e.target.value)}
            rows={2}
          />
        </div>

        <div className="form-group">
          <label>Error Message</label>
          <textarea
            value={this.formConfig.actions.errorMessage}
            onChange={(e) => this.updateFormConfig('actions.errorMessage', e.target.value)}
            rows={2}
          />
        </div>
      </div>
    );
  }

  renderIntegrationsTab() {
    return (
      <div className="integrations-tab">
        <div className="form-group">
          <label>Email Service</label>
          <select
            value={this.formConfig.integrations.emailService}
            onChange={(e) => this.updateFormConfig('integrations.emailService', e.target.value)}
          >
            <option value="">None</option>
            <option value="mailchimp">Mailchimp</option>
            <option value="sendgrid">SendGrid</option>
            <option value="mailgun">Mailgun</option>
            <option value="smtp">SMTP</option>
          </select>
        </div>

        <div className="form-group">
          <label>Webhook URL</label>
          <input
            type="url"
            value={this.formConfig.integrations.webhookUrl}
            onChange={(e) => this.updateFormConfig('integrations.webhookUrl', e.target.value)}
            placeholder="https://your-webhook-url.com"
          />
        </div>

        <div className="integration-section">
          <h4>Google Sheets</h4>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={this.formConfig.integrations.googleSheets}
                onChange={(e) => this.updateFormConfig('integrations.googleSheets', e.target.checked)}
              />
              Enable Google Sheets integration
            </label>
          </div>

          {this.formConfig.integrations.googleSheets && (
            <div className="form-group">
              <label>Spreadsheet ID</label>
              <input
                type="text"
                value={this.formConfig.integrations.spreadsheetId}
                onChange={(e) => this.updateFormConfig('integrations.spreadsheetId', e.target.value)}
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              />
            </div>
          )}
        </div>

        <div className="integration-section">
          <h4>Airtable</h4>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={this.formConfig.integrations.airtable}
                onChange={(e) => this.updateFormConfig('integrations.airtable', e.target.checked)}
              />
              Enable Airtable integration
            </label>
          </div>

          {this.formConfig.integrations.airtable && (
            <>
              <div className="form-group">
                <label>Base ID</label>
                <input
                  type="text"
                  value={this.formConfig.integrations.baseId}
                  onChange={(e) => this.updateFormConfig('integrations.baseId', e.target.value)}
                  placeholder="appXXXXXXXXXXXXXX"
                />
              </div>

              <div className="form-group">
                <label>Table Name</label>
                <input
                  type="text"
                  value={this.formConfig.integrations.tableName}
                  onChange={(e) => this.updateFormConfig('integrations.tableName', e.target.value)}
                  placeholder="Contacts"
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

FormBuilder.propTypes = {
  onFormApply: PropTypes.func,
  onFormSubmit: PropTypes.func,
  className: PropTypes.string
};