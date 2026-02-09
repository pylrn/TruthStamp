"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on?: (event: string, handler: (...args: any[]) => void) => void;
      removeListener?: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

type IssuerRole = "viewer" | "reviewer" | "approver";

export function useIssuerAuth() {
  const [address, setAddress] = useState<string | null>(null);
  const [role, setRole] = useState<IssuerRole>("viewer");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("truthstamp_issuer_address");
    if (saved) {
      setAddress(saved);
      computeRole(saved);
    }
  }, []);

  const computeRole = (addr: string) => {
    const lower = addr.toLowerCase();
    const approvers =
      process.env.NEXT_PUBLIC_APPROVER_ADDRESSES?.toLowerCase().split(",") ??
      [];
    const reviewers =
      process.env.NEXT_PUBLIC_REVIEWER_ADDRESSES?.toLowerCase().split(",") ??
      [];

    if (approvers.includes(lower)) {
      setRole("approver");
    } else if (reviewers.includes(lower)) {
      setRole("reviewer");
    } else {
      setRole("viewer");
    }
  };

  const connect = async () => {
    if (!window.ethereum) {
      alert("MetaMask (or compatible wallet) is required for issuer login.");
      return;
    }
    setLoading(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const addr = accounts[0] as string;
      setAddress(addr);
      window.localStorage.setItem("truthstamp_issuer_address", addr);
      computeRole(addr);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setRole("viewer");
    window.localStorage.removeItem("truthstamp_issuer_address");
  };

  return {
    address,
    role,
    loading,
    connect,
    disconnect,
    isConnected: !!address,
    canApprove: role === "approver",
    canReview: role === "approver" || role === "reviewer",
  };
}

