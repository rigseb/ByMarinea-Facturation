"use client";

const PRESTATIONS = [
  { label: "Colorimétrie", price: 100 },
  { label: "Accompagnement shopping", price: 100 },
  { label: "Morphologie", price: 100 },
  { label: "Style Vestimentaire", price: 100 },
  { label: "Coaching Image globale", price: 500 }
];

export default function InvoiceForm({
  items,
  setItems,
  clientName,
  setClientName,
  serviceTitle,
  setServiceTitle,
  paymentMethod,
  setPaymentMethod
}) {
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handlePresetChange = (index, value) => {
    const updated = [...items];
    updated[index].preset = value;

    const selected = PRESTATIONS.find((p) => p.label === value);

    if (selected) {
      updated[index].description = selected.label;
      updated[index].unitPrice = selected.price;
    }

    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        preset: "",
        description: "",
        qty: 1,
        unitPrice: 0,
        vatRate: 0
      }
    ]);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);

    setItems(
      updated.length
        ? updated
        : [
            {
              preset: "",
              description: "",
              qty: 1,
              unitPrice: 0,
              vatRate: 0
            }
          ]
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-6 p-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Nouvelle prestation
        </h2>

        {/* INFOS CLIENT */}
        <div className="space-y-3">
          <input
            className="w-full rounded-xl border border-slate-200 p-3 text-sm"
            placeholder="Nom"
            value={clientName.lastName || ""}
            onChange={(e) =>
              setClientName({
                ...clientName,
                lastName: e.target.value.toUpperCase()
              })
            }
          />

          <input
            className="w-full rounded-xl border border-slate-200 p-3 text-sm"
            placeholder="Prénom"
            value={clientName.firstName || ""}
            onChange={(e) =>
              setClientName({
                ...clientName,
                firstName:
                  e.target.value.charAt(0).toUpperCase() +
                  e.target.value.slice(1).toLowerCase()
              })
            }
          />

          <input
            className="w-full rounded-xl border border-slate-200 p-3 text-sm"
            placeholder="Adresse"
            value={clientName.address || ""}
            onChange={(e) =>
              setClientName({
                ...clientName,
                address: e.target.value
              })
            }
          />

          <input
            className="w-full rounded-xl border border-slate-200 p-3 text-sm"
            placeholder="Email"
            value={clientName.email || ""}
            onChange={(e) =>
              setClientName({
                ...clientName,
                email: e.target.value
              })
            }
          />

          <input
            className="w-full rounded-xl border border-slate-200 p-3 text-sm"
            placeholder="Téléphone"
            value={clientName.phone || ""}
            onChange={(e) =>
              setClientName({
                ...clientName,
                phone: e.target.value
              })
            }
          />

          <input
            className="w-full rounded-xl border border-slate-200 p-3 text-sm"
            placeholder="Titre global de la facture (optionnel)"
            value={serviceTitle}
            onChange={(e) => setServiceTitle(e.target.value)}
          />

          {/* MODE DE PAIEMENT */}
          <select
            className="w-full rounded-xl border border-slate-200 p-3 text-sm bg-white"
            value={paymentMethod || ""}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Mode de paiement</option>
            <option value="CB">CB</option>
            <option value="Espèces">Espèces</option>
            <option value="Virement">Virement</option>
            <option value="Chèque">Chèque</option>
          </select>
        </div>

        {/* ENTÊTES */}
        <div className="grid grid-cols-4 gap-3 mb-2 px-1">
          <p className="text-xs text-slate-500">Qté</p>
          <p className="text-xs text-slate-500">Prix HT €</p>
          <p className="text-xs text-slate-500">TVA %</p>
          <p className="text-xs text-slate-500 text-right">Total TTC</p>
        </div>

        {/* LIGNES */}
        {items.map((item, index) => (
          <div key={index} className="space-y-3 border-b border-slate-100 pb-4">
            <select
              className="w-full rounded-xl border border-slate-200 p-3 text-sm bg-white"
              value={item.preset || ""}
              onChange={(e) => handlePresetChange(index, e.target.value)}
            >
              <option value="">Choisir une prestation type (optionnel)</option>
              {PRESTATIONS.map((prestation) => (
                <option key={prestation.label} value={prestation.label}>
                  {prestation.label}
                </option>
              ))}
            </select>

            <input
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Description libre de la prestation"
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

              <div className="text-sm font-medium text-slate-900 text-right">
                {(
                  Number(item.qty || 0) *
                  Number(item.unitPrice || 0) *
                  (1 + Number(item.vatRate || 0) / 100)
                ).toFixed(2)} €
              </div>
            </div>

            <button
              onClick={() => removeItem(index)}
              className="text-sm text-red-500 hover:underline"
            >
              Supprimer la ligne
            </button>
          </div>
        ))}

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
