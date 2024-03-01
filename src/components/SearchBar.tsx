import React from "react";
import { Link } from "react-router-dom";
import "../styles/SearchBar.css";

const SearchBar = () => {
  return (
    <div className="search_input_history_link">
      <h1 className="title">Gallery App</h1>
      <form action="" className="search_bar">
        <input placeholder="Search" type="search" />
      </form>
      <Link to="/HistoryPage">Go to history page</Link>
    </div>
  );
};
export default SearchBar;
