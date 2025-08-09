import { TFavourite } from "./favourite.interface";
import { Favourite } from "./favourite.model";

const createFavourite = async (userId: string, serviceId: string) => {
  await Favourite.create({
    user: userId,
    service: serviceId,
  });
  return;
};

const myFavourites = async (userId: string) => {
  const results = await Favourite.find({ user: userId })
    .populate("service", "servicePhoto price")
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

const getFavouriteById = async (id: string) => {
  const result = await Favourite.findOne({ _id: id });
  return result;
};

const updateFavourite = async (id: string, data: Partial<TFavourite>) => {
  await Favourite.findOneAndUpdate({ _id: id }, data, { new: true });
  return;
};

const deleteFavourite = async (id: string) => {
  await Favourite.findOneAndDelete({ _id: id });
  return;
};

export const favouriteServices = {
  createFavourite,
  myFavourites,
  getFavouriteById,
  updateFavourite,
  deleteFavourite,
};
