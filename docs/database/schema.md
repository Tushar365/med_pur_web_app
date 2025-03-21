# MedSync Database Schema Reference

This document provides a comprehensive reference for the MedSync database schema, detailing all tables, columns, relationships, and their purposes within the application.

## Overview

MedSync uses a PostgreSQL database with tables organized around the core entities of the pharmacy management system:

- **Franchises**: Pharmacy locations or branches
- **Users**: Staff accounts with authentication
- **Products**: Medicines and healthcare items
- **Customers**: Patient/customer information
- **Orders**: Purchase transactions
- **Order Items**: Individual items within orders
- **Inventory**: Stock levels for products at franchises

## Entity Relationship Diagram

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   Franchise   │     │     User      │     │   Customer    │
├───────────────┤     ├───────────────┤     ├───────────────┤
│ id            │────>│ id            │     │ id            │
│ name          │     │ username      │     │ firstName     │
│ address       │     │ password      │     │ lastName      │
│ contactNumber │     │ firstName     │     │ email         │
│ email         │     │ lastName      │<────│ phone         │
│ isActive      │<────│ email         │     │ address       │
│ createdAt     │     │ role          │     │ franchiseId   │
│ updatedAt     │     │ franchiseId   │     │ createdAt     │
└───────────────┘     │ isActive      │     │ updatedAt     │
       ▲ △            │ createdAt     │     └───────────────┘
       │ │            │ updatedAt     │           △ ▲
       │ │            └───────────────┘           │ │
       │ │                    △                   │ │
       │ │                    │                   │ │
┌──────┴──────────┐   ┌───────┴───────┐   ┌──────┴───────────┐
│    Inventory    │   │    Order      │   │    Order Item    │
├─────────────────┤   ├───────────────┤   ├──────────────────┤
│ id              │   │ id            │<──│ id               │
│ productId       │   │ customerId    │   │ orderId          │
│ franchiseId     │   │ userId        │   │ productId        │
│ quantity        │   │ franchiseId   │   │ quantity         │
│ createdAt       │   │ total         │   │ price            │
│ updatedAt       │   │ status        │   │ total            │
└─────────────────┘   │ orderDate     │   │ createdAt        │
       ▲              │ createdAt     │   │ updatedAt        │
       │              │ updatedAt     │   └──────────────────┘
       │              └───────────────┘          △
       │                                         │
┌──────┴──────────┐                             │
│     Product     │                             │
├─────────────────┤                             │
│ id              │<────────────────────────────┘
│ name            │
│ description     │
│ manufacturer    │
│ category        │
│ price           │
│ gstRate         │
│ hsnCode         │
│ reorderLevel    │
│ franchiseId     │
│ createdAt       │
│ updatedAt       │
└─────────────────┘
```

## Tables

### Franchises

The `franchises` table stores information about different pharmacy locations or branches.

| Column | Type | Description | Constraints |
|--------|------|-------------|------------|
| id | serial | Unique identifier | Primary Key |
| name | text | Name of the franchise/branch | Not Null |
| address | text | Physical address | Not Null |
| contactNumber | text | Phone number | Not Null |
| email | text | Contact email | Not Null |
| isActive | boolean | Whether the franchise is active | Default: true |
| createdAt | timestamp | Creation timestamp | Default: now() |
| updatedAt | timestamp | Last update timestamp | Default: now() |

### Users

The `users` table stores authentication information for staff members.

| Column | Type | Description | Constraints |
|--------|------|-------------|------------|
| id | serial | Unique identifier | Primary Key |
| username | text | Login username | Not Null, Unique |
| password | text | Hashed password | Not Null |
| firstName | text | User's first name | Not Null |
| lastName | text | User's last name | Not Null |
| email | text | User's email address | Not Null |
| role | text | User role (admin, manager, staff) | Not Null, Default: 'staff' |
| franchiseId | integer | Associated franchise | Foreign Key (franchises.id) |
| isActive | boolean | Whether the user account is active | Default: true |
| createdAt | timestamp | Creation timestamp | Default: now() |
| updatedAt | timestamp | Last update timestamp | Default: now() |

### Products

The `products` table contains information about medicines and healthcare items.

| Column | Type | Description | Constraints |
|--------|------|-------------|------------|
| id | serial | Unique identifier | Primary Key |
| name | text | Product name | Not Null |
| description | text | Product description | |
| manufacturer | text | Manufacturing company | |
| category | text | Product category | Not Null |
| price | decimal | Base price (pre-tax) | Not Null |
| gstRate | decimal | GST rate percentage | Not Null, Default: 12.0 |
| hsnCode | text | HSN code for taxation | |
| reorderLevel | integer | Minimum quantity before reorder | Not Null |
| franchiseId | integer | Associated franchise | Foreign Key (franchises.id) |
| createdAt | timestamp | Creation timestamp | Default: now() |
| updatedAt | timestamp | Last update timestamp | Default: now() |

### Customers

The `customers` table stores information about the pharmacy's customers/patients.

| Column | Type | Description | Constraints |
|--------|------|-------------|------------|
| id | serial | Unique identifier | Primary Key |
| firstName | text | Customer's first name | Not Null |
| lastName | text | Customer's last name | Not Null |
| email | text | Customer's email address | |
| phone | text | Customer's phone number | Not Null |
| address | text | Customer's address | |
| franchiseId | integer | Associated franchise | Foreign Key (franchises.id) |
| createdAt | timestamp | Creation timestamp | Default: now() |
| updatedAt | timestamp | Last update timestamp | Default: now() |

### Orders

The `orders` table records purchase transactions.

| Column | Type | Description | Constraints |
|--------|------|-------------|------------|
| id | serial | Unique identifier | Primary Key |
| customerId | integer | Customer making the order | Foreign Key (customers.id) |
| userId | integer | Staff member creating the order | Foreign Key (users.id) |
| franchiseId | integer | Franchise where order was placed | Foreign Key (franchises.id) |
| total | decimal | Total order amount (with tax) | Not Null |
| status | text | Order status (pending, processing, completed, cancelled) | Not Null, Default: 'pending' |
| orderDate | timestamp | When the order was placed | Default: now() |
| createdAt | timestamp | Creation timestamp | Default: now() |
| updatedAt | timestamp | Last update timestamp | Default: now() |

### Order Items

The `order_items` table contains individual items within orders.

| Column | Type | Description | Constraints |
|--------|------|-------------|------------|
| id | serial | Unique identifier | Primary Key |
| orderId | integer | Associated order | Foreign Key (orders.id) |
| productId | integer | Product ordered | Foreign Key (products.id) |
| quantity | integer | Quantity ordered | Not Null |
| price | decimal | Unit price at time of order | Not Null |
| total | decimal | Total price for this item (with tax) | Not Null |
| createdAt | timestamp | Creation timestamp | Default: now() |
| updatedAt | timestamp | Last update timestamp | Default: now() |

### Inventory

The `inventory` table tracks stock levels for products at each franchise.

| Column | Type | Description | Constraints |
|--------|------|-------------|------------|
| id | serial | Unique identifier | Primary Key |
| productId | integer | Associated product | Foreign Key (products.id) |
| franchiseId | integer | Associated franchise | Foreign Key (franchises.id) |
| quantity | integer | Current stock quantity | Not Null |
| createdAt | timestamp | Creation timestamp | Default: now() |
| updatedAt | timestamp | Last update timestamp | Default: now() |

## Relationships

### Franchise Relationships

- **One-to-Many**: A franchise has many users
- **One-to-Many**: A franchise has many products
- **One-to-Many**: A franchise has many customers
- **One-to-Many**: A franchise has many orders
- **One-to-Many**: A franchise has many inventory records

### User Relationships

- **Many-to-One**: A user belongs to one franchise
- **One-to-Many**: A user creates many orders

### Customer Relationships

- **Many-to-One**: A customer belongs to one franchise
- **One-to-Many**: A customer places many orders

### Product Relationships

- **Many-to-One**: A product belongs to one franchise
- **One-to-Many**: A product appears in many order items
- **One-to-Many**: A product has many inventory records

### Order Relationships

- **Many-to-One**: An order belongs to one customer
- **Many-to-One**: An order is created by one user
- **Many-to-One**: An order belongs to one franchise
- **One-to-Many**: An order contains many order items

### Order Item Relationships

- **Many-to-One**: An order item belongs to one order
- **Many-to-One**: An order item references one product

### Inventory Relationships

- **Many-to-One**: An inventory record belongs to one product
- **Many-to-One**: An inventory record belongs to one franchise

## Schema Definition

The database schema is defined in the `shared/schema.ts` file using Drizzle ORM, which provides both the database structure and TypeScript type definitions.

### Key Schema Components

1. **Table Definitions**: Uses `pgTable` to define tables with columns and constraints
2. **Column Types**: Uses appropriate PostgreSQL types (serial, text, decimal, timestamp, etc.)
3. **Relations**: Defines relationships between tables using the `relations` function
4. **Insert Schemas**: Creates Zod validation schemas for data insertion using `createInsertSchema`
5. **TypeScript Types**: Generates TypeScript types from the schema definitions

## Unique Constraints and Indices

The schema includes several unique constraints and indices to optimize query performance:

- Unique constraint on `users.username` to prevent duplicate usernames
- Index on `products.franchiseId` to optimize product queries by franchise
- Index on `inventory.productId` and `inventory.franchiseId` for faster inventory lookups
- Composite unique constraint on `inventory.productId` and `inventory.franchiseId` to ensure a product has only one inventory record per franchise

## Enum Values

The schema uses several string enums for categorization:

### User Roles

- `admin`: System administrator with full access
- `manager`: Franchise manager with elevated permissions
- `staff`: Regular staff member with limited permissions

### Order Status

- `pending`: Order has been created but not processed
- `processing`: Order is being prepared
- `completed`: Order has been fulfilled and delivered
- `cancelled`: Order has been cancelled

### Product Categories

Common categories include:
- `Analgesics`
- `Antibiotics`
- `Antihistamines`
- `Antihypertensives`
- `Vitamins`
- `Supplements`
- `First Aid`

## Data Integrity

The schema enforces data integrity through:

1. **Primary Keys**: Every table has a unique `id` field
2. **Foreign Keys**: Relationships are enforced with references to parent tables
3. **Not Null Constraints**: Critical fields are required
4. **Default Values**: Sensible defaults are provided where appropriate
5. **Timestamps**: All records track creation and update times

## GST Implementation

The schema includes specific fields for Indian GST tax compliance:

- `products.gstRate`: The GST percentage applied to the product
- `products.hsnCode`: The Harmonized System Nomenclature code for tax classification
- `order_items.total`: Includes the calculated GST amount based on the product's GST rate

## Next Steps

After understanding the database schema, you might want to explore:

1. [Database Migrations Guide](./migrations.md) for managing schema changes
2. [API Endpoints Documentation](../api/endpoints.md) to understand how the application interacts with this data
3. [Local Development Setup](../development/local-setup.md) for setting up the database locally