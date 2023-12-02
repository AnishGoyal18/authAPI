import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const databaseName = "user-auth-db";
        const mongoURI = `mongodb://localhost:27017/${databaseName}`;
        await mongoose.connect(mongoURI);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    }
};

export default connectDB;
