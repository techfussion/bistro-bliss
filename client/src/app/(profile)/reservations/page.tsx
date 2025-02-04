"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import apiClient from "@/interceptor/axios.interceptor";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';

const ReservationsPage = () => {
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

  return (
    <div>
      <Header />
      <main className="p-6 px-24 space-y-4">
        <h1 className="text-xl font-bold font-serif text-red-700 italic">Reservations</h1>

        {reservations.map((reservation) => (
          <Card key={reservation.id} className="p-4">
            <CardContent>
              <p><strong>Reservation ID:</strong> {reservation.id}</p>
              <p><strong>Status:</strong> {reservation.status}</p>
              <p><strong>Date:</strong> {reservation.date}</p>
              <p><strong>Time:</strong> {reservation.time}</p>
              <p><strong>Party Size:</strong> {reservation.partySize}</p>
            </CardContent>
          </Card>
        ))}

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
    </div>
  );
};

export default ReservationsPage;