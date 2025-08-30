import React from "react";
import "./InvoiceStyles.css";
import Sidebar from "../Sidebar";
import Searchere from "../Searchere";
import { useEffect } from "react";
import { useState } from "react";
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsontoken = localStorage.getItem("token"); // assuming JWT stored here
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
    fetchData();
  }, [page, invoices]);
  const handleView = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axios.get(`http://localhost:8000/invoices/${id}`, {
        headers,
      });
      setSelectedInvoice(data.data);
      setOpenInvoiceView(true);
    } catch (err) {
      console.error("Error fetching invoice:", err);
    }
  };
  useEffect(() => {
    if (openInvoice) {
      const fetchProducts = async () => {
        try {
          const jsontoken = localStorage.getItem("token");
          const token = JSON.parse(jsontoken);
          const headers = { Authorization: `Bearer ${token}` };
          const res = await axios.get(
            "http://localhost:8000/product/getproducts",
            {
              headers,
            }
          );
          setProducts(res.data.data || []);
        } catch (err) {
          console.error("Error fetching products:", err);
        }
      };
      fetchProducts();
    }
  }, [openInvoice]);
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

      setopenInvoice(false); // close modal
      setProductId("");
      setQuantity(1);
      fetchData(); // refresh invoice list
    } catch (err) {
      console.error(
        "Error creating invoice:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const AddInvoice = async () => {
    setopenInvoice(true);
  };
  const onClose = () => {
    setopenInvoice(false);
  };
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
          {invoices &&
            invoices.map((inv) => (
              <div className="grid_div_invoice_content" key={inv._id}>
                <div>{inv.invoiceId}</div>
                <div>{inv.referenceNumber || "-"}</div>
                <div>₹ {inv.totalAmount}</div>
                <div>{inv.status}</div>
                <div>{new Date(inv.dueDate).toLocaleDateString()}</div>
                <div>
                  <button onClick={() => handleView(inv._id)}>View</button>
                  <button onClick={() => console.log("Delete", inv._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
        {/* Pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={{ cursor: "pointer" }}
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            style={{ cursor: "pointer" }}
          >
            Next
          </button>
        </div>
        <button
          style={{
            width: "100px",
            margin: "auto",
            padding: "5px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={AddInvoice}
        >
          Add Invoice
        </button>
      </div>
      {openInvoice && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "12px",
              width: "400px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginBottom: "20px" }}>Create Invoice</h2>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {/* Product Dropdown */}
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} (Stock: {p.quantity})
                  </option>
                ))}
              </select>

              {/* Quantity Input */}
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter Quantity"
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1,
                    marginRight: "10px",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#ccc",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#242531",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {openInvoiceView && selectedInvoice && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setOpenInvoiceView(false)} // ✅ close on backdrop click
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "12px",
              width: "700px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()} // ✅ prevent closing when clicking inside modal
          >
            <h2 style={{ textAlign: "center" }}>INVOICE</h2>
            <div style={{ marginBottom: "15px" }}>
              <strong>Invoice #:</strong> {selectedInvoice.invoiceId} <br />
              <strong>Reference:</strong>{" "}
              {selectedInvoice.referenceNumber || "-"} <br />
              <strong>Invoice Date:</strong>{" "}
              {new Date(selectedInvoice.createdAt).toLocaleDateString()} <br />
              <strong>Due Date:</strong>{" "}
              {new Date(selectedInvoice.dueDate).toLocaleDateString()}
            </div>

            {/* Items Table */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Products
                  </th>
                  <th style={{ borderBottom: "1px solid #ddd" }}>Qty</th>
                  <th style={{ borderBottom: "1px solid #ddd" }}>Price</th>
                  <th style={{ borderBottom: "1px solid #ddd" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td style={{ textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ textAlign: "right" }}>₹{item.price}</td>
                    <td style={{ textAlign: "right" }}>₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              style={{
                textAlign: "right",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              Total Due: ₹{selectedInvoice.totalAmount}
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setOpenInvoiceView(false)}
                style={{ padding: "8px 12px" }}
              >
                Close
              </button>
              <button style={{ padding: "8px 12px" }}>Download</button>
              <button style={{ padding: "8px 12px" }}>Print</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
