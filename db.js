const mongoose = require("mongoose");


const mongoDB = async () => {
  await mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
      console.log('MongoDB connected!');
      const foodCollection = await mongoose.connection.db.collection('food_items');
      const foodData = await foodCollection.find({}).toArray();

      const categoryCollection = await mongoose.connection.db.collection('foodCategory');
      const categoryData = await categoryCollection.find({}).toArray();

      global.foodData = foodData;
      global.foodCategory = categoryData;
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));
}


module.exports = mongoDB;