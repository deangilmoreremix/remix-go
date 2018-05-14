import React from 'react';

const Search = (props) => {
  let queryString;

  const queryHandler = () => {
    const data = this.queryInput.value;
    props.onSearch(data);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      queryHandler();
    }
  }

  const SearchInput = (data) => {
    return (
      <div className="search-input">
        <input className="vr-dashed" 
          type="text" name="query"
          placeholder="Search through your templates..."
          ref={(q) => { this.queryInput = q; }}
          value={queryString} 
          onKeyPress={handleKeyPress}
          /> 
      </div>
    );
  };

  const SearchButton = () => {
    return (
      <div className="search-button">
        <a onClick={queryHandler}>
          <img className="search-icon" src="../../../static/images/magnifying-glass.svg" />
        </a>
      </div>
    );
  };

  return (
    <div className="search-template">
      <div className="search-field">
        <SearchInput />
        <SearchButton />
      </div>
    </div>
  );
};

export default Search;
