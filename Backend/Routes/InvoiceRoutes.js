const express=require('express')
const { CreateInvoice, getInvoiceSummary, getInvoices, markInvoicePaid, getInvoiceById } = require('../Controllers/InvoiceController')
const auth = require('../Middlewares/Auth')
const InvoiceRouter=express.Router()



InvoiceRouter.post('/',auth,CreateInvoice)
InvoiceRouter.get('/summary',auth,getInvoiceSummary)
InvoiceRouter.get('/',auth,getInvoices)
InvoiceRouter.patch("/:id/pay", auth, markInvoicePaid); 
InvoiceRouter.get("/:id", auth, getInvoiceById); 

module.exports=InvoiceRouter