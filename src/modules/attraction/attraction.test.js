import app from "../../server";
import supertest, { Response } from "supertest";
import CommonTestUtil from "../../util/common.test.util.js";

describe("Attraction Module Tests", () => {
  const agent = supertest.agent(app);
  CommonTestUtil.setupDB();

  // API Tests
  describe("Validate Password Util", () => {
    it("FUNC: Validate Password --> password should have more than 8 characters", () => {});
  });
});
