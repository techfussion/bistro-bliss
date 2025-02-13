'use client';

import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MainLayout from '../../components/main-layout';
import Header from '../../components/header';
import { AdminGuard } from '@/components/hoc/admin-gaurd';
import apiClient from '@/interceptor/axios.interceptor';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    customer: string;
    items: OrderItem[];
    total: number;
    status: string;
    type: string;
    createdAt: string;
}

type Orders = Order[];

// {
//   id: "ORD001",
//   customer: "John Doe",
//   items: [
//     { name: "Margherita Pizza", quantity: 2, price: 12.99 },
//     { name: "Caesar Salad", quantity: 1, price: 8.99 }
//   ],
//   total: 34.97,
//   status: "PENDING",
//   type: "DELIVERY",
//   createdAt: "2024-02-04T10:00:00Z"
// },
// // Add more sample orders as needed

const OrdersManagement = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState<Orders>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const token = localStorage.getItem('token');

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setLoading(true);

      await apiClient.put(`/orders/${orderId}/status`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast({
        variant: "default",
        description: `Order status updated`,
      })

      fetchOrders(currentPage);
    } catch (err: any) {
      toast({
        variant: "destructive",
        description: `Could not updated order status: ${err.message}`,
      })
    } finally {
      setLoading(false);
    }
  }

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);

      const response = await apiClient.get(`/orders?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const { meta, data } = response.data

      setOrders(data)
      setTotalPages(meta.totalPages)
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage])

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    // Always show first page
    pages.push(1);
    
    // Calculate start and end for middle pages
    let start = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    let end = Math.min(totalPages, start + maxPagesToShow - 1);
    
    // Adjust start if we're near the end
    if (end === totalPages) {
      start = Math.max(2, totalPages - maxPagesToShow + 1);
    }
    
    // Add middle pages
    for (let i = start; i < end && i < totalPages; i++) {
      pages.push(i);
    }
    
    // Add last page if not already included
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }
    
    return pages;
  };
    
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Header activePage='Orders'/>
        <main className="p-6 px-24 space-y-4">
          <p className="text-xs">Loading orders...</p>
        </main>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
        <Header
            activePage='Orders'
            actionButton={
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] text-xs">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem className='text-xs' value="all">All Orders</SelectItem>
                        <SelectItem className='text-xs' value="PENDING">Pending</SelectItem>
                        <SelectItem className='text-xs' value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem className='text-xs' value="PREPARING">Preparing</SelectItem>
                        <SelectItem className='text-xs' value="READY">Ready</SelectItem>
                        <SelectItem className='text-xs' value="ON_DELIVERY">On Delivery</SelectItem>
                        <SelectItem className='text-xs' value="DELIVERED">Delivered</SelectItem>
                        <SelectItem className='text-xs' value="COMPLETED">Completed</SelectItem>
                        <SelectItem className='text-xs' value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            }
        />
        <main className="py-6 space-y-6">
            <Card>
                <CardContent className="p-0">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {orders
                        .filter(order => statusFilter === 'all' || order.status === statusFilter)
                        .map((order) => (
                        <TableRow className='text-xs' key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>${order.total.toFixed(2)}</TableCell>
                            <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                                {
                                'PENDING': 'bg-yellow-100 text-yellow-800',
                                'CONFIRMED': 'bg-blue-100 text-blue-800',
                                'PREPARING': 'bg-purple-100 text-purple-800',
                                'READY': 'bg-green-100 text-green-800',
                                'ON_DELIVERY': 'bg-orange-100 text-orange-800',
                                'DELIVERED': 'bg-green-100 text-green-800',
                                'COMPLETED': 'bg-gray-100 text-gray-800',
                                'CANCELLED': 'bg-red-100 text-red-800',
                                }[order.status]
                            }`}>
                                {order.status}
                            </span>
                            </TableCell>
                            <TableCell>{order.type}</TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                            <div className="flex gap-2">
                                <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedOrder(order)}
                                    >
                                    <Eye className="w-4 h-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                    <DialogTitle className='text-sm'>Order Details</DialogTitle>
                                    </DialogHeader>
                                    <OrderDetails order={order} onUpdateStatus={updateOrderStatus} loading={loading} />
                                </DialogContent>
                                </Dialog>
                            </div>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {
                  orders.length === 0 && (
                    <p className='text-xs text-center py-6'>There are no order records found</p>
                  )
                }
                </CardContent>
            </Card>
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>

                {generatePageNumbers().map((page, index) => (
                    <PaginationItem key={page}>
                    {index > 0 && page - generatePageNumbers()[index - 1] > 1 && (
                        <PaginationEllipsis />
                    )}
                    <PaginationLink 
                        isActive={page === currentPage}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>
                </PaginationContent>
            </Pagination>
          )}
        </main>
    </MainLayout>
  );
};

interface OrderDetailsProps {
  order: Order;
  loading: boolean;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onUpdateStatus, loading }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className='flex flex-col gap-y-4'>
          <h3 className="text-xs font-semibold">Order Information</h3>
          <p className='text-xs'>Order ID: {order.id}</p>
          <p className='text-xs'>Customer: {order.customer}</p>
          <p className='text-xs'>Type: {order.type}</p>
          <p className='text-xs'>Date: {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className='flex flex-col gap-y-4'>
          <h3 className="text-xs font-semibold">Items</h3>
          <ul className="list-disc pl-5">
            {order.items.map((item, index) => (
              <li key={index} className='text-xs mb-1'>
                {item.name} - {item.quantity} x ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
          <p className="mt-2 font-semibold text-sm">Total: ${order.total.toFixed(2)}</p>
        </div>
      </div>

      {/* Order Status Update */}
      <div>
        <h3 className="font-semibold text-xs mb-2 mt-4">Update Status</h3>
        <Select
          value={order.status}
          disabled={loading}
          onValueChange={(newStatus) => onUpdateStatus(order.id, newStatus)}
        >
          <SelectTrigger className="w-full text-xs">
            <SelectValue placeholder="Update Order Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className='text-xs' value="PENDING">Pending</SelectItem>
            <SelectItem className='text-xs' value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem className='text-xs' value="PREPARING">Preparing</SelectItem>
            <SelectItem className='text-xs' value="READY">Ready</SelectItem>
            <SelectItem className='text-xs' value="ON_DELIVERY">On Delivery</SelectItem>
            <SelectItem className='text-xs' value="DELIVERED">Delivered</SelectItem>
            <SelectItem className='text-xs' value="COMPLETED">Completed</SelectItem>
            <SelectItem className='text-xs' value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AdminGuard(OrdersManagement);
