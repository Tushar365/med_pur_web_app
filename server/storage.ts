import { 
  users, 
  type User, 
  type InsertUser, 
  products, 
  type Product, 
  type InsertProduct,
  customers,
  type Customer,
  type InsertCustomer,
  orders,
  type Order,
  type InsertOrder,
  orderItems,
  type OrderItem,
  type InsertOrderItem
} from "@shared/schema";
import { db } from "./db";
import { eq, lt, desc, sql as sqlBuilder, and, inArray } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { neon } from "@neondatabase/serverless";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getLowStockProducts(limit?: number): Promise<Product[]>;
  
  // Customer operations
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;
  getRecentCustomers(limit?: number): Promise<Customer[]>;
  
  // Order operations
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  getRecentOrders(limit?: number): Promise<Order[]>;
  getOrdersWithDetails(): Promise<any[]>;
  getOrderDetails(id: number): Promise<any>;
  
  // Dashboard statistics
  getDashboardStats(): Promise<any>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    // Create session store
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(products.name);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning({ id: products.id });
    return result.length > 0;
  }

  async getLowStockProducts(limit: number = 10): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(
        sqlBuilder`${products.stock} <= ${products.lowStockThreshold}`
      )
      .orderBy(products.stock)
      .limit(limit);
  }

  // Customer operations
  async getCustomers(): Promise<Customer[]> {
    return db.select().from(customers).orderBy(customers.name);
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db
      .insert(customers)
      .values(customer)
      .returning();
    return newCustomer;
  }

  async updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const [updatedCustomer] = await db
      .update(customers)
      .set({ ...customer, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    const result = await db
      .delete(customers)
      .where(eq(customers.id, id))
      .returning({ id: customers.id });
    return result.length > 0;
  }

  async getRecentCustomers(limit: number = 5): Promise<Customer[]> {
    return db
      .select()
      .from(customers)
      .orderBy(desc(customers.createdAt))
      .limit(limit);
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    // Start a transaction
    // This is a simplified version as proper transaction handling would require a more complex setup
    const [newOrder] = await db
      .insert(orders)
      .values(order)
      .returning();

    if (items.length > 0) {
      const itemsWithOrderId = items.map(item => ({
        ...item,
        orderId: newOrder.id
      }));
      
      await db
        .insert(orderItems)
        .values(itemsWithOrderId);
      
      // Update product stock
      for (const item of items) {
        const product = await this.getProduct(item.productId);
        if (product) {
          await this.updateProduct(item.productId, {
            stock: product.stock - item.quantity
          });
        }
      }
    }

    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async getRecentOrders(limit: number = 5): Promise<Order[]> {
    return db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit);
  }

  async getOrdersWithDetails(): Promise<any[]> {
    const result = await db.execute(sqlBuilder`
      SELECT o.id, o.status, o.total, o.created_at, c.name as customer_name, c.email as customer_email
      FROM ${orders} o
      JOIN ${customers} c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
    `);
    return result.rows as any[];
  }

  async getOrderDetails(id: number): Promise<any> {
    const orderResult = await db.execute(sqlBuilder`
      SELECT o.id, o.status, o.total, o.created_at, 
             c.id as customer_id, c.name as customer_name, c.email as customer_email
      FROM ${orders} o
      JOIN ${customers} c ON o.customer_id = c.id
      WHERE o.id = ${id}
    `);
    
    if (orderResult.rows.length === 0) {
      return null;
    }
    
    const order = orderResult.rows[0];
    
    const itemsResult = await db.execute(sqlBuilder`
      SELECT oi.id, oi.quantity, oi.price, oi.subtotal,
             p.id as product_id, p.name as product_name, p.sku as product_sku
      FROM ${orderItems} oi
      JOIN ${products} p ON oi.product_id = p.id
      WHERE oi.order_id = ${id}
    `);
    
    return {
      ...order,
      items: itemsResult.rows
    };
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<any> {
    const totalOrdersResult = await db.execute(sqlBuilder`SELECT COUNT(*) as count FROM ${orders}`);
    const totalOrdersCount = parseInt(totalOrdersResult.rows[0].count, 10);
    
    const totalRevenueResult = await db.execute(sqlBuilder`SELECT SUM(total) as sum FROM ${orders}`);
    const totalRevenue = parseFloat(totalRevenueResult.rows[0].sum) || 0;
    
    const customersCountResult = await db.execute(sqlBuilder`SELECT COUNT(*) as count FROM ${customers}`);
    const customersCount = parseInt(customersCountResult.rows[0].count, 10);
    
    const lowStockItemsResult = await db.execute(sqlBuilder`
      SELECT COUNT(*) as count 
      FROM ${products} 
      WHERE stock <= low_stock_threshold
    `);
    const lowStockItemsCount = parseInt(lowStockItemsResult.rows[0].count, 10);
    
    return {
      totalOrders: totalOrdersCount,
      revenue: totalRevenue,
      customers: customersCount,
      lowStockItems: lowStockItemsCount
    };
  }
}

export const storage = new DatabaseStorage();
