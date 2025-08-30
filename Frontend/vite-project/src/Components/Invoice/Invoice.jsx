import React from "react";
import "./InvoiceStyles.css";
import Sidebar from "../Sidebar";
import Searchere from "../Searchere";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const Invoice = () => {
  const [summary, setSummary] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsontoken = localStorage.getItem("token"); // assuming JWT stored here
        const token=JSON.parse(jsontoken)
        const headers = { Authorization: `Bearer ${token}` };

         const [summaryRes, invoicesRes] = await Promise.all([
           axios.get("http://localhost:8000/invoices/summary", { headers }),
           axios.get(`http://localhost:8000/invoices?page=${page}&limit=${limit}`, { headers }),
         ]);

        setSummary(summaryRes.data);
        setInvoices(invoicesRes.data.data);
      } catch (err) {
        console.error("Error fetching invoices:", err);
      }
    };
    fetchData();
  }, [page]);
  
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
                  <p>{summary?.recentTransactions || 0}</p>
                  <p>Last 7 days</p>
                </div>
              </div>
            </div>
            <div className="invoice_details_div">
              <h3>Total Invoices</h3>
              <div className="invoice_details_numbers">
                <div>
                  <p>{summary?.totalInvoices || 0}</p>
                  <p>Last 7 days</p>
                </div>
                <div>
                  <p>{summary?.processedInvoices || 0}</p>
                  <p>processed</p>
                </div>
              </div>
            </div>
            <div className="invoice_details_div">
              <h3>Paid Amount</h3>
              <div className="invoice_details_numbers">
                <div>
                  <p>{summary?.paidAmount || 0}</p>
                  <p>Last 7 days</p>
                </div>
                <div>
                  <p>{summary?.customers || 0}</p>
                  <p>customers</p>
                </div>
              </div>
            </div>
            <div className="invoice_details_div">
              <h3>Unpaid Amount</h3>
              <div className="invoice_details_numbers">
                <div>
                  <p>{summary?.unpaidAmount || 0}</p>
                  <p>Last 7 days</p>
                </div>
                <div>
                  <p>{summary?.pendingInvoices || 0}</p>
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
               <div>Actions</div>
            </div>
          </div>
           {invoices && invoices.map((inv) => (
              <div className="grid_div_invoice_content" key={inv._id}>
                <div>{inv.invoiceId}</div>
                <div>{inv.referenceNumber || "-"}</div>
                <div>₹ {inv.totalAmount}</div>
                <div>{inv.status}</div>
                <div>{new Date(inv.dueDate).toLocaleDateString()}</div>
                <div>
                  <button onClick={() => console.log("View", inv._id)}>View</button>
                  <button onClick={() => console.log("Delete", inv._id)}>Delete</button>
                </div>
              </div>
            ))}
        </div>
         {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
            <button disabled={page === 1} onClick={() => setPage(page - 1)} style={{cursor:'pointer'}}>Previous</button>
            <span>Page {page}</span>
            <button onClick={() => setPage(page + 1)} style={{cursor:'pointer'}}>Next</button>
          </div>
      </div>
    </div>
  );
};

export default Invoice;
