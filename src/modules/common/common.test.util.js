import mongoose from "mongoose";
import path from "path";
import util from "util";
import fs from "fs";
import dbConfig from "../../config/db.config";
import CommonUtil from "./common.util";

const removeAllCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany({});
  }
};

const dropAllCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
    } catch (error) {
      // Sometimes this error happens, but you can safely ignore it
      if (error.message === "ns not found") return;
      // This error occurs when you use it.todo. You can
      // safely ignore this error too
      if (error.message.includes("A background operation is currently running"))
        return;
      console.log(error.message);
    }
  }
};

const seedDatabase = async () => {
  const readDir = util.promisify(fs.readdir).bind(fs);
  const fPath = path.join(__dirname, "..", "..", "testData");
  console.log(__dirname);
  const dir = await readDir(fPath);
  const seedFiles = dir.filter((f) => f.endsWith(".seed.js"));

  for (const file of seedFiles) {
    const modelName = file.split(".seed.js")[0];
    const model = mongoose.models[modelName];

    if (!model) throw new Error(`Cannot Find Model '${modelName}'`);
    const fileContents = require(path.join(fPath, file));

    await model.create(fileContents);
  }
};

const setupDB = async () => {
  beforeAll(async () => {
    await CommonUtil.connectDB(dbConfig.getDBConfig().MONGODB_URL);
  }, 30000);

  afterAll(async () => {
    await dropAllCollections();
    await mongoose.disconnect();
  }, 30000);

  beforeEach(async () => {
    await seedDatabase();
  }, 30000);

  afterEach(async () => {
    await removeAllCollections();
  }, 30000);
};

export default {
  setupDB,
};
