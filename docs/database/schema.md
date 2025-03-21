# MedSync Database Schema

This document provides a comprehensive overview of the MedSync database schema, including tables, relationships, and important fields.

## Entity Relationship Diagram

```
+-------------+       +-------------+       +-------------+
|  Franchises |       |    Users    |       |  Customers  |
+-------------+       +-------------+       +-------------+
| id          |<----->| id          |       | id          |
| name        |       | firstName   |       | firstName   |
| address     |       | lastName    |       | lastName    |
| contactNumber|      | username    |       | email       |
| email       |       | password    |       | phone       |
| isActive    |       | email       |       | address     |
| createdAt   |       | role        |       | franchiseId |
| updatedAt   |       | franchiseId |       | createdAt   |
+-------------+       | createdAt   |       | updatedAt   |
       |              | updatedAt   |       +-------------+
       |              | lastLogin   |              |
       |              | isActive    |              |
       |              +-------------+              |
       |                     |                     |
       v                     |                     v
+-------------+              |              +-------------+
|  Products   |              |              |   Orders    |
+-------------+              |              +-------------+
| id          |              |              | id          |
| name        |              |              | customerId  |
| description |              |              | userId      |
| manufacturer|              |              | franchiseId |
| category    |              +------------->| total       |
| price       |                             | status      |
| gstRate     |                             | orderDate   |
| hsnCode     |                             | createdAt   |
| reorderLevel|                             | updatedAt   |
| franchiseId |                             +-------------+
| createdAt   |                                    |
| updatedAt   |                                    |
+-------------+                                    |
       |                                           |
       |                                           v
       v                                    +-------------+
+-------------+                             | Order Items |
|  Inventory  |                             +-------------+
+-------------+                             | id          |
| id          |                             | orderId     |
| productId   |<--------------------------->| productId   |
| franchiseId |                             | quantity    |
| quantity    |                             | price       |
| createdAt   |                             | total       |
| updatedAt   |                             | createdAt   |
+-------------+                             | updatedAt   |
                                            +-------------+
```

## Table Descriptions

### Franchises

This table stores information about the different pharmacy branches or franchises in the system.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| name | TEXT | Name of the franchise |
| address | TEXT | Physical address |
| contactNumber | TEXT | Contact phone number |
| email | TEXT | Contact email address |
| isActive | BOOLEAN | Whether the franchise is currently active |
| createdAt | TIMESTAMP | When the record was created |
| updatedAt | TIMESTAMP | When the record was last updated |

### Users

This table stores user accounts for staff members who use the system.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| firstName | TEXT | First name |
| lastName | TEXT | Last name |
| username | TEXT | Unique username for login |
| password | TEXT | Hashed password |
| email | TEXT | Email address |
| role | TEXT | User role (admin, staff, manager) |
| franchiseId | INTEGER | Foreign key to franchises.id |
| createdAt | TIMESTAMP | When the record was created |
| updatedAt | TIMESTAMP | When the record was last updated |
| lastLogin | TIMESTAMP | When the user last logged in |
| isActive | BOOLEAN | Whether the user account is active |

### Products

This table stores information about pharmaceutical products.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| name | TEXT | Product name |
| description | TEXT | Product description |
| manufacturer | TEXT | Manufacturer name |
| category | TEXT | Product category |
| price | DECIMAL | Base price (without GST) |
| gstRate | DECIMAL | GST rate in percentage |
| hsnCode | TEXT | HSN code for GST classification |
| reorderLevel | INTEGER | Minimum quantity before reorder |
| franchiseId | INTEGER | Foreign key to franchises.id |
| createdAt | TIMESTAMP | When the record was created |
| updatedAt | TIMESTAMP | When the record was last updated |

### Customers

This table stores information about pharmacy customers.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| firstName | TEXT | First name |
| lastName | TEXT | Last name |
| email | TEXT | Email address |
| phone | TEXT | Phone number |
| address | TEXT | Physical address |
| franchiseId | INTEGER | Foreign key to franchises.id |
| createdAt | TIMESTAMP | When the record was created |
| updatedAt | TIMESTAMP | When the record was last updated |

### Orders

This table stores customer orders.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| customerId | INTEGER | Foreign key to customers.id |
| userId | INTEGER | Foreign key to users.id (who processed the order) |
| franchiseId | INTEGER | Foreign key to franchises.id |
| total | DECIMAL | Total order amount (with GST) |
| status | TEXT | Order status (pending, processing, completed, cancelled) |
| orderDate | TIMESTAMP | When the order was placed |
| createdAt | TIMESTAMP | When the record was created |
| updatedAt | TIMESTAMP | When the record was last updated |

### Order Items

This table stores individual items within an order.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| orderId | INTEGER | Foreign key to orders.id |
| productId | INTEGER | Foreign key to products.id |
| quantity | INTEGER | Quantity ordered |
| price | DECIMAL | Unit price at time of order |
| total | DECIMAL | Line item total (quantity × price with GST) |
| createdAt | TIMESTAMP | When the record was created |
| updatedAt | TIMESTAMP | When the record was last updated |

### Inventory

This table tracks product inventory levels across franchises.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| productId | INTEGER | Foreign key to products.id |
| franchiseId | INTEGER | Foreign key to franchises.id |
| quantity | INTEGER | Current stock quantity |
| createdAt | TIMESTAMP | When the record was created |
| updatedAt | TIMESTAMP | When the record was last updated |

## Key Relationships

### Franchise to Users
- One-to-many relationship: A franchise can have multiple users
- Foreign key: `users.franchiseId` references `franchises.id`

### Franchise to Customers
- One-to-many relationship: A franchise can have multiple customers
- Foreign key: `customers.franchiseId` references `franchises.id`

### Franchise to Products
- One-to-many relationship: A franchise can have multiple products
- Foreign key: `products.franchiseId` references `franchises.id`

### User to Orders
- One-to-many relationship: A user can process multiple orders
- Foreign key: `orders.userId` references `users.id`

### Customer to Orders
- One-to-many relationship: A customer can place multiple orders
- Foreign key: `orders.customerId` references `customers.id`

### Franchise to Orders
- One-to-many relationship: A franchise can have multiple orders
- Foreign key: `orders.franchiseId` references `franchises.id`

### Order to Order Items
- One-to-many relationship: An order can have multiple items
- Foreign key: `orderItems.orderId` references `orders.id`

### Product to Order Items
- One-to-many relationship: A product can be in multiple order items
- Foreign key: `orderItems.productId` references `products.id`

### Product to Inventory
- One-to-many relationship: A product can be in inventory at multiple franchises
- Foreign key: `inventory.productId` references `products.id`

### Franchise to Inventory
- One-to-many relationship: A franchise can have multiple inventory items
- Foreign key: `inventory.franchiseId` references `franchises.id`

## GST Implementation

The MedSync database is designed to support GST (Goods and Services Tax) requirements for Indian pharmacies:

1. Each product has a `gstRate` field that stores the applicable GST percentage
2. Each product has an `hsnCode` field for GST classification
3. The `price` field in the Products table stores the base price without GST
4. The `total` field in Order Items includes the GST amount
5. The `total` field in Orders is the sum of all order items with GST included

## Security Considerations

1. User passwords are stored as hashed values, not plaintext
2. Sensitive customer information should be handled according to data protection regulations
3. Role-based access control is implemented through the `users.role` field

## Performance Considerations

For optimal performance, consider adding indexes to:

1. Foreign key columns (franchiseId, productId, orderId, etc.)
2. Frequently queried columns (status, orderDate, etc.)
3. Unique columns (username, email)

## Data Migration Notes

When migrating data to this schema:

1. Create franchises first
2. Then create users, products, and customers
3. Finally create orders, order items, and inventory records

## Next Steps

After understanding the database schema, you may want to:

1. Review the [Database Migrations Guide](./migrations.md) for managing schema changes
2. Explore the [API Endpoints Documentation](../api/endpoints.md) to understand how the application interacts with the database