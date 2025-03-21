# Database Migrations Guide for MedSync

This document explains how to manage database schema changes (migrations) in the MedSync application using Drizzle ORM.

## Understanding Migrations

Database migrations are a controlled way to evolve your database schema over time. They allow you to:

- Add new tables, columns, or indices
- Modify existing database structures
- Remove outdated database elements
- Keep your database schema in sync with your application code

## Migration Strategy in MedSync

MedSync uses Drizzle ORM's "push" approach for database migrations, which:

1. Compares your schema definition to the current database state
2. Generates and executes the necessary SQL to align the database with your schema
3. Preserves existing data when possible

This approach is simple and works well for development and small to medium-sized applications.

## Migration Files and Structure

In MedSync, the database schema is defined in:

```
shared/schema.ts
```

This file contains:
- Table definitions using `pgTable`
- Column definitions with data types and constraints
- Relationship definitions using the `relations` function
- Insert schemas using `createInsertSchema`
- Type definitions for TypeScript integration

## Running Migrations

### Basic Migration (Development)

To update your database schema to match the current schema definition:

```bash
npm run db:push
```

This command will:
1. Read your schema definition from `shared/schema.ts`
2. Compare it with the current database state
3. Generate and execute the necessary SQL to update the database

### Checking Pending Migrations

To see what changes would be made without actually applying them:

```bash
npm run db:generate
```

This will show a preview of the SQL that would be generated to update your database.

## Migration Best Practices

### Before Making Schema Changes

1. **Backup your database**:
   ```bash
   pg_dump -U postgres medsync > medsync_backup.sql
   ```

2. **Run in development first**:
   Test all migrations in a development environment before applying to production.

### When Making Schema Changes

1. **Be incremental**:
   Make small, targeted changes rather than large schema overhauls.

2. **Handle data preservation**:
   When renaming or restructuring columns, ensure your migration preserves existing data.

3. **Consider constraints**:
   Think about how new constraints might affect existing data.

4. **Test both ways**:
   Ensure your schema changes work for both new and existing installations.

## Production Migration Workflow

For production deployments, follow this workflow:

1. **Maintenance mode**:
   Consider putting your application in maintenance mode during migration.

2. **Backup**:
   Always backup your production database before migration.
   ```bash
   pg_dump -h [railway-host] -U [username] -d [dbname] > prod_backup_[date].sql
   ```

3. **Dry run**:
   Use `npm run db:generate` to preview changes.

4. **Apply migration**:
   Run `npm run db:push` to apply the changes.

5. **Verify**:
   Check that the application works correctly with the new schema.

## Common Migration Scenarios

### Adding a New Table

1. Add your table definition to `shared/schema.ts`:
   ```typescript
   export const suppliers = pgTable("suppliers", {
     id: serial("id").primaryKey(),
     name: text("name").notNull(),
     contactName: text("contact_name"),
     phone: text("phone"),
     email: text("email"),
     address: text("address"),
     franchiseId: integer("franchise_id").references(() => franchises.id),
     createdAt: timestamp("created_at").defaultNow(),
     updatedAt: timestamp("updated_at").defaultNow(),
   });
   ```

2. Add relations if needed:
   ```typescript
   export const suppliersRelations = relations(suppliers, ({ one, many }) => ({
     franchise: one(franchises, {
       fields: [suppliers.franchiseId],
       references: [franchises.id],
     }),
     products: many(products),
   }));
   ```

3. Add insert schema and type definitions:
   ```typescript
   export const insertSupplierSchema = createInsertSchema(suppliers).pick({
     name: true,
     contactName: true,
     phone: true,
     email: true,
     address: true,
     franchiseId: true,
   });
   
   export type Supplier = typeof suppliers.$inferSelect;
   export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
   ```

4. Run migration:
   ```bash
   npm run db:push
   ```

### Adding a New Column

1. Modify the table definition in `shared/schema.ts`:
   ```typescript
   export const products = pgTable("products", {
     // Existing fields...
     supplierInfo: text("supplier_info"), // New field
   });
   ```

2. Update the insert schema:
   ```typescript
   export const insertProductSchema = createInsertSchema(products).pick({
     // Existing fields...
     supplierInfo: true, // New field
   });
   ```

3. Run migration:
   ```bash
   npm run db:push
   ```

### Renaming a Column

Drizzle doesn't directly support column renaming through schema comparison. Instead, you'll need to:

1. Add the new column
2. Copy data from the old column to the new column
3. Remove the old column

Example process:

```typescript
// 1. Add new column first
export const products = pgTable("products", {
  // Existing fields...
  manufacturerName: text("manufacturer_name"), // New name
  manufacturer: text("manufacturer"), // Old name (keep for now)
});

// After migration and data copying:
export const products = pgTable("products", {
  // Existing fields...
  manufacturerName: text("manufacturer_name"), 
  // manufacturer field removed
});
```

The data copying step would need to be done with a custom SQL script.

### Changing Column Types

Be careful when changing column types as it might cause data loss:

1. For safe conversions (e.g., varchar to text):
   ```typescript
   // Change from:
   someField: varchar("some_field", { length: 255 }),
   // To:
   someField: text("some_field"),
   ```

2. For potentially unsafe conversions (e.g., text to integer):
   First validate that all data can be converted correctly using a database query.

## Troubleshooting Migrations

### Migration Fails to Apply

If `db:push` fails:

1. Check the error message for specific issues
2. Verify that your schema definition is valid
3. Ensure your database connection is working
4. Check for constraint violations in existing data

### Data Inconsistencies After Migration

If you notice data issues after migration:

1. Restore from backup if needed
2. Write a data correction script to fix specific issues
3. Consider a more careful migration approach for that specific change

## Advanced Migration Topics

### Custom SQL Migrations

For complex migrations that can't be handled by schema comparison:

1. Create a SQL script with your custom migration:
   ```sql
   -- migrations/custom-migration.sql
   UPDATE products SET price = price * 1.05 WHERE category = 'antibiotics';
   ```

2. Execute the script against your database:
   ```bash
   psql -U postgres -d medsync -f migrations/custom-migration.sql
   ```

### Railway PostgreSQL Considerations

When using Railway for your PostgreSQL database:

1. Migrations work the same way, just ensure your `DATABASE_URL` points to your Railway database
2. Railway may have connection limitations - use a stable connection for migrations
3. Always backup before migrating a Railway database

## Next Steps

After understanding how to manage database migrations, you might want to:

1. Review the [Database Schema Overview](./schema.md) for a comprehensive understanding of the data structure
2. Explore the [API Endpoints Documentation](../api/endpoints.md) to understand how the application interacts with the database