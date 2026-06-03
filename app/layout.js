import "./globals.css";

export const metadata = {
  title: "Application facturation",
  description: "Application de facturation prestations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}