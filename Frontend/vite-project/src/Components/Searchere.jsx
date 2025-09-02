import React, { useEffect, useState } from "react";

const Searchere = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // send query up
  };

  return (
    <div>
      <style>
        {`
          .search-input::placeholder {
            color: rgba(255,255,255,0.6);
            font-weight: bold; 
          }
        `}
      </style>
      <div
        style={{
          display: "flex",
          gap: "5px",
          backgroundColor: "rgba(255,255,255,0.13)",
          borderRadius: "20px",
          width: "fit-content",
          padding: "5px 15px",
          alignItems: "center",
        }}
      >
        <button style={{ cursor: "pointer", backgroundColor: "inherit" }}>
          <img src="/Home_assets/search_icon.png" alt="" />
        </button>
        <input
          type="text"
          value={query}
          placeholder="Search here..."
          className="search-input"
          onChange={handleChange}
          style={{
            border: "1px solid rgba(255,255,255,0.13)",
            backgroundColor: "inherit",
            boxShadow: "none",
            outline: "none",
            color: "white",
            padding: "4px 8px",
            borderRadius: "15px",
          }}
        />
      </div>
    </div>
  );
};

export default Searchere;
