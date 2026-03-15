import React, { useState } from "react";
import { Feedback } from "../../../components/Feedback";

export default function SuggestionsPage() {
  const [suggestion, setSuggestion] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess("");
    setError("");
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSuccess("Thank you for your suggestion!");
      setSuggestion("");
    }, 1000);
  }

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Suggestions</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1" htmlFor="suggestion">Your Suggestion</label>
          <textarea id="suggestion" className="border p-2 rounded w-full" rows={5} value={suggestion} onChange={e => setSuggestion(e.target.value)} required />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={submitting}>{submitting ? "Submitting..." : "Submit Suggestion"}</button>
        <Feedback type="success" message={success} />
        <Feedback type="error" message={error} />
      </form>
    </main>
  );
}
