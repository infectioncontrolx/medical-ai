import mongoose from 'mongoose';

export const connectTODB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to db');
  } catch (error) {
    console.log('Error while creating a database', error);
  }
};
