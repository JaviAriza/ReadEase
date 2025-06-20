# ReadEase

ReadEase is an application designed to facilitate reading and managing digital content, providing an intuitive and efficient user experience. The project is split into two parts: frontend and backend.

---

## Table of Contents

* [Technologies](#technologies)
* [Installation](#installation)
* [Database Setup](#database-setup)
* [Admin Panel](#admin-panel)
* [Project Structure](#project-structure)
* [License](#license)
* [Contact](#contact)

---

## Technologies

* **Frontend:** React, Vite, Tailwind CSS, React Router, Axios
* **Backend:** Node.js, Express, Sequelize
* **Database:** MySQL
* **Testing:** Jest, Vitest
* **Linting:** ESLint

---

## Installation

### Prerequisites

* [Node.js](https://nodejs.org/) ≥14
* [MySQL](https://dev.mysql.com/downloads/)

### Run Locally

```bash
# 1. Clone repository
git clone https://github.com/JaviAriza/ReadEase.git
cd ReadEase

# 2. Grant execute permission to scripts
chmod +x backend.sh frontend.sh

# 3. Create .env in backend
cat > ReadEase-Back/.env << EOL
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=readease
EOL

# 4. Start backend (default port: 3001)
./backend.sh &

# 5. Start frontend (port: 3000)
./frontend.sh
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Setup

1. Ensure MySQL is running.
2. Create the database:

   ```sql
   CREATE DATABASE readease;
   ```
3. The backend script (`backend.sh`) will run migrations automatically on start.

---


## Admin Panel

After starting the backend, you’ll see console output indicating the AdminJS URL. By default:

```
✔️ Database connected
🚀 Server at http://localhost:3000/
🛠 AdminJS at http://localhost:3000/admin
```

Open [http://localhost:3000/admin](http://localhost:3000/admin) in your browser and log in with your admin credentials (e.g., `admin@readease.com`).

---

## Project Structure

```
ReadEase/
├── ReadEase-Back/      # Backend source code & scripts
├── ReadEase-Front/     # Frontend source code & scripts
├── README.md           # Project overview (this file)
└── .git/               # Git settings
```

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Contact

For questions or suggestions, reach out at:

* Email: [javier.ariza.rosales@gmail.com](mailto:javier.ariza.rosales@gmail.com)
