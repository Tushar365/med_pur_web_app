import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, jsonb, date, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Franchise model
export const franchises = pgTable("franchises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  contactNumber: text("contact_number").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const insertFranchiseSchema = createInsertSchema(franchises).pick({
  name: true,
  address: true,
  contactNumber: true,
  email: true,
  isActive: true,
});

// User model (pharmacy staff)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("staff"),
  franchiseId: integer("franchise_id").references(() => franchises.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  firstName: true,
  lastName: true,
  username: true,
  password: true,
  email: true,
  role: true,
  franchiseId: true,
  isActive: true,
});

// Customer model
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  franchiseId: integer("franchise_id").notNull().references(() => franchises.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  address: text("address").notNull(),
  contactNumber: text("contact_number").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCustomerSchema = createInsertSchema(customers).pick({
  franchiseId: true,
  firstName: true,
  lastName: true,
  address: true,
  contactNumber: true,
  email: true,
});

// Product model (medicines)
export const products = pgTable("products", {
  prCode: serial("pr_code").primaryKey(),
  category: text("category").notNull(),
  manufacturer: text("manufacturer").notNull(),
  name: text("name").notNull(),
  packing: text("packing").notNull(),
  mrp: doublePrecision("mrp").notNull(),
  casePack: integer("case_pack").notNull(),
  composition: text("composition"),
  gst: doublePrecision("gst").notNull(),
  discount: doublePrecision("discount").notNull(),
  stockQuantity: integer("stock_quantity").notNull(),
  expiryDate: date("expiry_date").notNull(),
  prescriptionRequired: boolean("prescription_required").notNull(),
  supplier: text("supplier").notNull(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  category: true,
  manufacturer: true,
  name: true,
  packing: true,
  mrp: true,
  casePack: true,
  composition: true,
  gst: true,
  discount: true,
  stockQuantity: true,
  expiryDate: true,
  prescriptionRequired: true,
  supplier: true,
});

// Order model
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  franchiseId: integer("franchise_id").notNull().references(() => franchises.id),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  status: text("status").notNull().default("pending"),
  totalAmount: doublePrecision("total_amount").notNull(),
  discountAmount: doublePrecision("discount_amount").notNull(),
  taxAmount: doublePrecision("tax_amount").notNull(),
  finalAmount: doublePrecision("final_amount").notNull(),
  billData: jsonb("bill_data"),
  billGeneratedAt: timestamp("bill_generated_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  orderNumber: true,
  franchiseId: true,
  customerId: true,
  status: true,
  totalAmount: true,
  discountAmount: true,
  taxAmount: true,
  finalAmount: true,
  notes: true,
});

// Order items model
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: integer("product_id").notNull().references(() => products.prCode),
  quantity: integer("quantity").notNull(),
  unitPrice: doublePrecision("unit_price").notNull(),
  discount: doublePrecision("discount").notNull(),
  taxRate: doublePrecision("tax_rate").notNull(),
  taxAmount: doublePrecision("tax_amount").notNull(),
  totalAmount: doublePrecision("total_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  quantity: true,
  unitPrice: true,
  discount: true,
  taxRate: true,
  taxAmount: true,
  totalAmount: true,
});

// Inventory model
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  franchiseId: integer("franchise_id").notNull().references(() => franchises.id),
  productId: integer("product_id").notNull().references(() => products.prCode),
  stockQuantity: integer("stock_quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInventorySchema = createInsertSchema(inventory).pick({
  franchiseId: true,
  productId: true,
  stockQuantity: true,
});

// Relations
export const franchisesRelations = relations(franchises, ({ many }) => ({
  users: many(users),
  customers: many(customers),
  orders: many(orders),
  inventory: many(inventory),
}));

export const usersRelations = relations(users, ({ one }) => ({
  franchise: one(franchises, {
    fields: [users.franchiseId],
    references: [franchises.id],
  }),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  franchise: one(franchises, {
    fields: [customers.franchiseId],
    references: [franchises.id],
  }),
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  franchise: one(franchises, {
    fields: [orders.franchiseId],
    references: [franchises.id],
  }),
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.prCode],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  inventory: many(inventory),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  franchise: one(franchises, {
    fields: [inventory.franchiseId],
    references: [franchises.id],
  }),
  product: one(products, {
    fields: [inventory.productId],
    references: [products.prCode],
  }),
}));

// Types
export type Franchise = typeof franchises.$inferSelect;
export type InsertFranchise = z.infer<typeof insertFranchiseSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;