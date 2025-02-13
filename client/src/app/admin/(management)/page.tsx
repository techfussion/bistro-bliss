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
import { useEffect, useState } from 'react';
import apiClient from '@/interceptor/axios.interceptor';

interface RecentActivity {
  description: string;
  id: string
  status: string;
  type: string;
  timestamp: string;
}

interface Overview {
  orderStats: {
    totalOrders: number;
  };
  totalUsers: number;
  activeMenuItems: number;
  todayReservations: number;
  recentActivity: RecentActivity[];
}

const OverviewPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [overview, setOverview] = useState<Overview>();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOverview();
  }, []);

  // Define STATS after overview state is available
  const getStatsValue = (title: string) => {
    if (!overview) return 0;
    
    switch (title) {
      case 'Total Orders':
        return overview.orderStats.totalOrders;
      case 'Total Users':
        return overview.totalUsers;
      case 'Active Menu Items':
        return overview.activeMenuItems;
      case "Today's Reservations":
        return overview.todayReservations;
      default:
        return 0;
    }
  };

  const STATS = [
    { title: 'Total Orders', icon: ShoppingBag },
    { title: 'Total Users', icon: Users },
    { title: "Active Menu Items", icon: Store },
    { title: "Today's Reservations", icon: Calendar },
  ];

  const fetchOverview = async () => {
    try {
        setLoading(true);
  
        const response = await apiClient.get(`/overview`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        const { data } = response
        setOverview(data)
    } catch (err) {
        console.log(err);
    } finally {
        setLoading(false);
    }
  }

  const formatDate = (date: string) => {
    const transform = new Date(date);
    // Return a more readable date format
    return transform.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

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

  if (loading) {
    return (
      <MainLayout>
        <Header activePage='Overview'/>
        <main className="p-6 space-y-4">
          <p className="text-xs">Loading...</p>
        </main>
      </MainLayout>
    );
  }

  return(
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
                <div className="text-xl font-bold text-dark-700">
                  {getStatsValue(stat.title)}
                </div>
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
            {overview?.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-4">
                  <List className="w-6 h-6 p-1 bg-silk-50 text-red-700 rounded-full" />
                  <div className='text-xs'>
                    <p className="text-[10px] font-semibold">{activity.type}</p>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-dark-900">{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
                <span className={`text-[10px] rounded-lg px-2 ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  )
};

export default AdminGuard(OverviewPage);