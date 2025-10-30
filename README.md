# Highway Delite - Experience Booking Platform
A Next.js application for browsing and booking adventure experiences.

## Features

-  Browse adventure experiences
-  Search functionality
- 📅 Booking system
- 💾 MongoDB database integration

## Database Schema

### User Model
- **fullName** (String, required) - User's full name
- **email** (String, required, unique) - User's email address
- **promoCode** (String, optional) - Optional promotional code
- **createdAt** (Date) - Account creation timestamp

### Experience Model
- **title** (String, required) - Experience name
- **location** (String, required) - Location of experience
- **price** (Number, required) - Price in rupees
- **description** (String, required) - Experience description
- **image** (String, required) - Image URL
- **category** (String) - adventure, nature, cultural, water-sports
- **createdAt** (Date) - Creation timestamp

### Booking Model
- **userId** (ObjectId, required) - Reference to User
- **experienceId** (ObjectId, required) - Reference to Experience
- **bookingDate** (Date, required) - Date of booking
- **numberOfPeople** (Number, required) - Number of participants
- **totalPrice** (Number, required) - Total booking price
- **status** (String) - pending, confirmed, cancelled
- **createdAt** (Date) - Booking timestamp

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up MongoDB

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb://localhost:27017/highway-deloite
```

Or use MongoDB Atlas:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/highway-deloite?retryWrites=true&w=majority
```

### 3. Seed the Database

Run the seed script to populate initial experience data:

```bash
node db/seed.js
```

### 4. Run the Development Server

```bash
'npm run dev' - for frontend
'npm run server:dev'  -  for backend
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Experiences
- `GET /api/experiences` - Get all experiences
- `POST /api/experiences` - Create new experience

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Register new user
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "promoCode": "SUMMER2024" // optional
  }
  ```

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
  ```json
  {
    "userId": "user_id_here",
    "experienceId": "experience_id_here",
    "bookingDate": "2024-12-01",
    "numberOfPeople": 2,
    "totalPrice": 1998
  }
  ```

## Project Structure

```
highway-deloite/
├── app/
│   ├── api/
│   │   ├── bookings/
│   │   │   └── route.ts
│   │   ├── experiences/
│   │   │   └── route.ts
│   │   └── users/
│   │       └── route.ts
│   ├── components/
│   │   └── UserRegistration.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── db/
│   ├── index.ts      # Database models and connection
│   └── seed.js       # Database seeding script
├── public/
│   └── images/       # Experience images
├── routes/           # Express routes (legacy)
└── .env             # Environment variables
```

## Technologies Used

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **MongoDB** - Database
- **Mongoose** - ODM

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
