"use client";


export default function InvoiceForm({
  items,
  setItems,
  clientName,
  setClientName,
  serviceTitle,
  setServiceTitle
}) {

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      { description: "", qty: 1, unitPrice: 0, vatRate: 0 }
    ]);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated.length ? updated : [{ description: "", qty: 1, unitPrice: 0, vatRate: 0 }]);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-6 p-6">

        <h2 className="text-xl font-semibold text-slate-900">
          Nouvelle prestation
        </h2>

        <div className="space-y-3">

  <input
    className="w-full rounded-xl border border-slate-200 p-3 text-sm"
    placeholder="Nom du client"
    value={clientName}
    onChange={(e) => setClientName(e.target.value)}
  />

  <input
    className="w-full rounded-xl border border-slate-200 p-3 text-sm"
    placeholder="Titre de la prestation"
    value={serviceTitle}
    onChange={(e) => setServiceTitle(e.target.value)}
  />

</div>

<div className="grid grid-cols-4 gap-3 mb-2 px-1">
  <p className="text-xs text-slate-500">Qté</p>
  <p className="text-xs text-slate-500">Prix HT €</p>
  <p className="text-xs text-slate-500">TVA %</p>
  <p className="text-xs text-slate-500 text-right">Total TTC</p>
</div>

        {items.map((item, index) => (
          <div key={index} className="space-y-3 border-b border-slate-100 pb-4">

            <input
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Description"
              value={item.description}
              onChange={(e) => updateItem(index, "description", e.target.value)}
            />

<div className="grid grid-cols-4 gap-3 items-center">

  <input
    type="number"
    className="rounded-xl border border-slate-200 p-2 text-sm"
    value={item.qty}
    onChange={(e) => updateItem(index, "qty", e.target.value)}
  />

  <input
    type="number"
    className="rounded-xl border border-slate-200 p-2 text-sm"
    value={item.unitPrice}
    onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
  />

  <input
    type="number"
    className="rounded-xl border border-slate-200 p-2 text-sm"
    value={item.vatRate}
    onChange={(e) => updateItem(index, "vatRate", e.target.value)}
  />

  <div className="text-sm font-semibold text-slate-900 text-right">
    {(item.qty * item.unitPrice * (1 + item.vatRate / 100)).toFixed(2)} €
  </div>

</div>


            {/* bouton supprimer */}
            <button
              onClick={() => removeItem(index)}
              className="text-sm text-red-500 hover:underline"
            >
              Supprimer la ligne
            </button>

          </div>
        ))}

        {/* bouton ajouter */}
        <button
          onClick={addItem}
          className="w-full rounded-xl border border-slate-200 p-3 text-sm font-medium hover:bg-slate-50"
        >
          + Ajouter une ligne
        </button>

      </div>
    </div>
  );
}