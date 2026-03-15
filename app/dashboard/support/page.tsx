import React, { useState } from "react";
import { Feedback } from "../../../components/Feedback";

export default function SupportPage() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
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
      setSuccess("Support ticket submitted! Our team will contact you soon.");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1200);
  }

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Log a Support Ticket</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1" htmlFor="support-email">Your Email</label>
          <input id="support-email" type="email" className="border p-2 rounded w-full" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="support-subject">Subject</label>
          <input id="support-subject" className="border p-2 rounded w-full" value={subject} onChange={e => setSubject(e.target.value)} required />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="support-message">Message</label>
          <textarea id="support-message" className="border p-2 rounded w-full" rows={5} value={message} onChange={e => setMessage(e.target.value)} required />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={submitting}>{submitting ? "Submitting..." : "Submit Ticket"}</button>
        <Feedback type="success" message={success} />
        <Feedback type="error" message={error} />
      </form>
    </main>
  );
}
