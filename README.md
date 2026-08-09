InsightFlow AI

AI-powered business data analysis platform that turns CSV datasetsinto actionable insights.

🚀 Live Demo

Frontend: https://insightflow-ai-tau.vercel.app

Backend API: https://insightflow-ai-backend-fb3o.onrender.com

📌 Overview

InsightFlow AI is a full-stack web application designed to help usersupload CSV datasets, explore their data, and generate AI-poweredbusiness insights.

Users can upload a dataset, review key statistics and visualizations,and generate AI-assisted observations and business recommendations.

✨ Features

🔐 User authentication and protected routes

📁 CSV dataset upload

📊 Dataset overview and statistics

📈 Sales data visualization

🗂️ View uploaded datasets

🤖 AI-powered dataset analysis

💡 AI-generated business recommendations

📝 AI-generated reports

💾 Report persistence and cached results

🌐 Production deployment

📱 Responsive web interface

🛠️ Tech Stack

Frontend

React

Vite

JavaScript

Axios

React Router

React Dropzone

Backend

Node.js

Express.js

Mongoose

REST API

JWT-based authentication

File upload handling

Database

MongoDB Atlas

AI

Google Gemini API

Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

🏗️ Project Structure

InsightFlow-AI/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md

🔄 How It Works

User
  │
  ▼
React + Vite Frontend
  │
  │ REST API
  ▼
Express + Node.js Backend
  │
  ├──────────────► MongoDB Atlas
  │
  └──────────────► Google Gemini API
  │
  ▼
AI-generated insights & reports

Typical workflow

Create an account or log in.

Open the Upload page.

Upload a CSV dataset.

Review dataset statistics and visualizations.

Open AI Analysis.

Generate AI-powered insights.

Review business recommendations.

Access saved reports and uploaded datasets.

💻 Run Locally

1. Clone the repository

git clone https://github.com/AdhirajSinghKhubbar/InsightFlow-AI.git
cd InsightFlow-AI

2. Start the backend

cd backend
npm install
node server.js

3. Start the frontend

Open another terminal:

cd frontend
npm install
npm run dev

Vite will display the local development URL in the terminal.

🔐 Environment Variables

Do not commit real secrets to GitHub.

The backend requires environment variables for services such as MongoDB,authentication, and Gemini.

Example:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=5001

Use the exact variable names configured by your backend.

For production, store secrets in Render/Vercel environment-variablesettings rather than committing .env files.

🌐 Production Architecture

Component              Platform

React/Vite Frontend    VercelNode/Express Backend   RenderDatabase               MongoDB AtlasAI Service             Google Gemini

The production frontend communicates with the deployed Render backendAPI rather than the local development server.

🔗 Links

Live Application: https://insightflow-ai-tau.vercel.app

GitHub Repository:https://github.com/AdhirajSinghKhubbar/InsightFlow-AI

Backend API: https://insightflow-ai-backend-fb3o.onrender.com

🧪 Development Notes

For local development, make sure the backend is running before testingfeatures that require API access, such as authentication, datasetupload, dataset retrieval, and AI analysis.

The production frontend should use the deployed Render backend URLrather than localhost.

🔒 Security

Never commit .env files containing secrets.

Never expose the Gemini API key in frontend code.

Keep authentication secrets on the backend.

Use production environment variables for deployed services.

Do not expose database credentials publicly.

📈 Future Improvements

Advanced data cleaning and validation

More chart types and customizable dashboards

Automated anomaly detection

PDF report export

Excel file support

Advanced filtering and sorting

Dashboard sharing

Custom report templates

Role-based access control

Improved AI prompt and model management

👨‍💻 Author

Adhiraj Singh Khubbar

Software Product Engineering Student

GitHub: https://github.com/AdhirajSinghKhubbar

LinkedIn: https://www.linkedin.com/in/adhiraj-khubbar-a177b328b/

⭐ Project

If you find InsightFlow AI useful, consider giving the repository a staron GitHub.
