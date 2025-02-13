export interface OrderStats {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: string;
    deliveryOrders: number;
    pickupOrders: number;
  }
  
  export interface PaymentStats {
    successfulPayments: number;
    pendingPayments: number;
    totalRevenue: string;
    failedPayments: number;
  }
  
  export interface OverviewResponseDto {
    orderStats: OrderStats;
    totalUsers: number;
    activeMenuItems: number;
    todayReservations: number;
    recentActivity: {
      id: string;
      type: 'ORDER' | 'RESERVATION' | 'PAYMENT';
      description: string;
      timestamp: Date;
      status: string;
    }[];
  }