"use client";

import { useState } from "react";

export default function AdminDashboard() {
  const [hash, setHash] = useState("");

  const approve = async () => {
    await fetch(`http://localhost:8000/admin/approve/${hash}`, {
      method: "POST",
    });
    alert("Approved & minted");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <input
        placeholder="Paste certificate hash"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
        className="border p-2"
      />

      <button
        onClick={approve}
        className="mt-4 px-6 py-2 bg-emerald-500 text-black rounded"
      >
        Approve Certificate
      </button>
    </div>
  );
}
