# Nomad-Hub

Nomad Hub connects hosts and travelers, offering a platform for listing free rooms as hotels. It provides affordable stays, supports local economies, and creates authentic travel experiences for everyone.

## Run Locally

Clone the project

```bash
  git https://github.com/A1-mamun/Nomad-Hub-Client.git
```

Go to the project directory

```bash
  cd Nomad-Hub-Client
```

Install dependencies

```bash
  npm install
```

Create a `.env` file in your root directory and add the following to connect with mongoDB

```bash
VITE_apiKey=                  # Firebase API key for authentication and database access
VITE_authDomain=              # Firebase authentication domain for user authentication
VITE_projectId=               # Firebase project ID to identify the project
VITE_storageBucket=           # Firebase storage bucket for storing uploaded files
VITE_messagingSenderId=       # Firebase messaging sender ID for push notifications
VITE_appId=                   # Firebase app ID to uniquely identify the app
VITE_STRIPE_PUBLISHABLE_KEY=  # Stripe public key for processing payments on the frontend
VITE_API_URL=http://localhost:5000  # Backend API URL for connecting frontend with server
VITE_IMGBB_API_KEY=           # ImgBB API key for image uploads
```

Start the server

```bash
  npm run dev
```
