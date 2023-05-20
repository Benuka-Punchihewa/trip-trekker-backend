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
CommonService.deleteFromFirebase.mockReturnValue(Promise);
return;
describe("Guide Portfolio Module Tests", () => {
  const agent = supertest.agent(app);
  CommonTestUtil.setupDB();
  // API Tests
  describe("Create Guide Portfolio Tests", () => {
    it("API: POST /guide-portfolios --> Should return Unauthorized Error when attempted without auth tokens", async () => {
      await agent
        .post("/api/v1/guide-portfolios")
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{"description": "this is a description 4528"}`
        )
        .attach("file", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.UNAUTHORIZED);
    });

    it("API: POST /guide-portfolios --> Should return Bad Request Error when strigified JSON body is invalid", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.TOUR_GUIDE
      );

      await agent
        .post("/api/v1/guide-portfolios")
        .set("Content-type", "multipart/form-data")
        .set("Authorization", `Bearer ${token}`)
        .field("strigifiedBody", `{"description"= ""}`)
        .attach("file", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.BAD_REQUEST);
    });

    it("API: POST /guide-portfolios --> Should return Bad Request Error when strigified body is not defined", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.TOUR_GUIDE
      );

      await agent
        .post("/api/v1/guide-portfolios")
        .set("Content-type", "multipart/form-data")
        .set("Authorization", `Bearer ${token}`)
        .field("strigifiedBody", "")
        .attach("file", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })

        .expect("Content-Type", /json/)
        .expect(StatusCodes.BAD_REQUEST);
    });

    it("API: POST /guide-portfolios --> Should return status Created on success", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.TOUR_GUIDE
      );

      await agent
        .post("/api/v1/guide-portfolios")
        .set("Content-type", "multipart/form-data")
        .set("Authorization", `Bearer ${token}`)
        .field(
          "strigifiedBody",
          `{"description": "this is a description 4528"}`
        )
        .attach("file", "./src/testAttachments/img1.jpg", {
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

  describe("Update Guide Portfolio Tests", () => {
    it("API: PATCH /guide-portfolios/6457724c8d4f5c73603f8735 --> Should return Unauthorized Error when attempted without auth tokens", async () => {
      await agent
        .patch("/api/v1/guide-portfolios/6457724c8d4f5c73603f8735")
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{"description": "this is a description update"}`
        )
        .attach("file", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.UNAUTHORIZED);
    });

    it("API: PATCH /guide-portfolios/6457724c8d4f5c73603f8735 --> Should return Not Found Error when the portfolio record does not exist", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.TOUR_GUIDE
      );

      await agent
        .patch("/api/v1/guide-portfolios/6457724c8d4f5c73603f873c")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{"description": "this is a description update"}`
        )
        .attach("file", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.NOT_FOUND);
    });

    it("API: PATCH /guide-portfolios/6457724c8d4f5c73603f8735 --> Should return Bad Request Error when the json body is invalid", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.TOUR_GUIDE
      );

      await agent
        .patch("/api/v1/guide-portfolios/6457724c8d4f5c73603f8735")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-type", "multipart/form-data")
        .field("strigifiedBody", `{"descriptio"= ""}`)
        .attach("file", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.BAD_REQUEST);
    });

    it("API: PATCH /guide-portfolios/6457724c8d4f5c73603f8735 --> Should return Bad Request Error when the json body is not defined", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.TOUR_GUIDE
      );

      await agent
        .patch("/api/v1/guide-portfolios/6457724c8d4f5c73603f8735")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-type", "multipart/form-data")
        .field("strigifiedBody", "")
        .attach("file", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.BAD_REQUEST);
    });

    it("API: PATCH /guide-portfolios/6457724c8d4f5c73603f8735 --> Should return status OK on success", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.TOUR_GUIDE
      );

      await agent
        .patch("/api/v1/guide-portfolios/6457724c8d4f5c73603f8735")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{"description": "this is a description update"}`
        )
        .attach("file", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.OK)
        .then((response) => {
          const body = response.body;
          expect(body).toBeTruthy();
        });
    });
  });

  describe("Delete Guide Portfolio Tests", () => {
    it("API: DELETE /guide-portfolios/6457724c8d4f5c73603f8735 --> Should return Unauthorized Error when attempted without auth tokens", async () => {
      await agent
        .delete("/api/v1/guide-portfolios/6457724c8d4f5c73603f8735")
        .expect("Content-Type", /json/)
        .expect(StatusCodes.UNAUTHORIZED);
    });

    it("API: DELETE /guide-portfolios/6457724c8d4f5c73603f8735 --> Should return Not Found Error when duide portfolio doesn't exist", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.TOUR_GUIDE
      );
      await agent
        .delete("/api/v1/guide-portfolios/6457724c8d4f5c73603f873c")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(StatusCodes.NOT_FOUND);
    });

    it("API: DELETE /guide-portfolios/6457724c8d4f5c73603f8735 --> Should return status OK on success", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.TOUR_GUIDE
      );
      await agent
        .delete("/api/v1/guide-portfolios/6457724c8d4f5c73603f8735")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(StatusCodes.OK);
    });
  });

  describe("Get Paginated Guide Portfolio Tests", () => {
    it("API: GET /guide-portfolios/tour-guides/6455e0211fe8fa83ebbfabe2 --> Should return Not Found Error when tour guide doesnt exist", async () => {
      await agent
        .get("/api/v1/guide-portfolios/tour-guides/6455e0211fe8fa83ebbfabee")
        .expect("Content-Type", /json/)
        .expect(StatusCodes.NOT_FOUND);
    });

    it("API: GET /guide-portfolios/tour-guides/6455e0211fe8fa83ebbfabe2?page=1&limit=10&orderBy=desc --> Should return status OK when successful", async () => {
      await agent
        .get(
          "/api/v1/guide-portfolios/tour-guides/6455e0211fe8fa83ebbfabe2?page=1&limit=10&orderBy=desc"
        )
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
});
