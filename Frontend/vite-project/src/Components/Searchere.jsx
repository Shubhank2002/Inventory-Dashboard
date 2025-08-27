import React from "react";

const Searchere = () => {
  return (
    <div>
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
        <button style={{cursor:'pointer',backgroundColor:'inherit'}}>
          <img src="/Home_assets/search_icon.png" alt="" />
        </button>
        <input
          type="text"
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
