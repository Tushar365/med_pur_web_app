-- PostgreSQL Database Initialization Script for MedSync
-- This script creates tables and indexes for the MedSync medicine ordering system

-- Create franchises table
CREATE TABLE IF NOT EXISTS franchises (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create users table with first name and last name
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL,
  franchise_id INTEGER REFERENCES franchises(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create customers table with first name and last name
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  franchise_id INTEGER NOT NULL REFERENCES franchises(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table (based on your existing table structure)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  packing VARCHAR(100) NOT NULL,
  mrp DECIMAL(10, 2) NOT NULL,
  case_pack INTEGER NOT NULL,
  composition TEXT,
  gst DECIMAL(5, 2) NOT NULL,
  discount DECIMAL(5, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL,
  expiry_date DATE NOT NULL,
  prescription_required BOOLEAN NOT NULL,
  supplier VARCHAR(255) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  franchise_id INTEGER NOT NULL REFERENCES franchises(id),
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  status VARCHAR(20) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  final_amount DECIMAL(10, 2) NOT NULL,
  bill_data JSONB,
  bill_generated_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(5, 2) NOT NULL,
  tax_rate DECIMAL(5, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  franchise_id INTEGER NOT NULL REFERENCES franchises(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  stock_quantity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(franchise_id, product_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_franchise_id ON users(franchise_id);
CREATE INDEX IF NOT EXISTS idx_customers_franchise_id ON customers(franchise_id);
CREATE INDEX IF NOT EXISTS idx_orders_franchise_id ON orders(franchise_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_franchise_id ON inventory(franchise_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);

-- Create session store table for persistent sessions
CREATE TABLE IF NOT EXISTS session (
  sid varchar NOT NULL,
  sess json NOT NULL,
  expire timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON session ("expire");

-- Insert sample data for testing (uncomment for development environments)

-- Insert default franchise
-- INSERT INTO franchises (name, address, contact_number, email)
-- VALUES ('Main Pharmacy', '123 Medical Street, New Delhi, India', '+91 9876543210', 'pharmacy@example.com');

-- Insert a default admin user (password: admin123)
-- INSERT INTO users (first_name, last_name, username, password, email, role, franchise_id)
-- VALUES (
--   'Admin', 
--   'User', 
--   'admin', 
--   '$2b$10$iLAzIlN4oq0eWR2mMYk.F.ZiC9AFzQs/D3p3E4nHj2qSxBL2ek.5a', 
--   'admin@example.com', 
--   'admin',
--   (SELECT id FROM franchises WHERE name = 'Main Pharmacy')
-- );