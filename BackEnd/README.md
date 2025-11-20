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
## 📋 Available API Endpoints

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