"use client";

import { useEffect, useState } from "react";

export default function HistoriquePage() {
  const [invoices, setInvoices] = useState([]);

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

  // ✅ EXPORT CSV
  const exportCSV = (data, filename = "factures.csv") => {
    const headers = ["ID", "Date", "Client", "Prestation", "Total TTC"];

    const rows = data.map((inv) => [
      inv.id,
      new Date(inv.date).toLocaleDateString(),
      inv.clientName,
      inv.serviceTitle,
      inv.totals.totalTTC.toFixed(2)
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(";"))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* ✅ RETOUR */}
        <a
          href="/"
          className="inline-block text-sm text-slate-600 hover:text-slate-900"
        >
          ← Retour
        </a>

        <h1 className="text-2xl font-semibold text-slate-900">
          Historique des factures
        </h1>

        {/* ✅ EXPORT GLOBAL */}
        {invoices.length > 0 && (
          <button
            onClick={() => exportCSV(invoices, "historique_global.csv")}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm hover:bg-slate-700"
          >
            Export CSV global
          </button>
        )}

        {Object.keys(groupedInvoices).length === 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            Aucune facture enregistrée
          </div>
        )}

        {Object.entries(groupedInvoices).map(([year, yearInvoices]) => {

          const totalYear = yearInvoices.reduce(
            (sum, inv) => sum + inv.totals.totalTTC,
            0
          );

          return (
            <div
              key={year}
              className="rounded-2xl bg-white p-6 shadow-sm space-y-4"
            >

              {/* ✅ HEADER ANNEE */}
              <div className="flex justify-between items-center border-b pb-2">

                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {year}
                  </h2>

                  <span className="text-sm text-slate-500">
                    {totalYear.toFixed(2)} €
                  </span>
                </div>

                {/* ✅ EXPORT ANNEE */}
                <button
                  onClick={() => exportCSV(yearInvoices, `factures_${year}.csv`)}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Export année →
                </button>

              </div>

              {/* ✅ TABLEAU HEADER */}
              <div className="grid grid-cols-4 text-xs uppercase tracking-wide text-slate-400 border-b pb-2">
                <span>ID</span>
                <span>Client</span>
                <span className="text-center">Montant</span>
                <span className="text-right">Action</span>
              </div>

              {/* ✅ LIGNES */}
              {yearInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="grid grid-cols-4 items-center text-sm py-2 border-b last:border-0"
                >

                  <span className="text-slate-700">{inv.id}</span>

                  <span className="text-slate-700">
                    {inv.clientName || "Client"}
                  </span>

                  <span className="text-center text-slate-600">
                    {inv.totals.totalTTC.toFixed(2)} €
                  </span>

                  <div className="text-right">
                    <button
                      onClick={() => {
                        localStorage.setItem("selectedInvoice", JSON.stringify(inv));
                        window.location.href = "/";
                      }}
                      className="text-slate-600 hover:text-slate-900"
                    >
                      Voir →
                    </button>
                  </div>

                </div>
              ))}

            </div>
          );
        })}

      </div>
    </div>
  );
}
