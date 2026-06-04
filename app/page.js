"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { computeTotals } from "./lib/calculations";
import InvoicePreview from "./components/invoice/InvoicePreview";
import InvoiceForm from "./components/invoice/InvoiceForm";

const EMPTY_ITEM = {
  preset: "",
  description: "",
  qty: 1,
  unitPrice: 0,
  vatRate: 0,
};

const EMPTY_CLIENT = {
  lastName: "",
  firstName: "",
  address: "",
  email: "",
  phone: "",
};

export default function Page() {
  const previewRef = useRef(null);

  const [items, setItems] = useState([
    { preset: "", description: "Test prestation", qty: 1, unitPrice: 100, vatRate: 0 },
  ]);

  const [clientName, setClientName] = useState(EMPTY_CLIENT);
  const [serviceTitle, setServiceTitle] = useState("Conseil en image");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [savedInvoices, setSavedInvoices] = useState([]);
  const [currentInvoiceId, setCurrentInvoiceId] = useState(null);

  const totals = useMemo(() => computeTotals(items), [items]);

  const buildNextInvoiceId = () => {
    const year = new Date().getFullYear();

    const invoicesThisYear = savedInvoices.filter((inv) => {
      const refDate = inv.date || new Date().toISOString();
      return new Date(refDate).getFullYear() === year;
    });

    const nextNumber = invoicesThisYear.length + 1;
    const formattedNumber = String(nextNumber).padStart(3, "0");

    return `BM-${year}-${formattedNumber}`;
  };

  const displayedInvoiceId = currentInvoiceId || buildNextInvoiceId();

  useEffect(() => {
    const stored = localStorage.getItem("factures");
    if (stored) {
      try {
        setSavedInvoices(JSON.parse(stored));
      } catch (e) {
        console.error("Erreur lecture factures", e);
      }
    }

    const selected = localStorage.getItem("selectedInvoice");
    if (selected) {
      try {
        const invoice = JSON.parse(selected);

        setCurrentInvoiceId(invoice.id || null);

        setClientName(
          typeof invoice.clientName === "string"
            ? {
                ...EMPTY_CLIENT,
                lastName: invoice.clientName,
              }
            : { ...EMPTY_CLIENT, ...(invoice.clientName || {}) }
        );

        setServiceTitle(invoice.serviceTitle || "Conseil en image");
        setPaymentMethod(invoice.paymentMethod || "");

        setItems(
          invoice.items?.length
            ? invoice.items.map((item) => ({
                preset: item.preset || "",
                description: item.description || "",
                qty: item.qty ?? 1,
                unitPrice: item.unitPrice ?? 0,
                vatRate: item.vatRate ?? 0,
              }))
            : [EMPTY_ITEM]
        );

        localStorage.removeItem("selectedInvoice");
      } catch (e) {
        console.error("Erreur lecture facture sélectionnée", e);
      }
    }
  }, []);

  const printInvoice = (invoiceId) => {
    if (!previewRef.current) return;

    const printContents = previewRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=900,height=1200");

    if (!printWindow) {
      alert("Impossible d'ouvrir la fenêtre d'impression.");
      return;
    }

    const today = new Date().toLocaleDateString("fr-FR");

    printWindow.document.open();
    printWindow.document.write(`
      <!doctype html>
      <html lang="fr">
        <head>
          <meta charset="utf-8" />
          <title>Facture ${invoiceId}</title>
          <style>
            @page {
              size: A4;
              margin: 16mm;
            }

            html, body {
              margin: 0;
              padding: 0;
              background: white;
            }

            body {
              font-family: Arial, sans-serif;
              color: #1f2937;
              background: white;
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const saveInvoice = () => {
    const invoiceId = currentInvoiceId || buildNextInvoiceId();

    const newInvoiceData = {
      id: invoiceId,
      date: new Date().toISOString(),
      clientName,
      serviceTitle,
      paymentMethod,
      items,
      totals,
    };

    const updatedInvoices = [
      newInvoiceData,
      ...savedInvoices.filter((inv) => inv.id !== invoiceId),
    ];

    setSavedInvoices(updatedInvoices);
    localStorage.setItem("factures", JSON.stringify(updatedInvoices));
    setCurrentInvoiceId(invoiceId);

    setTimeout(() => {
      printInvoice(invoiceId);
    }, 300);
  };

  const newInvoice = () => {
    setItems([EMPTY_ITEM]);
    setClientName(EMPTY_CLIENT);
    setServiceTitle("Conseil en image");
    setPaymentMethod("");
    setCurrentInvoiceId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <div className="mx-auto mb-4 flex max-w-5xl justify-between">
        <div className="flex gap-2">
          <button
            onClick={saveInvoice}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
          >
            Enregistrer et imprimer
          </button>

          <button
            onClick={newInvoice}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
          >
            Nouvelle facture
          </button>
        </div>

        <a
          href="/historique"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Historique →
        </a>
      </div>

      {/* CONTENU */}
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <InvoiceForm
          items={items}
          setItems={setItems}
          clientName={clientName}
          setClientName={setClientName}
          serviceTitle={serviceTitle}
          setServiceTitle={setServiceTitle}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />

        <div ref={previewRef}>
          <InvoicePreview
            invoiceId={displayedInvoiceId}
            totals={totals}
            clientName={clientName}
            serviceTitle={serviceTitle}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>
    </div>
  );
}