const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable');

class UnifiedPDFInvoiceService {
  constructor() {
    this.doc = null;
  }

  // Generate unified transaction invoice PDF
  async generateTransactionInvoice(transactionData, userData = null, adminData = null, type = 'transaction') {
    try {
      const doc = new jsPDF();
      this.doc = doc;

      // Company Branding/Header
      doc.setFontSize(20);
      doc.setTextColor("#1677ff");
      doc.text("Secure USDT", 14, 22);
      doc.setFontSize(12);
      doc.setTextColor("#555555");
      
      // Set invoice title based on type
      let invoiceTitle = "Transaction Receipt";
      switch (type) {
        case 'deposit':
          invoiceTitle = "Deposit Confirmation Invoice";
          break;
        case 'withdrawal':
          invoiceTitle = "Withdrawal Confirmation Invoice";
          break;
        case 'admin_balance':
          invoiceTitle = "Balance Addition Invoice";
          break;
        case 'profit':
          invoiceTitle = "Profit Distribution Invoice";
          break;
        default:
          invoiceTitle = "Transaction Receipt";
      }
      
      doc.text(invoiceTitle, 14, 30);

      // Divider Line
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.5);
      doc.line(14, 34, 196, 34);

      // Transaction Info Table
      const tableData = [
        ["Transaction ID", transactionData.transactionId || transactionData.id || 'N/A'],
        ["Type", this.formatTransactionType(transactionData.type)],
        ["Amount", `${this.formatAmount(transactionData.quantity || transactionData.amount || transactionData.usdtQuantity)} USDT`],
        ["Fee", `${this.formatAmount(transactionData.fee)} USDT`],
        ["Balance After", `${this.formatAmount(transactionData.balance)} USDT`],
        ["Status", transactionData.status ? transactionData.status.toUpperCase() : 'UNKNOWN'],
        ["Date", this.formatDate(transactionData.date)],
        ["Description", transactionData.description || "-"],
      ];

      // Add type-specific fields
      if (transactionData.transactionHash) {
        tableData.push(["Transaction Hash", transactionData.transactionHash]);
      }
      if (transactionData.fromAddress) {
        tableData.push(["From Address", transactionData.fromAddress]);
      }
      if (transactionData.toAddress) {
        tableData.push(["To Address", transactionData.toAddress]);
      }
      if (transactionData.userWalletId) {
        tableData.push(["User Wallet", transactionData.userWalletId]);
      }
      if (transactionData.activeWalleteId) {
        tableData.push(["Active Wallet", transactionData.activeWalleteId]);
      }

      // Add user information if available
      if (userData) {
        tableData.push(["User Name", `${userData.firstName} ${userData.lastName}`]);
        tableData.push(["User Email", userData.email]);
        tableData.push(["User ID", userData._id]);
      }

      // Add admin information if available
      if (adminData) {
        tableData.push(["Admin Name", adminData.name || 'System Admin']);
        tableData.push(["Admin Email", adminData.email || 'admin@secureusdt.com']);
      }

      // Add withdrawal-specific fields
      if (type === 'withdrawal' && transactionData.walletAddress) {
        tableData.push(["Withdrawal Address", transactionData.walletAddress]);
      }
      if (type === 'withdrawal' && transactionData.processingTime) {
        tableData.push(["Processing Time", transactionData.processingTime]);
      }

      // Add admin balance specific fields
      if (type === 'admin_balance' && transactionData.reason) {
        tableData.push(["Reason", transactionData.reason]);
      }

      autoTable(doc, {
        startY: 40,
        head: [["Field", "Details"]],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [22, 119, 255], textColor: 255 },
        bodyStyles: { textColor: 50 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        styles: { cellPadding: 4, fontSize: 11 },
        columnStyles: {
          0: { cellWidth: 60, fontStyle: "bold" },
          1: { cellWidth: 120 },
        },
      });

      // Footer Notes
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(10);
      doc.setTextColor("#888888");
      doc.text("Thank you for your transaction.", 14, finalY);
      doc.text("For support, contact: support@secureusdt.com", 14, finalY + 8);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, finalY + 16);

      return doc.output('datauristring');
    } catch (error) {
      console.error('Error generating unified transaction invoice:', error);
      throw error;
    }
  }

  // Format transaction type
  formatTransactionType(type) {
    if (!type) return 'UNKNOWN';
    return type.replace('_', ' ').toUpperCase();
  }

  // Format amount
  formatAmount(amount) {
    if (!amount) return '0.00';
    return parseFloat(amount).toFixed(2);
  }

  // Format date
  formatDate(date) {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  }

  // Convert PDF to buffer for email attachment
  async pdfToBuffer(pdfDataUri) {
    try {
      // Remove data URI prefix
      const base64Data = pdfDataUri.split(',')[1];
      return Buffer.from(base64Data, 'base64');
    } catch (error) {
      console.error('Error converting PDF to buffer:', error);
      throw error;
    }
  }

  // Legacy methods for backward compatibility
  async generateDepositInvoice(userData, transactionData) {
    return this.generateTransactionInvoice(transactionData, userData, null, 'deposit');
  }

  async generateWithdrawalInvoice(userData, transactionData, withdrawalData) {
    const combinedData = { ...transactionData, ...withdrawalData };
    return this.generateTransactionInvoice(combinedData, userData, null, 'withdrawal');
  }

  async generateAdminBalanceInvoice(userData, transactionData, adminData, reason) {
    const combinedData = { ...transactionData, reason };
    return this.generateTransactionInvoice(combinedData, userData, adminData, 'admin_balance');
  }
}

module.exports = new UnifiedPDFInvoiceService();
