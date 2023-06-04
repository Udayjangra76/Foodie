const express = require("express");
const mongoDB = require("./db");
const dotenv = require("dotenv");
const cors = require('cors');
const app = express();
const BASE_URL = 5000;
dotenv.config();
mongoDB();
app.use(express.json())
app.use(cors());
app.use('/api', require('./routes/user.route.js'));
app.use('/api', require('./routes/display.route.js'));
app.use('/api', require('./routes/order.route.js'));

app.get('/', (req, res) => {
    res.send('Hello World');
})


app.listen(BASE_URL, () => {
    console.log(`server is running on  http://localhost:${BASE_URL}`)
})
