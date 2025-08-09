import { favouriteServices } from "./favourite.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createFavourite = catchAsync(async (req, res) => {
  const userId = req.user.id;
  await favouriteServices.createFavourite(userId, req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Favourite created successfully",
  });
});

const myFavourites = catchAsync(async (req, res) => {
  const result = await favouriteServices.myFavourites(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My all favourites fetched successfully",
    data: result,
  });
});

const getFavouriteById = catchAsync(async (req, res) => {
  const result = await favouriteServices.getFavouriteById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Favourite fetched successfully",
    data: result,
  });
});

const updateFavourite = catchAsync(async (req, res) => {
  await favouriteServices.updateFavourite(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Favourite updated successfully",
  });
});

const deleteFavourite = catchAsync(async (req, res) => {
  await favouriteServices.deleteFavourite(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Favourite deleted successfully",
  });
});

export const favouriteControllers = {
  createFavourite,
  myFavourites,
  getFavouriteById,
  updateFavourite,
  deleteFavourite,
};
