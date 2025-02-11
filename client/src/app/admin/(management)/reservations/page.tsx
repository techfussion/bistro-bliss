'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Users, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';
import { AdminGuard } from '@/components/hoc/admin-gaurd';
import MainLayout from '../../components/main-layout';
import Header from '../../components/header';
import apiClient from '@/interceptor/axios.interceptor';
import { useToast } from '@/hooks/use-toast';

interface Reservation {
    id: string;
    user: {
        firstName: string;
        lastName: string;
        phone: string;
    };
    date: string;
    time: string;
    partySize: number;
    status: string;
    notes: string | null;
}

const ReservationsPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [allReservations, setAllReservations] = useState<Reservation[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const { toast } = useToast();

    const token = localStorage.getItem('token');
  
    const cancelReservation = async (reservationId: string) => {
        try {
            setLoading(true);
      
            await apiClient.delete(`/reservations/${reservationId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            toast({
                variant: "default",
                description: `Reservation canceled`,
            })    

            fetchAllReservations(currentPage);
        } catch (err: any) {
            toast({
                variant: "destructive",
                description: `Failed to cancel reservation: ${err.message}`,
            })
        } finally {
            setLoading(false);
        }
    }

    const confirmReservation = async (reservationId: string) => {
        try {
            setLoading(true);
      
            await apiClient.put(`/reservations/${reservationId}/confirm`, {}, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
      
            toast({
              variant: "default",
              description: `Reservation confirmed`,
            })

            fetchAllReservations(currentPage);
        } catch (err: any) {
            toast({
                variant: "destructive",
                description: `Failed to confirm reservation: ${err.message}`,
            })
        } finally {
            setLoading(false);
        }
    }

    const fetchAllReservations = async (page = 1) => {
        try {
            setLoading(true);
      
            const response = await apiClient.get(`/reservations?page=${page}&limit=10`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
      
            const { meta, data } = response.data
            
            setAllReservations(data)
            setTotalPages(meta.totalPages)
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllReservations(currentPage);
    }, [currentPage]);

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString();
    };
      
    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const filterByStatus = (reservations: Reservation[]): Reservation[] => {
        if (statusFilter === 'all') return reservations;
        return reservations.filter(r => r.status.toLowerCase() === statusFilter.toLowerCase());
    };

    const filterByDate = (reservations: Reservation[]): Reservation[] => {
        if (dateFilter === 'all') return reservations;
        
        // Helper to compare only the date part
        const isSameDay = (date1: string, date2: Date): boolean => {
            const d1 = new Date(date1);
            return d1.getFullYear() === date2.getFullYear() &&
                   d1.getMonth() === date2.getMonth() &&
                   d1.getDate() === date2.getDate();
        };
    
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // For week range
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);
    
        switch (dateFilter) {
            case 'today':
                return reservations.filter(r => isSameDay(r.date, today));
            case 'yesterday':
                return reservations.filter(r => isSameDay(r.date, yesterday));
            case 'week':
                return reservations.filter(r => {
                    const reservationDate = new Date(r.date);
                    return reservationDate >= today && reservationDate <= weekFromNow;
                });
            default:
                return reservations;
        }
    };

    const filteredReservations = filterByDate(filterByStatus(allReservations))// filterByDate(filterByStatus(allReservations));

    interface StatusColors {
        [key: string]: string;
    }

    const getStatusColor = (status: string): string => {
        const colors: StatusColors = {
            PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            CONFIRMED: 'bg-green-100 text-green-800 border-green-300',
            CANCELLED: 'bg-red-100 text-red-800 border-red-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
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
            <Header activePage='Reservations'/>
            <main className="p-6 space-y-4">
              <p className="text-xs">Loading reservations...</p>
            </main>
          </MainLayout>
        );
    }

    if (filteredReservations.length === 0) (
        <MainLayout>
            <Header activePage='Reservations' />
            <main>
                <p className="text-center text-gray-500">No reservations found.</p>
            </main>
        </MainLayout>
    )

    return (
        <MainLayout>
            <Header
                activePage='Reservations'
                actionButton={
                    <div className="flex space-x-4">
                        <Select value={dateFilter} onValueChange={setDateFilter}>
                            <SelectTrigger className="w-[180px] text-xs">
                                <SelectValue placeholder="Select Date" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem className='text-xs' value="all">All</SelectItem>
                                <SelectItem className='text-xs' value="today">Today</SelectItem>
                                <SelectItem className='text-xs' value="yesterday">Yesterday</SelectItem>
                                <SelectItem className='text-xs' value="week">This Week</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px] text-xs">
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem className='text-xs' value="all">All Status</SelectItem>
                                <SelectItem className='text-xs' value="pending">Pending</SelectItem>
                                <SelectItem className='text-xs' value="confirmed">Confirmed</SelectItem>
                                <SelectItem className='text-xs' value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                }
            />
            <main className="py-6 space-y-6 bg-gray-50 min-h-screen">
                <div className="space-y-4">
                    {filteredReservations.map((reservation) => (
                    <Card key={reservation.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-silk-50 flex items-center justify-center">
                                    <span className="text-lg font-semibold text-gray-700">
                                        {reservation.user.firstName[0]}{reservation.user.lastName[0]}
                                    </span>
                                </div>
                                <div>
                                <h3 className="text-sm font-semibold">
                                    {reservation.user.firstName} {reservation.user.lastName}
                                </h3>
                                <p className="text-xs text-gray-500">{reservation.user.phone}</p>
                                </div>
                                <Badge className={`ml-4 ${getStatusColor(reservation.status)} hover:${getStatusColor(reservation.status)} px-3 py-1 rounded-full border text-xs`}>
                                    {reservation.status.charAt(0) + reservation.status.slice(1).toLowerCase()}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                <div className="flex items-center bg-gray-50 p-2 rounded-md">
                                    <Calendar className="w-3 h-3 mr-2" />
                                    {formatDate(reservation.date)}
                                </div>
                                <div className="flex items-center bg-gray-50 p-2 rounded-md">
                                    <Clock className="w-3 h-3 mr-2" />
                                    {formatTime(reservation.time)}
                                </div>
                                <div className="flex items-center p-2 rounded-md">
                                    <Users className="w-3 h-3 mr-2" />
                                    {reservation.partySize} {reservation.partySize === 1 ? 'guest' : 'guests'}
                                </div>
                            </div>
                            {reservation.notes && (
                                <div className="text-[13px] tracking-wide p-3 rounded-md">
                                    <span className="font-semibold">Notes:</span> {reservation.notes}
                                </div>
                            )}
                            </div>
                            {
                                reservation.status === 'PENDING' && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem className="cursor-pointer" disabled={loading} onClick={() => confirmReservation(reservation.id)}>
                                                Confirm Reservation
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600 cursor-pointer" disabled={loading} onClick={() => cancelReservation(reservation.id)}>
                                                Cancel Reservation
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )
                            }
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
        </MainLayout>
        
    );
};

export default AdminGuard(ReservationsPage);