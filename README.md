# real-time-webapp/real-time-webapp/README.md

# Real-Time Web Application

This project is a real-time web application that displays sensor data using WebSocket technology. It provides a user-friendly interface to monitor various sensor values and their states in real-time.

## Project Structure

```
Server-BaoChay
├── public
│   ├── css
│   │   └── styles.css        # Styles for the web application
│   ├── js
│       └── main.js           # Client-side JavaScript for WebSocket connection
│── server.js             # Entry point for the server application
│── data
│   |── sensorData.js     # Initial sensor data values and update functions
|   └── db.js             #
|
|--views                # All UI file
|
├── package.json               # npm configuration file
└── README.md                  # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd Server-BaoChay
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Start the server:**
   ```
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to view the application.

## Usage

The application displays real-time sensor data in a table format. The following information is shown:

- **Last Update Time:** The timestamp of the last data update.
- **Smoke Value:** Displays the current smoke level.
- **Fire Value:** Displays the current fire level, represented in a circle that changes color if it exceeds 400.
- **Pump State:** Indicates whether the pump is on or off, displayed as a colored circle.
- **Buzzer State:** Indicates whether the buzzer is on or off, displayed as a colored circle.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web framework for Node.js.
- **Socket.IO**: Library for real-time web applications.
- **HTML/CSS/JavaScript**: Frontend technologies for building the user interface.

## License

This project is licensed under the MIT License. See the LICENSE file for details.