# AVFarm - Fertilizer Site

A platform connecting farmers and consumers directly for fresh produce sales.

## Features

- **User Authentication**: Login/Register system with protected routes
- **Producer Dashboard**: Add and manage your crops (only visible to you)
- **Consumer Dashboard**: Browse crops from other producers (only accessible after adding products)
- **User Isolation**: Each user can only see their own crops and others' crops in consumer view

## How It Works

1. **Registration**: Users must register with email and password
2. **Login**: Users must login to access producer and consumer pages
3. **Producer Page**: Add your crops (only you can see your crops)
4. **Consumer Page**: View crops from other users (only accessible if you have added products)

## Setup Instructions

### Backend Setup
1. Navigate to the `Backend` folder
2. Install dependencies: `npm install`
3. Start the server: `npm start` (runs on port 5172)

### Frontend Setup
1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`

## API Endpoints

- `POST /register` - User registration
- `POST /login` - User authentication
- `POST /producer` - Add new crop
- `GET /getproducer` - Get all crops
- `GET /getproducer/:userId` - Get crops for specific user
- `DELETE /producer/:id` - Delete crop

## Security Features

- Protected routes requiring authentication
- User data isolation (users can only see their own crops)
- Consumer page access only after adding products
- Session management with localStorage

## Technologies Used

- **Frontend**: React, React Router, CSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: Custom JWT-like system with localStorage
