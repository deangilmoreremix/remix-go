import React from 'react';

const Search = (props) => {
  let queryString;
  let queryInput;

  const queryHandler = () => {
    const { value } = queryInput;
    props.onSearch(value);
  };

  const SearchInput = () => {
    return (
      <div className="search-input">
        <input className="vr-dashed" 
          type="text" name="query"
          placeholder="Search through your templates..."
          ref={(q) => { queryInput = q; }}
          value={queryString}
          onInput={queryHandler}
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
