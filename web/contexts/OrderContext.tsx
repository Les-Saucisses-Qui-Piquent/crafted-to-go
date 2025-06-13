import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem } from "./CartContext";

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: CartItem[];
  totalPrice: number;
  status: "pending" | "accepted" | "preparing" | "ready" | "completed" | "cancelled";
  createdAt: number;
  updatedAt: number;
  notes?: string;
}

interface OrderContextType {
  orders: Order[];
  pendingOrdersCount: number;
  addOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  getOrdersByStatus: (status: Order["status"]) => Order[];
  clearOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = "@brewery_orders";

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    saveOrders();
  }, [orders]);

  const loadOrders = async () => {
    try {
      const stored = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        setOrders(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Erreur chargement commandes:", error);
    }
  };

  const saveOrders = async () => {
    try {
      await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("Erreur sauvegarde commandes:", error);
    }
  };

  const addOrder = (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status, updatedAt: Date.now() } : order,
      ),
    );
  };

  const getOrdersByStatus = (status: Order["status"]): Order[] => {
    return orders.filter((order) => order.status === status);
  };

  const clearOrders = () => {
    setOrders([]);
  };

  const pendingOrdersCount = orders.filter((order) => order.status === "pending").length;

  const value: OrderContextType = {
    orders,
    pendingOrdersCount,
    addOrder,
    updateOrderStatus,
    getOrdersByStatus,
    clearOrders,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within OrderProvider");
  }
  return context;
};
