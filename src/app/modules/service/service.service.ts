import AppError from "../../utils/AppError";
import { getUserLocationFromRedis } from "../../utils/getMyLocation";
import { uploadInSpace } from "../../utils/uploadInSpace";
import { TService } from "./service.interface";
import { Service } from "./service.model";
import { Types } from "mongoose";

const createService = async (
  data: TService,
  userId: string,
  file: Express.Multer.File
) => {
  if (file === undefined) {
    throw new AppError(400, "Please select service image");
  }
  const servicePhoto = await uploadInSpace(file, "services/photos");
  await Service.create({ ...data, user: userId, servicePhoto });
  return;
};

const myServices = async (userId: string) => {
  const results = await Service.find({ user: userId })
    .populate("category", "_id name description")
    .populate("reviews")
    .sort({ createdAt: -1 });

  const servicesWithAvgRating = results.map((service) => {
    const reviews = (service as any).reviews || [];
    const totalRating = reviews.reduce(
      (sum: number, review: any) => sum + (review.rating || 0),
      0
    );
    const avgRating = reviews.length ? totalRating / reviews.length : 0;

    const serviceObj = service.toObject() as any;
    delete serviceObj?.reviews; // Remove reviews from result

    return {
      ...serviceObj,
      avgRating,
    };
  });

  return servicesWithAvgRating;
};

const getServiceById = async (id: string) => {
  const result = await Service.findOne({ _id: id })
    .populate("category", "_id name")
    .populate("user", "_id fullName profileImage email address avgRating")
    .populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "_id fullName profileImage",
      },
    });
  return result;
};

const updateService = async (
  id: string,
  userId: string,
  data: Partial<TService>
) => {
  await Service.findOneAndUpdate({ _id: id, userId }, data, { new: true });
  return;
};

const deleteService = async (id: string, userId: string) => {
  await Service.findOneAndDelete({ _id: id, userId });
  return;
};

const allServices = async (queries: any, userId: string) => {
  const { categoryId, distanceKm = 20, search = "" } = queries;
  const userLocation = await getUserLocationFromRedis(userId);
  if (!userLocation) {
    throw new AppError(404, "Your location not found");
  }

  const query: any = {
    address: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [
            userLocation?.location?.longitude,
            userLocation?.location?.latitude,
          ],
        },
        $maxDistance: Number(distanceKm) * 1000,
      },
    },
  };

  if (categoryId) {
    query.category = new Types.ObjectId(categoryId);
  }

  if (search) {
    query.serviceName = { $regex: search, $options: "i" }; // case-insensitive partial match
  }

  const services = await Service.find(query)
    .populate("category", "_id name description")
    .populate("user", "_id fullName profileImage");
  return services;
};

export const serviceServices = {
  createService,
  myServices,
  getServiceById,
  updateService,
  deleteService,
  allServices,
};
