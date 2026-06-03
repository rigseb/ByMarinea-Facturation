"use client";

import { useEffect, useState } from "react";

export default function HistoriquePage() {
  const [invoices, setInvoices] = useState([]);

  // ✅ Charger depuis le navigateur
  useEffect(() => {
    const stored = localStorage.getItem("factures");
    if (stored) {
      setInvoices(JSON.parse(stored));
    }
  }, []);

  // ✅ Grouper par année
  const groupByYear = () => {
    const grouped = {};

    invoices.forEach((inv) => {
      const year = new Date(inv.date).getFullYear();

      if (!grouped[year]) {
        grouped[year] = [];
      }

      grouped[year].push(inv);
    });

    return grouped;
  };

  const groupedInvoices = groupByYear();

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">

        <h1 className="text-2xl font-semibold text-slate-900">
          Historique des factures
        </h1>

        {Object.keys(groupedInvoices).length === 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            Aucune facture enregistrée
          </div>
        )}

        {Object.entries(groupedInvoices).map(([year, invoices]) => {

          const totalYear = invoices.reduce(
            (sum, inv) => sum + inv.totals.totalTTC,
            0
          );

          return (
            <div
              key={year}
              className="rounded-2xl bg-white p-6 shadow-sm space-y-4"
            >

              {/* HEADER ANNEE */}
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-lg font-semibold text-slate-900">
                  {year}
                </h2>
                <span className="text-sm font-medium text-slate-600">
                  {totalYear.toFixed(2)} €
                </span>
              </div>

              {/* LISTE FACTURES */}
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex justify-between items-center text-sm border-b pb-2 last:border-0"
                >
                  <span>
                    {inv.id} – {inv.clientName} – {inv.totals.totalTTC.toFixed(2)} €
                  </span>

                  <button
                    onClick={() => alert("On va relier la facture après ✅")}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    Voir →
                  </button>
                </div>
              ))}

            </div>
          );
        })}

      </div>
    </div>
  );
}