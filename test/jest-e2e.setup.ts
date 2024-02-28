import mongoose from 'mongoose';
import { prepareTestData } from './utils/common';
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost/youapp');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

connectDB();
export default async () => {
  await connectDB();

  await prepareTestData();

  return console.log('setup completed');
};
