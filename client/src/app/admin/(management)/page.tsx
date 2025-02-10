'use client';

import MainLayout from '@/app/admin/components/main-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Store,
  Users,
  ShoppingBag,
  Calendar,
  List,
} from 'lucide-react';
import Header from '../components/header';
import { AdminGuard } from '@/components/hoc/admin-gaurd';

const STATS = [
  { title: 'Total Orders', value: '1,234', icon: ShoppingBag },
  { title: 'Total Users', value: '856', icon: Users },
  { title: "Active Menu Items", value: '45', icon: Store },
  { title: "Today's Reservations", value: '12', icon: Calendar },
];

const OverviewPage = () => (
  <MainLayout>
    <Header activePage='Overview'/>
    <div className="my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, index) => (
          <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium">
                  {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-red-700" />
              </CardHeader>
              <CardContent>
              <div className="text-xl font-bold text-dark-700">{stat.value}</div>
              </CardContent>
          </Card>
          ))}
      </div>
    </div>
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-4">
                <List className="w-6 h-6 p-1 bg-silk-50 text-red-700 rounded-full" />
                <div className='text-xs'>
                  <p className="text-sm font-medium">New order #1234</p>
                  <p className="text-dark-900">2 minutes ago</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs">
                Completed
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </MainLayout>
);

export default AdminGuard(OverviewPage);
