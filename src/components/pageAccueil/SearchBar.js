import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <form className="sb-search-bar" onSubmit={handleSubmit}>
      <div className="sb-input-container">
        <input
          type="text"
          placeholder="Rechercher une ville, un type de logement..."
          value={searchTerm}
          onChange={handleChange}
          className="sb-input"
        />
        <button type="submit" className="sb-btn">
          🔍
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
