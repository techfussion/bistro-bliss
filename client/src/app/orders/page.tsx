import Header from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";

const orders = [
  {
    id: "12345",
    status: "Completed",
    total: "$45.00",
    date: "2025-02-01",
  },
  {
    id: "67890",
    status: "Pending",
    total: "$30.00",
    date: "2025-01-25",
  },
];

const OrdersPage = () => {
  return (
    <div>
      <Header />
      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        {orders.map((order) => (
          <Card key={order.id} className="p-4">
            <CardContent>
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total:</strong> {order.total}</p>
              <p><strong>Date:</strong> {order.date}</p>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
};

export default OrdersPage;