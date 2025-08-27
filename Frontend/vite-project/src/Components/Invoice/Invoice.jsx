import React from "react";
import "./InvoiceStyles.css";
import Sidebar from "../Sidebar";
import Searchere from "../Searchere";

const Invoice = () => {
  return (
    <div id="invoicecontainer">
      <Sidebar />
      <div id="invoicerightpart">
        <div id="invoicetopdiv">
          <h1
            style={{
              color: "white",
              fontSize: "18px",
              fontWeight: "normal",
              margin: "5px 0px",
            }}
          >
            Invoice
          </h1>
          <Searchere />
        </div>
        <div id="invoiceseconddiv">
          <h1>Overall Invoice</h1>
          <div id="invoice_details">
            <div className="invoice_details_div">
              <h3>Recent Transactions</h3>
              <div className="invoice_details_numbers">
                <div>
                  <p>24</p>
                  <p>Last 7 days</p>
                </div>
              </div>
            </div>
            <div className="invoice_details_div">
              <h3>Total Invoices</h3>
              <div className="invoice_details_numbers">
                <div>
                  <p>152</p>
                  <p>Last 7 days</p>
                </div>
                <div>
                  <p>138</p>
                  <p>processed</p>
                </div>
              </div>
            </div>
            <div className="invoice_details_div">
              <h3>Paid Amount</h3>
              <div className="invoice_details_numbers">
                <div>
                  <p>1,20,500</p>
                  <p>Last 7 days</p>
                </div>
                <div>
                  <p>97</p>
                  <p>customers</p>
                </div>
              </div>
            </div>
            <div className="invoice_details_div">
              <h3>Unpaid Amount</h3>
              <div className="invoice_details_numbers">
                <div>
                  <p>45800</p>
                  <p>Last 7 days</p>
                </div>
                <div>
                  <p>18</p>
                  <p>processed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="invoicelistdiv">
          <h1>Invoice List</h1>
          <div>
            <div className="grid_div_invoice_headers">
              <div>Invoice List</div>
              <div>Reference Number</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Due Date</div>
            </div>
            <div className="grid_div_invoice_content">
                
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
