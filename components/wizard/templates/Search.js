import React, { Component } from 'react';

export default class Search extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.queryInput.focus();
  }

  render() {
    const { state } = this.props;
    const{ query } = state;
    
    const queryHandler = () => {
      const { value } = this.queryInput;
      this.props.onSearch(value);
    }  
    return (
      <div className="search-template">
        <div className="search-field">
          <div className="search-input">
            <input className="vr-dashed" 
              type="text" name="query"
              placeholder="Search through your templates..."
              value={query}
              onChange={queryHandler}
              ref={(q) => { this.queryInput = q; }}
            /> 
          </div>
          <div className="search-button">
            <a onClick={queryHandler}>
              <img className="search-icon" src="../../../static/images/magnifying-glass.svg" />
            </a>
          </div>
        </div>
      </div>
    );
  }
}
