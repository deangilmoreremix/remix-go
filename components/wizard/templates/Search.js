import React from 'react';

const Search = (props) => {
  let queryString;

  const queryHandler = () => {
    const data = document.getElementById(`query`).value;
    props.onSearch(data);
  };

  const SearchInput = (data) => {
    return (
      <div className="search-input">
        <input className="vr-dashed" 
          type="text" name="query" id="query"
          placeholder="Search through your templates..."
          value={queryString} onChange={queryHandler} /> 
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
