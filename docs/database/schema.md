# MedSync Database Schema Documentation

This document provides a comprehensive overview of the database schema used in the MedSync application. The schema is defined in `shared/schema.ts` using Drizzle ORM.

## Overview

MedSync uses a PostgreSQL database with the following tables:

- Franchises: Stores information about different pharmacy locations
- Users: Stores user authentication and profile information
- Customers: Stores customer information
- Products: Stores medicine product information
- Orders: Stores order information
- Order Items: Stores individual items within an order
- Inventory: Stores product inventory information for each franchise

## Entity Relationship Diagram

```
┌─────────────┐       ┌──────────┐       ┌────────────┐
│  Franchises │───┐   │   Users  │       │  Customers │
└─────────────┘   │   └──────────┘       └────────────┘
                  │       │                     │
                  │       │                     │
                  ▼       ▼                     ▼
┌─────────────┐  ┌─────────────┐       ┌───────────────┐
│  Inventory  │◄─┤    Orders   │◄──────┤  Order Items  │
└─────────────┘  └─────────────┘       └───────────────┘
        ▲                                      │
        │                                      │
        │             ┌─────────────┐          │
        └─────────────┤   Products  │◄─────────┘
                      └─────────────┘
```

## Tables

### Franchises

Represents individual pharmacy locations or branches.

| Column | Type | Description |
|--------|------|-------------|
| id | Serial | Primary key |
| name | Text | Branch name |
| address | Text | Branch address |
| contact_number | Text | Contact phone number |
| email | Text | Branch email address |
| created_at | Timestamp | Creation timestamp |
| updated_at | Timestamp | Last update timestamp |
| is_active | Boolean | Whether the franchise is active |

### Users

Represents user accounts for administrators, managers, and staff.

| Column | Type | Description |
|--------|------|-------------|
| id | Serial | Primary key |
| first_name | Text | User's first name |
| last_name | Text | User's last name |
| username | Text | Unique username |
| password | Text | Hashed password |
| email | Text | User's email address |
| role | Text | User role (admin, manager, staff) |
| franchise_id | Integer | Foreign key to franchises |
| created_at | Timestamp | Creation timestamp |
| updated_at | Timestamp | Last update timestamp |
| last_login | Timestamp | Last login timestamp |
| is_active | Boolean | Whether the user is active |

### Customers

Represents customers who purchase medicines.

| Column | Type | Description |
|--------|------|-------------|
| id | Serial | Primary key |
| franchise_id | Integer | Foreign key to franchises |
| first_name | Text | Customer's first name |
| last_name | Text | Customer's last name |
| address | Text | Customer's address |
| contact_number | Text | Customer's contact number |
| email | Text | Customer's email address |
| created_at | Timestamp | Creation timestamp |
| updated_at | Timestamp | Last update timestamp |

### Products

Represents medicine products available for sale.

| Column | Type | Description |
|--------|------|-------------|
| id | Serial | Primary key |
| category | Text | Product category |
| manufacturer | Text | Product manufacturer |
| name | Text | Product name |
| packing | Text | Product packaging information |
| mrp | Numeric | Maximum Retail Price (in ₹) |
| case_pack | Integer | Number of units in a case |
| composition | Text | Medicine composition |
| gst | Numeric | GST tax rate (%) |
| discount | Numeric | Default discount rate (%) |
| stock_quantity | Integer | Stock quantity (at company level) |
| expiry_date | Date | Product expiry date |
| prescription_required | Boolean | Whether prescription is required |
| supplier | Text | Supplier name |

### Orders

Represents customer orders.

| Column | Type | Description |
|--------|------|-------------|
| id | Serial | Primary key |
| order_number | Text | Unique order number |
| franchise_id | Integer | Foreign key to franchises |
| customer_id | Integer | Foreign key to customers |
| status | Text | Order status (pending, processing, shipped, delivered, cancelled) |
| total_amount | Numeric | Total order amount before discounts and taxes |
| discount_amount | Numeric | Discount amount |
| tax_amount | Numeric | Tax amount |
| final_amount | Numeric | Final order amount after discounts and taxes |
| bill_data | JSON | JSON data for bill generation |
| bill_generated_at | Timestamp | When the bill was generated |
| notes | Text | Order notes |
| created_at | Timestamp | Creation timestamp |
| updated_at | Timestamp | Last update timestamp |

### Order Items

Represents individual items within an order.

| Column | Type | Description |
|--------|------|-------------|
| id | Serial | Primary key |
| order_id | Integer | Foreign key to orders |
| product_id | Integer | Foreign key to products |
| quantity | Integer | Quantity ordered |
| unit_price | Numeric | Unit price at time of order |
| discount | Numeric | Discount rate applied (%) |
| tax_rate | Numeric | Tax rate applied (%) |
| tax_amount | Numeric | Tax amount |
| total_amount | Numeric | Total amount for this item |
| created_at | Timestamp | Creation timestamp |
| updated_at | Timestamp | Last update timestamp |

### Inventory

Represents inventory levels for products at each franchise.

| Column | Type | Description |
|--------|------|-------------|
| id | Serial | Primary key |
| franchise_id | Integer | Foreign key to franchises |
| product_id | Integer | Foreign key to products |
| stock_quantity | Integer | Available stock quantity |
| created_at | Timestamp | Creation timestamp |
| updated_at | Timestamp | Last update timestamp |

## Relationships

### One-to-Many Relationships

- A Franchise has many Users
- A Franchise has many Customers
- A Franchise has many Orders
- A Franchise has many Inventory records
- A Customer has many Orders
- An Order has many Order Items
- A Product has many Order Items
- A Product has many Inventory records

### Many-to-One Relationships

- A User belongs to a Franchise
- A Customer belongs to a Franchise
- An Order belongs to a Franchise
- An Order belongs to a Customer
- An Order Item belongs to an Order
- An Order Item belongs to a Product
- An Inventory record belongs to a Franchise
- An Inventory record belongs to a Product

## Indexes

The following indexes are created to optimize query performance:

- idx_users_franchise_id
- idx_customers_franchise_id
- idx_orders_franchise_id
- idx_orders_customer_id
- idx_order_items_order_id
- idx_order_items_product_id
- idx_inventory_franchise_id
- idx_inventory_product_id

## Constraints

- Unique constraint on users.username
- Unique constraint on users.email
- Unique constraint on orders.order_number
- Unique constraint on inventory(franchise_id, product_id)

## TypeScript Schema

The database schema is defined in `shared/schema.ts` using Drizzle ORM. Here's an overview of how the tables are defined:

```typescript
export const franchises = pgTable("franchises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  contact_number: text("contact_number").notNull(),
  email: text("email").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  is_active: boolean("is_active").default(true),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(),
  franchise_id: integer("franchise_id").references(() => franchises.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  last_login: timestamp("last_login"),
  is_active: boolean("is_active").default(true),
});

// Other tables follow a similar pattern...
```

## Type Definitions

For each table, there are also TypeScript type definitions:

```typescript
export type Franchise = typeof franchises.$inferSelect;
export type InsertFranchise = z.infer<typeof insertFranchiseSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Other type definitions follow a similar pattern...
```

These types are used throughout the application to ensure type safety when interacting with the database.

## Schema Management

The schema is managed using Drizzle ORM's schema push functionality. To update the schema:

1. Modify the schema definition in `shared/schema.ts`
2. Run `npm run db:push` to apply the changes to the database

For more details on schema management, see the [Database Migrations Guide](/docs/database/migrations.md).

## Common Query Patterns

Here are some common query patterns used in the application:

### Fetching Data with Relations

```typescript
// Fetch all orders with customer details
const orders = await db.query.orders.findMany({
  with: {
    customer: true,
  },
});

// Fetch an order with all its items and product details
const orderWithDetails = await db.query.orders.findFirst({
  where: eq(orders.id, orderId),
  with: {
    customer: true,
    items: {
      with: {
        product: true,
      },
    },
  },
});
```

### Inserting Data with Transactions

```typescript
// Create an order with multiple items
const newOrder = await db.transaction(async (tx) => {
  const [order] = await tx
    .insert(orders)
    .values({
      order_number: generateOrderNumber(),
      franchise_id: franchiseId,
      customer_id: customerId,
      status: "pending",
      total_amount: totalAmount,
      discount_amount: discountAmount,
      tax_amount: taxAmount,
      final_amount: finalAmount,
      notes: notes,
    })
    .returning();

  for (const item of items) {
    await tx.insert(orderItems).values({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount: item.discount,
      tax_rate: item.tax_rate,
      tax_amount: item.tax_amount,
      total_amount: item.total_amount,
    });
  }

  return order;
});
```

## Conclusion

This schema design supports all the key features of the MedSync application, including multi-franchise management, user authentication, inventory tracking, customer management, and order processing with GST tax handling specifically for the Indian market.