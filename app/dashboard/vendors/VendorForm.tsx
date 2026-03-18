export type VendorFormState = {
  name: string;
  email: string;
  phone: string;
  company_name: string;
  contact_person: string;
};

export default function VendorForm({ onAdd }: { onAdd?: (vendor: VendorFormState) => Promise<boolean> }) {
  return (
    <form className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4">Add Vendor</h2>
      {/* Add form fields here */}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
    </form>
  );
}
