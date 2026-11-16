// Week18-Activity26-Solved - we didint think we needed it
import { Schema, model, Document } from 'mongoose';

// Define an interface for the User document
interface IRecipe extends Document {
  recipeName: string;
  recipeAuthor: Schema.Types.ObjectId;
  recipeDescription: string;
  servingSize: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  imageUrl: string;
  votes: Schema.Types.ObjectId[];
}

// Define the schema for the Recipe document
const recipeSchema = new Schema<IRecipe>(
  {
    recipeName: {
      type: String,
      required: true,
      unique: false,
      trim: true,
    },
    recipeAuthor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: false,
    },
    recipeDescription: {
      type: String,
      required: true,
      unique: false,
      trim: true,
    },
    servingSize: {
      type: String,
      required: true,
      unique: false,
    },
    ingredients: [{
      type: String,
      required: true,
      unique: false,
      trim: true,
    }],
    instructions: [{
      type: String,
      required: true,
      unique: false,
    }],
    tags: [{
      type: String,
      required: false,
      unique: false,
      trim: true,
    }],
    imageUrl: {
      type: String,
      default: '',
    },
    votes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  }
);

const Recipe = model<IRecipe>('Recipe', recipeSchema);

export default Recipe;