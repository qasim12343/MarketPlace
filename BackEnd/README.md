# Commands
- python manage.py makemigrations
- python manage.py migrate
- python manage.py runserver

# Customer
## Post sample to create user:
- POST  http://127.0.0.1:8000/api/users/
- body
  { 
    "first_name": "Qasim", 
    "last_name": "Yusofi", 
    "phone": "09926067529", 
    "password": "StrongPass@123", 
    "email": "qasim@gmail.com", 
    "post_code": "1234567890", 
    "birthday": "2001-04-25", 
    "city": "Tehran" 
  }


## Get to auth fetch data
- POST http://127.0.0.1:8000/api/auth/token/
- body
  {
    "phone":"09926067529" ,"password":"StrongPass@123"
  } 

then get the access token
- GET http://127.0.0.1:8000/api/users/me/
- past access token in auth bearer token
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyNDU2ODMyLCJpYXQiOjE3NjI0NTMyMzIsImp0aSI6IjIzN2ZiNWRkMThhYTQ0ZDE5ZDk1Y2Q0ZDJiY2QyMzMzIiwidXNlcl9pZCI6IjY5MGNlMGIyMzQ1YjljMDgzYjBiMGFhMyJ9.31dqLjcBi37j6q74E3e1z_FJFYiKRvR26h1ay0IWYGw



//////////////////////////////
# Store Owner
##  Available API Endpoints

### Store Owner CRUD
- `POST /api/store-owners/` - Create store owner
- `GET /api/store-owners/` - List all store owners (admin only)
- `GET /api/store-owners/me/` - Retrieve store owner
- `PUT /api/store-owners/me/` - Update store owner
- `PATCH /api/store-owners/me/` - Partial update store owner
- `DELETE /api/store-owners/me/` - Delete store owner

### Image Management
- `POST /api/store-owners/me/upload-profile-image/` - Upload profile image
- `DELETE /api/store-owners/me/remove-profile-image/` - Remove profile image
- `GET /api/store-owners/me/profile-image-info/` - Get profile image metadata
- `GET /api/store-owners/me/profile-image/` - Download profile image

- `POST /api/store-owners/me/upload-store-logo/` - Upload store logo
- `DELETE /api/store-owners/me/remove-store-logo/` - Remove store logo
- `GET /api/store-owners/me/store-logo-info/` - Get store logo metadata
- `GET /api/store-owners/me/store-logo/` - Download store logo

### Ratings & Statistics
- `GET /api/store-owners/me/statistics/` - Get store owner statistics
- `POST /api/store-owners/me/rate-seller/` - Rate seller
- `POST /api/store-owners/me/rate-store/` - Rate store

### sample body
{
  "first_name": "علی",
  "last_name": "رضایی",
  "phone": "09926067528",
  "password": "123456",
  "store_name": "فروشگاه الکترونیک رضایی"
}

//////////////////////////////
# Product
## Available API Endpoints

### Product CRUD
- `GET /api/products/` - List products (filtered by status for non-store-owners)
- `POST /api/products/` - Create product (store owners only)
- `GET /api/products/{id}/` - Get product details
- `PUT /api/products/{id}/` - Update product (store owners/admins only)
- `PATCH /api/products/{id}/` - Partial update product (store owners/admins only)
- `DELETE /api/products/{id}/` - Delete product (store owners/admins only)

### Image Management
- `POST /api/products/{id}/add-image/` - Add image to product
- `DELETE /api/products/{id}/remove-image/{image_id}/` - Remove image by index
- `POST /api/products/{id}/set-primary-image/{image_id}/` - Set image as primary

### Ratings & Analytics
- `POST /api/products/{id}/rate/` - Rate product
- `POST /api/products/{id}/view/` - Increment view count

### Store Owner Specific
- `GET /api/products/my-products/` - Get store owner's products

## Create Product Sample:
- POST http://127.0.0.1:8000/api/products/
- body (authentication required - store owner token)
  {
    "title": "تیشرت مردانه",
    "description": "تیشرت مردانه تمام پنبه سایز متوسط",
    "sku": "TSHIRT-M-MEDIUM",
    "price": 150000,
    "compare_price": 200000,
    "stock": 100,
    "category": "men",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["مشکی", "سفید", "خاکستری"],
    "tags": ["تیشرت", "مردانه", "تمام‌ پنبه"]
  }

## Add Image to Product:
- POST http://127.0.0.1:8000/api/products/{id}/add-image/
- body (form-data with file)
  - file: [image file]

## Rate Product:
- POST http://127.0.0.1:8000/api/products/{id}/rate/
- body
  {
    "rating": 4.5
  }

## Increment View Count:
- POST http://127.0.0.1:8000/api/products/{id}/view/

##  Product Fields Explanation:

### Required Fields:
- **store_owner**: Auto-set to current authenticated store owner
- **title**: Product name (string, max 255)
- **description**: Product description (text)
- **sku**: Unique product code per store (string, max 100)
- **price**: Product price (decimal, minimum 0)
- **stock**: Available quantity (integer, minimum 0)
- **category**: Product category (men/women/kids/baby)

### Optional Fields:
- **compare_price**: Original price for discount calculation (decimal)
- **sizes**: Array of size options (JSON array)
- **colors**: Array of color options (JSON array)
- **tags**: Array of product tags (JSON array)
- **images**: Array of product images (auto-populated)

### Computed Fields:
- **is_in_stock**: Boolean (stock > 0)
- **is_low_stock**: Boolean (stock <= 10 and stock > 0)
- **discount_percentage**: Integer (calculated from compare_price)
- **images_count**: Integer (number of images)

### Permissions:
- **Create/Update/Delete**: Only store owners (for their products) and admins
- **View**: Everyone can view products (active products for non-store-owners)
- **My Products**: Only authenticated store owners

##  Data Types:

- **price/compare_price**: Decimal (10 digits, 2 decimals)
- **stock/views/sales_count**: Integer
- **sizes/colors/tags**: Array of strings
- **images**: Array of objects with binary data
- **rating**: Object with average (decimal) and count (integer)

//////////////////////////////
# Category API for Home Page
##  Available API Endpoints

### Get Stores by Category
- `GET /api/categories/{category}/stores/` - Get all stores that have products in the specified category

**Valid Categories:** men, women, kids


### Get Products by Store and Category
- `GET /api/categories/{category}/stores/{store_id}/products/` - Get products of a specific store in the specified category

**Response Format:**
```json
{
  "category": "men",
  "store": {
    "id": "store_id",
    "store_name": "Store Name",
    "store_rating": {
      "average": 4.5,
      "count": 10
    }
  },
  "products": [
    {
      "id": "product_id",
      "store_owner": {
        "id": "store_owner_id",
        "store_name": "Store Name",
        "full_name": "Owner Name"
      },
      "title": "Product Title",
      "description": "Product Description",
      "sku": "SKU123",
      "price": "150000.00",
      "compare_price": "200000.00",
      "stock": 100,
      "category": "men",
      "sizes": ["S", "M", "L"],
      "colors": ["Black", "White"],
      "tags": ["tag1", "tag2"],
      "status": "active",
      "views": 150,
      "sales_count": 25,
      "rating": {
        "average": 4.2,
        "count": 8
      },
      "created_at": "2025-01-01T10:00:00Z",
      "updated_at": "2025-01-01T10:00:00Z",
      "is_in_stock": true,
      "is_low_stock": false,
      "discount_percentage": 25,
      "images_count": 3,
      "images": [
        {
          "id": "image_id",
          "image": "http://example.com/media/products/image.jpg",
          "is_primary": true,
          "created_at": "2025-01-01T10:00:00Z"
        }
      ]
    }
  ],
  "total_products": 10
}
```


##  Filtering & Validation
- **Categories**: Only men, women, kids are valid
- **Products**: Only active products are returned
- **Stores**: Only approved stores with active products in the category are returned
- **Ordering**: Products ordered by creation date (newest first)
- **Images**: Primary images shown first in product responses

//////////////////////////////
# Cart
##  Cart API Documentation

The Cart API allows customers to manage their shopping carts with embedded cart items.

##  Available API Endpoints

### Cart CRUD
- `GET /api/carts/me/` - Get current user's cart
- `PUT /api/carts/me/` - Update cart items (replace all)
- `PATCH /api/carts/me/` - Partial update cart items
- `DELETE /api/carts/me/` - Delete cart (clear all items)

### Cart Item Management
- `POST /api/carts/me/add-item/` - Add item to cart
- `PUT /api/carts/me/update-item/{product_id}/` - Update item quantity/color/size
- `DELETE /api/carts/me/remove-item/{product_id}/` - Remove item from cart
- `POST /api/carts/me/clear/` - Clear all items from cart

### Cart Information
- `GET /api/carts/me/summary/` - Get cart summary with totals

##  API Usage Examples

### Get Cart
```bash
GET /api/carts/me/
Authorization: Bearer <customer_token>
```

### Add Item to Cart
```bash
POST /api/carts/me/add-item/
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "product_id": "693f127d61cbf72a8ad3cd97",
  "quantity": 1,
  "price_snapshot": 150000.00,
  "color": "سفید",
  "size": "L",
  "owner_store_id": "69355abeeaded8b87b904951"
}
```

### Update Item Quantity
```bash
PUT /api/carts/me/update-item/6790ce0b234b9c083b0aaf4/
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "quantity": 3,
  "color": "آبی"
}
```

### Remove Item from Cart
```bash
DELETE /api/carts/me/remove-item/{product_id}/
Authorization: Bearer <customer_token>
```


### Clear Cart
```bash
POST /api/carts/me/clear/
Authorization: Bearer <customer_token>
```

