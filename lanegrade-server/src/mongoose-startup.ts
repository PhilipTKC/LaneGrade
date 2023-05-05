import mongoose from "mongoose";

export async function connectMongoose () {
  const databaseURL = process.env.MONGODB_URL;

  try
  {
    if (databaseURL)
    {
      await mongoose.connect(databaseURL);
    } else
    {
      throw "No database connection string found";
    }
  } catch (error)
  {
    console.error(error);
  }
}
