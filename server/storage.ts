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
  type InsertOrderItem,
  franchises,
  type Franchise,
  type InsertFranchise,
  inventory,
  type Inventory,
  type InsertInventory
} from "@shared/schema";
import { db } from "./db";
import { eq, lt, desc, sql as sqlBuilder, and, inArray } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { neon } from "@neondatabase/serverless";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Franchise operations
  getFranchises(): Promise<Franchise[]>;
  getFranchise(id: number): Promise<Franchise | undefined>;
  createFranchise(franchise: InsertFranchise): Promise<Franchise>;
  updateFranchise(id: number, franchise: Partial<InsertFranchise>): Promise<Franchise | undefined>;
  
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
  createOrder(order: InsertOrder, items: Omit<InsertOrderItem, 'orderId'>[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  getRecentOrders(limit?: number): Promise<Order[]>;
  getOrdersWithDetails(): Promise<any[]>;
  getOrderDetails(id: number): Promise<any>;
  
  // Inventory operations
  getInventoryByFranchise(franchiseId: number): Promise<Inventory[]>;
  updateInventory(franchiseId: number, productId: number, quantity: number): Promise<Inventory | undefined>;
  
  // Dashboard statistics
  getDashboardStats(franchiseId?: number): Promise<any>;
  
  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Create session store
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
  }

  // Franchise operations
  async getFranchises(): Promise<Franchise[]> {
    return db.select().from(franchises).orderBy(franchises.name);
  }

  async getFranchise(id: number): Promise<Franchise | undefined> {
    const [franchise] = await db.select().from(franchises).where(eq(franchises.id, id));
    return franchise;
  }

  async createFranchise(franchise: InsertFranchise): Promise<Franchise> {
    const [newFranchise] = await db
      .insert(franchises)
      .values(franchise)
      .returning();
    return newFranchise;
  }

  async updateFranchise(id: number, franchise: Partial<InsertFranchise>): Promise<Franchise | undefined> {
    const [updatedFranchise] = await db
      .update(franchises)
      .set({ ...franchise, updatedAt: new Date() })
      .where(eq(franchises.id, id))
      .returning();
    return updatedFranchise;
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
    const [product] = await db.select().from(products).where(eq(products.prCode, id));
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
      .set(product)
      .where(eq(products.prCode, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db
      .delete(products)
      .where(eq(products.prCode, id))
      .returning({ prCode: products.prCode });
    return result.length > 0;
  }

  async getLowStockProducts(limit: number = 10): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(
        sqlBuilder`${products.stockQuantity} <= 10`
      )
      .orderBy(products.stockQuantity)
      .limit(limit);
  }

  // Customer operations
  async getCustomers(): Promise<Customer[]> {
    return db.select()
      .from(customers)
      .orderBy(customers.lastName);
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

  async createOrder(order: InsertOrder, items: Omit<InsertOrderItem, 'orderId'>[]): Promise<Order> {
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
      })) as InsertOrderItem[];
      
      await db
        .insert(orderItems)
        .values(itemsWithOrderId);
      
      // Update product stock
      for (const item of items) {
        const product = await this.getProduct(item.productId);
        if (product) {
          await this.updateProduct(item.productId, {
            stockQuantity: product.stockQuantity - item.quantity
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
      SELECT o.id, o.status, o.final_amount, o.created_at, 
             c.first_name || ' ' || c.last_name as customer_name, c.email as customer_email
      FROM ${orders} o
      JOIN ${customers} c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
    `);
    return result.rows as any[];
  }

  async getOrderDetails(id: number): Promise<any> {
    const orderResult = await db.execute(sqlBuilder`
      SELECT o.id, o.status, o.total_amount, o.discount_amount, o.tax_amount, o.final_amount, o.created_at, 
             c.id as customer_id, c.first_name || ' ' || c.last_name as customer_name, c.email as customer_email
      FROM ${orders} o
      JOIN ${customers} c ON o.customer_id = c.id
      WHERE o.id = ${id}
    `);
    
    if (orderResult.rows.length === 0) {
      return null;
    }
    
    const order = orderResult.rows[0];
    
    const itemsResult = await db.execute(sqlBuilder`
      SELECT oi.id, oi.quantity, oi.unit_price, oi.discount, oi.tax_rate, oi.tax_amount, oi.total_amount,
             p.pr_code as product_id, p.name as product_name, p.packing as product_packing
      FROM ${orderItems} oi
      JOIN ${products} p ON oi.product_id = p.pr_code
      WHERE oi.order_id = ${id}
    `);
    
    return {
      ...order,
      items: itemsResult.rows
    };
  }

  // Inventory operations
  async getInventoryByFranchise(franchiseId: number): Promise<Inventory[]> {
    return db
      .select()
      .from(inventory)
      .where(eq(inventory.franchiseId, franchiseId))
      .orderBy(desc(inventory.updatedAt));
  }

  async updateInventory(franchiseId: number, productId: number, quantity: number): Promise<Inventory | undefined> {
    const [existingInventory] = await db
      .select()
      .from(inventory)
      .where(
        and(
          eq(inventory.franchiseId, franchiseId),
          eq(inventory.productId, productId)
        )
      );

    if (existingInventory) {
      const [updatedInventory] = await db
        .update(inventory)
        .set({ 
          stockQuantity: quantity,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(inventory.franchiseId, franchiseId),
            eq(inventory.productId, productId)
          )
        )
        .returning();
      return updatedInventory;
    } else {
      const [newInventory] = await db
        .insert(inventory)
        .values({
          franchiseId,
          productId,
          stockQuantity: quantity
        })
        .returning();
      return newInventory;
    }
  }

  // Dashboard statistics
  async getDashboardStats(franchiseId?: number): Promise<any> {
    let totalOrdersResult;
    if (franchiseId) {
      totalOrdersResult = await db.execute(sqlBuilder`
        SELECT COUNT(*) as count FROM ${orders} o WHERE o.franchise_id = ${franchiseId}
      `);
    } else {
      totalOrdersResult = await db.execute(sqlBuilder`
        SELECT COUNT(*) as count FROM ${orders}
      `);
    }
    const totalOrdersCount = parseInt(totalOrdersResult.rows[0]?.count?.toString() || '0', 10);
    
    let totalRevenueResult;
    if (franchiseId) {
      totalRevenueResult = await db.execute(sqlBuilder`
        SELECT SUM(final_amount) as sum FROM ${orders} WHERE franchise_id = ${franchiseId}
      `);
    } else {
      totalRevenueResult = await db.execute(sqlBuilder`
        SELECT SUM(final_amount) as sum FROM ${orders}
      `);
    }
    const totalRevenue = parseFloat(totalRevenueResult.rows[0]?.sum?.toString() || '0') || 0;
    
    let customersCountResult;
    if (franchiseId) {
      customersCountResult = await db.execute(sqlBuilder`
        SELECT COUNT(*) as count FROM ${customers} WHERE franchise_id = ${franchiseId}
      `);
    } else {
      customersCountResult = await db.execute(sqlBuilder`
        SELECT COUNT(*) as count FROM ${customers}
      `);
    }
    const customersCount = parseInt(customersCountResult.rows[0]?.count?.toString() || '0', 10);
    
    let lowStockItemsResult;
    if (franchiseId) {
      lowStockItemsResult = await db.execute(sqlBuilder`
        SELECT COUNT(*) as count 
        FROM ${inventory} 
        WHERE franchise_id = ${franchiseId} AND stock_quantity <= 10
      `);
    } else {
      lowStockItemsResult = await db.execute(sqlBuilder`
        SELECT COUNT(*) as count 
        FROM ${inventory} 
        WHERE stock_quantity <= 10
      `);
    }
    const lowStockItemsCount = parseInt(lowStockItemsResult.rows[0]?.count?.toString() || '0', 10);
    
    return {
      totalOrders: totalOrdersCount,
      revenue: totalRevenue,
      customers: customersCount,
      lowStockItems: lowStockItemsCount
    };
  }
}

export const storage = new DatabaseStorage();