const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  products: {
    type: Array,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
