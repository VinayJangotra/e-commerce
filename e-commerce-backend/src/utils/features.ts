import mongoose from "mongoose";
import { InvalidateCacheProps, orderItemType } from "../types/types";
import NodeCache from "node-cache";
import { Product } from "../models/product";
import { Order } from "../models/order";
const myCache = new NodeCache();
export const connectDB = (uri: string) => {
  mongoose
    .connect(uri, {
      dbName: "E-commerce_24",
    })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("Error connecting to database", error);
    });
};
// This function is used to delete the cache in the memory
export const invalidatesCache = async ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "categories",
      "all-products",
 
    ];
    if(typeof productId ==="string")productKeys.push(`product-${productId}`);

    if(typeof productId==="object")productId.forEach((i)=>productKeys.push(`product-${i}`))
    // const products = await Product.find({}).select("_id");
    // products.forEach((key) => {
    //   productKeys.push(`product-${key._id}`);
    // });
    myCache.del(productKeys);
  }
  if (order) {
    const orderKeys: string[] = [
      "all-orders",
      `my-order-${userId}`,
      `order-${orderId}`,
    ];
    // const orders = await Order.find({}).select("_id");
    // orders.forEach((key) => {
    //   orderKeys.push(`order-${key._id}`);
    // });
    myCache.del(orderKeys)
  }
  if (admin) {
    myCache.del("latest-admins");
  }
};

export const reduceStock = async (orderItems: orderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product Not Found");
    product.stock = product.stock - order.quantity;
    await product.save();
  }
};
export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;
  const percent = (thisMonth / lastMonth) * 100;
  return Number(percent.toFixed(0));
};

export const getInventories = async ({
  categories,
  productsCount,
}: {
  categories: string[];
  productsCount: number;
}) => {
  const categoriesCountPromise = categories.map((category) =>
    Product.countDocuments({ category })
  );

  const categoriesCount = await Promise.all(categoriesCountPromise);

  const categoryCount: Record<string, number>[] = [];

  categories.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / productsCount) * 100),
    });
  });

  return categoryCount;
};

interface MyDocument extends Document {
  createdAt: Date;
  discount?: number;
  total?: number;
}
type FuncProps = {
  length: number;
  docArr: MyDocument[];
  today: Date;
  property?: "discount" | "total";
};

export const getChartData = ({
  length,
  docArr,
  today,
  property,
}: FuncProps) => {
  const data: number[] = new Array(length).fill(0);

  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < length) {
      if (property) {
        data[length - monthDiff - 1] += i[property]!;
      } else {
        data[length - monthDiff - 1] += 1;
      }
    }
  });

  return data;
};