const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "minimum length must be 3"],
    required: [true, "Person name required"],
  },
  number: {
    type: String,
    minLength: [8, "minimum length must be 8"],
    required: [true, "Person phone number required"],
    validate: {
      validator: (number) => {
        return /^\d{2,3}-\d*$/.test(number);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
