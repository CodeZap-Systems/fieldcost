import QuoteForm from "../QuoteForm";

export default function AddQuotePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">New Quote</h1>
        <p className="text-gray-500 mt-1">Create a new quote for your customer</p>
      </div>
      <QuoteForm />
    </div>
  );
}
