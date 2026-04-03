import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

@inject('store')
@observer
export default class TemplateSystem extends Component {
  @observable
  selectedCategory = 'all';

  @observable
  searchQuery = '';

  @observable
  selectedTemplate = null;

  @observable
  isPreviewMode = false;

  @observable
  templates = [
    {
      id: 'hero-landing',
      name: 'Hero Landing',
      category: 'landing',
      description: 'Clean hero section with call-to-action',
      thumbnail: '/templates/hero-landing.jpg',
      popularity: 95,
      tags: ['hero', 'cta', 'minimal'],
      components: ['HeroSection', 'CTAButton', 'FeatureList']
    },
    {
      id: 'product-showcase',
      name: 'Product Showcase',
      category: 'product',
      description: 'Showcase products with images and descriptions',
      thumbnail: '/templates/product-showcase.jpg',
      popularity: 87,
      tags: ['products', 'gallery', 'showcase'],
      components: ['ProductGrid', 'ImageGallery', 'Testimonials']
    },
    {
      id: 'business-landing',
      name: 'Business Landing',
      category: 'business',
      description: 'Professional business landing page',
      thumbnail: '/templates/business-landing.jpg',
      popularity: 92,
      tags: ['business', 'professional', 'corporate'],
      components: ['HeroSection', 'Services', 'Team', 'ContactForm']
    },
    {
      id: 'portfolio-minimal',
      name: 'Minimal Portfolio',
      category: 'portfolio',
      description: 'Clean portfolio layout for creatives',
      thumbnail: '/templates/portfolio-minimal.jpg',
      popularity: 78,
      tags: ['portfolio', 'minimal', 'creative'],
      components: ['PortfolioGrid', 'AboutSection', 'ContactForm']
    },
    {
      id: 'blog-template',
      name: 'Blog Template',
      category: 'blog',
      description: 'Modern blog layout with featured posts',
      thumbnail: '/templates/blog-template.jpg',
      popularity: 83,
      tags: ['blog', 'articles', 'news'],
      components: ['BlogHeader', 'FeaturedPosts', 'ArticleGrid', 'NewsletterSignup']
    },
    {
      id: 'ecommerce-store',
      name: 'E-commerce Store',
      category: 'ecommerce',
      description: 'Complete online store template',
      thumbnail: '/templates/ecommerce-store.jpg',
      popularity: 89,
      tags: ['ecommerce', 'store', 'shopping'],
      components: ['ProductCatalog', 'ShoppingCart', 'CheckoutForm', 'ProductDetails']
    }
  ];

  categories = [
    { id: 'all', name: 'All Templates', count: 0 },
    { id: 'landing', name: 'Landing Pages', count: 0 },
    { id: 'business', name: 'Business', count: 0 },
    { id: 'portfolio', name: 'Portfolio', count: 0 },
    { id: 'blog', name: 'Blog', count: 0 },
    { id: 'ecommerce', name: 'E-commerce', count: 0 }
  ];

  @computed
  get filteredTemplates() {
    let filtered = this.templates;

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }

  @computed
  get categoryCounts() {
    const counts = {};
    this.categories.forEach(cat => {
      if (cat.id === 'all') {
        counts[cat.id] = this.templates.length;
      } else {
        counts[cat.id] = this.templates.filter(t => t.category === cat.id).length;
      }
    });
    return counts;
  }

  @action
  selectCategory = (categoryId) => {
    this.selectedCategory = categoryId;
    this.selectedTemplate = null;
  };

  @action
  updateSearchQuery = (query) => {
    this.searchQuery = query;
    this.selectedTemplate = null;
  };

  @action
  selectTemplate = (template) => {
    this.selectedTemplate = template;
    if (this.props.onTemplateSelect) {
      this.props.onTemplateSelect(template);
    }
  };

  @action
  togglePreview = () => {
    this.isPreviewMode = !this.isPreviewMode;
  };

  @action
  applyTemplate = () => {
    if (this.selectedTemplate && this.props.onTemplateApply) {
      this.props.onTemplateApply(this.selectedTemplate);
    }
  };

  render() {
    const { className } = this.props;

    return (
      <div className={classnames('template-system', className)}>
        <div className="template-header">
          <h2>Choose a Template</h2>
          <div className="template-search">
            <input
              type="text"
              placeholder="Search templates..."
              value={this.searchQuery}
              onChange={(e) => this.updateSearchQuery(e.target.value)}
              className="search-input"
            />
            <button className="clear-search" onClick={() => this.updateSearchQuery('')}>
              ×
            </button>
          </div>
        </div>

        <div className="template-categories">
          {this.categories.map(category => (
            <button
              key={category.id}
              className={classnames('category-tab', {
                active: this.selectedCategory === category.id
              })}
              onClick={() => this.selectCategory(category.id)}
            >
              {category.name}
              <span className="category-count">({this.categoryCounts[category.id]})</span>
            </button>
          ))}
        </div>

        <div className="template-grid">
          {this.filteredTemplates.map(template => (
            <div
              key={template.id}
              className={classnames('template-card', {
                selected: this.selectedTemplate?.id === template.id
              })}
              onClick={() => this.selectTemplate(template)}
            >
              <div className="template-thumbnail">
                <div className="thumbnail-placeholder">
                  <i className="fa fa-image" />
                  <span>{template.name}</span>
                </div>
                <div className="template-popularity">
                  <i className="fa fa-star" />
                  {template.popularity}%
                </div>
              </div>

              <div className="template-info">
                <h3>{template.name}</h3>
                <p>{template.description}</p>
                <div className="template-tags">
                  {template.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="template-components">
                <small>{template.components.length} components</small>
              </div>
            </div>
          ))}
        </div>

        {this.selectedTemplate && (
          <div className="template-actions">
            <button className="preview-btn" onClick={this.togglePreview}>
              <i className="fa fa-eye" /> Preview
            </button>
            <button className="apply-btn" onClick={this.applyTemplate}>
              <i className="fa fa-plus" /> Use This Template
            </button>
          </div>
        )}

        {this.isPreviewMode && this.selectedTemplate && (
          <div className="template-preview-overlay" onClick={this.togglePreview}>
            <div className="template-preview-modal" onClick={(e) => e.stopPropagation()}>
              <div className="preview-header">
                <h3>Preview: {this.selectedTemplate.name}</h3>
                <button className="close-preview" onClick={this.togglePreview}>×</button>
              </div>
              <div className="preview-content">
                <div className="preview-placeholder">
                  <i className="fa fa-desktop" />
                  <p>Template preview would be rendered here</p>
                  <small>Components: {this.selectedTemplate.components.join(', ')}</small>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .template-system {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #f8f9fa;
          }

          .template-header {
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
            background: white;
          }

          .template-header h2 {
            margin: 0 0 16px 0;
            font-size: 24px;
            font-weight: 600;
            color: #212529;
          }

          .template-search {
            position: relative;
          }

          .search-input {
            width: 100%;
            padding: 12px 40px 12px 16px;
            border: 1px solid #ced4da;
            border-radius: 8px;
            font-size: 16px;
          }

          .search-input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
          }

          .clear-search {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 20px;
            color: #6c757d;
            cursor: pointer;
          }

          .template-categories {
            display: flex;
            padding: 0 20px;
            background: white;
            border-bottom: 1px solid #e9ecef;
            overflow-x: auto;
          }

          .category-tab {
            padding: 12px 20px;
            border: none;
            background: none;
            color: #6c757d;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
            white-space: nowrap;
          }

          .category-tab.active {
            color: #007bff;
            border-bottom-color: #007bff;
          }

          .category-tab:hover {
            color: #007bff;
            background: #f8f9fa;
          }

          .category-count {
            margin-left: 4px;
            opacity: 0.7;
          }

          .template-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
            padding: 20px;
            flex: 1;
            overflow-y: auto;
          }

          .template-card {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s;
          }

          .template-card:hover {
            border-color: #007bff;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .template-card.selected {
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
          }

          .template-thumbnail {
            position: relative;
            height: 160px;
            background: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .thumbnail-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #6c757d;
          }

          .thumbnail-placeholder i {
            font-size: 32px;
            margin-bottom: 8px;
          }

          .template-popularity {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(0, 123, 255, 0.9);
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .template-info {
            padding: 16px;
          }

          .template-info h3 {
            margin: 0 0 8px 0;
            font-size: 16px;
            font-weight: 600;
          }

          .template-info p {
            margin: 0 0 12px 0;
            color: #6c757d;
            font-size: 14px;
            line-height: 1.4;
          }

          .template-tags {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
          }

          .tag {
            background: #e9ecef;
            color: #495057;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
          }

          .template-components {
            padding: 8px 16px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
          }

          .template-actions {
            padding: 20px;
            border-top: 1px solid #e9ecef;
            background: white;
            display: flex;
            gap: 12px;
            justify-content: center;
          }

          .preview-btn, .apply-btn {
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
          }

          .preview-btn {
            background: #6c757d;
            color: white;
            border: 1px solid #6c757d;
          }

          .preview-btn:hover {
            background: #5a6268;
          }

          .apply-btn {
            background: #007bff;
            color: white;
            border: 1px solid #007bff;
          }

          .apply-btn:hover {
            background: #0056b3;
          }

          .template-preview-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .template-preview-modal {
            background: white;
            border-radius: 8px;
            width: 90%;
            max-width: 1200px;
            height: 80%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
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
          }

          .close-preview {
            background: none;
            border: none;
            font-size: 24px;
            color: #6c757d;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .preview-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
          }

          .preview-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #6c757d;
            text-align: center;
          }

          .preview-placeholder i {
            font-size: 64px;
            margin-bottom: 16px;
          }

          @media (max-width: 768px) {
            .template-grid {
              grid-template-columns: 1fr;
              gap: 16px;
              padding: 16px;
            }

            .template-categories {
              padding: 0 16px;
            }

            .category-tab {
              padding: 10px 16px;
              font-size: 13px;
            }

            .template-actions {
              padding: 16px;
              flex-direction: column;
            }

            .preview-btn, .apply-btn {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>
      </div>
    );
  }
}

TemplateSystem.propTypes = {
  onTemplateSelect: PropTypes.func,
  onTemplateApply: PropTypes.func,
  className: PropTypes.string
};