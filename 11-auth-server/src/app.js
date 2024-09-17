const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors")
// const authRoutes = require('./routes/authRoutes');
// const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors())


app.get("/", (req, res) => {
    res.send("Hello from the express server")
})

app.use("/api/auth", require("./routes/auth.routes"))

// app.use('/api/auth', authRoutes);

// app.get('/api/protected', authMiddleware, (req, res) => {
//   res.json({ message: 'This is a protected route', user: req.user });
// });

module.exports = app;