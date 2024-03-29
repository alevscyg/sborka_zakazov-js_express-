const express = require("express");
const ordersRouts = require('./routes/orders.routes');
const app = express();
app.use(express.json());
app.use('/',ordersRouts);

app.listen(3001,()=> console.log(`server started on port 3001`));
