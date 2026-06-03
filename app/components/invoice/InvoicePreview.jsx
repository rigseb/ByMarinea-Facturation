"use client";

export default function InvoicePreview({ totals, clientName, serviceTitle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-10">

        <div className="space-y-2">
          <img 
            src="/logo.png" 
            alt="By Marinea"
            className="h-14 object-contain"
          />
          <p className="text-[11px] uppercase tracking-wider text-slate-400">
            Conseil en image & colorimétrie
          </p>
        </div>

        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wider text-slate-400">
            Facture
          </p>
          <p className="text-xs text-slate-500">
            {new Date().toLocaleDateString()}
          </p>
        </div>

      </div>

      {/* CLIENT */}
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-wider text-slate-400">
          Client
        </p>
        <p className="text-sm font-medium text-slate-800">
          {clientName || "Nom du client"}
        </p>
      </div>

      {/* SERVICE */}
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-wider text-slate-400">
          Prestation
        </p>
        <p className="text-sm font-medium text-slate-800">
          {serviceTitle}
        </p>
      </div>

      {/* TABLEAU */}
      <div className="mb-8">

        <div className="grid grid-cols-4 text-[11px] uppercase tracking-wide text-slate-400 border-b pb-2">
          <span>Description</span>
          <span className="text-center">Qté</span>
          <span className="text-center">Prix HT</span>
          <span className="text-right">Total</span>
        </div>

        {totals.normalized.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-4 text-sm py-2 border-b last:border-0"
          >
            <span className="text-slate-700">
              {item.description || "Prestation"}
            </span>
            <span className="text-center text-slate-600">
              {item.qty}
            </span>
            <span className="text-center text-slate-600">
              {Number(item.unitPrice).toFixed(2)} €
            </span>
            <span className="text-right font-medium text-slate-800">
              {item.totalTTC.toFixed(2)} €
            </span>
          </div>
        ))}

      </div>

      {/* TOTAUX */}
      <div className="flex justify-end">
        <div className="w-60 space-y-2 text-sm">

          <div className="flex justify-between text-slate-500">
            <span>Total HT</span>
            <span>{totals.totalHT.toFixed(2)} €</span>
          </div>

          <div className="flex justify-between text-slate-500">
            <span>TVA</span>
            <span>{totals.totalVAT.toFixed(2)} €</span>
          </div>

          <div className="border-t pt-2 flex justify-between font-medium text-slate-800 text-base">
            <span>Total TTC</span>
            <span>{totals.totalTTC.toFixed(2)} €</span>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-10 text-[11px] text-slate-400 text-center tracking-wide">
        Merci pour votre confiance
      </div>

    </div>
  );
}
