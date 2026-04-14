# AutoRia Clone API

Backend API for an AutoRia-style car marketplace built with `Node.js`, `Express`, `TypeScript`, `MongoDB`, JWT auth, AWS S3 file storage, and email notifications.

## Features

- Authentication: sign up, sign in, logout, logout all
- Roles: `buyer`, `seller`, `manager`, `admin`
- Account types: `basic`, `premium`
- Car ads: create, update, view, upload photos, delete photos
- Premium statistics for car ads
- Brand request and model request flows
- Premium mock purchase flow
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
  "paymentStatus": "success"
}
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

### Brand and Model Requests

- `POST /api/brand-request/brand-request`
- `POST /api/model-request/model-request`

## Photo Upload

Photo upload uses `multipart/form-data`.

Field name:

```text
photos
```

## Postman Collection

Use the file:

```text
autor ia-clone.postman_collection.json
```

Import it into Postman and set:

- `baseUrl`
- `token`
- `carId`
- `photoUrl`

## Notes

- Premium statistics are available only for premium sellers
- Basic sellers can create only one car
- Premium activation is mocked through `paymentStatus=success`
- Daily currency update endpoint exists and can also be called manually
- Brand/model requests notify admin by email
