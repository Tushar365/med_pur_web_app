import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import { insertProductSchema, insertCustomerSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Middleware to ensure user is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Product routes
  app.get("/api/products", requireAuth, async (req, res, next) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products/:id", requireAuth, async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/products", requireAuth, async (req, res, next) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      next(error);
    }
  });

  app.put("/api/products/:id", requireAuth, async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      
      const product = await storage.updateProduct(productId, validatedData);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      next(error);
    }
  });

  app.delete("/api/products/:id", requireAuth, async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      const success = await storage.deleteProduct(productId);
      
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products/low-stock", requireAuth, async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const products = await storage.getLowStockProducts(limit);
      res.json(products);
    } catch (error) {
      next(error);
    }
  });

  // Customer routes
  app.get("/api/customers", requireAuth, async (req, res, next) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/customers/:id", requireAuth, async (req, res, next) => {
    try {
      const customerId = parseInt(req.params.id);
      const customer = await storage.getCustomer(customerId);
      
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      res.json(customer);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/customers", requireAuth, async (req, res, next) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid customer data", errors: error.errors });
      }
      next(error);
    }
  });

  app.put("/api/customers/:id", requireAuth, async (req, res, next) => {
    try {
      const customerId = parseInt(req.params.id);
      const validatedData = insertCustomerSchema.partial().parse(req.body);
      
      const customer = await storage.updateCustomer(customerId, validatedData);
      
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      res.json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid customer data", errors: error.errors });
      }
      next(error);
    }
  });

  app.delete("/api/customers/:id", requireAuth, async (req, res, next) => {
    try {
      const customerId = parseInt(req.params.id);
      const success = await storage.deleteCustomer(customerId);
      
      if (!success) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/customers/recent", requireAuth, async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const customers = await storage.getRecentCustomers(limit);
      res.json(customers);
    } catch (error) {
      next(error);
    }
  });

  // Order routes
  app.get("/api/orders", requireAuth, async (req, res, next) => {
    try {
      const orders = await storage.getOrdersWithDetails();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/orders/:id", requireAuth, async (req, res, next) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrderDetails(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/orders", requireAuth, async (req, res, next) => {
    try {
      const { order, items } = req.body;
      
      const validatedOrder = insertOrderSchema.parse(order);
      
      // Items will be processed in the storage layer to add orderId
      const validatedItemsSchema = z.array(
        insertOrderItemSchema.omit({ orderId: true })
      );
      
      const validatedItems = validatedItemsSchema.parse(items);
      
      const newOrder = await storage.createOrder(validatedOrder, validatedItems);
      res.status(201).json(newOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      next(error);
    }
  });

  app.patch("/api/orders/:id/status", requireAuth, async (req, res, next) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const order = await storage.updateOrderStatus(orderId, status);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/orders/recent", requireAuth, async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const orders = await storage.getRecentOrders(limit);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  });

  // Dashboard statistics
  app.get("/api/dashboard/stats", requireAuth, async (req, res, next) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
