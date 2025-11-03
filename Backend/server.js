import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    return res.json({name: "janisar"})
})

app.use("/api", chatRoutes);

// app.listen(PORT, () => {
//     console.log(`server running on ${PORT}`);
// });

const MONGO_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    console.log("✅ Reusing existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = await mongoose.connect(MONGO_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
    });
  } 

  try {
    cached.conn = await cached.promise;
    console.log("✅ New MongoDB connection established");
    return cached.conn;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

connectToDatabase();

export default app;


// app.post("/test", async (req, res) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: [{
//                 role: "user",
//                 content: req.body.message
//             }]
//         })
//     };

//     try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await response.json();
//         //console.log(data.choices[0].message.content); //reply
//         res.send(data.choices[0].message.content);
//     } catch(err) {
//         console.log(err);
//     }
// });

