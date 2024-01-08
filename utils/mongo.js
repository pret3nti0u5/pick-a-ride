import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL;

const databaseMiddleware = async (req, res, next) => {
  try {
    if (!global.mongoose) {
      global.mongoose = await mongoose.connect(MONGO_URL, {
        bufferCommands: false,
      });
    }
  } catch (ex) {
    console.error(ex);
  }

  // You could extend the NextRequest interface
  // with the mongoose instance as well if you wish.
  // req.mongoose = global.mongoose;

  return next();
};

export default databaseMiddleware;
