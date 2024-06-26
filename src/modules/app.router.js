import connectDB from "../../DB/connection.js";
import categoriesRouter from "./categories/categories.router.js";
import subcategoriesRouter from "./subcategories/subcategories.router.js";
import productsRouter from "./products/products.router.js";
import authRouter from "./auth/auth.router.js";
import couponRouter from "./coupon/coupon.router.js";
import cartRouter from "./cart/cart.router.js";
import orderRouter from "./order/order.router.js";
import userRouter from "./user/user.router.js";
import { globalErrorHandler } from "../middleware/errorHandling.js";
import cors from "cors";

const initApp = (app, express) => {
  // app.use(async (req, res, next) => {
  //   let whitelist = ['http://www.raghad.com'];
  //   if (!whitelist.includes(req.header('origin'))) {
  //     return next(new Error('Invalid', { cause: 403 }));
  //   } else {
  //     next();
  //   }
  // })
  app.use(cors());
  app.use(express.json());
  connectDB();

  app.get("/", (req, res) => {
    return res.status(200).json("Welcome...");
  });
  app.use("/userPdf", express.static("./"));
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/categories", categoriesRouter);
  app.use("/subcategories", subcategoriesRouter);
  app.use("/products", productsRouter);
  app.use("/coupon", couponRouter);
  app.use("/cart", cartRouter);
  app.use("/order", orderRouter);
  app.get("*", (req, res) => {
    return res.status(500).json({ message: "Page not found 404 x_x" });
  });
  app.use(globalErrorHandler);
};
export default initApp;
