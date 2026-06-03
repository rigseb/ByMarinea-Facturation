"use client";

export default function HistoriquePage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">

        <h1 className="text-2xl font-semibold text-slate-800 mb-6">
          Historique des factures
        </h1>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-500">
            Aucune facture enregistrée pour le moment
          </p>
        </div>

      </div>
    </div>
  );
}
