"use client";

import React, { useMemo, useState, useEffect } from "react";
import { computeTotals } from "./lib/calculations";
import InvoicePreview from "./components/invoice/InvoicePreview";
import InvoiceForm from "./components/invoice/InvoiceForm";

export default function Page() {

  // ✅ Lignes de facture
  const [items, setItems] = useState([
    { description: "Test prestation", qty: 1, unitPrice: 100, vatRate: 0 }
  ]);

  // ✅ Infos client
  const [clientName, setClientName] = useState("");
  const [serviceTitle, setServiceTitle] = useState("Conseil en image");

  // ✅ Historique
  const [savedInvoices, setSavedInvoices] = useState([]);

  // ✅ Calculs
  const totals = useMemo(() => computeTotals(items), [items]);

  // ✅ Chargement au démarrage
  useEffect(() => {
    const stored = localStorage.getItem("factures");
    if (stored) {
      setSavedInvoices(JSON.parse(stored));
    }

    // ✅ Recharge depuis historique
    const selected = localStorage.getItem("selectedInvoice");
    if (selected) {
      const invoice = JSON.parse(selected);

      setClientName(invoice.clientName);
      setServiceTitle(invoice.serviceTitle);
      setItems(invoice.items);

      localStorage.removeItem("selectedInvoice");
    }

  }, []);

  // ✅ SAUVEGARDE AVEC NUMÉROTATION PROPRE
  const saveInvoice = () => {

    const year = new Date().getFullYear();

    // ✅ filtrer les factures de l’année
    const invoicesThisYear = savedInvoices.filter(
      (inv) => new Date(inv.date).getFullYear() === year
    );

    // ✅ numéro suivant
    const nextNumber = invoicesThisYear.length + 1;

    // ✅ format 001
    const formattedNumber = String(nextNumber).padStart(3, "0");

    // ✅ ID final
    const invoiceId = `BM-${year}-${formattedNumber}`;

    const newInvoiceData = {
      id: invoiceId,
      date: new Date().toISOString(),
      clientName,
      serviceTitle,
      items,
      totals
    };

    const updatedInvoices = [newInvoiceData, ...savedInvoices];

    setSavedInvoices(updatedInvoices);
    localStorage.setItem("factures", JSON.stringify(updatedInvoices));
  };

  // ✅ NOUVELLE FACTURE
  const newInvoice = () => {
    setItems([
      { description: "", qty: 1, unitPrice: 0, vatRate: 0 }
    ]);
    setClientName("");
    setServiceTitle("Conseil en image");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* ✅ HEADER ACTIONS */}
      <div className="flex justify-between mb-4">

        <div className="flex gap-2">

          <button
            onClick={saveInvoice}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm hover:bg-slate-700"
          >
            Enregistrer
          </button>

          <button
            onClick={newInvoice}
            className="px-4 py-2 border border-slate-300 rounded-xl text-sm hover:bg-slate-100"
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

      {/* ✅ CONTENU PRINCIPAL */}
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">

        {/* GAUCHE */}
        <InvoiceForm 
          items={items} 
          setItems={setItems}
          clientName={clientName}
          setClientName={setClientName}
          serviceTitle={serviceTitle}
          setServiceTitle={setServiceTitle}
        />

        {/* DROITE */}
        <InvoicePreview 
          totals={totals}
          clientName={clientName}
          serviceTitle={serviceTitle}
        />

      </div>

    </div>
  );
}