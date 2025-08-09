import { TCategory } from "./category.interface";
import { Category } from "./category.model";

const createCategory = async (data: TCategory) => {
  await Category.create(data);
  return;
};

const getAllCategorys = async () => {
  const results = await Category.find()
    .select("_id name description")
    .sort({ createdAt: -1 });
  return results;
};

const getCategoryById = async (id: string) => {
  const result = await Category.findOne({ _id: id });
  return result;
};

const updateCategory = async (
  id: string,
  data: Partial<TCategory>
) => {
  await Category.findOneAndUpdate({ _id: id}, data, { new: true });
  return;
};

const deleteCategory = async (id: string) => {
  await Category.findOneAndDelete({ _id: id });
  return;
};

export const categoryServices = {
  createCategory,
  getAllCategorys,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
