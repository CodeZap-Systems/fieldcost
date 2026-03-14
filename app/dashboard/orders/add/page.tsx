import OrderForm from "../OrderForm";

export default function AddOrderPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">New Purchase Order</h1>
        <p className="text-gray-500 mt-1">Create a new purchase order</p>
      </div>
      <OrderForm />
    </div>
  );
}
