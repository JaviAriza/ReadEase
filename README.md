# ReadEase

ReadEase is an application designed to facilitate reading and managing digital content, providing an intuitive and efficient user experience. The project is divided into two main parts: frontend and backend.

---

## Table of Contents

- [Technologies](#technologies)  
- [Installation](#installation)  
- [Database Setup](#database-setup)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [License](#license)  
- [Contact](#contact)  

---

## Technologies

- **Frontend:** Node.js
- **Backend:** Node.js
- **Database:** MySQL  
  

---

## Installation

### Prerequisites

- Node.js installed ([Download Node.js](https://nodejs.org/))  
- MySQL installed ([Download MySQL](https://dev.mysql.com/downloads/))  

### Steps to Run Locally

1. Clone the repository

```bash
git clone https://github.com/JaviAriza/ReadEase.git
Install dependencies and run the frontend

bash
Copiar
cd ReadEase/ReadEase-Front
npm install
npm run dev
Install dependencies and run the backend

bash
Copiar
cd ../../ReadEase-Back
npm install
node app.js  # or your main backend file
Open your browser and go to http://localhost:3000 (or the configured port)

Database Setup
ReadEase uses MySQL to store data. Follow these steps to configure your local database:

Install MySQL
If you don’t have MySQL installed, download and install it from MySQL Downloads.

Create the database
Open your MySQL console and run:

sql
Copiar
CREATE DATABASE readease;
Configure credentials
In the backend folder, create a .env file (if not present) and add your database connection variables:

env
Copiar
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=readease
DB_PORT=3306
Run migrations or SQL scripts
If your project has SQL scripts or migration files to create tables, run them now to prepare the database schema.

Start the backend
When running, the backend will connect to your MySQL database using the provided configuration.

Usage
Briefly explain how to use the app, for example:

Register or log in.

Browse through reading contents.

Add, edit, or delete texts.

Enjoy an enhanced reading experience.

Project Structure
bash
Copiar
ReadEase/
├── ReadEase-Back/        # Backend source code  
├── ReadEase-Front/       # Frontend source code  
├── README.md             # This file  
└── .git/                 # Git configuration  
Contributing
Contributions are welcome! To contribute:

Fork the project.

Create a new branch (git checkout -b feature/your-feature).

Commit your changes (git commit -m 'Add some feature').

Push to the branch (git push origin feature/your-feature).

Open a Pull Request.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
For questions or suggestions, you can reach me at:

Email: your-email@example.com
