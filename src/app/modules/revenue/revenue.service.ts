import { TRevenue } from "./revenue.interface";
import { Revenue } from "./revenue.model";

const workerEarnings = async (
  workerId: string,
  filter: "weekly" | "monthly" | "yearly"
) => {
  const now = new Date();

  // Always calculate total earnings (unfiltered)
  const totalResult = await Revenue.aggregate([
    {
      $match: {
        workerId: workerId,
      },
    },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$price" },
      },
    },
  ]);
  const totalEarnings = totalResult[0]?.totalEarnings || 0;

  // WEEKLY BREAKDOWN
  if (filter === "weekly") {
    const currentDay = now.getDay(); // 0 (Sun) to 6 (Sat)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - currentDay);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const dailyData = await Revenue.aggregate([
      {
        $match: {
          workerId: workerId,
          createdAt: {
            $gte: startOfWeek,
            $lte: endOfWeek,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          earnings: { $sum: "$price" },
        },
      },
    ]);

    const earningsMap = new Map(
      dailyData.map((item) => [item._id, item.earnings])
    );

    const breakdown = [];
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      const dateStr = day.toISOString().split("T")[0];

      breakdown.push({
        label: dayNames[i],
        date: dateStr,
        earnings: earningsMap.get(dateStr) || 0,
      });
    }

    return {
      totalEarnings,
      filter,
      breakdown,
    };
  }

  if (filter === "monthly") {
    function startOfMonthUTC(year: number, month: number) {
      return new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    }

    function endOfMonthUTC(year: number, month: number) {
      // The day 0 of next month is last day of current month
      return new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
    }

    const startOfMonth = startOfMonthUTC(now.getFullYear(), now.getMonth());
    const endOfMonth = endOfMonthUTC(now.getFullYear(), now.getMonth());

    console.log("Monthly range:", startOfMonth, endOfMonth);

    const dailyData = await Revenue.aggregate([
      {
        $match: {
          workerId: workerId, // use ObjectId if your schema uses it
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          earnings: { $sum: "$price" },
        },
      },
    ]);

    console.log("Aggregated daily data:", dailyData);

    const earningsMap = new Map(
      dailyData.map((item) => [item._id, item.earnings])
    );

    const breakdown = [];
    let current = new Date(startOfMonth);
    let weekNum = 1;
    let weekEarnings = 0;

    while (current <= endOfMonth) {
      const dateStr = current.toISOString().split("T")[0];
      const dayEarning = earningsMap.get(dateStr) || 0;
      weekEarnings += dayEarning;

      const isEndOfWeek =
        current.getDay() === 6 ||
        dateStr === endOfMonth.toISOString().split("T")[0];

      if (isEndOfWeek) {
        breakdown.push({
          label: `Week ${weekNum}`,
          earnings: weekEarnings,
        });
        weekNum++;
        weekEarnings = 0;
      }

      current.setDate(current.getDate() + 1);
    }

    return {
      totalEarnings,
      filter,
      breakdown,
    };
  }

  if (filter === "yearly") {
    const startOfYear = new Date(now.getFullYear(), 0, 1); // Jan 1
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); // Dec 31

    const monthlyData = await Revenue.aggregate([
      {
        $match: {
          workerId: workerId,
          createdAt: {
            $gte: startOfYear,
            $lte: endOfYear,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          earnings: { $sum: "$price" },
        },
      },
    ]);

    const earningsMap = new Map(
      monthlyData.map((item) => [item._id, item.earnings])
    );

    const breakdown = Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date(now.getFullYear(), i, 1);
      const label = monthDate.toLocaleString("default", { month: "long" }); // "January", "February", ...
      const dateKey = `${now.getFullYear()}-${String(i + 1).padStart(2, "0")}`;

      return {
        label,
        date: dateKey,
        earnings: earningsMap.get(dateKey) || 0,
      };
    });

    return {
      totalEarnings,
      filter,
      breakdown,
    };
  }
};

const getRevenueById = async (id: string) => {
  const result = await Revenue.findOne({ _id: id });
  return result;
};

const updateRevenue = async (id: string, data: Partial<TRevenue>) => {
  await Revenue.findOneAndUpdate({ _id: id }, data, { new: true });
  return;
};

const deleteRevenue = async (id: string) => {
  await Revenue.findOneAndDelete({ _id: id });
  return;
};

export const revenueServices = {
  workerEarnings,
  getRevenueById,
  updateRevenue,
  deleteRevenue,
};
