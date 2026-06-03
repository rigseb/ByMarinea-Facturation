"use client";

import React, { useMemo, useState } from "react";
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

  // ✅ Calculs
  const totals = useMemo(() => computeTotals(items), [items]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* ✅ BOUTON HISTORIQUE */}
      <div className="flex justify-end mb-4">
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