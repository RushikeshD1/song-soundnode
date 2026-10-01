import express from "express";
import dotenv from "dotenv";
import songRoutes from "./route.js";
import redis from "redis";
import cors from "cors";
dotenv.config();
export const redisClient = redis.createClient({
    password: process.env.Redis_Password,
    socket: {
        host: "redis-15470.c85.us-east-1-2.ec2.cloud.redislabs.com",
        port: 15470
    }
});
redisClient.connect()
    .then(() => {
    console.log("Connected to redis");
})
    .catch(console.error);
const app = express();
app.use(cors());
app.use("/api/v1/", songRoutes);
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map