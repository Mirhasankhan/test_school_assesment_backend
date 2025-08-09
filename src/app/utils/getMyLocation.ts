import redisClient from "./radis";

export const getUserLocationFromRedis = async (userId: string) => {
  const redisGeoKey = "userLocations";
  const location = await redisClient.geoPos(redisGeoKey, userId);

  const [geo] = location;
  return {
    location: geo
      ? { longitude: Number(geo.longitude), latitude: Number(geo.latitude) }
      : null,
  };
};
