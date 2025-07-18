import React, { useEffect, useState } from 'react';
import API from '../api';
import { io } from 'socket.io-client';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';

const socket = io(import.meta.env.VITE_API_URL);

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  preparing: 'bg-yellow-100 text-yellow-800',
  served: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await API.get('/api/orders');
      setOrders(res.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Listen for real-time updates
    socket.on('newOrder', (order) => {
      setOrders(prev => [order, ...prev]);
      toast.success(`New order from Table ${order.tableId}`);
    });

    socket.on('orderStatusUpdate', (order) => {
      setOrders(prev =>
        prev.map(o => (o._id === order._id ? order : o))
      );
    });

    return () => {
      socket.off('newOrder');
      socket.off('orderStatusUpdate');
    };
  }, []);

  const updateStatus = async (id, status) => {
    setIsLoading(prev => ({ ...prev, [id]: true }));
    try {
      await API.put(`/api/orders/${id}/status`, { status });
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setIsLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Orders Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        Table {order.tableId}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items.map(item => (
                            <div key={item.itemId} className="flex justify-between">
                              <span>{item.name}</span>
                              <span className="text-muted-foreground">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(order._id, 'preparing')}
                            disabled={order.status !== 'pending' || isLoading[order._id]}
                          >
                            {isLoading[order._id] && order.status === 'preparing' ? (
                              'Updating...'
                            ) : (
                              'Start Preparing'
                            )}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateStatus(order._id, 'served')}
                            disabled={order.status !== 'preparing' || isLoading[order._id]}
                          >
                            {isLoading[order._id] && order.status === 'served' ? (
                              'Updating...'
                            ) : (
                              'Mark as Served'
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;