"use client";

import { useState } from "react";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === "Be-mabdlt?77") {

      // ✅ On définit correctement le cookie
      document.cookie = "auth=true; path=/; max-age=3600";

      // ✅ Redirection forcée
      window.location.replace("/");

    } else {
      setError("Mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow w-80 space-y-4">

        <h1 className="text-lg font-semibold text-center">
          Accès sécurisé
        </h1>

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full border p-2 rounded text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-slate-900 text-white py-2 rounded"
        >
          Se connecter
        </button>

      </div>
    </div>
  );
}