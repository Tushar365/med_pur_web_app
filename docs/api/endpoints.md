# MedSync API Endpoints Documentation

This document provides comprehensive documentation for all API endpoints in the MedSync application, including request formats, response structures, and authentication requirements.

## Base URL

All API endpoints are relative to the base URL of your deployment:

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Most endpoints require authentication using session cookies. To authenticate:

1. Call the `/api/login` endpoint with valid credentials
2. The server will set a session cookie in the response
3. Include this cookie in subsequent requests

### Authentication Endpoints

#### Register a New User

```
POST /api/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "password": "securepassword",
  "email": "john.doe@example.com",
  "role": "staff",
  "franchiseId": 1
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john.doe@example.com",
  "role": "staff",
  "franchiseId": 1,
  "isActive": true,
  "createdAt": "2023-06-01T12:00:00Z",
  "updatedAt": "2023-06-01T12:00:00Z"
}
```

**Possible Errors:**
- `400 Bad Request`: Username already exists or invalid input
- `500 Internal Server Error`: Server error

#### Login

```
POST /api/login
```

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john.doe@example.com",
  "role": "staff",
  "franchiseId": 1,
  "isActive": true,
  "createdAt": "2023-06-01T12:00:00Z",
  "updatedAt": "2023-06-01T12:00:00Z",
  "lastLogin": "2023-06-02T10:30:00Z"
}
```

**Possible Errors:**
- `401 Unauthorized`: Invalid username or password
- `500 Internal Server Error`: Server error

#### Logout

```
POST /api/logout
```

**Request Body:** None

**Response (200 OK):**
```json
{}
```

#### Get Current User

```
GET /api/user
```

**Response (200 OK):**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john.doe@example.com",
  "role": "staff",
  "franchiseId": 1,
  "isActive": true,
  "createdAt": "2023-06-01T12:00:00Z",
  "updatedAt": "2023-06-01T12:00:00Z",
  "lastLogin": "2023-06-02T10:30:00Z"
}
```

**Possible Errors:**
- `401 Unauthorized`: User not logged in

## Franchise Management

### Get All Franchises

```
GET /api/franchises
```

**Authentication Required:** Yes

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Main Branch",
    "address": "123 Healthcare Street, Mumbai",
    "contactNumber": "+91 9876543210",
    "email": "main@medsync.com",
    "isActive": true,
    "createdAt": "2023-05-01T10:00:00Z",
    "updatedAt": "2023-05-01T10:00:00Z"
  },
  {
    "id": 2,
    "name": "North Mumbai Branch",
    "address": "456 Medical Avenue, Mumbai",
    "contactNumber": "+91 9876543211",
    "email": "north@medsync.com",
    "isActive": true,
    "createdAt": "2023-05-02T11:00:00Z",
    "updatedAt": "2023-05-02T11:00:00Z"
  }
]
```

### Get Franchise by ID

```
GET /api/franchises/:id
```

**Authentication Required:** Yes

**URL Parameters:**
- `id`: ID of the franchise to retrieve

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Main Branch",
  "address": "123 Healthcare Street, Mumbai",
  "contactNumber": "+91 9876543210",
  "email": "main@medsync.com",
  "isActive": true,
  "createdAt": "2023-05-01T10:00:00Z",
  "updatedAt": "2023-05-01T10:00:00Z"
}
```

**Possible Errors:**
- `404 Not Found`: Franchise not found

### Create Franchise

```
POST /api/franchises
```

**Authentication Required:** Yes (Admin role)

**Request Body:**
```json
{
  "name": "South Mumbai Branch",
  "address": "789 Pharmacy Road, Mumbai",
  "contactNumber": "+91 9876543212",
  "email": "south@medsync.com",
  "isActive": true
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "name": "South Mumbai Branch",
  "address": "789 Pharmacy Road, Mumbai",
  "contactNumber": "+91 9876543212",
  "email": "south@medsync.com",
  "isActive": true,
  "createdAt": "2023-06-05T14:30:00Z",
  "updatedAt": "2023-06-05T14:30:00Z"
}
```

**Possible Errors:**
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Not an admin
- `500 Internal Server Error`: Server error

### Update Franchise

```
PATCH /api/franchises/:id
```

**Authentication Required:** Yes (Admin role)

**URL Parameters:**
- `id`: ID of the franchise to update

**Request Body:**
```json
{
  "name": "South Mumbai Main Branch",
  "contactNumber": "+91 9876543213",
  "isActive": true
}
```

**Response (200 OK):**
```json
{
  "id": 3,
  "name": "South Mumbai Main Branch",
  "address": "789 Pharmacy Road, Mumbai",
  "contactNumber": "+91 9876543213",
  "email": "south@medsync.com",
  "isActive": true,
  "createdAt": "2023-06-05T14:30:00Z",
  "updatedAt": "2023-06-05T15:45:00Z"
}
```

**Possible Errors:**
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Not an admin
- `404 Not Found`: Franchise not found
- `500 Internal Server Error`: Server error

## Product Management

### Get All Products

```
GET /api/products
```

**Authentication Required:** Yes

**Query Parameters:**
- `franchiseId` (optional): Filter products by franchise

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Paracetamol 500mg",
    "description": "Pain reliever and fever reducer",
    "manufacturer": "ABC Pharmaceuticals",
    "category": "Analgesics",
    "price": 45.00,
    "gstRate": 12.00,
    "hsnCode": "30049099",
    "reorderLevel": 50,
    "franchiseId": 1,
    "createdAt": "2023-05-15T09:00:00Z",
    "updatedAt": "2023-05-15T09:00:00Z"
  },
  {
    "id": 2,
    "name": "Amoxicillin 250mg",
    "description": "Antibiotic medication",
    "manufacturer": "XYZ Pharma",
    "category": "Antibiotics",
    "price": 120.00,
    "gstRate": 5.00,
    "hsnCode": "30041010",
    "reorderLevel": 30,
    "franchiseId": 1,
    "createdAt": "2023-05-15T09:30:00Z",
    "updatedAt": "2023-05-15T09:30:00Z"
  }
]
```

### Get Product by ID

```
GET /api/products/:id
```

**Authentication Required:** Yes

**URL Parameters:**
- `id`: ID of the product to retrieve

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Paracetamol 500mg",
  "description": "Pain reliever and fever reducer",
  "manufacturer": "ABC Pharmaceuticals",
  "category": "Analgesics",
  "price": 45.00,
  "gstRate": 12.00,
  "hsnCode": "30049099",
  "reorderLevel": 50,
  "franchiseId": 1,
  "createdAt": "2023-05-15T09:00:00Z",
  "updatedAt": "2023-05-15T09:00:00Z"
}
```

**Possible Errors:**
- `404 Not Found`: Product not found

### Create Product

```
POST /api/products
```

**Authentication Required:** Yes

**Request Body:**
```json
{
  "name": "Cetrizine 10mg",
  "description": "Antihistamine for allergies",
  "manufacturer": "Pharma India Ltd",
  "category": "Antihistamines",
  "price": 35.00,
  "gstRate": 5.00,
  "hsnCode": "30049099",
  "reorderLevel": 40,
  "franchiseId": 1
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "name": "Cetrizine 10mg",
  "description": "Antihistamine for allergies",
  "manufacturer": "Pharma India Ltd",
  "category": "Antihistamines",
  "price": 35.00,
  "gstRate": 5.00,
  "hsnCode": "30049099",
  "reorderLevel": 40,
  "franchiseId": 1,
  "createdAt": "2023-06-10T11:15:00Z",
  "updatedAt": "2023-06-10T11:15:00Z"
}
```

**Possible Errors:**
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Not logged in
- `500 Internal Server Error`: Server error

### Update Product

```
PATCH /api/products/:id
```

**Authentication Required:** Yes

**URL Parameters:**
- `id`: ID of the product to update

**Request Body:**
```json
{
  "price": 38.50,
  "reorderLevel": 45
}
```

**Response (200 OK):**
```json
{
  "id": 3,
  "name": "Cetrizine 10mg",
  "description": "Antihistamine for allergies",
  "manufacturer": "Pharma India Ltd",
  "category": "Antihistamines",
  "price": 38.50,
  "gstRate": 5.00,
  "hsnCode": "30049099",
  "reorderLevel": 45,
  "franchiseId": 1,
  "createdAt": "2023-06-10T11:15:00Z",
  "updatedAt": "2023-06-10T12:30:00Z"
}
```

**Possible Errors:**
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Not logged in
- `404 Not Found`: Product not found
- `500 Internal Server Error`: Server error

### Delete Product

```
DELETE /api/products/:id
```

**Authentication Required:** Yes (Admin or Manager role)

**URL Parameters:**
- `id`: ID of the product to delete

**Response (200 OK):**
```json
{
  "success": true
}
```

**Possible Errors:**
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Product not found
- `500 Internal Server Error`: Server error

### Get Low Stock Products

```
GET /api/products/low-stock?limit=5
```

**Authentication Required:** Yes

**Query Parameters:**
- `limit` (optional): Maximum number of products to return (default: 10)
- `franchiseId` (optional): Filter by franchise

**Response (200 OK):**
```json
[
  {
    "id": 2,
    "name": "Amoxicillin 250mg",
    "description": "Antibiotic medication",
    "manufacturer": "XYZ Pharma",
    "category": "Antibiotics",
    "price": 120.00,
    "gstRate": 5.00,
    "hsnCode": "30041010",
    "reorderLevel": 30,
    "franchiseId": 1,
    "inventory": {
      "quantity": 25
    },
    "createdAt": "2023-05-15T09:30:00Z",
    "updatedAt": "2023-05-15T09:30:00Z"
  }
]
```

## Customer Management

### Get All Customers

```
GET /api/customers
```

**Authentication Required:** Yes

**Query Parameters:**
- `franchiseId` (optional): Filter customers by franchise

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "firstName": "Rajesh",
    "lastName": "Kumar",
    "email": "rajesh.kumar@example.com",
    "phone": "+91 9876123456",
    "address": "45 Residential Lane, Mumbai",
    "franchiseId": 1,
    "createdAt": "2023-05-20T10:00:00Z",
    "updatedAt": "2023-05-20T10:00:00Z"
  },
  {
    "id": 2,
    "firstName": "Priya",
    "lastName": "Sharma",
    "email": "priya.sharma@example.com",
    "phone": "+91 9876123457",
    "address": "78 Park Avenue, Mumbai",
    "franchiseId": 1,
    "createdAt": "2023-05-20T11:30:00Z",
    "updatedAt": "2023-05-20T11:30:00Z"
  }
]
```

### Get Customer by ID

```
GET /api/customers/:id
```

**Authentication Required:** Yes

**URL Parameters:**
- `id`: ID of the customer to retrieve

**Response (200 OK):**
```json
{
  "id": 1,
  "firstName": "Rajesh",
  "lastName": "Kumar",
  "email": "rajesh.kumar@example.com",
  "phone": "+91 9876123456",
  "address": "45 Residential Lane, Mumbai",
  "franchiseId": 1,
  "createdAt": "2023-05-20T10:00:00Z",
  "updatedAt": "2023-05-20T10:00:00Z"
}
```

**Possible Errors:**
- `404 Not Found`: Customer not found

### Create Customer

```
POST /api/customers
```

**Authentication Required:** Yes

**Request Body:**
```json
{
  "firstName": "Ananya",
  "lastName": "Patel",
  "email": "ananya.patel@example.com",
  "phone": "+91 9876123458",
  "address": "123 Urban Heights, Mumbai",
  "franchiseId": 1
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "firstName": "Ananya",
  "lastName": "Patel",
  "email": "ananya.patel@example.com",
  "phone": "+91 9876123458",
  "address": "123 Urban Heights, Mumbai",
  "franchiseId": 1,
  "createdAt": "2023-06-15T14:00:00Z",
  "updatedAt": "2023-06-15T14:00:00Z"
}
```

**Possible Errors:**
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Not logged in
- `500 Internal Server Error`: Server error

### Update Customer

```
PATCH /api/customers/:id
```

**Authentication Required:** Yes

**URL Parameters:**
- `id`: ID of the customer to update

**Request Body:**
```json
{
  "phone": "+91 9876123459",
  "address": "124 Urban Heights, Mumbai"
}
```

**Response (200 OK):**
```json
{
  "id": 3,
  "firstName": "Ananya",
  "lastName": "Patel",
  "email": "ananya.patel@example.com",
  "phone": "+91 9876123459",
  "address": "124 Urban Heights, Mumbai",
  "franchiseId": 1,
  "createdAt": "2023-06-15T14:00:00Z",
  "updatedAt": "2023-06-15T15:30:00Z"
}
```

**Possible Errors:**
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Not logged in
- `404 Not Found`: Customer not found
- `500 Internal Server Error`: Server error

### Delete Customer

```
DELETE /api/customers/:id
```

**Authentication Required:** Yes

**URL Parameters:**
- `id`: ID of the customer to delete

**Response (200 OK):**
```json
{
  "success": true
}
```

**Possible Errors:**
- `401 Unauthorized`: Not logged in
- `404 Not Found`: Customer not found
- `500 Internal Server Error`: Server error

### Get Recent Customers

```
GET /api/customers/recent?limit=5
```

**Authentication Required:** Yes

**Query Parameters:**
- `limit` (optional): Maximum number of customers to return (default: 5)
- `franchiseId` (optional): Filter by franchise

**Response (200 OK):**
```json
[
  {
    "id": 3,
    "firstName": "Ananya",
    "lastName": "Patel",
    "email": "ananya.patel@example.com",
    "phone": "+91 9876123459",
    "address": "124 Urban Heights, Mumbai",
    "franchiseId": 1,
    "createdAt": "2023-06-15T14:00:00Z",
    "updatedAt": "2023-06-15T15:30:00Z"
  },
  {
    "id": 2,
    "firstName": "Priya",
    "lastName": "Sharma",
    "email": "priya.sharma@example.com",
    "phone": "+91 9876123457",
    "address": "78 Park Avenue, Mumbai",
    "franchiseId": 1,
    "createdAt": "2023-05-20T11:30:00Z",
    "updatedAt": "2023-05-20T11:30:00Z"
  }
]
```

## Order Management

### Get All Orders

```
GET /api/orders
```

**Authentication Required:** Yes

**Query Parameters:**
- `franchiseId` (optional): Filter orders by franchise

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "customerId": 1,
    "userId": 1,
    "franchiseId": 1,
    "total": 240.80,
    "status": "completed",
    "orderDate": "2023-06-01T13:00:00Z",
    "createdAt": "2023-06-01T13:00:00Z",
    "updatedAt": "2023-06-01T13:30:00Z"
  },
  {
    "id": 2,
    "customerId": 2,
    "userId": 1,
    "franchiseId": 1,
    "total": 134.40,
    "status": "processing",
    "orderDate": "2023-06-10T15:00:00Z",
    "createdAt": "2023-06-10T15:00:00Z",
    "updatedAt": "2023-06-10T15:10:00Z"
  }
]
```

### Get Order by ID

```
GET /api/orders/:id
```

**Authentication Required:** Yes

**URL Parameters:**
- `id`: ID of the order to retrieve

**Response (200 OK):**
```json
{
  "id": 1,
  "customerId": 1,
  "userId": 1,
  "franchiseId": 1,
  "total": 240.80,
  "status": "completed",
  "orderDate": "2023-06-01T13:00:00Z",
  "createdAt": "2023-06-01T13:00:00Z",
  "updatedAt": "2023-06-01T13:30:00Z"
}
```

**Possible Errors:**
- `404 Not Found`: Order not found

### Create Order

```
POST /api/orders
```

**Authentication Required:** Yes

**Request Body:**
```json
{
  "customerId": 3,
  "userId": 1,
  "franchiseId": 1,
  "orderItems": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 45.00
    },
    {
      "productId": 3,
      "quantity": 1,
      "price": 38.50
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "customerId": 3,
  "userId": 1,
  "franchiseId": 1,
  "total": 143.92,
  "status": "pending",
  "orderDate": "2023-06-20T10:00:00Z",
  "createdAt": "2023-06-20T10:00:00Z",
  "updatedAt": "2023-06-20T10:00:00Z",
  "orderItems": [
    {
      "id": 5,
      "orderId": 3,
      "productId": 1,
      "quantity": 2,
      "price": 45.00,
      "total": 100.80
    },
    {
      "id": 6,
      "orderId": 3,
      "productId": 3,
      "quantity": 1,
      "price": 38.50,
      "total": 40.43
    }
  ]
}
```

**Possible Errors:**
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Not logged in
- `500 Internal Server Error`: Server error

### Update Order Status

```
PATCH /api/orders/:id/status
```

**Authentication Required:** Yes

**URL Parameters:**
- `id`: ID of the order to update

**Request Body:**
```json
{
  "status": "completed"
}
```

**Response (200 OK):**
```json
{
  "id": 3,
  "customerId": 3,
  "userId": 1,
  "franchiseId": 1,
  "total": 143.92,
  "status": "completed",
  "orderDate": "2023-06-20T10:00:00Z",
  "createdAt": "2023-06-20T10:00:00Z",
  "updatedAt": "2023-06-20T11:15:00Z"
}
```

**Possible Errors:**
- `400 Bad Request`: Invalid status
- `401 Unauthorized`: Not logged in
- `404 Not Found`: Order not found
- `500 Internal Server Error`: Server error

### Get Order Details

```
GET /api/orders/:id/details
```

**Authentication Required:** Yes

**URL Parameters:**
- `id`: ID of the order to retrieve details for

**Response (200 OK):**
```json
{
  "order": {
    "id": 3,
    "customerId": 3,
    "userId": 1,
    "franchiseId": 1,
    "total": 143.92,
    "status": "completed",
    "orderDate": "2023-06-20T10:00:00Z",
    "createdAt": "2023-06-20T10:00:00Z",
    "updatedAt": "2023-06-20T11:15:00Z"
  },
  "customer": {
    "id": 3,
    "firstName": "Ananya",
    "lastName": "Patel",
    "email": "ananya.patel@example.com",
    "phone": "+91 9876123459",
    "address": "124 Urban Heights, Mumbai"
  },
  "items": [
    {
      "id": 5,
      "productId": 1,
      "productName": "Paracetamol 500mg",
      "quantity": 2,
      "price": 45.00,
      "gstRate": 12.00,
      "gstAmount": 10.80,
      "total": 100.80
    },
    {
      "id": 6,
      "productId": 3,
      "productName": "Cetrizine 10mg",
      "quantity": 1,
      "price": 38.50,
      "gstRate": 5.00,
      "gstAmount": 1.93,
      "total": 40.43
    }
  ],
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe"
  },
  "franchise": {
    "id": 1,
    "name": "Main Branch"
  }
}
```

**Possible Errors:**
- `404 Not Found`: Order not found

### Get Recent Orders

```
GET /api/orders/recent?limit=5
```

**Authentication Required:** Yes

**Query Parameters:**
- `limit` (optional): Maximum number of orders to return (default: 5)
- `franchiseId` (optional): Filter by franchise

**Response (200 OK):**
```json
[
  {
    "id": 3,
    "customerId": 3,
    "customerName": "Ananya Patel",
    "userId": 1,
    "userName": "John Doe",
    "franchiseId": 1,
    "total": 143.92,
    "status": "completed",
    "orderDate": "2023-06-20T10:00:00Z",
    "createdAt": "2023-06-20T10:00:00Z",
    "updatedAt": "2023-06-20T11:15:00Z"
  },
  {
    "id": 2,
    "customerId": 2,
    "customerName": "Priya Sharma",
    "userId": 1,
    "userName": "John Doe",
    "franchiseId": 1,
    "total": 134.40,
    "status": "processing",
    "orderDate": "2023-06-10T15:00:00Z",
    "createdAt": "2023-06-10T15:00:00Z",
    "updatedAt": "2023-06-10T15:10:00Z"
  }
]
```

## Inventory Management

### Get Inventory by Franchise

```
GET /api/inventory?franchiseId=1
```

**Authentication Required:** Yes

**Query Parameters:**
- `franchiseId`: ID of the franchise to get inventory for

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "productId": 1,
    "franchiseId": 1,
    "quantity": 75,
    "product": {
      "id": 1,
      "name": "Paracetamol 500mg",
      "description": "Pain reliever and fever reducer",
      "manufacturer": "ABC Pharmaceuticals",
      "category": "Analgesics",
      "price": 45.00,
      "gstRate": 12.00,
      "reorderLevel": 50
    },
    "createdAt": "2023-05-15T10:00:00Z",
    "updatedAt": "2023-06-20T11:15:00Z"
  },
  {
    "id": 2,
    "productId": 2,
    "franchiseId": 1,
    "quantity": 25,
    "product": {
      "id": 2,
      "name": "Amoxicillin 250mg",
      "description": "Antibiotic medication",
      "manufacturer": "XYZ Pharma",
      "category": "Antibiotics",
      "price": 120.00,
      "gstRate": 5.00,
      "reorderLevel": 30
    },
    "createdAt": "2023-05-15T10:30:00Z",
    "updatedAt": "2023-06-10T15:10:00Z"
  }
]
```

**Possible Errors:**
- `400 Bad Request`: Missing franchiseId

### Update Inventory

```
PATCH /api/inventory
```

**Authentication Required:** Yes

**Request Body:**
```json
{
  "franchiseId": 1,
  "productId": 2,
  "quantity": 40
}
```

**Response (200 OK):**
```json
{
  "id": 2,
  "productId": 2,
  "franchiseId": 1,
  "quantity": 40,
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-06-25T09:45:00Z"
}
```

**Possible Errors:**
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Not logged in
- `404 Not Found`: Inventory not found
- `500 Internal Server Error`: Server error

## Dashboard Statistics

### Get Dashboard Statistics

```
GET /api/dashboard/stats?franchiseId=1
```

**Authentication Required:** Yes

**Query Parameters:**
- `franchiseId` (optional): Get stats for a specific franchise

**Response (200 OK):**
```json
{
  "totalOrders": 3,
  "revenue": 519.12,
  "customers": 3,
  "lowStockItems": 1,
  "recentOrders": [
    {
      "id": 3,
      "customerName": "Ananya Patel",
      "total": 143.92,
      "status": "completed",
      "orderDate": "2023-06-20T10:00:00Z"
    },
    {
      "id": 2,
      "customerName": "Priya Sharma",
      "total": 134.40,
      "status": "processing",
      "orderDate": "2023-06-10T15:00:00Z"
    }
  ],
  "recentCustomers": [
    {
      "id": 3,
      "name": "Ananya Patel",
      "phone": "+91 9876123459"
    },
    {
      "id": 2,
      "name": "Priya Sharma",
      "phone": "+91 9876123457"
    }
  ],
  "lowStockProducts": [
    {
      "id": 2,
      "name": "Amoxicillin 250mg",
      "quantity": 25,
      "reorderLevel": 30
    }
  ]
}
```

**Possible Errors:**
- `401 Unauthorized`: Not logged in
- `500 Internal Server Error`: Server error

## Error Responses

All API endpoints use standard HTTP status codes and return error messages in a consistent format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common status codes:

- `400 Bad Request`: The request was invalid or cannot be served
- `401 Unauthorized`: Authentication is required or failed
- `403 Forbidden`: The authenticated user doesn't have permission
- `404 Not Found`: The requested resource doesn't exist
- `500 Internal Server Error`: An error occurred on the server

## Pagination

For endpoints that return potentially large lists, pagination is supported using query parameters:

- `page`: Page number (starting from 1)
- `limit`: Number of items per page

Example:
```
GET /api/products?page=2&limit=20
```

The response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "totalItems": 45,
    "itemsPerPage": 20,
    "currentPage": 2,
    "totalPages": 3
  }
}
```

## GST Implementation

All products include GST information in accordance with Indian tax regulations:

- `gstRate`: The GST percentage rate applicable to the product
- `hsnCode`: The Harmonized System Nomenclature code for GST classification
- Price calculations include GST in the final amount

## Rate Limiting

API endpoints are subject to rate limiting to prevent abuse:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated requests

When the rate limit is exceeded, the API responds with:

```
429 Too Many Requests
```

And headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1623456789
```