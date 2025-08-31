import React, { useEffect, useState } from "react";
import "./InvoiceStyles.css";
import Sidebar from "../Sidebar";
import Searchere from "../Searchere";
import axios from "axios";

const Invoice = () => {
  const [openInvoice, setopenInvoice] = useState(false);
  const [summary, setSummary] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openInvoiceView, setOpenInvoiceView] = useState(false);
  const [loading, setLoading] = useState(false);

  // NEW STATES
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState(null);

  // 🔹 Fetch invoices & summary
  const fetchData = async () => {
    try {
      const jsontoken = localStorage.getItem("token");
      const token = JSON.parse(jsontoken);
      const headers = { Authorization: `Bearer ${token}` };

      const [summaryRes, invoicesRes] = await Promise.all([
        axios.get("http://localhost:8000/invoices/summary", { headers }),
        axios.get(
          `http://localhost:8000/invoices?page=${page}&limit=${limit}`,
          { headers }
        ),
      ]);

      setSummary(summaryRes.data);
      setInvoices(invoicesRes.data.data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, invoices]);

  // 🔹 Close modal
  const onClose = () => {
    setopenInvoice(false);
    setProductId("");
    setQuantity(1);
  };

  // 🔹 Close 3-dot menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setMenuOpenId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 🔹 View invoice
  const handleView = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axios.get(`http://localhost:8000/invoices/${id}`, {
        headers,
      });
      setSelectedInvoice(data.data);
      setOpenInvoiceView(true);
      setMenuOpenId(null);
    } catch (err) {
      console.error("Error fetching invoice:", err);
    }
  };

  // 🔹 Create invoice
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || quantity <= 0) {
      return alert("Please select a product and enter a valid quantity");
    }
    setLoading(true);
    try {
      const jsontoken = localStorage.getItem("token");
      const token = JSON.parse(jsontoken);
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(
        "http://localhost:8000/invoices",
        { items: [{ productId, quantity }] },
        { headers }
      );

      onClose();
      fetchData(); // refresh after create
    } catch (err) {
      console.error(
        "Error creating invoice:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Mark as paid
  const handleMarkPaid = async (id) => {
    try {
      const jsontoken = localStorage.getItem("token");
      const token = JSON.parse(jsontoken);
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.patch(
        `http://localhost:8000/invoices/${id}/pay`,
        {},
        { headers }
      );

      setInvoices((prev) =>
        prev.map((inv) =>
          inv._id === id
            ? {
                ...inv,
                status: "Paid",
                referenceNumber: res.data.data.referenceNumber,
              }
            : inv
        )
      );
      fetchData(); // refresh
      setMenuOpenId(null);
    } catch (err) {
      console.error("Error marking as paid:", err);
    }
  };

  // 🔹 Fetch products when adding invoice
  useEffect(() => {
    if (openInvoice && products.length === 0) {
      const fetchProducts = async () => {
        try {
          const token = JSON.parse(localStorage.getItem("token"));
          const headers = { Authorization: `Bearer ${token}` };
          const res = await axios.get(
            "http://localhost:8000/product/getproducts",
            { headers }
          );
          setProducts(res.data.data || []);
        } catch (err) {
          console.error("Error fetching products:", err);
        }
      };
      fetchProducts();
    }
  }, [openInvoice]);

  // 🔹 Delete invoice
  const handleDelete = async (id) => {
    try {
      const jsontoken = localStorage.getItem("token");
      const token = JSON.parse(jsontoken);
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:8000/invoices/${id}/delete`, {
        headers,
      });
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      setDeleteInvoiceId(null);
      fetchData(); // refresh
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  return (
    <div id="invoicecontainer">
      <Sidebar />
      <div id="invoicerightpart">
        {/* Header */}
        <div id="invoicetopdiv">
          <h1
            style={{ color: "white", fontSize: "18px", fontWeight: "normal" }}
          >
            Invoice
          </h1>
          <Searchere />
        </div>

        {/* SUMMARY */}
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
                  <p>{summary?.totalInvoices || 0}</p>
                  <p>Processed</p>
                </div>
              </div>
            </div>
            <div className="invoice_details_div">
              <h3>Paid Amount</h3>
              <div className="invoice_details_numbers">
                <div>
                  <p>₹{summary?.paidAmount || 0}</p>
                  <p>Last 7 days</p>
                </div>
                <div>
                  <p>{summary?.customers}</p>
                  <p>customers</p>
                </div>
              </div>
            </div>
            <div className="invoice_details_div">
              <h3>Unpaid Amount</h3>
              <div className="invoice_details_numbers">
                <div>
                  <p>₹{summary?.unpaidAmount || 0}</p>
                  <p>ordered</p>
                </div>
                <div>
                  <p>{summary?.pendingInvoices}</p>
                  <p>pending payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LIST */}
        <div id="invoicelistdiv">
          <h1>Invoice List</h1>
          <div className="grid_div_invoice_headers">
            <div>Invoice ID</div>
            <div>Reference Number</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Due Date</div>
          </div>

          {invoices.map((inv) => (
            <div className="grid_div_invoice_content" key={inv._id}>
              <div>{inv.invoiceId}</div>
              <div>{inv.referenceNumber || "-"}</div>
              <div>₹ {inv.totalAmount}</div>
              <div>{inv.status}</div>

              {/* Due Date + Three dots */}
              <div style={{ position: "relative" }}>
                {new Date(inv.dueDate).toLocaleDateString()}
                <button
                  style={{
                    marginLeft: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: "black",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === inv._id ? null : inv._id);
                  }}
                >
                  ⋮
                </button>

                {menuOpenId === inv._id && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      background: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      zIndex: 10,
                    }}
                  >
                    <button
                      style={{
                        cursor: "pointer",
                        display: "block",
                        width: "100%",
                      }}
                      onClick={() => handleView(inv._id)}
                    >
                      View Invoice
                    </button>
                    {inv.status !== "Paid" && (
                      <button
                        style={{
                          cursor: "pointer",
                          display: "block",
                          width: "100%",
                        }}
                        onClick={() => handleMarkPaid(inv._id)}
                      >
                        Mark as Paid
                      </button>
                    )}
                    <button
                      style={{
                        color: "red",
                        cursor: "pointer",
                        display: "block",
                        width: "100%",
                      }}
                      onClick={() => setDeleteInvoiceId(inv._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div style={{marginTop:'20px'}}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>
              <span>Page {page}</span>
              <button onClick={() => setPage(page + 1)}>Next</button>
            </div>

            <button
              onClick={() => setopenInvoice(true)}
              style={{
                width: "80px",
                padding: "3px",
                borderRadius: "8px",
                margin: "auto",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Add Invoice
            </button>
          </div>
        </div>

        {/* PAGINATION */}
      </div>

      {/* DELETE CONFIRMATION */}
      {deleteInvoiceId && (
        <div className="overlay" onClick={() => setDeleteInvoiceId(null)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h2>This Invoice will be deleted.</h2>
            <button onClick={() => setDeleteInvoiceId(null)}>Cancel</button>
            <button onClick={() => handleDelete(deleteInvoiceId)}>
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* CREATE INVOICE POPUP */}
      {openInvoice && (
        <div className="overlay" onClick={onClose}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h2>Create Invoice</h2>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} (Stock: {p.quantity})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter Quantity"
              />

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="button" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW INVOICE POPUP */}
      {openInvoiceView && selectedInvoice && (
        <div className="overlay" onClick={() => setOpenInvoiceView(false)}>
          <div
            className="dialog"
            style={{ width: "700px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ textAlign: "center" }}>INVOICE</h2>
            <div>
              <strong>Invoice #:</strong> {selectedInvoice.invoiceId} <br />
              <strong>Reference:</strong>{" "}
              {selectedInvoice.referenceNumber || "-"} <br />
              <strong>Invoice Date:</strong>{" "}
              {new Date(selectedInvoice.createdAt).toLocaleDateString()} <br />
              <strong>Due Date:</strong>{" "}
              {new Date(selectedInvoice.dueDate).toLocaleDateString()}
            </div>

            <table>
              <thead>
                <tr>
                  <th>Products</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price}</td>
                    <td>₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ textAlign: "right", fontWeight: "bold" }}>
              Total Due: ₹{selectedInvoice.totalAmount}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button onClick={() => setOpenInvoiceView(false)}>Close</button>
              <button>Download</button>
              <button>Print</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
