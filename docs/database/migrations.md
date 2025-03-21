# Database Migration Guide for MedSync

This guide provides instructions for managing database migrations in the MedSync application.

## Overview

MedSync uses Drizzle ORM for database schema management. This approach utilizes a schema-first development model where you define your schema in TypeScript and then push the changes to your database.

## Migration Workflow

### 1. Update Schema Definition

First, modify the schema definition in `shared/schema.ts`. This is where you define your tables, columns, relationships, and types.

Example of adding a new column to an existing table:

```typescript
// shared/schema.ts
export const products = pgTable("products", {
  // Existing columns...
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  
  // New column
  batch_number: text("batch_number"),
});
```

### 2. Generate Migration Files (Optional)

While MedSync primarily uses the push approach for simplicity, you can generate SQL migration files for more control:

```bash
npm run db:generate
```

This command uses Drizzle Kit to compare your schema with the database and generate migration files in the `drizzle` folder.

### 3. Push Schema Changes

To apply your schema changes directly to the database:

```bash
npm run db:push
```

This command will update your database schema to match the definition in `shared/schema.ts`.

## Important Considerations

### Data Safety

- The `db:push` command can be destructive. It may drop columns or tables when they are removed from the schema.
- For production environments, consider using the migration-based approach with `db:generate` and then manually reviewing the migrations before applying them.

### Schema Validation

Before applying migrations to production:

1. Test migrations on a staging environment first
2. Back up the production database before applying migrations
3. Schedule migrations during low-traffic periods

## Common Migration Scenarios

### Adding a New Table

1. Define the new table in `shared/schema.ts`:

```typescript
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contact_person: text("contact_person"),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Add the schema to insertSchema and type exports
export const insertSupplierSchema = createInsertSchema(suppliers).pick({
  name: true,
  contact_person: true,
  phone: true,
  email: true,
  address: true,
});

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
```

2. Push the changes:

```bash
npm run db:push
```

### Adding a Column to an Existing Table

1. Update the table definition in `shared/schema.ts`:

```typescript
export const customers = pgTable("customers", {
  // Existing columns...
  
  // New column
  preferred_communication: text("preferred_communication").default("phone"),
});

// Update the insert schema too
export const insertCustomerSchema = createInsertSchema(customers).pick({
  // Existing fields...
  preferred_communication: true,
});
```

2. Push the changes:

```bash
npm run db:push
```

### Renaming a Column (Two-Step Process)

Drizzle doesn't directly support renaming columns in the schema-push approach. You'll need to:

1. Add the new column:

```typescript
export const products = pgTable("products", {
  // Existing columns...
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  // New column with the desired name
  mrp: numeric("mrp", { precision: 10, scale: 2 }).notNull().default("0"),
});
```

2. Push the changes:

```bash
npm run db:push
```

3. Write a data migration script to copy data from the old column to the new one:

```typescript
import { db } from '@/server/db';
import { products } from '@/shared/schema';

// Copy data from price to mrp
await db.execute(sql`UPDATE products SET mrp = price WHERE mrp = 0`);
```

4. Remove the old column from the schema:

```typescript
export const products = pgTable("products", {
  // Existing columns...
  // price: numeric("price", { precision: 10, scale: 2 }).notNull(), // Removed
  mrp: numeric("mrp", { precision: 10, scale: 2 }).notNull(),
});
```

5. Push the changes again:

```bash
npm run db:push
```

### Adding a Relationship Between Tables

1. Define the relationship in `shared/schema.ts`:

```typescript
// First, ensure both tables have the necessary columns
export const products = pgTable("products", {
  // Existing columns...
  supplier_id: integer("supplier_id").references(() => suppliers.id),
});

// Then, define the relationship
export const productsRelations = relations(products, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [products.supplier_id],
    references: [suppliers.id],
  }),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
}));
```

2. Push the changes:

```bash
npm run db:push
```

## Troubleshooting Migrations

### Schema Push Fails

If `db:push` fails with errors:

1. Check for conflicting schema changes
2. Verify database connection and permissions
3. Consider using a custom migration script for complex changes

### Data Type Conflicts

When changing column types:

1. Consider creating a new column with the desired type
2. Migrate data with appropriate conversions
3. Remove the old column after data is migrated

### Foreign Key Constraints

When adding foreign keys:

1. Ensure the referenced table and column exist
2. Check that there are no existing records that would violate the constraint
3. For existing data, clean up or update records before adding the constraint

## Verifying Migrations

After applying migrations, verify your schema:

1. Inspect the database schema:

```bash
npm run db:studio
```

2. Run tests that interact with the affected parts of the database
3. Manually test the application functionality that uses the updated schema

## Conclusion

Following this guide will help you safely manage database schema changes in your MedSync application. Remember to always back up your database before applying migrations to production environments.

## Next Steps

- Learn more about [Drizzle ORM](https://orm.drizzle.team/)
- Explore [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) for more advanced migration workflows
- Consider adding automated testing for your database schema