'use client';

import React, { Fragment, useEffect, useState } from 'react';
import Header from "@/components/header";
import apiClient from "@/interceptor/axios.interceptor";
import { 
  Clock, MapPin, Receipt, ChevronDown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Link from "next/link";
import { CustomerGuard } from "@/components/hoc/customer-gaurd";

// const ordersNative = [
//   {
//     id: 'ORD-001',
//     date: '2025-02-05',
//     status: 'DELIVERED',
//     type: 'DELIVERY',
//     items: [
//       { name: 'Jollof Rice', quantity: 2, price: 2500 },
//       { name: 'Chicken Wings', quantity: 1, price: 3000 },
//     ],
//     subtotal: 8000,
//     tax: 600,
//     total: 8600,
//     address: {
//       street: '123 Main Street',
//       city: 'Lagos',
//       state: 'Lagos State',
//     },
//     payment: {
//       status: 'COMPLETED',
//       provider: 'PAYSTACK'
//     }
//   },
//   {
//     id: 'ORD-002',
//     date: '2025-02-06',
//     status: 'PREPARING',
//     type: 'PICKUP',
//     items: [
//       { name: 'Suya Platter', quantity: 1, price: 5000 },
//       { name: 'Chapman', quantity: 2, price: 1000 },
//     ],
//     subtotal: 7000,
//     tax: 525,
//     total: 7525,
//     payment: {
//       status: 'COMPLETED',
//       provider: 'PAYSTACK'
//     }
//   }
// ];

interface Address {
  street: string;
  city: string;
  state: string;
}
interface MenuItem {
  name: string;
}

interface Item {
  memuItem: MenuItem[];
  quantity: number;
  price: number;
}

interface Payment {
  status: string;
  provider: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  type: string;
  items: Item[];
  subtotal: number;
  tax: number;
  total: number;
  address?: Address;
  payment: Payment;
}


const MyOrdersPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);


  const fetchOrders = async (page = 1) => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await apiClient.get(`/orders?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { data, meta } = response.data;
      setOrders(data);
      setTotalPages(meta.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    // setOrders(ordersNative)
    // setTotalPages(1)
    fetchOrders(currentPage);
  }, [token, currentPage]);

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PREPARING: 'bg-purple-100 text-purple-800',
      READY: 'bg-green-100 text-green-800',
      ON_DELIVERY: 'bg-orange-100 text-orange-800',
      DELIVERED: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
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
      <div>
        <Header />
        <main className="p-6 px-24 space-y-4">
          <h1 className="text-xl font-bold font-serif text-red-700 italic">Orders</h1>
          <p className="text-xs">Loading orders...</p>
        </main>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <Header />
        <main className="p-6 px-24 space-y-4">
          <h1 className="text-xl font-bold font-serif text-red-700 italic">Orders</h1>
          <p className="text-sm">You haven't made any order
            <Button asChild variant='link'>
              <Link href='/menu' className="text-red-700 font-serif italic">
                Order Now
              </Link>
            </Button>
            </p>
        </main>
      </div>
    );
  }

  return (
    <Fragment>
      <Header />
      <main className="p-6 px-24 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold font-serif text-red-700 italic">Orders</h1>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Collapsible key={order.id}>
              <Card>
                <CardContent className="p-6">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex justify-between items-start w-full">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <p className="font-medium text-sm">{order.id}</p>
                          <Badge className={`${getStatusColor(order.status)} font-medium`}>
                            {order.status}
                          </Badge>
                          <Badge variant="outline" className='font-medium'>
                            {order.type}
                          </Badge>
                        </div>
                        <p className="text-gray-500 flex items-center gap-2 text-xs">
                          <Clock className="h-3 w-3" />
                          {order.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{formatCurrency(order.total)}</p>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="mt-4 pt-4 border-t">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="font-semibold text-xs">Order Items</p>
                        <div className="space-y-2">
                          {order.items.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.menuItem.name}</span>
                              <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.type === 'DELIVERY' && order.address && (
                        <div className="space-y-2">
                          <p className="font-semibold text-xs">Delivery Address</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mt-1" />
                            <p>{order.address.street}, {order.address.city}, {order.address.state}</p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax</span>
                          <span>{formatCurrency(order.tax)}</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Total</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center gap-2">
                          {
                            order.payment ? (
                              <Fragment>
                                <Badge variant="outline" className="capitalize font-medium">
                                  {order.payment.provider}
                                </Badge>
                                <Badge className={`${getStatusColor(order.payment.status)} font-medium`}>
                                  {order?.payment?.status}
                                </Badge>
                              </Fragment>
                            ) :
                              (
                                <Fragment>
                                  <Badge variant="outline" className="capitalize font-medium">
                                    PENDING
                                  </Badge>
                                  <Badge className={`${getStatusColor("PENDING")} font-medium`}>
                                    PENDING
                                  </Badge>
                                </Fragment>
                              )
                          }
                        </div>
                        <Button variant="outline" size="sm" className='text-xs'>
                          <Receipt className="h-3 w-3 mr-2" />
                          View Receipt
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Card>
            </Collapsible>
          ))}
        </div>
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
    </Fragment>
    
  );
};

export default CustomerGuard(MyOrdersPage);