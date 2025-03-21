# MedSync API Documentation

This document provides details on all available API endpoints in the MedSync application.

## Authentication

### Register a new user

- **URL**: `/api/register`
- **Method**: `POST`
- **Auth required**: No
- **Permissions required**: None

**Request Body:**

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "password": "securepassword",
  "email": "john.doe@example.com",
  "role": "manager",
  "franchise_id": 1
}
```

**Success Response:**

- **Code**: 201 Created
- **Content**:

```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "email": "john.doe@example.com",
  "role": "manager",
  "franchise_id": 1
}
```

**Error Response:**

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "Username already exists"
}
```

### Login

- **URL**: `/api/login`
- **Method**: `POST`
- **Auth required**: No
- **Permissions required**: None

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "securepassword"
}
```

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "email": "john.doe@example.com",
  "role": "manager",
  "franchise_id": 1
}
```

**Error Response:**

- **Code**: 401 Unauthorized
- **Content**: None

### Logout

- **URL**: `/api/logout`
- **Method**: `POST`
- **Auth required**: Yes
- **Permissions required**: None

**Success Response:**

- **Code**: 200 OK
- **Content**: None

### Get current user

- **URL**: `/api/user`
- **Method**: `GET`
- **Auth required**: Yes
- **Permissions required**: None

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "email": "john.doe@example.com",
  "role": "manager",
  "franchise_id": 1
}
```

**Error Response:**

- **Code**: 401 Unauthorized
- **Content**: None

## Franchises

### Get all franchises

- **URL**: `/api/franchises`
- **Method**: `GET`
- **Auth required**: Yes
- **Permissions required**: None

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
[
  {
    "id": 1,
    "name": "Main Branch",
    "address": "123 Medical Street, New Delhi",
    "contact_number": "+91 9876543210",
    "email": "main@medsync.com",
    "is_active": true,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
]
```

### Get a specific franchise

- **URL**: `/api/franchises/:id`
- **Method**: `GET`
- **Auth required**: Yes
- **Permissions required**: None
- **URL Parameters**: id=[integer] franchise ID

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "id": 1,
  "name": "Main Branch",
  "address": "123 Medical Street, New Delhi",
  "contact_number": "+91 9876543210",
  "email": "main@medsync.com",
  "is_active": true,
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

**Error Response:**

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Franchise not found"
}
```

### Create a franchise

- **URL**: `/api/franchises`
- **Method**: `POST`
- **Auth required**: Yes
- **Permissions required**: Admin

**Request Body:**

```json
{
  "name": "New Branch",
  "address": "456 Pharmacy Road, Mumbai",
  "contact_number": "+91 9876543211",
  "email": "mumbai@medsync.com"
}
```

**Success Response:**

- **Code**: 201 Created
- **Content**:

```json
{
  "id": 2,
  "name": "New Branch",
  "address": "456 Pharmacy Road, Mumbai",
  "contact_number": "+91 9876543211",
  "email": "mumbai@medsync.com",
  "is_active": true,
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

### Update a franchise

- **URL**: `/api/franchises/:id`
- **Method**: `PATCH`
- **Auth required**: Yes
- **Permissions required**: Admin
- **URL Parameters**: id=[integer] franchise ID

**Request Body:**

```json
{
  "name": "Updated Branch Name",
  "contact_number": "+91 9876543212"
}
```

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "id": 2,
  "name": "Updated Branch Name",
  "address": "456 Pharmacy Road, Mumbai",
  "contact_number": "+91 9876543212",
  "email": "mumbai@medsync.com",
  "is_active": true,
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

**Error Response:**

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Franchise not found"
}
```

## Products

### Get all products

- **URL**: `/api/products`
- **Method**: `GET`
- **Auth required**: Yes
- **Permissions required**: None

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
[
  {
    "id": 1,
    "category": "Antibiotics",
    "manufacturer": "Sun Pharma",
    "name": "Azithromycin 500mg",
    "packing": "10 tablets",
    "mrp": 150.50,
    "case_pack": 10,
    "composition": "Azithromycin 500mg",
    "gst": 12.00,
    "discount": 10.00,
    "stock_quantity": 100,
    "expiry_date": "2024-12-31",
    "prescription_required": true,
    "supplier": "ABC Medical Suppliers"
  }
]
```

### Get a specific product

- **URL**: `/api/products/:id`
- **Method**: `GET`
- **Auth required**: Yes
- **Permissions required**: None
- **URL Parameters**: id=[integer] product ID

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "id": 1,
  "category": "Antibiotics",
  "manufacturer": "Sun Pharma",
  "name": "Azithromycin 500mg",
  "packing": "10 tablets",
  "mrp": 150.50,
  "case_pack": 10,
  "composition": "Azithromycin 500mg",
  "gst": 12.00,
  "discount": 10.00,
  "stock_quantity": 100,
  "expiry_date": "2024-12-31",
  "prescription_required": true,
  "supplier": "ABC Medical Suppliers"
}
```

**Error Response:**

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Product not found"
}
```

### Create a product

- **URL**: `/api/products`
- **Method**: `POST`
- **Auth required**: Yes
- **Permissions required**: Manager, Admin

**Request Body:**

```json
{
  "category": "Pain Relief",
  "manufacturer": "Cipla",
  "name": "Paracetamol 500mg",
  "packing": "15 tablets",
  "mrp": 35.00,
  "case_pack": 24,
  "composition": "Paracetamol 500mg",
  "gst": 5.00,
  "discount": 5.00,
  "stock_quantity": 200,
  "expiry_date": "2025-06-30",
  "prescription_required": false,
  "supplier": "XYZ Pharmaceuticals"
}
```

**Success Response:**

- **Code**: 201 Created
- **Content**:

```json
{
  "id": 2,
  "category": "Pain Relief",
  "manufacturer": "Cipla",
  "name": "Paracetamol 500mg",
  "packing": "15 tablets",
  "mrp": 35.00,
  "case_pack": 24,
  "composition": "Paracetamol 500mg",
  "gst": 5.00,
  "discount": 5.00,
  "stock_quantity": 200,
  "expiry_date": "2025-06-30",
  "prescription_required": false,
  "supplier": "XYZ Pharmaceuticals"
}
```

### Update a product

- **URL**: `/api/products/:id`
- **Method**: `PATCH`
- **Auth required**: Yes
- **Permissions required**: Manager, Admin
- **URL Parameters**: id=[integer] product ID

**Request Body:**

```json
{
  "mrp": 40.00,
  "discount": 7.50,
  "stock_quantity": 180
}
```

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "id": 2,
  "category": "Pain Relief",
  "manufacturer": "Cipla",
  "name": "Paracetamol 500mg",
  "packing": "15 tablets",
  "mrp": 40.00,
  "case_pack": 24,
  "composition": "Paracetamol 500mg",
  "gst": 5.00,
  "discount": 7.50,
  "stock_quantity": 180,
  "expiry_date": "2025-06-30",
  "prescription_required": false,
  "supplier": "XYZ Pharmaceuticals"
}
```

**Error Response:**

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Product not found"
}
```

### Delete a product

- **URL**: `/api/products/:id`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Permissions required**: Admin
- **URL Parameters**: id=[integer] product ID

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "success": true
}
```

**Error Response:**

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Product not found"
}
```

### Get low stock products

- **URL**: `/api/products/low-stock`
- **Method**: `GET`
- **Auth required**: Yes
- **Permissions required**: None
- **Query Parameters**: limit=[integer] optional, default=10

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
[
  {
    "id": 3,
    "category": "Cardiovascular",
    "manufacturer": "Dr. Reddy's",
    "name": "Atorvastatin 10mg",
    "packing": "10 tablets",
    "mrp": 85.00,
    "case_pack": 12,
    "composition": "Atorvastatin 10mg",
    "gst": 12.00,
    "discount": 8.00,
    "stock_quantity": 8,
    "expiry_date": "2025-03-15",
    "prescription_required": true,
    "supplier": "Medical Distributors Ltd"
  }
]
```

## Customers

### Get all customers

- **URL**: `/api/customers`
- **Method**: `GET`
- **Auth required**: Yes
- **Permissions required**: None

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
[
  {
    "id": 1,
    "franchise_id": 1,
    "first_name": "Rajesh",
    "last_name": "Kumar",
    "address": "789 Customer Street, New Delhi",
    "contact_number": "+91 9876543220",
    "email": "rajesh.kumar@example.com",
    "created_at": "2023-01-15T00:00:00.000Z",
    "updated_at": "2023-01-15T00:00:00.000Z"
  }
]
```

### Get a specific customer

- **URL**: `/api/customers/:id`
- **Method**: `GET`
- **Auth required**: Yes
- **Permissions required**: None
- **URL Parameters**: id=[integer] customer ID

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "id": 1,
  "franchise_id": 1,
  "first_name": "Rajesh",
  "last_name": "Kumar",
  "address": "789 Customer Street, New Delhi",
  "contact_number": "+91 9876543220",
  "email": "rajesh.kumar@example.com",
  "created_at": "2023-01-15T00:00:00.000Z",
  "updated_at": "2023-01-15T00:00:00.000Z"
}
```

**Error Response:**

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Customer not found"
}
```

### Create a customer

- **URL**: `/api/customers`
- **Method**: `POST`
- **Auth required**: Yes
- **Permissions required**: None

**Request Body:**

```json
{
  "franchise_id": 1,
  "first_name": "Priya",
  "last_name": "Sharma",
  "address": "101 Residential Colony, Bangalore",
  "contact_number": "+91 9876543221",
  "email": "priya.sharma@example.com"
}
```

**Success Response:**

- **Code**: 201 Created
- **Content**:

```json
{
  "id": 2,
  "franchise_id": 1,
  "first_name": "Priya",
  "last_name": "Sharma",
  "address": "101 Residential Colony, Bangalore",
  "contact_number": "+91 9876543221",
  "email": "priya.sharma@example.com",
  "created_at": "2023-01-16T00:00:00.000Z",
  "updated_at": "2023-01-16T00:00:00.000Z"
}
```

### Update a customer

- **URL**: `/api/customers/:id`
- **Method**: `PATCH`
- **Auth required**: Yes
- **Permissions required**: None
- **URL Parameters**: id=[integer] customer ID

**Request Body:**

```json
{
  "address": "New Address, Bangalore",
  "contact_number": "+91 9876543222"
}
```

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "id": 2,
  "franchise_id": 1,
  "first_name": "Priya",
  "last_name": "Sharma",
  "address": "New Address, Bangalore",
  "contact_number": "+91 9876543222",
  "email": "priya.sharma@example.com",
  "created_at": "2023-01-16T00:00:00.000Z",
  "updated_at": "2023-01-16T00:00:00.000Z"
}
```

**Error Response:**

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Customer not found"
}
```

### Delete a customer

- **URL**: `/api/customers/:id`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Permissions required**: Manager, Admin
- **URL Parameters**: id=[integer] customer ID

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "success": true
}
```

**Error Response:**

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Customer not found"
}
```

### Get recent customers

- **URL**: `/api/customers/recent`
- **Method**: `GET`
- **Auth required**: Yes
- **Permissions required**: None
- **Query Parameters**: limit=[integer] optional, default=5

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
[
  {
    "id": 3,
    "franchise_id": 1,
    "first_name": "Amit",
    "last_name": "Patel",
    "address": "555 New Street, Mumbai",
    "contact_number": "+91 9876543223",
    "email": "amit.patel@example.com",
    "created_at": "2023-01-17T00:00:00.000Z",
    "updated_at": "2023-01-17T00:00:00.000Z"
  },
  {
    "id": 2,
    "franchise_id": 1,
    "first_name": "Priya",
    "last_name": "Sharma",
    "address": "New Address, Bangalore",
    "contact_number": "+91 9876543222",
    "email": "priya.sharma@example.com",
    "created_at": "2023-01-16T00:00:00.000Z",
    "updated_at": "2023-01-16T00:00:00.000Z"
  }
]
```

## Orders

### Get all orders

- **URL**: `/api/orders`
- **Method**: `GET`
- **Auth required**: Yes
- **Permissions required**: None

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
[
  {
    "id": 1,
    "order_number": "ORD-20230120-001",
    "franchise_id": 1,
    "customer_id": 1,
    "status": "completed",
    "total_amount": 450.00,
    "discount_amount": 45.00,
    "tax_amount": 54.00,
    "final_amount": 459.00,
    "notes": "Regular customer order",
    "created_at": "2023-01-20T00:00:00.000Z",
    "updated_at": "2023-01-20T00:00:00.000Z"
  }
]
```

### Get a specific order

- **URL**: `/api/orders/:id`
- **Method**: `GET`
- **Auth required**: Yes
- **Permissions required**: None
- **URL Parameters**: id=[integer] order ID

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "id": 1,
  "order_number": "ORD-20230120-001",
  "franchise_id": 1,
  "customer_id": 1,
  "status": "completed",
  "total_amount": 450.00,
  "discount_amount": 45.00,
  "tax_amount": 54.00,
  "final_amount": 459.00,
  "notes": "Regular customer order",
  "created_at": "2023-01-20T00:00:00.000Z",
  "updated_at": "2023-01-20T00:00:00.000Z"
}
```

**Error Response:**

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Order not found"
}
```

### Create an order

- **URL**: `/api/orders`
- **Method**: `POST`
- **Auth required**: Yes
- **Permissions required**: None

**Request Body:**

```json
{
  "franchise_id": 1,
  "customer_id": 2,
  "status": "pending",
  "notes": "Priority delivery",
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "unit_price": 150.50,
      "discount": 10.00,
      "tax_rate": 12.00
    },
    {
      "product_id": 2,
      "quantity": 1,
      "unit_price": 35.00,
      "discount": 5.00,
      "tax_rate": 5.00
    }
  ]
}
```

**Success Response:**

- **Code**: 201 Created
- **Content**:

```json
{
  "id": 2,
  "order_number": "ORD-20230121-001",
  "franchise_id": 1,
  "customer_id": 2,
  "status": "pending",
  "total_amount": 336.00,
  "discount_amount": 33.10,
  "tax_amount": 37.26,
  "final_amount": 340.16,
  "notes": "Priority delivery",
  "created_at": "2023-01-21T00:00:00.000Z",
  "updated_at": "2023-01-21T00:00:00.000Z"
}
```

### Update an order status

- **URL**: `/api/orders/:id/status`
- **Method**: `PATCH`
- **Auth required**: Yes
- **Permissions required**: None
- **URL Parameters**: id=[integer] order ID

**Request Body:**

```json
{
  "status": "shipped"
}
```

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "id": 2,
  "order_number": "ORD-20230121-001",
  "franchise_id": 1,
  "customer_id": 2,
  "status": "shipped",
  "total_amount": 336.00,
  "discount_amount": 33.10,
  "tax_amount": 37.26,
  "final_amount": 340.16,
  "notes": "Priority delivery",
  "created_at": "2023-01-21T00:00:00.000Z",
  "updated_at": "2023-01-21T12:30:00.000Z"
}
```

**Error Response:**

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Order not found"
}
```

### Get order details with items

- **URL**: `/api/orders/:id/details`
- **Method**: `GET`
- **Auth required**: Yes
- **Permissions required**: None
- **URL Parameters**: id=[integer] order ID

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "order": {
    "id": 2,
    "order_number": "ORD-20230121-001",
    "franchise_id": 1,
    "customer_id": 2,
    "status": "shipped",
    "total_amount": 336.00,
    "discount_amount": 33.10,
    "tax_amount": 37.26,
    "final_amount": 340.16,
    "notes": "Priority delivery",
    "created_at": "2023-01-21T00:00:00.000Z",
    "updated_at": "2023-01-21T12:30:00.000Z"
  },
  "customer": {
    "id": 2,
    "first_name": "Priya",
    "last_name": "Sharma",
    "address": "New Address, Bangalore",
    "contact_number": "+91 9876543222",
    "email": "priya.sharma@example.com"
  },
  "items": [
    {
      "id": 3,
      "order_id": 2,
      "product_id": 1,
      "quantity": 2,
      "unit_price": 150.50,
      "discount": 10.00,
      "tax_rate": 12.00,
      "tax_amount": 32.51,
      "total_amount": 303.01,
      "product": {
        "id": 1,
        "name": "Azithromycin 500mg",
        "manufacturer": "Sun Pharma",
        "packing": "10 tablets"
      }
    },
    {
      "id": 4,
      "order_id": 2,
      "product_id": 2,
      "quantity": 1,
      "unit_price": 35.00,
      "discount": 5.00,
      "tax_rate": 5.00,
      "tax_amount": 1.66,
      "total_amount": 34.91,
      "product": {
        "id": 2,
        "name": "Paracetamol 500mg",
        "manufacturer": "Cipla",
        "packing": "15 tablets"
      }
    }
  ]
}
```

**Error Response:**

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Order not found"
}
```

### Get recent orders

- **URL**: `/api/orders/recent`
- **Method**: `GET`
- **Auth required**: Yes
- **Permissions required**: None
- **Query Parameters**: limit=[integer] optional, default=5

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
[
  {
    "id": 2,
    "order_number": "ORD-20230121-001",
    "franchise_id": 1,
    "customer_id": 2,
    "status": "shipped",
    "total_amount": 336.00,
    "discount_amount": 33.10,
    "tax_amount": 37.26,
    "final_amount": 340.16,
    "notes": "Priority delivery",
    "created_at": "2023-01-21T00:00:00.000Z",
    "updated_at": "2023-01-21T12:30:00.000Z",
    "customer": {
      "id": 2,
      "first_name": "Priya",
      "last_name": "Sharma"
    }
  },
  {
    "id": 1,
    "order_number": "ORD-20230120-001",
    "franchise_id": 1,
    "customer_id": 1,
    "status": "completed",
    "total_amount": 450.00,
    "discount_amount": 45.00,
    "tax_amount": 54.00,
    "final_amount": 459.00,
    "notes": "Regular customer order",
    "created_at": "2023-01-20T00:00:00.000Z",
    "updated_at": "2023-01-20T00:00:00.000Z",
    "customer": {
      "id": 1,
      "first_name": "Rajesh",
      "last_name": "Kumar"
    }
  }
]
```

## Inventory

### Get inventory by franchise

- **URL**: `/api/inventory/:franchiseId`
- **Method**: `GET`
- **Auth required**: Yes
- **Permissions required**: None
- **URL Parameters**: franchiseId=[integer] franchise ID

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
[
  {
    "id": 1,
    "franchise_id": 1,
    "product_id": 1,
    "stock_quantity": 95,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-21T00:00:00.000Z",
    "product": {
      "id": 1,
      "name": "Azithromycin 500mg",
      "manufacturer": "Sun Pharma",
      "category": "Antibiotics",
      "mrp": 150.50,
      "expiry_date": "2024-12-31"
    }
  },
  {
    "id": 2,
    "franchise_id": 1,
    "product_id": 2,
    "stock_quantity": 199,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-21T00:00:00.000Z",
    "product": {
      "id": 2,
      "name": "Paracetamol 500mg",
      "manufacturer": "Cipla",
      "category": "Pain Relief",
      "mrp": 35.00,
      "expiry_date": "2025-06-30"
    }
  }
]
```

### Update inventory

- **URL**: `/api/inventory/:franchiseId/:productId`
- **Method**: `PATCH`
- **Auth required**: Yes
- **Permissions required**: Manager, Admin
- **URL Parameters**: 
  - franchiseId=[integer] franchise ID
  - productId=[integer] product ID

**Request Body:**

```json
{
  "stock_quantity": 90
}
```

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "id": 1,
  "franchise_id": 1,
  "product_id": 1,
  "stock_quantity": 90,
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-22T00:00:00.000Z"
}
```

**Error Response:**

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Inventory record not found"
}
```

## Dashboard

### Get dashboard statistics

- **URL**: `/api/dashboard/stats`
- **Method**: `GET`
- **Auth required**: Yes
- **Permissions required**: None
- **Query Parameters**: franchiseId=[integer] optional, specific franchise ID

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "totalOrders": 25,
  "revenue": 12500.75,
  "customers": 15,
  "lowStockItems": 3,
  "recentOrders": [
    {
      "id": 2,
      "order_number": "ORD-20230121-001",
      "customer": {
        "first_name": "Priya",
        "last_name": "Sharma"
      },
      "status": "shipped",
      "final_amount": 340.16,
      "created_at": "2023-01-21T00:00:00.000Z"
    }
  ],
  "recentCustomers": [
    {
      "id": 3,
      "first_name": "Amit",
      "last_name": "Patel",
      "contact_number": "+91 9876543223",
      "created_at": "2023-01-17T00:00:00.000Z"
    }
  ],
  "lowStockProducts": [
    {
      "id": 3,
      "name": "Atorvastatin 10mg",
      "stock_quantity": 8,
      "manufacturer": "Dr. Reddy's"
    }
  ]
}
```

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request – Your request has validation errors |
| 401 | Unauthorized – You need to authenticate first |
| 403 | Forbidden – You don't have permission to access this resource |
| 404 | Not Found – The specified resource could not be found |
| 409 | Conflict – The request conflicts with current state of the server |
| 422 | Unprocessable Entity – Unable to process the contained instructions |
| 429 | Too Many Requests – You're sending too many requests too quickly |
| 500 | Internal Server Error – We had a problem with our server |

## Notes

1. All successful requests return a status code of 200 (OK) or 201 (Created).
2. All error responses include an error message in the response body.
3. Authentication is managed via session cookies.
4. All timestamp fields are in ISO 8601 format (YYYY-MM-DDTHH:MM:SS.sssZ).
5. All currency amounts are in Indian Rupees (₹).