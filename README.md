# OfferAlertBackend

Backend for the OfferAlert application. This project is responsible for managing users, products, and checking for offers.

## Client Application

The client-side of this application is a mobile app developed with React Native. You can find the repository here: [OfferAlertMobile](https://github.com/victorrmc/OfferAlertMobile)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/OfferAlertBackend.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in the required environment variables.

## Usage

To start the server, run:

```bash
npm start
```

## API Endpoints

The following are the main routes for the application:

*   `/api/auth`: Authentication routes (login, register, etc.)
*   `/api/user-products`: User's products routes (add, remove, list)
*   `/api/discount-selectors`: Routes for managing discount selectors for different stores.
*   `/api/store-checker-test`: Routes for testing the store checker functionality.

## Technologies Used

*   Node.js
*   Express
*   MongoDB
*   Mongoose
*   Puppeteer
*   Jest
