const router = require("express").Router();
const Mongoose = require("mongoose");
const Order = require("../../models/Order");
const Product = require("../../models/Product");

const ALLOWED_STATUSES = ["pending", "shipped", "delivered", "cancelled"];

const aggregateOrderItems = (items = []) => {
  return items.reduce((acc, it) => {
    const key = String(it.productId);
    acc[key] = (acc[key] || 0) + Number(it.quantity || 0);
    return acc;
  }, {});
};

const restockProducts = async (items = []) => {
  const qtyByProduct = aggregateOrderItems(items);
  await Promise.all(
    Object.entries(qtyByProduct).map(([productId, quantity]) =>
      Product.updateOne(
        { _id: Mongoose.Types.ObjectId(productId) },
        { $inc: { quantity: quantity } }
      )
    )
  );
};

router.post("/place", async (req, res) => {
  try {
    const { userId, userName, address, items } = req.body;

    if (!userId || !Mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }
    if (!userName || typeof userName !== "string") {
      return res.status(400).json({ error: "userName is required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items must be a non-empty array" });
    }

    const hasInvalidItemInput = items.some(
      (it) =>
        !it ||
        !Mongoose.Types.ObjectId.isValid(it.productId) ||
        !Number.isFinite(Number(it.quantity)) ||
        Number(it.quantity) <= 0 ||
        !Number.isFinite(Number(it.price)) ||
        Number(it.price) < 0
    );
    if (hasInvalidItemInput) {
      return res.status(400).json({ error: "Invalid item payload" });
    }

    const normalizedItems = items.map((it) => ({
      productId: Mongoose.Types.ObjectId(it.productId),
      productName: String(it.productName),
      quantity: Number(it.quantity),
      price: Number(it.price),
    }));

    const quantityByProduct = aggregateOrderItems(normalizedItems);

    const decremented = [];
    for (const [productId, quantity] of Object.entries(quantityByProduct)) {
      const updated = await Product.findOneAndUpdate(
        { _id: Mongoose.Types.ObjectId(productId), quantity: { $gte: quantity } },
        { $inc: { quantity: -quantity } },
        { new: true }
      );

      if (!updated) {
        if (decremented.length > 0) {
          await Promise.all(
            decremented.map((d) =>
              Product.updateOne(
                { _id: Mongoose.Types.ObjectId(d.productId) },
                { $inc: { quantity: d.quantity } }
              )
            )
          );
        }
        return res
          .status(400)
          .json({ error: "Insufficient stock for one or more items" });
      }

      decremented.push({ productId, quantity });
    }

    const total = normalizedItems.reduce(
      (sum, it) => sum + it.price * it.quantity,
      0
    );

    const order = new Order({
      userId: Mongoose.Types.ObjectId(userId),
      userName,
      address: address || "",
      items: normalizedItems,
      total,
    });

    const saved = await order.save();
    return res.status(201).json(saved);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!Mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }
    const orders = await Order.find({
      userId: Mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch("/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!Mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid orderId" });
    }
    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const existing = await Order.findById(orderId);
    if (!existing) return res.status(404).json({ error: "Order not found" });

    if (existing.status === "cancelled" && status !== "cancelled") {
      return res.status(400).json({ error: "Cancelled orders cannot be reopened" });
    }

    if (existing.status !== "cancelled" && status === "cancelled") {
      await restockProducts(existing.items);
    }

    existing.status = status;
    const saved = await existing.save();
    return res.json(saved);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!Mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid orderId" });
    }

    const removed = await Order.findByIdAndRemove(orderId);
    if (!removed) return res.status(404).json({ error: "Order not found" });

    if (removed.status !== "cancelled") {
      await restockProducts(removed.items);
    }

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
