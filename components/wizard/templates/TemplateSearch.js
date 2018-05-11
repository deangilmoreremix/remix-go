import React from 'react';

const TemplateSearch = (props) => {

  const SearchInput = (query) => {
    return (
      <div className="search-input">
        <input className="vr-dashed" type="text" placeholder="Search through your templates..." />
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

export default TemplateSearch;
