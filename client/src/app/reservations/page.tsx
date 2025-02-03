import React from 'react';
import Header from '@/components/header';
import {Card, CardContent} from '@/components/ui/card';

const reservations = [
  {
    id: '1',
    status: 'Confirmed',
    date: '2025-01-28',
    time: '8:00 PM',
    partySize: 4,
  },
  {
    id: "54321",
    status: "Pending",
    date: "2025-03-01",
    time: "6:00 PM",
    partySize: 2,
  },
];

export function ReservationsPage() {
  return (
    <div>
      <Header />
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Reservations</h1>
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
      </div>
    </div>
  );
};

export default ReservationsPage;