const express = require("express");
import connectDB from "./db";
import { userStrategyJWT } from "./middlewares/user-auth.middleware";
import userRouter from "./routes/user.route";

const app = express();
app.use(express.json());
userStrategyJWT();
connectDB();

// routes
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
