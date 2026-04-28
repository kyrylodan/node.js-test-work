# AutoRia Clone API

Backend API for an AutoRia-style car marketplace built with `Node.js`, `Express`, `TypeScript`, `MongoDB`, JWT auth, AWS S3 file storage, and email notifications.

## Features

- Authentication: sign up, sign in, logout, logout all, refresh token
- Roles: `buyer`, `seller`, `manager`, `admin`
- Account types: `basic`, `premium`
- Car ads: create, update, view, upload photos, delete photos
- Premium statistics for your own car ads
- Brand and model directories plus request flows
- Daily currency conversion update
- AWS S3 photo upload
- Email notifications with Handlebars templates

## Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- JWT
- AWS S3
- Nodemailer
- Handlebars

## Project Structure

```text
src/
  configs/
  constants/
  controllers/
  enums/
  errors/
  interfaces/
  middlewares/
  models/
  repositories/
  routes/
  services/
  templates/
  utils/
  validator/
index.ts
```

## Environment Variables

Create a `.env` file in the project root.

```env
APP_PORT=3000
APP_HOST=localhost
MONGO_URI=mongodb://localhost:27017/mydatabase

JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRATION=1h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRATION=7d

SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_email_password
ADMIN_EMAIL=admin@gmail.com
MANAGER_EMAIL=manager@gmail.com

PREMIUM_PAYMENT_SECRET=your_payment_secret

AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name
AWS_S3_REGION=eu-central-1
AWS_S3_ACL=public-read
AWS_S3_ENDPOINT=
```

## Local Run

1. Install dependencies:

```bash
npm install
```

2. Start the server in dev mode:

```bash
npm run watch:server
```

3. The API will be available at:

```text
http://localhost:3000
```

## Docker Run

1. Build and start containers:

```bash
docker-compose up --build
```

2. API:

```text
http://localhost:3000
```

3. MongoDB:

```text
mongodb://localhost:27017/mydatabase
```

## Main Endpoints

### Auth

- `POST /api/auth/sign-up`
- `POST /api/auth/sign-in`
- `POST /api/auth/logout`
- `POST /api/auth/logout-all`
- `POST /api/auth/refresh`

### Users

- `GET /api/users/me`
- `PATCH /api/users/update-me`
- `DELETE /api/users/delete-me`
- `PATCH /api/users/ban`
- `PATCH /api/users/unban`
- `POST /api/users/create-manager`

### Account

- `POST /api/account/buy-premium`

Body example:

```json
{
  "paymentStatus": "success",
  "paymentReference": "order-123",
  "paymentSignature": "sha256_hmac_signature"
}
```

Signature source:

```text
HMAC_SHA256(userId:paymentReference:paymentStatus, PREMIUM_PAYMENT_SECRET)
```

### Cars

- `POST /api/cars`
- `GET /api/cars/:carId`
- `PATCH /api/cars/:carId`
- `GET /api/cars/:carId/statistics`
- `POST /api/cars/:carId/photos`
- `DELETE /api/cars/:carId/photos`
- `POST /api/cars/check-brand-model`
- `POST /api/cars/update-prices-daily`

### Brands and Models

- `GET /api/brands`
- `GET /api/models`
- `GET /api/models?brandId=:brandId`
- `POST /api/brand-request`
- `POST /api/model-request`

## Typical Flow

1. `POST /api/auth/sign-up`
2. `POST /api/auth/sign-in`
3. `POST /api/brand-request`
4. `GET /api/brands`
5. `POST /api/model-request`
6. `GET /api/models?brandId=:brandId`
7. `POST /api/cars`
8. `GET /api/cars/:carId/statistics`

## Photo Upload

Photo upload uses `multipart/form-data`.

Field name:

```text
photos
```

## Postman Collection

Use the file:

```text
autoria-clone.postman_collection.json
```

Import it into Postman and set:

- `baseUrl`
- `token`
- `carId`
- `brandId`
- `modelId`
- `photoUrl`
- `premiumPaymentSecret`

The `Buy Premium` request in the collection generates `paymentSignature` automatically in a pre-request script.

## Notes

- Premium statistics are available only for premium sellers and only for their own cars
- Basic sellers can create only one car
- `POST /api/cars/update-prices-daily` now requires permission and should not be called by a regular seller token
- Brand and model requests create records that can be used right away in the current project flow
- If you use Docker, the app binds to `0.0.0.0` so the mapped port is reachable from the host
