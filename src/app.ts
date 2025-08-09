import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import router from "./app/routes";
import sendResponse from "./app/utils/sendResponse";
import bodyParser from "body-parser";
const app: Application = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "server is running now",
    data: {},
  });
});
app.use(globalErrorHandler);
app.use(notFound);
export default app;










DATABASE_URL="mongodb+srv://accessfordev2:jvFRAyLBXnVQByha@cluster0.u9w31wp.mongodb.net/ayrton95"
PORT=5000

JWT_SECRET = "test-test-test"
GEN_SALT = 10
EXPIRES_IN = 15d

EMAIL= "ruhulamin.et15@gmail.com"
APP_PASS= "fedz rsnu pevz shpp"

#for test
STRIPE_PK="pk_test_51QFZCpFQDM8OhwJHixf9ycw8YpyK6vuUNMWzfuWcIgEFTlP4fKMkBaAfrLFWQkEMqV52OfveaDDY1aAzMixFduVz00RO52Ez8L"
STRIPE_SK="sk_test_51QFZCpFQDM8OhwJHipFGXiHTAB9Q5god0O9CtKVXy11DQzPX48E2Yf9oFjwRjVCOODQ6bMRpGkyPBvsYXDYSwCkx00yJrbvjpE"
STRIPE_WEBHOOK_URL = "https://lunatix-backend.vercel.app/stripe/webhook"
# STRIPE_WEBHOOK_SECRET = "whsec_tO6vwyKF11Z0rAZoahTXaOndVuAlcoox"
# STRIPE_WEBHOOK_SECRET33 = "whsec_f941af58df29a1cb202715291f77cc61d6488d599366dcc44d117aee5fe45466"
STRIPE_WEBHOOK_SECRET = "whsec_boZ9ZJoPvIT5OdwgbvzXyYXKXmnDaFBl"

