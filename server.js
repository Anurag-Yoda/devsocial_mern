const express = require("express");
const connectDB = require('./config/db');
const app = express();
const userRoute = require('./routes/api/users');
const postRoute = require('./routes/api/posts');
const profileRoute = require('./routes/api/profile');
const authRoute = require('./routes/api/auth');



connectDB(); // mongooseDB connect

app.use(express.json({extended: false})); //body parser

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Hello World!"));

//Define routes below
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/profile', profileRoute);
app.use('/api/posts', postRoute);





app.listen(PORT, () => console.log(`Example app listening on port port!`));
