export type Recipe = {
  createdAt: number;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  author: string;
  numberOfLikes: number;
  numberOfSaves: number;
  fileUrl?: string;
  id: string;
};
