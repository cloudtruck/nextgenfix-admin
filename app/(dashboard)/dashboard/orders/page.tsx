"use client"
import api from "@/lib/api"
import { useState, useEffect, useCallback } from "react"
import { MoreHorizontal, Search, Download, RefreshCw, Eye, XCircle, CookingPot, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface OrderItem {
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  user: { _id: string; name: string; phone?: string; }
  items: OrderItem[]
  totalPrice: number
  status: OrderStatus
  orderTimestamp: string
  deliveryAddress: string
  paymentMethod: string
  paymentStatus: "Paid" | "Pending" | "Failed" | "Refunded"
}

 interface ApiOrderItem {
    name?: string;
    itemId?: string | { _id: string; name: string; [key: string]: unknown }; // Can be populated object or string ID
    quantity: number;
    price: number;
  }
  interface ApiOrder {
    _id: string;
    user: { _id: string; name: string; phone?: string; };
    items: ApiOrderItem[];
    billing?: { totalAmount?: number };
    totalAmount?: number;
    status?: string;
    createdAt?: string;
    deliveryAddress?: string; // Backend now returns formatted string
    paymentMethod?: string;
    paymentStatus?: string;
    paymentDetails?: {
      method?: string;
      status?: string;
    };
  }

// Define allowed order status values
export type OrderStatus = "Ordered" | "Preparing" | "Dispatched" | "Delivered" | "Canceled";

// Error handling utility function
const getErrorMessage = (err: unknown, defaultMessage: string): string => {
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) {
      return response.data.message;
    }
  }
  return defaultMessage;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<{ message: string; success: boolean; orders: ApiOrder[] }>(
        '/api/orders/admin/all'
      );
      const data = response.data;
      console.log('Fetched orders data:', data);
      if (!data.success || !Array.isArray(data.orders)) throw new Error(data.message || "Invalid response");
      const mappedOrders: Order[] = data.orders.map((o: ApiOrder) => {
        // Map API status string to OrderStatus type
        const statusMap: Record<string, OrderStatus> = {
          placed: "Ordered",
          ordered: "Ordered",
          delivered: "Delivered",
          preparing: "Preparing",
          dispatched: "Dispatched",
          cancelled: "Canceled",
          canceled: "Canceled",
        };
        const rawStatus = (o.status || "").toLowerCase();
        const mappedStatus: OrderStatus =
          statusMap[rawStatus] ||
          (["Ordered", "Preparing", "Dispatched", "Delivered", "Canceled"].includes(
            (o.status || "").charAt(0).toUpperCase() + (o.status || "").slice(1)
          )
            ? ((o.status || "").charAt(0).toUpperCase() + (o.status || "").slice(1)) as OrderStatus
            : "Ordered");

        return {
          id: o._id,
          user: {
            _id: o.user._id,
            name: o.user.name || "Unknown User",
            phone: o.user.phone
          },
          items: Array.isArray(o.items)
            ? o.items.map((item: ApiOrderItem) => ({
                // Handle both populated (object) and unpopulated (string) itemId
                name: item.name || 
                      (typeof item.itemId === 'object' && item.itemId?.name) || 
                      (typeof item.itemId === 'string' ? item.itemId : 'Item'),
                quantity: item.quantity,
                price: item.price,
              }))
            : [],
          totalPrice: o.billing?.totalAmount ?? o.totalAmount ?? 0,
          status: mappedStatus,
          orderTimestamp: o.createdAt ? new Date(o.createdAt).toLocaleString() : "",
          deliveryAddress: o.deliveryAddress || "", // Backend now returns formatted string
          paymentMethod: o.paymentDetails?.method || o.paymentMethod || "-",
          paymentStatus:
            ((o.paymentDetails?.status || o.paymentStatus || "Pending").toLowerCase() === "paid"
              ? "Paid"
              : (o.paymentDetails?.status || o.paymentStatus || "Pending").toLowerCase() === "refunded"
              ? "Refunded"
              : (o.paymentDetails?.status || o.paymentStatus || "Pending").toLowerCase() === "failed"
              ? "Failed"
              : "Pending") as "Paid" | "Pending" | "Failed" | "Refunded",
        };
      });
      setOrders(mappedOrders);
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Failed to fetch orders.");
      console.error('Error fetching orders:', err);
      
      // Check if it's an authentication error
      if (err && typeof err === 'object' && 'response' in err) {
        const response = err.response as { status?: number };
        if (response?.status === 401 || response?.status === 403) {
          toast({ 
            title: "Authentication Error", 
            description: "Please login again to continue."
          });
          // Optionally redirect to login
          // router.push('/login');
        } else {
          toast({ title: "Error", description: errorMessage });
        }
      } else {
        toast({ title: "Error", description: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleViewOrder = async (orderId: string) => {
    try {
  await api.get(`/api/orders/${orderId}`);
      // TODO: Implement order details dialog
      toast({ title: "Order details fetched", description: `Order ${orderId} details loaded.` });
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Failed to fetch order details.");
      toast({ title: "Error", description: errorMessage });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus, newPaymentStatus?: "Paid" | "Pending" | "Failed" | "Refunded") => {
    try {
      await api.put(
        `/api/orders/${orderId}/status`,
        { status: newStatus, paymentStatus: newPaymentStatus }
      );
      toast({ title: "Order updated!", description: `Order ${orderId} status updated to ${newStatus}.` });
      fetchOrders();
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Failed to update order status.");
      toast({ title: "Error", description: errorMessage });
    }
  };

  const handleExportOrders = async () => {
    try {
      const response = await api.get('/api/admin/orders-export', {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: "Export successful!", description: "Orders data exported as CSV." });
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Failed to export orders.");
      toast({ title: "Error", description: errorMessage });
    }
  };

  // Optionally, you can filter orders based on statusFilter and searchQuery
  // Example:
  // const filteredOrders = orders.filter(order =>
  //   (statusFilter === "" || order.status === statusFilter) &&
  //   (searchQuery === "" ||
  //     order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     order.chefName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     order.id.toLowerCase().includes(searchQuery.toLowerCase()))
  // );
  // Removed unused filteredOrders

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Input
            placeholder="Search orders by user or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button variant="ghost" className="ml-2" onClick={fetchOrders}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" className="ml-2" onClick={handleExportOrders}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="ghost" className="ml-2" onClick={fetchOrders}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Ordered At</TableCell>
            <TableCell>Delivery Address</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Payment Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center">
                Loading orders...
              </TableCell>
            </TableRow>
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center">
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id.length > 8 ? `${order.id.slice(0, 8)}...` : order.id}</TableCell>
              <TableCell>{order.user.name}</TableCell>
              <TableCell>
                {order.items.map((item) => (
                  <div key={item.name}>
                    {item.name} x {item.quantity}
                  </div>
                ))}
              </TableCell>
              <TableCell>{order.totalPrice}</TableCell>
              <TableCell>
                <Badge
                  className="capitalize"
                  variant={
                    order.status === "Delivered"
                      ? "secondary"
                      : order.status === "Canceled"
                        ? "destructive"
                        : "default"
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{order.orderTimestamp}</TableCell>
              <TableCell>{order.deliveryAddress}</TableCell>
              <TableCell>{order.paymentMethod}</TableCell>
              <TableCell>
                <Badge
                  className="capitalize"
                  variant={
                    order.paymentStatus === "Paid"
                      ? "secondary"
                      : order.paymentStatus === "Refunded"
                        ? "default"
                        : "destructive"
                  }
                >
                  {order.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleViewOrder(order.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    {order.status === "Ordered" && (
                        <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "Preparing")}>
                        <CookingPot className="h-4 w-4 mr-2" />
                        Start Preparing
                      </DropdownMenuItem>
                    )}
                    {order.status === "Preparing" && (
                        <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "Dispatched")}>
                        <Truck className="h-4 w-4 mr-2" />
                        Dispatch Order
                      </DropdownMenuItem>
                    )}
                    {order.status !== "Delivered" && order.status !== "Canceled" && (
                        <>
                          <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "Delivered")}>
                            Mark as Delivered
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "Canceled")}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Order
                      </DropdownMenuItem>
                        </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

