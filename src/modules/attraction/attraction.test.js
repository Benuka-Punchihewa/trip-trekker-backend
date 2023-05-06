import app from "../../server.js";
import supertest, { Response } from "supertest";
import CommonTestUtil from "../common/common.test.util.js";
import AuthTestUtil from "../auth/auth.test.util.js";
import constants from "../../constants.js";
import CommonService from "../common/common.service.js";
import { StatusCodes } from "http-status-codes";

// mock firebase upload
jest.mock("../common/common.service.js");
CommonService.uploadToFirebase.mockReturnValue(Promise);

describe("Attraction Module Tests", () => {
  const agent = supertest.agent(app);
  CommonTestUtil.setupDB();

  // API Tests
  describe("Create Attraction Tests", () => {
    it("API: POST /attractions --> Should return Bad Request Error when strigified body is not defined", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );

      await agent
        .post("/api/v1/attractions")
        .set("Content-type", "multipart/form-data")
        .set("Authorization", `Bearer ${token}`)
        .field("strigifiedBody", "")
        .attach("files", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .attach("files", "./src/testAttachments/img2.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.BAD_REQUEST);
    });
  });
});
