import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

@inject('store')
@observer
export default class ContentBlocksLibrary extends Component {
  @observable
  searchQuery = '';

  @observable
  selectedCategory = 'all';

  @observable
  draggedBlock = null;

  @observable
  isDragging = false;

  categories = [
    { id: 'all', name: 'All Blocks', icon: 'fa-th' },
    { id: 'text', name: 'Text', icon: 'fa-font' },
    { id: 'media', name: 'Media', icon: 'fa-image' },
    { id: 'features', name: 'Features', icon: 'fa-star' },
    { id: 'social', name: 'Social Proof', icon: 'fa-users' },
    { id: 'pricing', name: 'Pricing', icon: 'fa-dollar-sign' },
    { id: 'forms', name: 'Forms', icon: 'fa-envelope' },
    { id: 'layout', name: 'Layout', icon: 'fa-th-large' }
  ];

  contentBlocks = [
    // Text Blocks
    {
      id: 'heading-block',
      name: 'Heading Block',
      category: 'text',
      icon: 'fa-heading',
      description: 'Large heading with optional subheading',
      tags: ['heading', 'title', 'text'],
      component: 'HeadingBlock',
      defaultProps: {
        level: 'h1',
        text: 'Your Amazing Headline',
        subheading: 'Add a compelling subheading here',
        alignment: 'center'
      }
    },
    {
      id: 'paragraph-block',
      name: 'Paragraph Block',
      category: 'text',
      icon: 'fa-paragraph',
      description: 'Rich text paragraph with formatting options',
      tags: ['paragraph', 'text', 'content'],
      component: 'ParagraphBlock',
      defaultProps: {
        text: 'This is a sample paragraph. You can add your own content here and format it with bold, italic, and other styling options.',
        alignment: 'left'
      }
    },
    {
      id: 'quote-block',
      name: 'Quote Block',
      category: 'text',
      icon: 'fa-quote-left',
      description: 'Pull quote or testimonial quote',
      tags: ['quote', 'testimonial', 'text'],
      component: 'QuoteBlock',
      defaultProps: {
        quote: '"This is an amazing product that changed my life."',
        author: 'John Doe',
        position: 'CEO, Company Inc.',
        alignment: 'center'
      }
    },

    // Media Blocks
    {
      id: 'image-block',
      name: 'Image Block',
      category: 'media',
      icon: 'fa-image',
      description: 'Single image with caption and styling options',
      tags: ['image', 'photo', 'media'],
      component: 'ImageBlock',
      defaultProps: {
        src: '/placeholder-image.jpg',
        alt: 'Descriptive alt text',
        caption: 'Image caption (optional)',
        size: 'medium',
        rounded: false
      }
    },
    {
      id: 'video-block',
      name: 'Video Block',
      category: 'media',
      icon: 'fa-video',
      description: 'Embedded video with controls',
      tags: ['video', 'media', 'embed'],
      component: 'VideoBlock',
      defaultProps: {
        src: 'https://example.com/video.mp4',
        poster: '/video-poster.jpg',
        autoplay: false,
        controls: true,
        loop: false
      }
    },
    {
      id: 'gallery-block',
      name: 'Image Gallery',
      category: 'media',
      icon: 'fa-images',
      description: 'Grid of multiple images',
      tags: ['gallery', 'images', 'grid'],
      component: 'GalleryBlock',
      defaultProps: {
        images: [
          { src: '/image1.jpg', alt: 'Image 1' },
          { src: '/image2.jpg', alt: 'Image 2' },
          { src: '/image3.jpg', alt: 'Image 3' }
        ],
        columns: 3,
        lightbox: true
      }
    },

    // Feature Blocks
    {
      id: 'feature-list',
      name: 'Feature List',
      category: 'features',
      icon: 'fa-list-check',
      description: 'List of features with icons',
      tags: ['features', 'list', 'icons'],
      component: 'FeatureListBlock',
      defaultProps: {
        features: [
          { icon: 'fa-check', title: 'Feature One', description: 'Description of feature one' },
          { icon: 'fa-star', title: 'Feature Two', description: 'Description of feature two' },
          { icon: 'fa-heart', title: 'Feature Three', description: 'Description of feature three' }
        ],
        layout: 'grid',
        columns: 3
      }
    },
    {
      id: 'icon-feature',
      name: 'Icon Feature',
      category: 'features',
      icon: 'fa-lightbulb',
      description: 'Single feature with large icon',
      tags: ['feature', 'icon', 'highlight'],
      component: 'IconFeatureBlock',
      defaultProps: {
        icon: 'fa-rocket',
        title: 'Amazing Feature',
        description: 'This feature will blow your mind with its capabilities.',
        buttonText: 'Learn More',
        buttonUrl: '#'
      }
    },
    {
      id: 'stats-counter',
      name: 'Stats Counter',
      category: 'features',
      icon: 'fa-chart-line',
      description: 'Animated counters for statistics',
      tags: ['stats', 'numbers', 'counter'],
      component: 'StatsCounterBlock',
      defaultProps: {
        stats: [
          { number: 1000, suffix: '+', label: 'Happy Customers' },
          { number: 500, suffix: 'K', label: 'Downloads' },
          { number: 99, suffix: '%', label: 'Satisfaction' }
        ],
        animated: true
      }
    },

    // Social Proof Blocks
    {
      id: 'testimonial-slider',
      name: 'Testimonial Slider',
      category: 'social',
      icon: 'fa-comments',
      description: 'Rotating testimonials carousel',
      tags: ['testimonial', 'reviews', 'social'],
      component: 'TestimonialSliderBlock',
      defaultProps: {
        testimonials: [
          {
            quote: '"Amazing product that exceeded expectations!"',
            author: 'Sarah Johnson',
            position: 'Marketing Director',
            avatar: '/avatar1.jpg'
          },
          {
            quote: '"Best investment we\'ve made this year."',
            author: 'Mike Chen',
            position: 'CEO',
            avatar: '/avatar2.jpg'
          }
        ],
        autoplay: true,
        showDots: true
      }
    },
    {
      id: 'logo-wall',
      name: 'Logo Wall',
      category: 'social',
      icon: 'fa-building',
      description: 'Grid of company logos',
      tags: ['logos', 'brands', 'trust'],
      component: 'LogoWallBlock',
      defaultProps: {
        logos: [
          { src: '/logo1.png', alt: 'Company 1' },
          { src: '/logo2.png', alt: 'Company 2' },
          { src: '/logo3.png', alt: 'Company 3' }
        ],
        grayscale: true,
        columns: 4
      }
    },
    {
      id: 'social-proof-numbers',
      name: 'Social Proof Numbers',
      category: 'social',
      icon: 'fa-users',
      description: 'Large numbers showing social proof',
      tags: ['numbers', 'social', 'trust'],
      component: 'SocialProofNumbersBlock',
      defaultProps: {
        items: [
          { number: '10M', label: 'Users Worldwide' },
          { number: '4.9', label: 'Average Rating', suffix: '/5' },
          { number: '24/7', label: 'Customer Support' }
        ],
        layout: 'horizontal'
      }
    },

    // Pricing Blocks
    {
      id: 'pricing-table',
      name: 'Pricing Table',
      category: 'pricing',
      icon: 'fa-table',
      description: 'Multi-column pricing comparison',
      tags: ['pricing', 'plans', 'comparison'],
      component: 'PricingTableBlock',
      defaultProps: {
        plans: [
          {
            name: 'Basic',
            price: '$9',
            period: 'month',
            features: ['Feature 1', 'Feature 2', 'Feature 3'],
            buttonText: 'Get Started',
            popular: false
          },
          {
            name: 'Pro',
            price: '$29',
            period: 'month',
            features: ['Everything in Basic', 'Advanced Feature', 'Priority Support'],
            buttonText: 'Go Pro',
            popular: true
          }
        ],
        highlightPopular: true
      }
    },
    {
      id: 'pricing-card',
      name: 'Pricing Card',
      category: 'pricing',
      icon: 'fa-credit-card',
      description: 'Single pricing plan card',
      tags: ['pricing', 'plan', 'card'],
      component: 'PricingCardBlock',
      defaultProps: {
        name: 'Professional Plan',
        price: '$19',
        period: 'month',
        features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
        buttonText: 'Choose Plan',
        buttonUrl: '#',
        popular: false
      }
    },

    // Form Blocks
    {
      id: 'contact-form',
      name: 'Contact Form',
      category: 'forms',
      icon: 'fa-envelope',
      description: 'Contact form with multiple fields',
      tags: ['contact', 'form', 'lead'],
      component: 'ContactFormBlock',
      defaultProps: {
        fields: [
          { type: 'text', name: 'name', label: 'Full Name', required: true },
          { type: 'email', name: 'email', label: 'Email Address', required: true },
          { type: 'textarea', name: 'message', label: 'Message', required: true }
        ],
        submitText: 'Send Message',
        submitUrl: '#'
      }
    },
    {
      id: 'newsletter-signup',
      name: 'Newsletter Signup',
      category: 'forms',
      icon: 'fa-newspaper',
      description: 'Email newsletter subscription form',
      tags: ['newsletter', 'email', 'signup'],
      component: 'NewsletterSignupBlock',
      defaultProps: {
        title: 'Stay Updated',
        description: 'Get the latest news and updates delivered to your inbox.',
        placeholder: 'Enter your email address',
        buttonText: 'Subscribe',
        privacyText: 'We respect your privacy.'
      }
    },

    // Layout Blocks
    {
      id: 'spacer-block',
      name: 'Spacer',
      category: 'layout',
      icon: 'fa-arrows-alt-v',
      description: 'Empty space between blocks',
      tags: ['spacer', 'space', 'layout'],
      component: 'SpacerBlock',
      defaultProps: {
        height: '50px',
        backgroundColor: 'transparent'
      }
    },
    {
      id: 'divider-block',
      name: 'Divider',
      category: 'layout',
      icon: 'fa-minus',
      description: 'Visual separator line',
      tags: ['divider', 'separator', 'line'],
      component: 'DividerBlock',
      defaultProps: {
        style: 'solid',
        color: '#e9ecef',
        thickness: '1px',
        width: '100%'
      }
    },
    {
      id: 'columns-block',
      name: 'Columns Layout',
      category: 'layout',
      icon: 'fa-columns',
      description: 'Multi-column content layout',
      tags: ['columns', 'layout', 'grid'],
      component: 'ColumnsBlock',
      defaultProps: {
        columns: 2,
        gap: '20px',
        responsive: true
      }
    }
  ];

  @computed
  get filteredBlocks() {
    let filtered = this.contentBlocks;

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(block => block.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(block =>
        block.name.toLowerCase().includes(query) ||
        block.description.toLowerCase().includes(query) ||
        block.tags.some(tag => tag.toLowerCase().includes(query)) ||
        block.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  @computed
  get categoryCounts() {
    const counts = {};
    this.categories.forEach(cat => {
      if (cat.id === 'all') {
        counts[cat.id] = this.contentBlocks.length;
      } else {
        counts[cat.id] = this.contentBlocks.filter(b => b.category === cat.id).length;
      }
    });
    return counts;
  }

  @action
  selectCategory = (categoryId) => {
    this.selectedCategory = categoryId;
  };

  @action
  updateSearchQuery = (query) => {
    this.searchQuery = query;
  };

  handleDragStart = (e, block) => {
    this.draggedBlock = block;
    this.isDragging = true;
    e.dataTransfer.setData('application/json', JSON.stringify(block));
    e.dataTransfer.effectAllowed = 'copy';

    // Add visual feedback
    if (this.props.onDragStart) {
      this.props.onDragStart(block);
    }
  };

  handleDragEnd = () => {
    this.isDragging = false;
    this.draggedBlock = null;

    if (this.props.onDragEnd) {
      this.props.onDragEnd();
    }
  };

  handleBlockClick = (block) => {
    if (this.props.onBlockSelect) {
      this.props.onBlockSelect(block);
    }
  };

  render() {
    const { className } = this.props;

    return (
      <div className={classnames('content-blocks-library', className)}>
        <div className="library-header">
          <h2>Content Blocks</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search blocks..."
              value={this.searchQuery}
              onChange={(e) => this.updateSearchQuery(e.target.value)}
              className="search-input"
            />
            <i className="fa fa-search search-icon" />
          </div>
        </div>

        <div className="library-categories">
          {this.categories.map(category => (
            <button
              key={category.id}
              className={classnames('category-btn', {
                active: this.selectedCategory === category.id
              })}
              onClick={() => this.selectCategory(category.id)}
            >
              <i className={`fa ${category.icon}`} />
              <span className="category-name">{category.name}</span>
              <span className="category-count">({this.categoryCounts[category.id]})</span>
            </button>
          ))}
        </div>

        <div className="blocks-grid">
          {this.filteredBlocks.map(block => (
            <div
              key={block.id}
              className={classnames('block-card', {
                dragging: this.draggedBlock?.id === block.id
              })}
              draggable
              onDragStart={(e) => this.handleDragStart(e, block)}
              onDragEnd={this.handleDragEnd}
              onClick={() => this.handleBlockClick(block)}
            >
              <div className="block-icon">
                <i className={`fa ${block.icon}`} />
              </div>

              <div className="block-info">
                <h3 className="block-name">{block.name}</h3>
                <p className="block-description">{block.description}</p>
                <div className="block-tags">
                  {block.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="block-actions">
                <button
                  className="drag-handle"
                  title="Drag to add to page"
                >
                  <i className="fa fa-grip-vertical" />
                </button>
              </div>

              <div className="block-overlay">
                <span>Drag to add</span>
              </div>
            </div>
          ))}
        </div>

        {this.filteredBlocks.length === 0 && (
          <div className="no-results">
            <i className="fa fa-search" />
            <h3>No blocks found</h3>
            <p>Try adjusting your search or category filter</p>
          </div>
        )}

        <style jsx>{`
          .content-blocks-library {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #f8f9fa;
          }

          .library-header {
            padding: 20px;
            background: white;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .library-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            color: #212529;
          }

          .search-container {
            position: relative;
            width: 250px;
          }

          .search-input {
            width: 100%;
            padding: 8px 12px 8px 35px;
            border: 1px solid #ced4da;
            border-radius: 6px;
            font-size: 14px;
          }

          .search-input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
          }

          .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #6c757d;
          }

          .library-categories {
            display: flex;
            padding: 0 20px;
            background: white;
            border-bottom: 1px solid #e9ecef;
            overflow-x: auto;
            gap: 0;
          }

          .category-btn {
            padding: 12px 16px;
            border: none;
            background: none;
            color: #6c757d;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
            white-space: nowrap;
            flex-shrink: 0;
          }

          .category-btn.active {
            color: #007bff;
            border-bottom-color: #007bff;
            background: #f8f9fa;
          }

          .category-btn:hover {
            color: #007bff;
            background: #f8f9fa;
          }

          .category-name {
            font-weight: 500;
          }

          .category-count {
            font-size: 12px;
            opacity: 0.7;
          }

          .blocks-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 16px;
            padding: 20px;
            flex: 1;
            overflow-y: auto;
          }

          .block-card {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 16px;
            cursor: grab;
            display: flex;
            flex-direction: column;
            position: relative;
            transition: all 0.3s;
            user-select: none;
          }

          .block-card:hover {
            border-color: #007bff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
          }

          .block-card:active {
            cursor: grabbing;
          }

          .block-card.dragging {
            opacity: 0.5;
            transform: rotate(2deg);
          }

          .block-icon {
            width: 40px;
            height: 40px;
            background: #007bff;
            color: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            margin-bottom: 12px;
          }

          .block-info {
            flex: 1;
          }

          .block-name {
            margin: 0 0 8px 0;
            font-size: 16px;
            font-weight: 600;
            color: #212529;
          }

          .block-description {
            margin: 0 0 12px 0;
            font-size: 14px;
            color: #6c757d;
            line-height: 1.4;
          }

          .block-tags {
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

          .block-actions {
            position: absolute;
            top: 12px;
            right: 12px;
          }

          .drag-handle {
            background: none;
            border: none;
            color: #6c757d;
            cursor: grab;
            padding: 4px;
            border-radius: 4px;
          }

          .drag-handle:hover {
            color: #495057;
            background: #f8f9fa;
          }

          .block-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 123, 255, 0.9);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 500;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: none;
            border-radius: 6px;
          }

          .block-card:hover .block-overlay {
            opacity: 1;
          }

          .no-results {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            color: #6c757d;
            text-align: center;
          }

          .no-results i {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.5;
          }

          .no-results h3 {
            margin: 0 0 8px 0;
            font-size: 18px;
          }

          .no-results p {
            margin: 0;
            font-size: 14px;
          }

          @media (max-width: 768px) {
            .library-header {
              flex-direction: column;
              gap: 16px;
              align-items: stretch;
            }

            .search-container {
              width: 100%;
            }

            .library-categories {
              padding: 0 16px;
            }

            .blocks-grid {
              grid-template-columns: 1fr;
              gap: 12px;
              padding: 16px;
            }

            .category-btn {
              padding: 10px 12px;
              font-size: 13px;
            }
          }
        `}</style>
      </div>
    );
  }
}

ContentBlocksLibrary.propTypes = {
  onBlockSelect: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  className: PropTypes.string
};