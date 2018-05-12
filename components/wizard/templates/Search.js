import React from 'react';

const Search = (props) => {

  const queryChangeHandler = (event) => {
    const qry = event.target.value;
    props.onQueryParamsChange(qry);
  };

  const SearchInput = (data) => {
    return (
      <div className="search-input">
        <input className="vr-dashed" 
          type="text" name="query"
          placeholder="Search through your templates..." 
          value={data.query} onChange={queryChangeHandler} />
      </div>
    );
  };

  const qrySearch = (query) => {
    console.log(query);
  };

  const SearchButton = () => {
    return (
      <div className="search-button">
        <a onClick={qrySearch}>
          <img className="search-icon" src="../../../static/images/magnifying-glass.svg" />
        </a>
      </div>
    );
  };

  return (
    <div className="search-template">
      <div className="search-field">
        <SearchInput query={props.query} />
        <SearchButton />
      </div>
    </div>
  );
};

export default Search;
