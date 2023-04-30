const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const DATABASE_NAME = process.env.DATABASE_NAME || "";

const MONGODB_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.ry2n6wq.mongodb.net/${DATABASE_NAME}`;

export default { MONGODB_URL };
