import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

@inject('store')
@observer
export default class DynamicContentEngine extends Component {
  @observable
  contentRules = [
    {
      id: 'rule_1',
      name: 'New User Welcome',
      trigger: 'first_visit',
      conditions: [
        { type: 'user_property', property: 'loginCount', operator: 'equals', value: '1' }
      ],
      content: {
        type: 'banner',
        title: 'Welcome to Our Platform!',
        message: 'Discover amazing features tailored just for you.',
        cta: { text: 'Explore Features', url: '/features' }
      },
      priority: 10,
      active: true,
      schedule: { start: null, end: null, timezone: 'UTC' }
    },
    {
      id: 'rule_2',
      name: 'Returning User Offer',
      trigger: 'page_visit',
      conditions: [
        { type: 'user_property', property: 'loginCount', operator: 'greater_than', value: '5' },
        { type: 'time_condition', property: 'lastLogin', operator: 'greater_than', value: '7_days' }
      ],
      content: {
        type: 'modal',
        title: 'We Missed You!',
        message: 'Here\'s a special offer for returning users.',
        cta: { text: 'Claim Offer', url: '/offers' }
      },
      priority: 8,
      active: true,
      schedule: { start: null, end: null, timezone: 'UTC' }
    },
    {
      id: 'rule_3',
      name: 'Location-Based Content',
      trigger: 'geolocation',
      conditions: [
        { type: 'geolocation', property: 'country', operator: 'equals', value: 'US' },
        { type: 'time_condition', property: 'current_time', operator: 'between', value: '09:00-17:00' }
      ],
      content: {
        type: 'sidebar',
        title: 'Local Business Hours',
        message: 'We\'re open now! Visit our local office.',
        cta: { text: 'Get Directions', url: '/contact' }
      },
      priority: 5,
      active: false,
      schedule: { start: null, end: null, timezone: 'UTC' }
    }
  ];

  @observable
  selectedRuleIndex = -1;

  @observable
  isCreatingRule = false;

  @observable
  newRule = {
    name: '',
    trigger: 'page_visit',
    conditions: [],
    content: { type: 'banner', title: '', message: '', cta: { text: '', url: '' } },
    priority: 5,
    active: true,
    schedule: { start: null, end: null, timezone: 'UTC' }
  };

  @observable
  contentVariants = [];

  @observable
  abTestingEnabled = false;

  @observable
  previewUser = {
    properties: {
      loginCount: 1,
      userType: 'new',
      location: 'US',
      interests: ['technology', 'business'],
      lastLogin: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    behavior: {
      pageViews: 5,
      timeSpent: 120,
      actions: ['signup', 'view_features']
    }
  };

  @observable
  previewResults = null;

  triggers = [
    { id: 'first_visit', name: 'First Visit', icon: 'fa-user-plus' },
    { id: 'page_visit', name: 'Page Visit', icon: 'fa-eye' },
    { id: 'user_action', name: 'User Action', icon: 'fa-mouse-pointer' },
    { id: 'time_based', name: 'Time Based', icon: 'fa-clock' },
    { id: 'geolocation', name: 'Geolocation', icon: 'fa-map-marker' },
    { id: 'device_type', name: 'Device Type', icon: 'fa-mobile' },
    { id: 'referrer', name: 'Referrer Source', icon: 'fa-external-link' },
    { id: 'custom_event', name: 'Custom Event', icon: 'fa-code' }
  ];

  contentTypes = [
    { id: 'banner', name: 'Banner', icon: 'fa-flag' },
    { id: 'modal', name: 'Modal Popup', icon: 'fa-window-maximize' },
    { id: 'sidebar', name: 'Sidebar', icon: 'fa-columns' },
    { id: 'tooltip', name: 'Tooltip', icon: 'fa-comment' },
    { id: 'notification', name: 'Notification', icon: 'fa-bell' },
    { id: 'inline', name: 'Inline Content', icon: 'fa-paragraph' },
    { id: 'redirect', name: 'Page Redirect', icon: 'fa-share' },
    { id: 'email', name: 'Email Trigger', icon: 'fa-envelope' }
  ];

  conditionTypes = [
    { id: 'user_property', name: 'User Property', icon: 'fa-user' },
    { id: 'page_property', name: 'Page Property', icon: 'fa-file' },
    { id: 'time_condition', name: 'Time Condition', icon: 'fa-clock' },
    { id: 'behavior', name: 'User Behavior', icon: 'fa-chart-line' },
    { id: 'geolocation', name: 'Geolocation', icon: 'fa-map-marker' },
    { id: 'device', name: 'Device Info', icon: 'fa-mobile' },
    { id: 'referrer', name: 'Referrer', icon: 'fa-external-link' },
    { id: 'custom', name: 'Custom Condition', icon: 'fa-code' }
  ];

  operators = [
    { id: 'equals', name: 'Equals', symbol: '=' },
    { id: 'not_equals', name: 'Not Equals', symbol: '≠' },
    { id: 'greater_than', name: 'Greater Than', symbol: '>' },
    { id: 'less_than', name: 'Less Than', symbol: '<' },
    { id: 'contains', name: 'Contains', symbol: '⊃' },
    { id: 'not_contains', name: 'Not Contains', symbol: '⊄' },
    { id: 'between', name: 'Between', symbol: '↔' },
    { id: 'regex', name: 'Regex Match', symbol: '≈' }
  ];

  @action
  selectRule = (index) => {
    this.selectedRuleIndex = index;
    this.isCreatingRule = false;
  };

  @action
  startCreatingRule = () => {
    this.isCreatingRule = true;
    this.selectedRuleIndex = -1;
    this.newRule = {
      name: '',
      trigger: 'page_visit',
      conditions: [],
      content: { type: 'banner', title: '', message: '', cta: { text: '', url: '' } },
      priority: 5,
      active: true,
      schedule: { start: null, end: null, timezone: 'UTC' }
    };
  };

  @action
  cancelCreatingRule = () => {
    this.isCreatingRule = false;
    this.newRule = {
      name: '',
      trigger: 'page_visit',
      conditions: [],
      content: { type: 'banner', title: '', message: '', cta: { text: '', url: '' } },
      priority: 5,
      active: true,
      schedule: { start: null, end: null, timezone: 'UTC' }
    };
  };

  @action
  saveNewRule = () => {
    const rule = {
      ...this.newRule,
      id: `rule_${Date.now()}`
    };
    this.contentRules.push(rule);
    this.isCreatingRule = false;
    this.selectedRuleIndex = this.contentRules.length - 1;
  };

  @action
  updateRule = (index, field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (!this.contentRules[index][parent]) {
        this.contentRules[index][parent] = {};
      }
      this.contentRules[index][parent][child] = value;
    } else {
      this.contentRules[index][field] = value;
    }
  };

  @action
  updateNewRule = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (!this.newRule[parent]) {
        this.newRule[parent] = {};
      }
      this.newRule[parent][child] = value;
    } else {
      this.newRule[field] = value;
    }
  };

  @action
  addCondition = (ruleIndex, isNewRule = false) => {
    const newCondition = {
      type: 'user_property',
      property: '',
      operator: 'equals',
      value: ''
    };

    if (isNewRule) {
      this.newRule.conditions.push(newCondition);
    } else {
      this.contentRules[ruleIndex].conditions.push(newCondition);
    }
  };

  @action
  removeCondition = (ruleIndex, conditionIndex, isNewRule = false) => {
    if (isNewRule) {
      this.newRule.conditions.splice(conditionIndex, 1);
    } else {
      this.contentRules[ruleIndex].conditions.splice(conditionIndex, 1);
    }
  };

  @action
  updateCondition = (ruleIndex, conditionIndex, field, value, isNewRule = false) => {
    if (isNewRule) {
      this.newRule.conditions[conditionIndex][field] = value;
    } else {
      this.contentRules[ruleIndex].conditions[conditionIndex][field] = value;
    }
  };

  @action
  deleteRule = (index) => {
    this.contentRules.splice(index, 1);
    if (this.selectedRuleIndex === index) {
      this.selectedRuleIndex = -1;
    } else if (this.selectedRuleIndex > index) {
      this.selectedRuleIndex--;
    }
  };

  @action
  duplicateRule = (index) => {
    const rule = { ...this.contentRules[index] };
    rule.id = `rule_${Date.now()}`;
    rule.name = `${rule.name} (Copy)`;
    this.contentRules.splice(index + 1, 0, rule);
    this.selectedRuleIndex = index + 1;
  };

  @action
  runPreview = () => {
    const matchingRules = this.evaluateRulesForUser(this.previewUser);
    this.previewResults = {
      user: this.previewUser,
      matchingRules,
      triggeredContent: matchingRules.map(rule => ({
        ruleId: rule.id,
        ruleName: rule.name,
        content: rule.content,
        priority: rule.priority
      })).sort((a, b) => b.priority - a.priority)
    };
  };

  evaluateRulesForUser = (user) => {
    return this.contentRules.filter(rule => {
      if (!rule.active) return false;

      // Check schedule
      if (rule.schedule.start || rule.schedule.end) {
        const now = new Date();
        if (rule.schedule.start && new Date(rule.schedule.start) > now) return false;
        if (rule.schedule.end && new Date(rule.schedule.end) < now) return false;
      }

      // Check conditions
      return rule.conditions.every(condition => {
        return this.evaluateCondition(condition, user);
      });
    });
  };

  evaluateCondition = (condition, user) => {
    const { type, property, operator, value } = condition;

    let actualValue;

    switch (type) {
      case 'user_property':
        actualValue = user.properties[property];
        break;
      case 'page_property':
        actualValue = window.location.pathname; // Simplified
        break;
      case 'time_condition':
        if (property === 'lastLogin') {
          const lastLogin = new Date(user.properties.lastLogin);
          const daysSince = (Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24);
          actualValue = Math.floor(daysSince);
        } else if (property === 'current_time') {
          const now = new Date();
          const currentTime = now.getHours() * 100 + now.getMinutes();
          actualValue = currentTime;
        }
        break;
      case 'geolocation':
        actualValue = user.properties.location;
        break;
      default:
        return true;
    }

    return this.compareValues(actualValue, operator, value);
  };

  compareValues = (actual, operator, expected) => {
    switch (operator) {
      case 'equals':
        return actual == expected;
      case 'not_equals':
        return actual != expected;
      case 'greater_than':
        return parseFloat(actual) > parseFloat(expected);
      case 'less_than':
        return parseFloat(actual) < parseFloat(expected);
      case 'contains':
        return String(actual).toLowerCase().includes(String(expected).toLowerCase());
      case 'not_contains':
        return !String(actual).toLowerCase().includes(String(expected).toLowerCase());
      case 'between':
        const [min, max] = expected.split('-').map(v => parseFloat(v));
        const val = parseFloat(actual);
        return val >= min && val <= max;
      case 'regex':
        try {
          return new RegExp(expected).test(String(actual));
        } catch {
          return false;
        }
      default:
        return true;
    }
  };

  @action
  updatePreviewUser = (section, field, value) => {
    if (!this.previewUser[section]) {
      this.previewUser[section] = {};
    }
    this.previewUser[section][field] = value;
  };

  @action
  exportRules = () => {
    const data = JSON.stringify(this.contentRules, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dynamic-content-rules.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  @action
  importRules = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const rules = JSON.parse(e.target.result);
          this.contentRules = rules;
          this.selectedRuleIndex = -1;
        } catch (error) {
          console.error('Invalid rules file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  render() {
    const { className } = this.props;

    return (
      <div className={classnames('dynamic-content-engine', className)}>
        <div className="engine-header">
          <h2>Dynamic Content Engine</h2>
          <div className="header-actions">
            <button className="action-btn" onClick={this.exportRules}>
              <i className="fa fa-download" /> Export Rules
            </button>
            <label className="action-btn import">
              <i className="fa fa-upload" /> Import Rules
              <input
                type="file"
                accept=".json"
                onChange={this.importRules}
                style={{ display: 'none' }}
              />
            </label>
            <button className="action-btn primary" onClick={this.startCreatingRule}>
              <i className="fa fa-plus" /> Create Rule
            </button>
          </div>
        </div>

        <div className="engine-content">
          <div className="rules-panel">
            <div className="rules-header">
              <h3>Content Rules ({this.contentRules.length})</h3>
            </div>

            <div className="rules-list">
              {this.contentRules.map((rule, index) => (
                <div
                  key={rule.id}
                  className={classnames('rule-item', {
                    selected: this.selectedRuleIndex === index,
                    inactive: !rule.active
                  })}
                  onClick={() => this.selectRule(index)}
                >
                  <div className="rule-info">
                    <div className="rule-name">{rule.name}</div>
                    <div className="rule-meta">
                      <span className="rule-trigger">
                        <i className={`fa ${this.triggers.find(t => t.id === rule.trigger)?.icon}`} />
                        {this.triggers.find(t => t.id === rule.trigger)?.name}
                      </span>
                      <span className="rule-conditions">
                        {rule.conditions.length} condition{rule.conditions.length !== 1 ? 's' : ''}
                      </span>
                      <span className="rule-priority">Priority: {rule.priority}</span>
                    </div>
                  </div>
                  <div className="rule-actions">
                    <button
                      className="rule-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.updateRule(index, 'active', !rule.active);
                      }}
                      title={rule.active ? 'Deactivate' : 'Activate'}
                    >
                      <i className={`fa ${rule.active ? 'fa-toggle-on' : 'fa-toggle-off'}`} />
                    </button>
                    <button
                      className="rule-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.duplicateRule(index);
                      }}
                      title="Duplicate"
                    >
                      <i className="fa fa-copy" />
                    </button>
                    <button
                      className="rule-action danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.deleteRule(index);
                      }}
                      title="Delete"
                    >
                      <i className="fa fa-trash" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {this.isCreatingRule && this.renderRuleEditor(true)}
          </div>

          <div className="rule-editor-panel">
            {this.selectedRuleIndex >= 0 && !this.isCreatingRule && this.renderRuleEditor(false)}
          </div>

          <div className="preview-panel">
            <div className="preview-header">
              <h3>Live Preview</h3>
              <button className="run-preview-btn" onClick={this.runPreview}>
                <i className="fa fa-play" /> Run Preview
              </button>
            </div>

            <div className="preview-user">
              <h4>Test User Profile</h4>
              <div className="user-properties">
                <div className="property-group">
                  <label>Login Count</label>
                  <input
                    type="number"
                    value={this.previewUser.properties.loginCount}
                    onChange={(e) => this.updatePreviewUser('properties', 'loginCount', parseInt(e.target.value))}
                  />
                </div>
                <div className="property-group">
                  <label>User Type</label>
                  <select
                    value={this.previewUser.properties.userType}
                    onChange={(e) => this.updatePreviewUser('properties', 'userType', e.target.value)}
                  >
                    <option value="new">New User</option>
                    <option value="returning">Returning</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div className="property-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={this.previewUser.properties.location}
                    onChange={(e) => this.updatePreviewUser('properties', 'location', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {this.previewResults && this.renderPreviewResults()}
          </div>
        </div>

        <style jsx>{`
          .dynamic-content-engine {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #f8f9fa;
          }

          .engine-header {
            padding: 20px;
            background: white;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .engine-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }

          .header-actions {
            display: flex;
            gap: 8px;
          }

          .action-btn, .import {
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

          .action-btn:hover, .import:hover {
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

          .engine-content {
            display: flex;
            flex: 1;
            overflow: hidden;
          }

          .rules-panel {
            width: 300px;
            background: white;
            border-right: 1px solid #e9ecef;
            display: flex;
            flex-direction: column;
          }

          .rules-header {
            padding: 16px 20px;
            border-bottom: 1px solid #e9ecef;
          }

          .rules-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
          }

          .rules-list {
            flex: 1;
            overflow-y: auto;
          }

          .rule-item {
            padding: 16px 20px;
            border-bottom: 1px solid #f8f9fa;
            cursor: pointer;
            transition: all 0.2s;
          }

          .rule-item:hover {
            background: #f8f9fa;
          }

          .rule-item.selected {
            background: #e7f3ff;
            border-left: 4px solid #007bff;
          }

          .rule-item.inactive {
            opacity: 0.6;
          }

          .rule-info {
            margin-bottom: 8px;
          }

          .rule-name {
            font-weight: 500;
            margin-bottom: 4px;
          }

          .rule-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            font-size: 12px;
            color: #6c757d;
          }

          .rule-trigger, .rule-conditions, .rule-priority {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .rule-actions {
            display: flex;
            gap: 4px;
          }

          .rule-action {
            padding: 6px;
            border: none;
            background: none;
            color: #6c757d;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s;
          }

          .rule-action:hover {
            background: #e9ecef;
          }

          .rule-action.danger:hover {
            background: #f8d7da;
            color: #721c24;
          }

          .rule-editor-panel {
            width: 400px;
            background: white;
            border-right: 1px solid #e9ecef;
            overflow-y: auto;
          }

          .preview-panel {
            flex: 1;
            background: white;
            overflow-y: auto;
          }

          .preview-header {
            padding: 16px 20px;
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

          .run-preview-btn {
            padding: 8px 16px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
          }

          .run-preview-btn:hover {
            background: #218838;
          }

          .preview-user {
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
          }

          .preview-user h4 {
            margin: 0 0 16px 0;
            font-size: 16px;
            font-weight: 600;
          }

          .user-properties {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }

          .property-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .property-group label {
            font-size: 12px;
            font-weight: 500;
            color: #495057;
          }

          .property-group input,
          .property-group select {
            padding: 6px 8px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
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

          .condition-builder {
            margin-top: 12px;
          }

          .condition-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 4px;
          }

          .condition-input {
            flex: 1;
          }

          .remove-condition {
            padding: 4px 8px;
            border: none;
            background: #dc3545;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          }

          .add-condition-btn {
            padding: 8px 12px;
            border: 1px solid #007bff;
            background: #007bff;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }

          .content-preview {
            margin-top: 16px;
            padding: 16px;
            border: 2px dashed #e9ecef;
            border-radius: 8px;
            background: #fafafa;
          }

          .preview-results {
            padding: 20px;
          }

          .preview-results h4 {
            margin: 0 0 16px 0;
            font-size: 16px;
            font-weight: 600;
          }

          .triggered-content {
            display: grid;
            gap: 12px;
          }

          .content-item {
            padding: 12px;
            background: #e7f3ff;
            border: 1px solid #b3d9ff;
            border-radius: 6px;
          }

          .content-rule-name {
            font-weight: 500;
            margin-bottom: 4px;
          }

          .content-preview-text {
            font-size: 14px;
            color: #495057;
            margin-bottom: 8px;
          }

          .content-priority {
            font-size: 12px;
            color: #6c757d;
          }

          @media (max-width: 1200px) {
            .engine-content {
              flex-direction: column;
            }

            .rules-panel, .rule-editor-panel {
              width: 100%;
              border-right: none;
              border-bottom: 1px solid #e9ecef;
            }

            .user-properties {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    );
  }

  renderRuleEditor(isNewRule = false) {
    const rule = isNewRule ? this.newRule : this.contentRules[this.selectedRuleIndex];
    if (!rule) return null;

    const updateFunction = isNewRule ? this.updateNewRule : (field, value) => this.updateRule(this.selectedRuleIndex, field, value);
    const addConditionFunction = (ruleIndex) => this.addCondition(ruleIndex, isNewRule);
    const removeConditionFunction = (ruleIndex, conditionIndex) => this.removeCondition(ruleIndex, conditionIndex, isNewRule);
    const updateConditionFunction = (ruleIndex, conditionIndex, field, value) => this.updateCondition(ruleIndex, conditionIndex, field, value, isNewRule);

    return (
      <div className="rule-editor">
        <div className="editor-header">
          <h3>{isNewRule ? 'Create New Rule' : `Edit: ${rule.name}`}</h3>
          {isNewRule && (
            <div className="editor-actions">
              <button className="cancel-btn" onClick={this.cancelCreatingRule}>
                Cancel
              </button>
              <button className="save-btn" onClick={this.saveNewRule}>
                Save Rule
              </button>
            </div>
          )}
        </div>

        <div className="editor-content">
          <div className="form-group">
            <label>Rule Name</label>
            <input
              type="text"
              value={rule.name}
              onChange={(e) => updateFunction('name', e.target.value)}
              placeholder="Enter rule name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Trigger</label>
              <select
                value={rule.trigger}
                onChange={(e) => updateFunction('trigger', e.target.value)}
              >
                {this.triggers.map(trigger => (
                  <option key={trigger.id} value={trigger.id}>{trigger.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <input
                type="number"
                min="1"
                max="100"
                value={rule.priority}
                onChange={(e) => updateFunction('priority', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={rule.active}
                onChange={(e) => updateFunction('active', e.target.checked)}
              />
              Rule is active
            </label>
          </div>

          <div className="conditions-section">
            <div className="section-header">
              <h4>Conditions</h4>
              <button
                className="add-condition-btn"
                onClick={() => addConditionFunction(isNewRule ? 0 : this.selectedRuleIndex)}
              >
                Add Condition
              </button>
            </div>

            <div className="condition-builder">
              {rule.conditions.map((condition, conditionIndex) => (
                <div key={conditionIndex} className="condition-item">
                  <select
                    className="condition-input"
                    value={condition.type}
                    onChange={(e) => updateConditionFunction(isNewRule ? 0 : this.selectedRuleIndex, conditionIndex, 'type', e.target.value)}
                  >
                    {this.conditionTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    className="condition-input"
                    placeholder="Property"
                    value={condition.property}
                    onChange={(e) => updateConditionFunction(isNewRule ? 0 : this.selectedRuleIndex, conditionIndex, 'property', e.target.value)}
                  />

                  <select
                    className="condition-input"
                    value={condition.operator}
                    onChange={(e) => updateConditionFunction(isNewRule ? 0 : this.selectedRuleIndex, conditionIndex, 'operator', e.target.value)}
                  >
                    {this.operators.map(op => (
                      <option key={op.id} value={op.id}>{op.name}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    className="condition-input"
                    placeholder="Value"
                    value={condition.value}
                    onChange={(e) => updateConditionFunction(isNewRule ? 0 : this.selectedRuleIndex, conditionIndex, 'value', e.target.value)}
                  />

                  <button
                    className="remove-condition"
                    onClick={() => removeConditionFunction(isNewRule ? 0 : this.selectedRuleIndex, conditionIndex)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="content-section">
            <h4>Content</h4>

            <div className="form-group">
              <label>Content Type</label>
              <select
                value={rule.content.type}
                onChange={(e) => updateFunction('content.type', e.target.value)}
              >
                {this.contentTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={rule.content.title || ''}
                onChange={(e) => updateFunction('content.title', e.target.value)}
                placeholder="Content title"
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                value={rule.content.message || ''}
                onChange={(e) => updateFunction('content.message', e.target.value)}
                placeholder="Content message"
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>CTA Text</label>
                <input
                  type="text"
                  value={rule.content.cta?.text || ''}
                  onChange={(e) => updateFunction('content.cta.text', e.target.value)}
                  placeholder="Button text"
                />
              </div>

              <div className="form-group">
                <label>CTA URL</label>
                <input
                  type="url"
                  value={rule.content.cta?.url || ''}
                  onChange={(e) => updateFunction('content.cta.url', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          <div className="content-preview">
            <h4>Preview</h4>
            <div className="preview-content">
              {rule.content.title && <h5>{rule.content.title}</h5>}
              {rule.content.message && <p>{rule.content.message}</p>}
              {rule.content.cta?.text && (
                <button style={{
                  padding: '8px 16px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  {rule.content.cta.text}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderPreviewResults() {
    if (!this.previewResults) return null;

    return (
      <div className="preview-results">
        <h4>Preview Results</h4>

        <div className="triggered-content">
          {this.previewResults.triggeredContent.length === 0 ? (
            <div className="no-content">
              <i className="fa fa-info-circle" />
              <p>No content rules matched for this user profile.</p>
            </div>
          ) : (
            this.previewResults.triggeredContent.map((content, index) => (
              <div key={index} className="content-item">
                <div className="content-rule-name">{content.ruleName}</div>
                <div className="content-preview-text">
                  {content.content.title && <strong>{content.content.title}</strong>}
                  {content.content.message && <span> - {content.content.message}</span>}
                </div>
                <div className="content-priority">Priority: {content.priority}</div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

DynamicContentEngine.propTypes = {
  onRuleSave: PropTypes.func,
  className: PropTypes.string
};