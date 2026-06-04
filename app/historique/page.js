"use client";

import { useEffect, useState } from "react";

export default function HistoriquePage() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("factures");
    if (stored) {
      setInvoices(JSON.parse(stored));
    }
  }, []);

  // ✅ SUPPRESSION
  const deleteInvoice = (id) => {
    const updated = invoices.filter((inv) => inv.id !== id);
    setInvoices(updated);
    localStorage.setItem("factures", JSON.stringify(updated));
  };

  // ✅ GROUP BY YEAR
  const groupByYear = () => {
    const grouped = {};
    invoices.forEach((inv) => {
      const year = new Date(inv.date).getFullYear();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(inv);
    });
    return grouped;
  };

  const groupedInvoices = groupByYear();

  // ✅ CLIENT DISPLAY
  const getClientDisplayName = (client) => {
    if (!client) return "Client";
    if (typeof client === "string") return client;
    return `${client.lastName || ""} ${client.firstName || ""}`.trim();
  };

  // ✅ FILTRE NOM
  const getClientLastName = (client) => {
    if (!client) return "";
    if (typeof client === "string") return client.toUpperCase();
    return (client.lastName || "").toUpperCase();
  };

  // ✅ EXPORT CSV COMPLET AVEC LIGNES
  const exportCSV = (data, filename = "factures.csv") => {

    const headers = [
      "ID",
      "Date",
      "Nom",
      "Prénom",
      "Prestation globale",
      "Services détaillés",
      "Quantités",
      "Prix unitaires HT",
      "TVA %",
      "Total lignes TTC",
      "Total TTC facture"
    ];

    const rows = data.map((inv) => {
      const isLegacy = typeof inv.clientName === "string";

      const items = Array.isArray(inv.items) ? inv.items : [];

      // ✅ fallback si ancienne facture sans lignes
      const safeItems = items.length
        ? items
        : [{
            description: inv.serviceTitle || "Prestation",
            qty: 1,
            unitPrice: inv.totals?.totalHT || inv.totals?.totalTTC || 0,
            vatRate: 0
          }];

      const services = safeItems.map(i => i.description || "").join(" | ");
      const qtys = safeItems.map(i => i.qty ?? 1).join(" | ");
      const prices = safeItems.map(i => Number(i.unitPrice || 0).toFixed(2)).join(" | ");
      const vatRates = safeItems.map(i => i.vatRate ?? 0).join(" | ");

      const totalsLines = safeItems.map(item => {
        const total =
          Number(item.qty || 1) *
          Number(item.unitPrice || 0) *
          (1 + Number(item.vatRate || 0) / 100);
        return total.toFixed(2);
      }).join(" | ");

      return [
        inv.id,
        new Date(inv.date).toLocaleDateString("fr-FR"),
        isLegacy ? inv.clientName : inv.clientName?.lastName || "",
        isLegacy ? "" : inv.clientName?.firstName || "",
        inv.serviceTitle || "",
        services,
        qtys,
        prices,
        vatRates,
        totalsLines,
        inv.totals?.totalTTC?.toFixed(2) || "0.00"
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.join(";"))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* ✅ RETOUR CORRIGÉ */}
        <a href="/" className="text-sm text-slate-600 hover:text-slate-900">
          ← Retour
        </a>

        <h1 className="text-2xl font-semibold">Historique des factures</h1>

        {/* ✅ FILTRE */}
        <input
          placeholder="Rechercher par nom (ex : DUPONT)"
          className="w-full rounded-xl border p-3 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value.toUpperCase())}
        />

        {/* ✅ EXPORT GLOBAL */}
        {invoices.length > 0 && (
          <button
            onClick={() => exportCSV(invoices)}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm"
          >
            Export CSV global
          </button>
        )}

        {/* ✅ PAR ANNÉE */}
        {Object.entries(groupedInvoices).map(([year, yearInvoices]) => {

          const filtered = yearInvoices.filter((inv) =>
            getClientLastName(inv.clientName).includes(search)
          );

          if (!filtered.length) return null;

          const totalYear = filtered.reduce(
            (sum, inv) => sum + (inv.totals?.totalTTC || 0),
            0
          );

          return (
            <div key={year} className="bg-white p-6 rounded-xl space-y-4">

              <div className="flex justify-between border-b pb-2">
                <div className="flex gap-4">
                  <h2>{year}</h2>
                  <span>{totalYear.toFixed(2)} €</span>
                </div>

                <button
                  onClick={() => exportCSV(filtered, `factures_${year}.csv`)}
                  className="text-sm text-slate-600"
                >
                  Export année →
                </button>
              </div>

              {/* ✅ HEADER */}
              <div className="grid grid-cols-5 text-xs text-slate-400 border-b pb-2">
                <span>ID</span>
                <span>Client</span>
                <span className="text-center">Montant</span>
                <span className="text-center">Voir</span>
                <span className="text-right">Supprimer</span>
              </div>

              {/* ✅ LIGNES */}
              {filtered.map((inv) => (
                <div key={inv.id} className="grid grid-cols-5 py-2 border-b">

                  <span>{inv.id}</span>

                  <span>{getClientDisplayName(inv.clientName)}</span>

                  <span className="text-center">
                    {inv.totals?.totalTTC?.toFixed(2)} €
                  </span>

                  <div className="text-center">
                    <button
                      onClick={() => {
                        localStorage.setItem("selectedInvoice", JSON.stringify(inv));
                        window.location.href = "/";
                      }}
                      className="text-slate-600"
                    >
                      Voir →
                    </button>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={() => deleteInvoice(inv.id)}
                      className="text-red-500"
                    >
                      Supprimer
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
