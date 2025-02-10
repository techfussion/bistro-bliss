'use client';

import React, { Fragment, useEffect, useState } from 'react';
import { Calendar, Clock, Users, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Header from '@/components/header';
import apiClient from "@/interceptor/axios.interceptor";
import { CustomerGuard } from "@/components/hoc/customer-gaurd";
import Link from 'next/link';

const MyReservationsPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchReservations = async (page = 1) => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await apiClient.get(`/reservations?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { data, meta } = response.data;
      setReservations(data);
      setTotalPages(meta.totalPages);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchReservations(currentPage);
    }
  }, [token, currentPage]);

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
          <h1 className="text-xl font-bold font-serif text-red-700 italic">Reservations</h1>
          <p className="text-xs">Loading reservations...</p>
        </main>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div>
        <Header />
        <main className="p-6 px-24 space-y-4">
          <h1 className="text-xl font-bold font-serif text-red-700 italic">Reservations</h1>
          <p className="text-sm">You don't have any reservation history
            <Button asChild variant='link'>
              <Link href='/book' className="text-red-700 font-serif italic">
                Make a Reservation
              </Link>
            </Button>
          </p>
        </main>
      </div>
    );
  }

  interface Reservation {
    id: string;
    date: string;
    time: string;
    partySize: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    notes?: string;
  }

  const getStatusColor = (status: Reservation['status']): string => {
    const colors: Record<Reservation['status'], string> = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      CONFIRMED: 'bg-green-100 text-green-800 border-green-300',
      CANCELLED: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <Fragment>
      <Header />
      <main className="py-6 space-y-6 px-24">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold font-serif text-red-700 italic">Reservations</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>New Reservation</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Make a Reservation</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input type="date" id="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input type="time" id="time" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partySize">Number of Guests</Label>
                  <Input type="number" id="partySize" min="1" max="20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Special Requests</Label>
                  <Input id="notes" placeholder="Any special requests or notes?" />
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <Button type="submit">Make Reservation</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge className={`${getStatusColor(reservation.status as Reservation['status'])} px-3 py-1 rounded-full border text-xs`}>
                      {reservation.status.charAt(0) + reservation.status.slice(1).toLowerCase()}
                    </Badge>
                    {reservation.status === 'PENDING' && (
                      <Button variant="outline" className="text-red-600 hover:bg-red-50 text-xs" size="sm">
                        Cancel Reservation
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center bg-gray-50 p-3 rounded-md">
                      <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500">Date</p>
                        <p className="font-medium text-xs">{reservation.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center bg-gray-50 p-3 rounded-md">
                      <Clock className="h-4 w-4 mr-3 text-gray-500" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500">Time</p>
                        <p className="font-medium text-xs">{reservation.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center bg-gray-50 p-3 rounded-md">
                      <Users className="h-4 w-4 mr-3 text-gray-500" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500">Party Size</p>
                        <p className="font-medium text-xs">{reservation.partySize} guests</p>
                      </div>
                    </div>
                  </div>
                  
                  {reservation.notes && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-xs mb-1 font-semibold text-gray-500">Special Request:</p>
                      <p className="text-gray-700 text-sm">{reservation.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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

export default CustomerGuard(MyReservationsPage);