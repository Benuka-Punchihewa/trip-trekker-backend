import app from "../../server.js";
import supertest from "supertest";
import CommonTestUtil from "../common/common.test.util.js";
import AuthTestUtil from "../auth/auth.test.util.js";
import constants from "../../constants.js";
import CommonService from "../common/common.service.js";
import { StatusCodes } from "http-status-codes";

// mock firebase upload
jest.mock("../common/common.service.js");
CommonService.uploadToFirebase.mockReturnValue(Promise);
return;
describe("Attraction Module Tests", () => {
  const agent = supertest.agent(app);
  CommonTestUtil.setupDB();

  // API Tests
  describe("Create Attraction Tests", () => {
    it("API: POST /attractions --> Should return Unauthorized Error when attempted without auth tokens", async () => {
      await agent
        .post("/api/v1/attractions")
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{"name":"Sigiriya","location":{"coordinates":[80.75972,7.956944]},"description":"Test Description","openHours":{"open":"2023-05-01T06:30:00.000+05:30","close":"2023-05-01T17:30:00.000+05:30"},"accessibilityOptions":["option 1, option 2"]}`
        )
        .attach("files", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .attach("files", "./src/testAttachments/img2.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.UNAUTHORIZED);
    });

    it("API: POST /attractions --> Should return Bad Request Error when strigified JSON body is invalid", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );

      await agent
        .post("/api/v1/attractions")
        .set("Content-type", "multipart/form-data")
        .set("Authorization", `Bearer ${token}`)
        .field(
          "strigifiedBody",
          `{name:"Sigiriya","location":{"coordinates":[80.75972,7.956944]},"description":"Test Description","openHours":{"open":"2023-05-01T06:30:00.000+05:30","close":"2023-05-01T17:30:00.000+05:30"},"accessibilityOptions":["option 1, option 2"]}`
        )
        .attach("files", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .attach("files", "./src/testAttachments/img2.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.BAD_REQUEST);
    });

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

    it("API: POST /attractions --> Should return status Created on success", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );

      await agent
        .post("/api/v1/attractions")
        .set("Content-type", "multipart/form-data")
        .set("Authorization", `Bearer ${token}`)
        .field(
          "strigifiedBody",
          `{"name":"Sigiriya","location":{"coordinates":[80.75972,7.956944]},"description":"Test Description","openHours":{"open":"2023-05-01T06:30:00.000+05:30","close":"2023-05-01T17:30:00.000+05:30"},"accessibilityOptions":["option 1, option 2"]}`
        )
        .attach("files", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .attach("files", "./src/testAttachments/img2.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.CREATED)
        .then((response) => {
          const body = response.body;
          expect(body).toBeTruthy();
        });
    });
  });

  describe("Get Paginated Attraction Tests", () => {
    it("API: GET /attractions?keyword=&page=1&limit=10&orderBy=desc --> Should return status OK on success", async () => {
      await agent
        .get("/api/v1/attractions?keyword=&page=1&limit=10&orderBy=desc")
        .expect("Content-Type", /json/)
        .expect(StatusCodes.OK)
        .then((response) => {
          const body = response.body;
          expect(Array.isArray(body.content)).toBe(true);
          expect(typeof body.totalElements).toBe("number");
          expect(typeof body.totalPages).toBe("number");
        });
    });
  });

  describe("Get Paginated Attraction Tests", () => {
    it("API: GET /attractions/64500171bddd30a906652044 --> Should return Not Found Error when attraction is not found", async () => {
      await agent
        .get("/api/v1/attractions/64500171bddd30a906652044")
        .expect("Content-Type", /json/)
        .expect(StatusCodes.NOT_FOUND);
    });

    it("API: GET /attractions/64500171bddd30a906652044 --> Should return status OK when when successful", async () => {
      await agent
        .get("/api/v1/attractions/645691012a51fd1abe171360")
        .expect("Content-Type", /json/)
        .expect(StatusCodes.OK)
        .then((response) => {
          const body = response.body;
          expect(body).toBeTruthy();
        });
    });
  });
});
