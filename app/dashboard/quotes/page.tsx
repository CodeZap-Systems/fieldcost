"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ensureClientUserId } from "../../../lib/clientUser";
import { QuoteForm, type QuoteFormData } from "./QuoteForm";
import { QuoteList, type Quote } from "./QuoteList";

function QuotesPageContent() {
  const userId = ensureClientUserId();
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company_id") || "1";

  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleCreateQuote = async (data: QuoteFormData): Promise<boolean> => {
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, user_id: userId }),
      });

      if (res.ok) {
        setSuccessMessage("Quote created successfully!");
        setView("list");
        setTimeout(() => setSuccessMessage(""), 3000);
        return true;
      } else {
        const error = await res.json();
        console.error("Error creating quote:", error);
        return false;
      }
    } catch (err) {
      console.error("Exception creating quote:", err);
      return false;
    }
  };

  const handleUpdateQuote = async (data: QuoteFormData): Promise<boolean> => {
    if (!selectedQuote) return false;

    try {
      const res = await fetch(`/api/quotes?id=${selectedQuote.id}&user_id=${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccessMessage("Quote updated successfully!");
        setView("list");
        setTimeout(() => setSuccessMessage(""), 3000);
        return true;
      } else {
        const error = await res.json();
        console.error("Error updating quote:", error);
        return false;
      }
    } catch (err) {
      console.error("Exception updating quote:", err);
      return false;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {view === "list" && (
        <QuoteList
          companyId={companyId}
          onCreateNew={() => {
            setSelectedQuote(null);
            setView("create");
          }}
          onSelectQuote={(quote) => {
            setSelectedQuote(quote);
            setView("edit");
          }}
        />
      )}

      {view === "create" && (
        <QuoteForm
          companyId={companyId}
          onSubmit={handleCreateQuote}
          onCancel={() => setView("list")}
        />
      )}

      {view === "edit" && selectedQuote && (
        <QuoteForm
          existingQuote={selectedQuote}
          companyId={companyId}
          onSubmit={handleUpdateQuote}
          onCancel={() => setView("list")}
        />
      )}
    </div>
  );
}

export default function QuotesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <QuotesPageContent />
    </Suspense>
  );
}
