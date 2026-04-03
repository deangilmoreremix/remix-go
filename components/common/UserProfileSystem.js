import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

@inject('store')
@observer
export default class UserProfileSystem extends Component {
  @observable
  profileConfig = {
    basic: {
      name: '',
      email: '',
      avatar: '',
      bio: '',
      location: '',
      website: '',
      phone: ''
    },
    preferences: {
      theme: 'light', // light, dark, auto
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      notifications: {
        email: true,
        push: true,
        sms: false,
        marketing: false
      }
    },
    privacy: {
      profileVisibility: 'public', // public, private, friends
      showEmail: false,
      showPhone: false,
      allowMessaging: true,
      dataSharing: false,
      analytics: true
    },
    interests: {
      categories: [],
      tags: [],
      contentTypes: []
    },
    behavior: {
      lastLogin: null,
      loginCount: 0,
      pagesViewed: [],
      timeSpent: {},
      devices: [],
      locations: []
    },
    customization: {
      dashboardLayout: 'default',
      shortcuts: [],
      savedFilters: {},
      colorScheme: 'blue',
      fontSize: 'medium'
    }
  };

  @observable
  activeTab = 'basic';

  @observable
  isEditing = false;

  @observable
  profileImageFile = null;

  @observable
  validationErrors = {};

  availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'zh', name: '中文' }
  ];

  timezones = [
    'UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London',
    'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney',
    'Pacific/Auckland', 'Africa/Cairo', 'Asia/Dubai'
  ];

  currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' }
  ];

  interestCategories = [
    'Technology', 'Business', 'Marketing', 'Design', 'Photography',
    'Music', 'Sports', 'Travel', 'Food', 'Fashion', 'Health',
    'Education', 'Science', 'Art', 'Entertainment', 'News'
  ];

  contentTypes = [
    'Articles', 'Videos', 'Podcasts', 'Infographics', 'Webinars',
    'E-books', 'Courses', 'Newsletters', 'Case Studies', 'Whitepapers'
  ];

  colorSchemes = [
    { id: 'blue', name: 'Blue', color: '#007bff' },
    { id: 'green', name: 'Green', color: '#28a745' },
    { id: 'purple', name: 'Purple', color: '#6f42c1' },
    { id: 'red', name: 'Red', color: '#dc3545' },
    { id: 'orange', name: 'Orange', color: '#fd7e14' },
    { id: 'teal', name: 'Teal', color: '#20c997' }
  ];

  @action
  updateProfile = (section, field, value) => {
    if (!this.profileConfig[section]) {
      this.profileConfig[section] = {};
    }

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (!this.profileConfig[section][parent]) {
        this.profileConfig[section][parent] = {};
      }
      this.profileConfig[section][parent][child] = value;
    } else {
      this.profileConfig[section][field] = value;
    }

    // Clear validation error for this field
    if (this.validationErrors[`${section}.${field}`]) {
      delete this.validationErrors[`${section}.${field}`];
    }
  };

  @action
  setActiveTab = (tab) => {
    this.activeTab = tab;
  };

  @action
  toggleEditing = () => {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.validationErrors = {};
    }
  };

  @action
  handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      this.profileImageFile = file;
      // In a real app, you'd upload this to a server
      // For now, we'll create a data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.updateProfile('basic', 'avatar', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  @action
  addInterest = (category, interest) => {
    if (!this.profileConfig.interests[category]) {
      this.profileConfig.interests[category] = [];
    }

    if (!this.profileConfig.interests[category].includes(interest)) {
      this.profileConfig.interests[category].push(interest);
    }
  };

  @action
  removeInterest = (category, interest) => {
    if (this.profileConfig.interests[category]) {
      this.profileConfig.interests[category] = this.profileConfig.interests[category].filter(i => i !== interest);
    }
  };

  @action
  validateProfile = () => {
    const errors = {};

    // Basic validation
    if (!this.profileConfig.basic.name.trim()) {
      errors['basic.name'] = 'Name is required';
    }

    if (!this.profileConfig.basic.email.trim()) {
      errors['basic.email'] = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.profileConfig.basic.email)) {
      errors['basic.email'] = 'Please enter a valid email address';
    }

    if (this.profileConfig.basic.website && !/^https?:\/\/.+/.test(this.profileConfig.basic.website)) {
      errors['basic.website'] = 'Please enter a valid URL';
    }

    if (this.profileConfig.basic.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(this.profileConfig.basic.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors['basic.phone'] = 'Please enter a valid phone number';
    }

    this.validationErrors = errors;
    return Object.keys(errors).length === 0;
  };

  @action
  saveProfile = () => {
    if (this.validateProfile()) {
      // In a real app, this would save to a backend
      console.log('Profile saved:', this.profileConfig);
      this.isEditing = false;
      if (this.props.onProfileSave) {
        this.props.onProfileSave(this.profileConfig);
      }
    }
  };

  @action
  resetProfile = () => {
    // Reset to default state
    this.profileConfig = {
      basic: {
        name: '',
        email: '',
        avatar: '',
        bio: '',
        location: '',
        website: '',
        phone: ''
      },
      preferences: {
        theme: 'light',
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD',
        notifications: {
          email: true,
          push: true,
          sms: false,
          marketing: false
        }
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false,
        allowMessaging: true,
        dataSharing: false,
        analytics: true
      },
      interests: {
        categories: [],
        tags: [],
        contentTypes: []
      },
      behavior: {
        lastLogin: null,
        loginCount: 0,
        pagesViewed: [],
        timeSpent: {},
        devices: [],
        locations: []
      },
      customization: {
        dashboardLayout: 'default',
        shortcuts: [],
        savedFilters: {},
        colorScheme: 'blue',
        fontSize: 'medium'
      }
    };
    this.validationErrors = {};
  };

  @action
  exportProfile = () => {
    const profileData = JSON.stringify(this.profileConfig, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(profileData);

    const exportFileDefaultName = 'user-profile.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  @action
  importProfile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const profileData = JSON.parse(e.target.result);
          this.profileConfig = profileData;
          this.validationErrors = {};
        } catch (error) {
          console.error('Invalid profile file:', error);
          // Show error message
        }
      };
      reader.readAsText(file);
    }
  };

  @computed
  get completionPercentage() {
    let completed = 0;
    let total = 0;

    // Basic info (required)
    total += 3; // name, email, bio
    if (this.profileConfig.basic.name) completed++;
    if (this.profileConfig.basic.email) completed++;
    if (this.profileConfig.basic.bio) completed++;

    // Optional fields
    total += 4; // avatar, location, website, phone
    if (this.profileConfig.basic.avatar) completed++;
    if (this.profileConfig.basic.location) completed++;
    if (this.profileConfig.basic.website) completed++;
    if (this.profileConfig.basic.phone) completed++;

    // Preferences
    total += 5; // theme, language, timezone, dateFormat, currency
    if (this.profileConfig.preferences.theme) completed++;
    if (this.profileConfig.preferences.language) completed++;
    if (this.profileConfig.preferences.timezone) completed++;
    if (this.profileConfig.preferences.dateFormat) completed++;
    if (this.profileConfig.preferences.currency) completed++;

    // Interests
    total += 3; // categories, tags, contentTypes
    if (this.profileConfig.interests.categories.length > 0) completed++;
    if (this.profileConfig.interests.tags.length > 0) completed++;
    if (this.profileConfig.interests.contentTypes.length > 0) completed++;

    return Math.round((completed / total) * 100);
  }

  render() {
    const { className } = this.props;

    return (
      <div className={classnames('user-profile-system', className)}>
        <div className="profile-header">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {this.profileConfig.basic.avatar ? (
                <img src={this.profileConfig.basic.avatar} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  <i className="fa fa-user" />
                </div>
              )}
            </div>
            {this.isEditing && (
              <label className="avatar-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={this.handleImageUpload}
                  style={{ display: 'none' }}
                />
                <i className="fa fa-camera" />
                Change Photo
              </label>
            )}
          </div>

          <div className="profile-info">
            <h2>{this.profileConfig.basic.name || 'Your Name'}</h2>
            <p>{this.profileConfig.basic.bio || 'Add a bio to tell others about yourself'}</p>
            <div className="profile-completion">
              <div className="completion-bar">
                <div
                  className="completion-fill"
                  style={{ width: `${this.completionPercentage}%` }}
                />
              </div>
              <span className="completion-text">{this.completionPercentage}% Complete</span>
            </div>
          </div>

          <div className="profile-actions">
            {!this.isEditing ? (
              <button className="action-btn edit" onClick={this.toggleEditing}>
                <i className="fa fa-edit" /> Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="action-btn save" onClick={this.saveProfile}>
                  <i className="fa fa-save" /> Save
                </button>
                <button className="action-btn cancel" onClick={this.toggleEditing}>
                  <i className="fa fa-times" /> Cancel
                </button>
              </div>
            )}
            <button className="action-btn export" onClick={this.exportProfile}>
              <i className="fa fa-download" /> Export
            </button>
            <label className="action-btn import">
              <i className="fa fa-upload" /> Import
              <input
                type="file"
                accept=".json"
                onChange={this.importProfile}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-tabs">
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'basic' })}
              onClick={() => this.setActiveTab('basic')}
            >
              <i className="fa fa-user" /> Basic Info
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'preferences' })}
              onClick={() => this.setActiveTab('preferences')}
            >
              <i className="fa fa-sliders-h" /> Preferences
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'privacy' })}
              onClick={() => this.setActiveTab('privacy')}
            >
              <i className="fa fa-shield-alt" /> Privacy
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'interests' })}
              onClick={() => this.setActiveTab('interests')}
            >
              <i className="fa fa-heart" /> Interests
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'customization' })}
              onClick={() => this.setActiveTab('customization')}
            >
              <i className="fa fa-paint-brush" /> Customization
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'behavior' })}
              onClick={() => this.setActiveTab('behavior')}
            >
              <i className="fa fa-chart-bar" /> Activity
            </button>
          </div>

          <div className="profile-panel">
            {this.activeTab === 'basic' && this.renderBasicTab()}
            {this.activeTab === 'preferences' && this.renderPreferencesTab()}
            {this.activeTab === 'privacy' && this.renderPrivacyTab()}
            {this.activeTab === 'interests' && this.renderInterestsTab()}
            {this.activeTab === 'customization' && this.renderCustomizationTab()}
            {this.activeTab === 'behavior' && this.renderBehaviorTab()}
          </div>
        </div>

        <style jsx>{`
          .user-profile-system {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #f8f9fa;
          }

          .profile-header {
            padding: 24px;
            background: white;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            align-items: center;
            gap: 24px;
          }

          .profile-avatar-section {
            position: relative;
          }

          .profile-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            overflow: hidden;
            border: 4px solid #e9ecef;
          }

          .profile-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .avatar-placeholder {
            width: 100%;
            height: 100%;
            background: #6c757d;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 36px;
          }

          .avatar-upload {
            position: absolute;
            bottom: 0;
            right: 0;
            background: #007bff;
            color: white;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 14px;
            border: 2px solid white;
            transition: all 0.2s;
          }

          .avatar-upload:hover {
            background: #0056b3;
          }

          .profile-info {
            flex: 1;
          }

          .profile-info h2 {
            margin: 0 0 8px 0;
            font-size: 28px;
            font-weight: 600;
            color: #212529;
          }

          .profile-info p {
            margin: 0 0 16px 0;
            color: #6c757d;
            font-size: 16px;
          }

          .profile-completion {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .completion-bar {
            flex: 1;
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
          }

          .completion-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            border-radius: 4px;
            transition: width 0.3s ease;
          }

          .completion-text {
            font-size: 14px;
            font-weight: 500;
            color: #495057;
          }

          .profile-actions {
            display: flex;
            flex-direction: column;
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

          .action-btn.edit {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }

          .action-btn.edit:hover {
            background: #0056b3;
          }

          .action-btn.save {
            background: #28a745;
            color: white;
            border-color: #28a745;
          }

          .action-btn.save:hover {
            background: #218838;
          }

          .action-btn.cancel {
            background: #6c757d;
            color: white;
            border-color: #6c757d;
          }

          .action-btn.cancel:hover {
            background: #5a6268;
          }

          .action-btn.export {
            background: #17a2b8;
            color: white;
            border-color: #17a2b8;
          }

          .action-btn.export:hover {
            background: #138496;
          }

          .action-btn.import {
            background: #ffc107;
            color: #212529;
            border-color: #ffc107;
            cursor: pointer;
          }

          .action-btn.import:hover {
            background: #e0a800;
          }

          .edit-actions {
            display: flex;
            gap: 8px;
          }

          .profile-content {
            display: flex;
            flex: 1;
            overflow: hidden;
          }

          .profile-tabs {
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

          .profile-panel {
            flex: 1;
            background: white;
            overflow-y: auto;
            padding: 24px;
          }

          .form-section {
            margin-bottom: 32px;
          }

          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #212529;
            margin: 0 0 16px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #e9ecef;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-group label {
            display: block;
            margin-bottom: 6px;
            font-size: 14px;
            font-weight: 500;
            color: #495057;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ced4da;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.2s;
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

          .form-row {
            display: flex;
            gap: 16px;
          }

          .form-row .form-group {
            flex: 1;
          }

          .checkbox-group {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .checkbox-group input[type="checkbox"] {
            width: auto;
            margin: 0;
          }

          .error-message {
            color: #dc3545;
            font-size: 12px;
            margin-top: 4px;
          }

          .interest-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
          }

          .interest-tag {
            background: #007bff;
            color: white;
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .interest-tag.removable {
            background: #6c757d;
            cursor: pointer;
          }

          .interest-tag.removable:hover {
            background: #5a6268;
          }

          .interest-tag .remove-tag {
            margin-left: 4px;
            cursor: pointer;
            opacity: 0.8;
          }

          .interest-tag .remove-tag:hover {
            opacity: 1;
          }

          .available-interests {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 8px;
            margin-top: 12px;
          }

          .interest-option {
            padding: 8px 12px;
            border: 1px solid #ced4da;
            border-radius: 6px;
            background: white;
            cursor: pointer;
            text-align: center;
            font-size: 12px;
            transition: all 0.2s;
          }

          .interest-option:hover {
            border-color: #007bff;
            background: #f8f9fa;
          }

          .interest-option.selected {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }

          .color-schemes {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            gap: 12px;
            margin-top: 12px;
          }

          .color-scheme {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 12px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .color-scheme:hover {
            border-color: #007bff;
          }

          .color-scheme.selected {
            border-color: #007bff;
            background: #f8f9fa;
          }

          .color-preview {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid #e9ecef;
          }

          .color-name {
            font-size: 12px;
            font-weight: 500;
            text-align: center;
          }

          .activity-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
          }

          .metric-card {
            background: #f8f9fa;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
          }

          .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 4px;
          }

          .metric-label {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
          }

          .activity-list {
            margin-top: 16px;
          }

          .activity-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0;
            border-bottom: 1px solid #e9ecef;
          }

          .activity-icon {
            width: 32px;
            height: 32px;
            background: #007bff;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .activity-content {
            flex: 1;
          }

          .activity-title {
            font-weight: 500;
            margin-bottom: 2px;
          }

          .activity-meta {
            font-size: 12px;
            color: #6c757d;
          }

          @media (max-width: 768px) {
            .profile-header {
              flex-direction: column;
              text-align: center;
              gap: 16px;
            }

            .profile-actions {
              flex-direction: row;
              justify-content: center;
            }

            .profile-tabs {
              flex-direction: row;
              overflow-x: auto;
              width: 100%;
              border-right: none;
              border-bottom: 1px solid #e9ecef;
            }

            .tab-btn {
              flex: 1;
              min-width: 120px;
              justify-content: center;
              border-bottom: none;
              border-right: 1px solid #f8f9fa;
            }

            .form-row {
              flex-direction: column;
              gap: 12px;
            }

            .activity-metrics {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}</style>
      </div>
    );
  }

  renderBasicTab() {
    const { basic } = this.profileConfig;

    return (
      <div className="basic-tab">
        <div className="form-section">
          <h3 className="section-title">Basic Information</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={basic.name}
                onChange={(e) => this.updateProfile('basic', 'name', e.target.value)}
                disabled={!this.isEditing}
                placeholder="Enter your full name"
              />
              {this.validationErrors['basic.name'] && (
                <div className="error-message">{this.validationErrors['basic.name']}</div>
              )}
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                value={basic.email}
                onChange={(e) => this.updateProfile('basic', 'email', e.target.value)}
                disabled={!this.isEditing}
                placeholder="Enter your email"
              />
              {this.validationErrors['basic.email'] && (
                <div className="error-message">{this.validationErrors['basic.email']}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={basic.bio}
              onChange={(e) => this.updateProfile('basic', 'bio', e.target.value)}
              disabled={!this.isEditing}
              placeholder="Tell others about yourself"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={basic.location}
                onChange={(e) => this.updateProfile('basic', 'location', e.target.value)}
                disabled={!this.isEditing}
                placeholder="City, Country"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={basic.phone}
                onChange={(e) => this.updateProfile('basic', 'phone', e.target.value)}
                disabled={!this.isEditing}
                placeholder="+1 (555) 123-4567"
              />
              {this.validationErrors['basic.phone'] && (
                <div className="error-message">{this.validationErrors['basic.phone']}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Website</label>
            <input
              type="url"
              value={basic.website}
              onChange={(e) => this.updateProfile('basic', 'website', e.target.value)}
              disabled={!this.isEditing}
              placeholder="https://yourwebsite.com"
            />
            {this.validationErrors['basic.website'] && (
              <div className="error-message">{this.validationErrors['basic.website']}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  renderPreferencesTab() {
    const { preferences } = this.profileConfig;

    return (
      <div className="preferences-tab">
        <div className="form-section">
          <h3 className="section-title">Display Preferences</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Theme</label>
              <select
                value={preferences.theme}
                onChange={(e) => this.updateProfile('preferences', 'theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Language</label>
              <select
                value={preferences.language}
                onChange={(e) => this.updateProfile('preferences', 'language', e.target.value)}
              >
                {this.availableLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Timezone</label>
              <select
                value={preferences.timezone}
                onChange={(e) => this.updateProfile('preferences', 'timezone', e.target.value)}
              >
                {this.timezones.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Currency</label>
              <select
                value={preferences.currency}
                onChange={(e) => this.updateProfile('preferences', 'currency', e.target.value)}
              >
                {this.currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Date Format</label>
            <select
              value={preferences.dateFormat}
              onChange={(e) => this.updateProfile('preferences', 'dateFormat', e.target.value)}
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="DD MMM YYYY">DD MMM YYYY</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Notification Preferences</h3>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={preferences.notifications.email}
                onChange={(e) => this.updateProfile('preferences', 'notifications.email', e.target.checked)}
              />
              <label>Email Notifications</label>
            </div>
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={preferences.notifications.push}
                onChange={(e) => this.updateProfile('preferences', 'notifications.push', e.target.checked)}
              />
              <label>Push Notifications</label>
            </div>
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={preferences.notifications.sms}
                onChange={(e) => this.updateProfile('preferences', 'notifications.sms', e.target.checked)}
              />
              <label>SMS Notifications</label>
            </div>
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={preferences.notifications.marketing}
                onChange={(e) => this.updateProfile('preferences', 'notifications.marketing', e.target.checked)}
              />
              <label>Marketing Communications</label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderPrivacyTab() {
    const { privacy } = this.profileConfig;

    return (
      <div className="privacy-tab">
        <div className="form-section">
          <h3 className="section-title">Privacy Settings</h3>

          <div className="form-group">
            <label>Profile Visibility</label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => this.updateProfile('privacy', 'profileVisibility', e.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={privacy.showEmail}
                onChange={(e) => this.updateProfile('privacy', 'showEmail', e.target.checked)}
              />
              <label>Show email address publicly</label>
            </div>
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={privacy.showPhone}
                onChange={(e) => this.updateProfile('privacy', 'showPhone', e.target.checked)}
              />
              <label>Show phone number publicly</label>
            </div>
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={privacy.allowMessaging}
                onChange={(e) => this.updateProfile('privacy', 'allowMessaging', e.target.checked)}
              />
              <label>Allow other users to message me</label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Data & Analytics</h3>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={privacy.dataSharing}
                onChange={(e) => this.updateProfile('privacy', 'dataSharing', e.target.checked)}
              />
              <label>Share usage data for product improvement</label>
            </div>
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={privacy.analytics}
                onChange={(e) => this.updateProfile('privacy', 'analytics', e.target.checked)}
              />
              <label>Enable analytics tracking</label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderInterestsTab() {
    const { interests } = this.profileConfig;

    return (
      <div className="interests-tab">
        <div className="form-section">
          <h3 className="section-title">Your Interests</h3>

          <div className="form-group">
            <label>Categories</label>
            <div className="interest-tags">
              {interests.categories.map(category => (
                <span key={category} className="interest-tag removable">
                  {category}
                  <span
                    className="remove-tag"
                    onClick={() => this.removeInterest('categories', category)}
                  >
                    ×
                  </span>
                </span>
              ))}
            </div>
            <div className="available-interests">
              {this.interestCategories.map(category => (
                <div
                  key={category}
                  className={classnames('interest-option', {
                    selected: interests.categories.includes(category)
                  })}
                  onClick={() => this.addInterest('categories', category)}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Content Types</label>
            <div className="interest-tags">
              {interests.contentTypes.map(type => (
                <span key={type} className="interest-tag removable">
                  {type}
                  <span
                    className="remove-tag"
                    onClick={() => this.removeInterest('contentTypes', type)}
                  >
                    ×
                  </span>
                </span>
              ))}
            </div>
            <div className="available-interests">
              {this.contentTypes.map(type => (
                <div
                  key={type}
                  className={classnames('interest-option', {
                    selected: interests.contentTypes.includes(type)
                  })}
                  onClick={() => this.addInterest('contentTypes', type)}
                >
                  {type}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Custom Tags</label>
            <input
              type="text"
              placeholder="Add custom interests (press Enter)"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  this.addInterest('tags', e.target.value.trim());
                  e.target.value = '';
                }
              }}
            />
            <div className="interest-tags">
              {interests.tags.map(tag => (
                <span key={tag} className="interest-tag removable">
                  {tag}
                  <span
                    className="remove-tag"
                    onClick={() => this.removeInterest('tags', tag)}
                  >
                    ×
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderCustomizationTab() {
    const { customization } = this.profileConfig;

    return (
      <div className="customization-tab">
        <div className="form-section">
          <h3 className="section-title">Interface Customization</h3>

          <div className="form-group">
            <label>Color Scheme</label>
            <div className="color-schemes">
              {this.colorSchemes.map(scheme => (
                <div
                  key={scheme.id}
                  className={classnames('color-scheme', {
                    selected: customization.colorScheme === scheme.id
                  })}
                  onClick={() => this.updateProfile('customization', 'colorScheme', scheme.id)}
                >
                  <div
                    className="color-preview"
                    style={{ backgroundColor: scheme.color }}
                  />
                  <span className="color-name">{scheme.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Font Size</label>
            <select
              value={customization.fontSize}
              onChange={(e) => this.updateProfile('customization', 'fontSize', e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="extra-large">Extra Large</option>
            </select>
          </div>

          <div className="form-group">
            <label>Dashboard Layout</label>
            <select
              value={customization.dashboardLayout}
              onChange={(e) => this.updateProfile('customization', 'dashboardLayout', e.target.value)}
            >
              <option value="default">Default</option>
              <option value="compact">Compact</option>
              <option value="expanded">Expanded</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  renderBehaviorTab() {
    const { behavior } = this.profileConfig;

    return (
      <div className="behavior-tab">
        <div className="form-section">
          <h3 className="section-title">Activity Overview</h3>

          <div className="activity-metrics">
            <div className="metric-card">
              <div className="metric-value">{behavior.loginCount}</div>
              <div className="metric-label">Total Logins</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{behavior.pagesViewed.length}</div>
              <div className="metric-label">Pages Viewed</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{behavior.devices.length}</div>
              <div className="metric-label">Devices Used</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{behavior.locations.length}</div>
              <div className="metric-label">Locations</div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Recent Activity</h3>
          <div className="activity-list">
            {behavior.lastLogin && (
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fa fa-sign-in-alt" />
                </div>
                <div className="activity-content">
                  <div className="activity-title">Last Login</div>
                  <div className="activity-meta">{new Date(behavior.lastLogin).toLocaleString()}</div>
                </div>
              </div>
            )}

            {behavior.pagesViewed.slice(-5).reverse().map((page, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  <i className="fa fa-eye" />
                </div>
                <div className="activity-content">
                  <div className="activity-title">Viewed: {page}</div>
                  <div className="activity-meta">Recently</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

UserProfileSystem.propTypes = {
  onProfileSave: PropTypes.func,
  className: PropTypes.string
};