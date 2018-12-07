import React, { Component } from 'react';
import SVGInline from 'react-svg-inline';

import PropTypes from '../../lib/PropTypes';

import SVGSearch from '../../static/images/magnifying-glass.svg';

export default class Search extends Component {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
  };

  state = {
    query: '',
  };

  queryHandler = (value) => {
    const { onSearch } = this.props;
    this.setState({ query: value });
    onSearch(value);
  };

  render() {
    const { placeholder = 'Search through your content...' } = this.props;
    const { query } = this.state;
    return (
      <div className="search-template">
        <div className="search-field">
          <div className="search-input">
            <input
              className="vr-dashed"
              type="text"
              name="query"
              placeholder={placeholder}
              value={query}
              onChange={({ target: { value } }) => this.queryHandler(value)}
            />
          </div>
          <div className="search-button">
            <a onClick={() => this.queryHandler(query)}>
              <SVGInline className="search-icon" classSuffix="" svg={SVGSearch} />
            </a>
          </div>
        </div>
      </div>
    );
  }
}
