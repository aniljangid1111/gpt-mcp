
"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

type InvoiceItem = {
  productName: string;
  unitPrice: number;
  quantity: number;
};

type InvoiceDownloadButtonProps = {
  orderId: string;
  currency: string;
  totalAmount: number;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  address: string;
  items: InvoiceItem[];
};

export default function InvoiceDownloadButton({
  orderId,
  currency,
  totalAmount,
  customerName,
  customerEmail,
  customerPhone,
  address,
  items,
}: InvoiceDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  function downloadInvoice() {
    setDownloading(true);

    try {
      const pdf = new jsPDF();
      const money = (amount: number) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency.toUpperCase(),
        }).format(amount / 100);

      let y = 20;

      pdf.setFontSize(20);
      pdf.text("CLEANERGY BATTERY", 15, y);

      y += 10;
      pdf.setFontSize(16);
      pdf.text("INVOICE / PAYMENT RECEIPT", 15, y);

      y += 12;
      pdf.setFontSize(10);
      pdf.text(`Order ID: ${orderId}`, 15, y);

      y += 7;
      pdf.text(`Date: ${new Date().toLocaleDateString("en-US")}`, 15, y);

      y += 7;
      pdf.text("Payment Status: PAID", 15, y);

      y += 13;
      pdf.setFontSize(12);
      pdf.text("Customer Details", 15, y);

      y += 7;
      pdf.setFontSize(10);
      pdf.text(`Name: ${customerName || "Not provided"}`, 15, y);

      y += 6;
      pdf.text(`Email: ${customerEmail || "Not provided"}`, 15, y);

      y += 6;
      pdf.text(`Phone: ${customerPhone || "Not provided"}`, 15, y);

      y += 6;
      const addressLines = pdf.splitTextToSize(
        `Address: ${address || "Not provided"}`,
        175
      );
      pdf.text(addressLines, 15, y);
      y += addressLines.length * 5 + 10;

      pdf.setFontSize(12);
      pdf.text("Purchased Products", 15, y);
      y += 9;

      pdf.setFontSize(9);
      pdf.text("Product", 15, y);
      pdf.text("Qty", 110, y);
      pdf.text("Unit Price", 130, y);
      pdf.text("Amount", 170, y, { align: "right" });

      y += 3;
      pdf.line(15, y, 195, y);
      y += 7;

      for (const item of items) {
        const nameLines = pdf.splitTextToSize(item.productName, 85);

        if (y + nameLines.length * 5 > 265) {
          pdf.addPage();
          y = 20;
        }

        pdf.text(nameLines, 15, y);
        pdf.text(String(item.quantity), 110, y);
        pdf.text(money(item.unitPrice), 130, y);
        pdf.text(
          money(item.unitPrice * item.quantity),
          195,
          y,
          { align: "right" }
        );

        y += Math.max(nameLines.length * 5, 7);
      }

      y += 5;

      if (y > 270) {
        pdf.addPage();
        y = 20;
      }

      pdf.line(15, y, 195, y);
      y += 10;

      pdf.setFontSize(13);
      pdf.text("Total Paid", 130, y);
      pdf.text(money(totalAmount), 195, y, { align: "right" });

      y += 15;
      pdf.setFontSize(9);
      pdf.text(
        "Thank you for shopping with Cleanergy Battery.",
        15,
        y
      );

      pdf.save(`Cleanergy-Invoice-${orderId}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={downloadInvoice}
      disabled={downloading}
      style={{
        background: "#166534",
        color: "#fff",
        border: 0,
        borderRadius: 9,
        padding: "11px 16px",
        fontWeight: 600,
        cursor: "pointer",
        width: "100%",
      }}
    >
      {downloading ? "Preparing invoice..." : "Download Invoice PDF"}
    </button>
  );
}