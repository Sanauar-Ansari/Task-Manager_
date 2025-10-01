 import mongoose from "mongoose";

 const MONGODB_URI = "mongodb+srv://sanauaransari99:LyNvwxdz2qhDazrP@cluster0.alykwsb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define the MONGODB_URI environment variable in .env.local");
}

// Global cache (prevents multiple connections in dev)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // ✅ Use mongoose.default in case Next.js wraps the import
    cached.promise = (mongoose.connect ?? mongoose.default.connect)(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;