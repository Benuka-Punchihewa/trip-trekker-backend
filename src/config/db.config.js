const getDBConfig = () => {
  const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
  const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
  const DATABASE_NAME = process.env.MONGO_DATABASE_NAME || "";

  let dbName;
  if (process.env.ENVIRONMENT === "TEST")
    dbName = process.env.MONGO_TEST_DATABASE_NAME || "";
  else dbName = process.env.MONGO_DATABASE_NAME || "";

  return {
    MONGODB_URL: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.obv9syr.mongodb.net/${dbName}?&retryWrites=true&w=majority`,
  };
};

export default { getDBConfig };
