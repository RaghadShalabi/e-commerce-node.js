import cartModel from "../../../../DB/model/cart.model.js";
import couponModel from "../../../../DB/model/coupon.model.js";
import orderModel from "../../../../DB/model/order.model.js";
import productModel from "../../../../DB/model/product.model.js";
import userModel from "../../../../DB/model/user.model.js";

export const createOrder = async (req, res, next) => {
  const { couponName } = req.body;

  const cart = await cartModel.findOne({ userId: req.user._id });

  if (!cart) {
    return next(new Error("cart is empty", { cause: 409 }));
  }
  req.body.products = cart.products;

  if (couponName) {
    const coupon = await couponModel.findOne({ name: couponName });
    if (!coupon) {
      return next(new Error("coupon not found", { cause: 404 }));
    }
    const currentDate = new Date();

    if (coupon.expireDate <= currentDate) {
      return next(new Error("this coupon has expired", { cause: 400 }));
    }
    // if (coupon.usedBy.includes(req.user._id)) {
    //   return next(new Error('coupon already used', { cause: 409 }));
    // }
    req.body.coupon = coupon;
  }
  let subTotal = 0; //total price of the all products in the cart
  let finalProductList = [];
  for (let product of req.body.products) {
    const checkProduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity }, //if stock to the product is greater than or equal the quantity of the product in the cart
    });
    if (!checkProduct) {
      return next(new Error("product quantity not available", { cause: 409 }));
    }
    product = product.toObject();
    product.name = checkProduct.name;
    product.unitPrice = checkProduct.price;
    product.discount = checkProduct.discount;
    product.finalPrice = checkProduct.finalPrice * product.quantity; //final price to the product in the cart = final price to the product * quantity of the product in the cart
    subTotal += product.finalPrice;
    finalProductList.push(product);
  }
  const user = await userModel.findById(req.user._id);
  if (!req.body.address) {
    req.body.address = user.address;
  }
  if (!req.body.phone) {
    req.body.phone = user.phone;
  }
  const order = await orderModel.create({
    userId: req.user._id,
    products: finalProductList,
    finalPrice: subTotal - (subTotal * (req.body.coupon?.amount || 0)) / 100,
    address: req.body.address,
    phoneNumber: req.body.phone,
    couponName: req.body.couponName ?? "",
  });
  for (const product of req.body.products) {
    await productModel.updateOne(
      { _id: product.productId },
      { $inc: { stock: -product.quantity } }
    );
  }
  if (req.body.coupon) {
    await couponModel.updateOne(
      { _id: req.body.coupon._id },
      { $addToSet: { usedBy: req.user._id } }
    );
  }
  await cartModel.updateOne({ userId: req.user._id }, { products: [] });
  return res.status(201).json(order);
};

export const getOrders = async (req, res, next) => {
  const orders = await orderModel.find({ userId: req.user._id });
  return res
    .status(201)
    .json({ message: "success", total: orders.length, orders });
};

export const cancelOrder = async (req, res, next) => {
  const { orderId } = req.params;

  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) {
    return next(new Error("cart is empty", { cause: 409 }));
  }

  const order = await orderModel.findOne({
    _id: orderId,
    userId: req.user._id,
  });
  if (!order) {
    return next(new Error(`Order not found`, { cause: 404 }));
  }
  if (order.status != "pending") {
    return next(
      new Error(`Order is ${order.status}, can't cancel this order`, {
        cause: 404,
      })
    );
  }
  if (order.status == "cancelled") {
    return next(new Error(`Order is already ${order.status}`, { cause: 404 }));
  }
  // req.body.status = "cancelled";
  // req.body.updatedBy = req.user._id;

  const newOrder = await orderModel.findByIdAndUpdate(
    orderId,
    {
      $set: {
        status: "cancelled",
        updatedBy: req.user._id,
        products: cart.products,
      },
      $unset: { couponName: "" },
    },
    { new: true }
  );

  //newOrder.products = cart.products;

  await cartModel.updateOne(
    { userId: req.user._id },
    { products: order.products }
  );

  for (const product of order.products) {
    await productModel.updateOne(
      { _id: product.productId },
      { $inc: { stock: product.quantity } }
    );
  }

  if (order.couponName) {
    await couponModel.updateOne(
      { name: order.couponName },
      { $pull: { usedBy: req.user._id } }
    );
  }

  //await newOrder.save();
  return res.status(201).json({ message: "success", order: newOrder });
};

export const changeStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const order = await orderModel.findById(orderId);
  if (!order) {
    return next(new Error("Order not found", { cause: 404 }));
  }
  if (order.status == "cancelled" || order.status == "delivered") {
    return next(new Error(`can't cancel this order`, { cause: 404 }));
  }
  const cart = await cartModel.findOne({ userId: order.userId });
  if (!cart) {
    return next(new Error("cart is empty", { cause: 409 }));
  }
  let newOrder = await orderModel.findByIdAndUpdate(
    orderId,
    { status: req.body.status },
    { new: true }
  );

  if (req.body.status == "cancelled") {
    newOrder = await orderModel.findByIdAndUpdate(
      orderId,
      {
        $set: { updatedBy: req.user._id, products: cart.products },
        $unset: { couponName: "" },
      },
      { new: true }
    );

    await cartModel.updateOne(
      { userId: order.userId },
      { products: order.products }
    );

    for (const product of order.products) {
      await productModel.updateOne(
        { _id: product.productId },
        { $inc: { stock: product.quantity } }
      );
    }

    if (order.couponName) {
      await couponModel.updateOne(
        { name: order.couponName },
        { $pull: { usedBy: order.userId } }
      );
    }
  }
  return res.status(201).json({ message: "success", newOrder });
};
