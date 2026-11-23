# Employee Attendance API

A REST API built with **Node.js**, **Express.js**, **MongoDB**, and
**Mongoose** to manage faculty registration, login, and daily
attendance.

## Features

-   Faculty registration
-   Faculty login
-   Password hashing with `bcryptjs`
-   JWT-based authentication
-   Mark daily attendance
-   Prevent duplicate attendance for the same faculty on the same day
-   Get today's attendance
-   Filter attendance records by date
-   Attendance status options: `Present`, `Absent`, and `Late`

## Technology Stack

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JSON Web Token (`jsonwebtoken`)
-   `bcryptjs`
-   `dotenv`

## Project Structure

The project uses the following folder structure:

``` text
Employee-Attendance-API/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── attendanceController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── Faculty.js
│   └── Attendance.js
├── routes/
│   ├── authRoutes.js
│   └── attendanceRoutes.js
├── .env
├── server.js
└── package.json
```

> Keep your actual project structure if folder or file names differ.

## Installation

1.  Open the project folder in VS Code.
2.  Open the terminal.
3.  Install the project dependencies:

``` bash
npm install
```

If the dependencies have not been installed yet, install them with:

``` bash
npm install express mongoose jsonwebtoken bcryptjs dotenv
npm install --save-dev nodemon
```

## Environment Variables

Create a `.env` file in the project root and add your own MongoDB
connection string and JWT secret:

``` env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/employee_attendance
JWT_SECRET=replace_with_a_long_random_secret
```

Use the exact environment variable names expected by your `config/db.js`
and `server.js` files. Do not commit real secrets or passwords to
GitHub.

## Run the Project

Start the server:

``` bash
npm start
```

For development with Nodemon:

``` bash
npm run dev
```

When the server starts successfully, the root route may display:

``` text
Employee Attendance API is running!
```

The API runs locally at:

``` text
http://localhost:5000
```

This is a backend REST API. It does not provide a browser-based login
page. Use Postman to send API requests.

## API Endpoints

All examples below assume that the routes are mounted at `/api/auth` and
`/api/attendance`.

  -----------------------------------------------------------------------------------------
  Feature           Method            Endpoint                            Authentication
  ----------------- ----------------- ----------------------------------- -----------------
  Faculty           POST              `/api/auth/register`                Not required
  Registration                                                            

  Faculty Login     POST              `/api/auth/login`                   Not required

  Mark Attendance   POST              `/api/attendance/mark`              Bearer Token

  Today's           GET               `/api/attendance/today`             Bearer Token
  Attendance                                                              

  Filter Attendance GET               `/api/attendance?date=YYYY-MM-DD`   Bearer Token
  by Date                                                                 
  -----------------------------------------------------------------------------------------

## Postman Testing

Base URL:

``` text
http://localhost:5000
```

### 1. Faculty Registration

-   Method: `POST`
-   URL: `http://localhost:5000/api/auth/register`
-   Body: **raw → JSON**

``` json
{
  "name": "Mehul",
  "email": "mehul@example.com",
  "password": "your_password",
  "department": "IT"
}
```

Successful registration returns a message and the newly created faculty
ID. Register each email only once.

### 2. Faculty Login

-   Method: `POST`
-   URL: `http://localhost:5000/api/auth/login`
-   Body: **raw → JSON**

``` json
{
  "email": "mehul@example.com",
  "password": "your_password"
}
```

A successful login returns a JWT token and faculty details. Copy the
value of the `token` field.

### 3. Use the JWT Token in Postman

For protected attendance endpoints:

1.  Open the request in Postman.
2.  Select the **Authorization** tab.
3.  Set **Type** to **Bearer Token**.
4.  Paste the JWT token received from the login response into the Token
    field.

Do not include quotation marks around the token. Keep the token private.

### 4. Mark Attendance

-   Method: `POST`
-   URL: `http://localhost:5000/api/attendance/mark`
-   Authorization: **Bearer Token**
-   Body: **raw → JSON**

``` json
{
  "status": "Present"
}
```

Allowed statuses:

-   `Present`
-   `Absent`
-   `Late`

If no status is supplied, the controller defaults to `Present`. A
faculty member cannot mark attendance more than once for the same date.

### 5. Get Today's Attendance

-   Method: `GET`
-   URL: `http://localhost:5000/api/attendance/today`
-   Authorization: **Bearer Token**
-   Body: None

Returns the date, total number of attendance records, and the records
with faculty details.

### 6. Filter Attendance by Date

-   Method: `GET`
-   URL example:

``` text
http://localhost:5000/api/attendance?date=2026-11-23
```

-   Authorization: **Bearer Token**
-   Body: None

Use the date format `YYYY-MM-DD`. If the `date` query parameter is
omitted, the controller returns records for all dates.

## Attendance Model

Each attendance record contains:

  Field         Description
  ------------- ----------------------------------------
  `facultyId`   Reference to the Faculty document
  `date`        Attendance date in `YYYY-MM-DD` format
  `status`      `Present`, `Absent`, or `Late`
  `createdAt`   Automatically generated timestamp
  `updatedAt`   Automatically updated timestamp

## Faculty Model

Each faculty record contains:

  Field          Description
  -------------- -----------------------------------
  `name`         Faculty name
  `email`        Unique faculty email
  `password`     Hashed password
  `department`   Department; defaults to `IT`
  `createdAt`    Automatically generated timestamp
  `updatedAt`    Automatically updated timestamp

## Testing Checklist

-   [ ] Register a faculty account
-   [ ] Log in and receive a JWT token
-   [ ] Mark attendance with a valid token
-   [ ] Get today's attendance
-   [ ] Filter attendance using a date
-   [ ] Try marking attendance again on the same day and confirm the
    duplicate check
-   [ ] Try a protected endpoint with an invalid token and confirm that
    access is rejected

## Important Notes

-   Start MongoDB before starting the API if you are using a local
    MongoDB server.
-   Keep the terminal running while testing the API in Postman.
-   The API does not include a frontend login page.
-   Do not upload `.env` or expose JWT tokens, database credentials, or
    real passwords in a public repository.
