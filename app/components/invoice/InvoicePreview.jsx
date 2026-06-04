"use client";

export default function InvoicePreview({
  invoiceId,
  totals,
  clientName,
  serviceTitle,
  paymentMethod
}) {
  const client = typeof clientName === "string" ? null : clientName;

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "white",
        padding: "50px 40px",
        fontFamily: "Arial, sans-serif",
        color: "#1f2937"
      }}
    >

      {/* ✅ LOGO */}
      <div style={{ marginBottom: "25px" }}>
        <img
          src="https://by-marinea-facturation.vercel.app/logo.png"
          alt="By Marinea"
          style={{ height: "60px" }}
        />
      </div>

      {/* ✅ ENTREPRISE + CLIENT */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "30px"
      }}>

        <div style={{ width: "48%" }}>
          <div style={{ fontSize: "13px", lineHeight: "1.6", color: "#6b7280" }}>
            <strong>By Marinea</strong><br />
            Conseil en image & colorimétrie<br />
            59 rue des Chataigniers<br />
            63112 Blanzat<br />
            bonjour@bymarinea.fr<br />
            <br />
            <strong>SIRET :</strong> À compléter
          </div>
        </div>

        <div style={{ width: "48%" }}>
          <div style={{
            fontSize: "12px",
            color: "#6b7280",
            textTransform: "uppercase",
            marginBottom: "6px"
          }}>
            Client
          </div>

          <div style={{ fontSize: "15px", fontWeight: "600" }}>
            {typeof clientName === "string"
              ? clientName
              : `${client?.lastName || ""} ${client?.firstName || ""}`}
          </div>

          {client?.address && (
            <div style={{ fontSize: "13px", color: "#4b5563", marginTop: "4px" }}>
              {client.address}
            </div>
          )}

          {(client?.email || client?.phone) && (
            <div style={{ fontSize: "13px", color: "#4b5563", marginTop: "4px" }}>
              {client.email}
              {client.email && client.phone ? " — " : ""}
              {client.phone}
            </div>
          )}
        </div>

      </div>

      {/* ✅ BARRE D’INFOS COMPACTE */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "30px"
      }}>

        {/* NUMERO */}
        <div>
          <div style={{ fontSize: "11px", color: "#6b7280" }}>
            N° facture
          </div>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>
            {invoiceId}
          </div>
        </div>

        {/* DATE */}
        <div>
          <div style={{ fontSize: "11px", color: "#6b7280" }}>
            Date
          </div>
          <div style={{ fontSize: "14px" }}>
            {new Date().toLocaleDateString("fr-FR")}
          </div>
        </div>

        {/* PRESTATION */}
        <div>
          <div style={{ fontSize: "11px", color: "#6b7280" }}>
            Prestation
          </div>
          <div style={{ fontSize: "14px" }}>
            {serviceTitle}
          </div>
        </div>

        {/* PAIEMENT */}
        <div>
          <div style={{ fontSize: "11px", color: "#6b7280" }}>
            Paiement
          </div>
          <div style={{ fontSize: "14px" }}>
            {paymentMethod || "-"}
          </div>
        </div>

      </div>

      {/* ✅ TABLEAU */}
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "40px"
      }}>
        <thead>
          <tr style={{
            borderBottom: "2px solid #e5e7eb",
            fontSize: "12px",
            color: "#6b7280"
          }}>
            <th style={{ textAlign: "left", paddingBottom: "10px" }}>
              Description
            </th>
            <th style={{ textAlign: "center" }}>Qté</th>
            <th style={{ textAlign: "center" }}>Prix HT</th>
            <th style={{ textAlign: "right" }}>Total</th>
          </tr>
        </thead>

        <tbody>
          {totals.normalized.map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "12px 0" }}>
                {item.description || "Prestation"}
              </td>
              <td style={{ textAlign: "center" }}>{item.qty}</td>
              <td style={{ textAlign: "center" }}>
                {Number(item.unitPrice).toFixed(2)} €
              </td>
              <td style={{ textAlign: "right" }}>
                {item.totalTTC.toFixed(2)} €
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ TOTAUX */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ width: "260px" }}>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span>Total HT</span>
            <span>{totals.totalHT.toFixed(2)} €</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span>TVA</span>
            <span>{totals.totalVAT.toFixed(2)} €</span>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid black",
            paddingTop: "10px",
            fontWeight: "bold",
            fontSize: "16px"
          }}>
            <span>Total TTC</span>
            <span>{totals.totalTTC.toFixed(2)} €</span>
          </div>

        </div>
      </div>

      {/* ✅ MENTION */}
      <div style={{
        marginTop: "40px",
        textAlign: "center",
        fontSize: "12px",
        color: "#6b7280"
      }}>
        TVA non applicable, article 293B du CGI
      </div>

      {/* ✅ FOOTER */}
      <div style={{
        marginTop: "20px",
        textAlign: "center",
        fontSize: "12px",
        color: "#6b7280"
      }}>
        Merci pour votre confiance
      </div>

    </div>
  );
}
``