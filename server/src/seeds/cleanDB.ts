import { Recipe, User } from '../models/index.js';
import process from 'process';

const cleanDB = async (): Promise<void> => {
  try {
    await Recipe.deleteMany({});
    console.log('Recipe collection cleaned.');
    await User.updateMany({}, { $set: { recipes: [] } });
    console.log('User recipe lists cleaned.');

  } catch (err) {
    console.error('Error cleaning collections:', err);
    process.exit(1);
  }
};

export default cleanDB;
// UPDATE