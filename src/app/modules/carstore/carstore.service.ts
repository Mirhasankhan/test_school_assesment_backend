import { paginationHelper } from "../../utils/pagination";
import { uploadInSpace } from "../../utils/uploadInSpace";
import { TCarstore } from "./carstore.interface";
import { Carstore } from "./carstore.model";

const createCarstore = async (
  data: TCarstore,
  userId: string,
  files: { [fieldname: string]: Express.Multer.File[] }
) => {
  const processImages = async (
    files: Express.Multer.File[],
    folder: string
  ) => {
    if (!files || files.length === 0) return null;
    return Promise.all(
      files.map((file) => uploadInSpace(file, `cars/${folder}`))
    );
  };

  const [carImages] = await Promise.all([
    processImages(files?.carImages, "carImages"),
  ]);

  await Carstore.create({
    ...data,
    user: userId,
    carImages,
  });
  return;
};

const getAllCarstores = async (query: any) => {
  const { page, limit, skip } = paginationHelper(query);
  const [totalCount, results] = await Promise.all([
    Carstore.countDocuments(),
    Carstore.find().skip(skip).limit(limit),
  ]);
  const totalPages = Math.ceil(totalCount / limit);
  return {
    totalCount,
    totalPages,
    currentPage: page,
    results,
  };
};

const getCarstoreById = async (id: string) => {
  const result = await Carstore.findOne({ _id: id });
  return result;
};

const updateCarstore = async (id: string, data: Partial<TCarstore>) => {
  await Carstore.findOneAndUpdate({ _id: id }, data, { new: true });
  return;
};

const deleteCarstore = async (id: string) => {
  await Carstore.findOneAndDelete({ _id: id });
  return;
};

export const carstoreServices = {
  createCarstore,
  getAllCarstores,
  getCarstoreById,
  updateCarstore,
  deleteCarstore,
};
