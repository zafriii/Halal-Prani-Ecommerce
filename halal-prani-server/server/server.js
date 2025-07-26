require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");
const app = express();
const cookieParser = require("cookie-parser");

const authRouter = require("./router/auth-router");
const lostpasswordRoute =  require("./router/lostpasswordRouter");
const productRoutes = require('./router/productRouter');
const wishRoutes = require('./router/wishRouter');
const cartRoutes = require('./router/cartRouter');
const reviewRoutes = require('./router/reviewRouter');
const helpfulRoutes = require("./router/helpfulRouter");
const rateRoutes = require("./router/ratingRouter");
const billingaddressroutes = require("./router/billingAddressRouter");
const shippingAddressRoutes = require('./router/shippingAddressRouter');
const compareRoutes = require('./router/comparisonRouter');
const memberRoutes = require("./router/memberRouter");
const orderRoutes = require("./router/orderRouter");
const downloadRoutes = require('./router/downloadRouter');
const contactRoutes = require('./router/contactRouter');


const corsOptions = {
  origin: "http://localhost:5173", 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
};
app.use(cors(corsOptions));
app.use(cookieParser());


app.use(express.json());
app.use(express.static('dist')); 


app.use("/api/auth", authRouter);

app.use("/api", lostpasswordRoute);

app.use('/api/products', productRoutes);

app.use('/api/wishes', wishRoutes);

app.use('/api/cart', cartRoutes);

app.use('/api/reviews', reviewRoutes);

app.use("/api/helpful", helpfulRoutes);

app.use("/api/ratings", rateRoutes);

app.use("/api/billingaddress", billingaddressroutes);

app.use('/api/shippingaddress', shippingAddressRoutes);

app.use('/api/compare', compareRoutes);

app.use("/api/member", memberRoutes);

app.use("/api/orders", orderRoutes);

app.use('/api/downloads', downloadRoutes);

app.use('/api/contact', contactRoutes);



app.use(errorMiddleware);


const port = 5000;
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}).catch((error) => {
  console.error("Database connection failed:", error);
});
