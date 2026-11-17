import db from '../config/connection.js';
import { Recipe, User } from '../models/index.js';
import cleanDB from './cleanDB.js';

import recipeData from './formattedRecipes.json' with { type: 'json' };

const seedUserProfiles = Array.from({ length: 8 }, (_, index) => {
  const username = `recipe_cook_${index + 1}`;
  return {
    username,
    email: `${username}@recipesocial.invalid`,
  };
});

const seedDatabase = async (): Promise<void> => {
  try {
    const seedPassword = process.env.SEED_USER_PASSWORD;
    if (!seedPassword || seedPassword.length < 5) {
      throw new Error('Set SEED_USER_PASSWORD to a password with at least 5 characters before seeding.');
    }

    await db();
    const seedUsers = await Promise.all(seedUserProfiles.map(async (profile) => {
      const user = await User.findOne({ username: profile.username });
      if (user) {
        user.password = seedPassword;
        await user.save();
        return user;
      }

      return User.create({ ...profile, password: seedPassword });
    }));

    await cleanDB();
    const seededRecipes = await Recipe.insertMany(
      recipeData.map((recipe, index) => ({
        ...recipe,
        recipeAuthor: seedUsers[index % seedUsers.length]._id,
      }))
    );

    await Promise.all(seedUsers.map((user, userIndex) =>
      User.updateOne(
        { _id: user._id },
        {
          $set: {
            recipes: seededRecipes
              .filter((_, recipeIndex) => recipeIndex % seedUsers.length === userIndex)
              .map((recipe) => recipe._id),
          },
        }
      )
    ));

    console.log(`Seeded ${seedUsers.length} users and ${seededRecipes.length} recipes.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
// We deleted json files for this seed.ts and when we add those back for recipes this file needs to be updated