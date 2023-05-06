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

describe("Pulse Stream Data Module Tests", () => {
  const agent = supertest.agent(app);
  CommonTestUtil.setupDB();

  // API Tests
  describe("Create Pulse Stream Data Tests", () => {
    it("API: POST /pulse-stream-data/attractions/645691012a51fd1abe171360 --> Should return Unauthorized Error when attempted without auth tokens", async () => {
      await agent
        .post("/api/v1/pulse-stream-data/attractions/645691012a51fd1abe171360")
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{"tag":"Info","description":"Some Description"}`
        )
        .attach("file", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.UNAUTHORIZED);
    });

    it("API: POST /pulse-stream-data/attractions/645691012a51fd1abe171360 --> Should return Bad Request Error when strigified JSON body is invalid", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );

      await agent
        .post("/api/v1/pulse-stream-data/attractions/645691012a51fd1abe171360")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{tag:"Info","description":"Some Description"}`
        )
        .attach("file", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.BAD_REQUEST);
    });

    it("API: POST /pulse-stream-data/attractions/645691012a51fd1abe171360 --> Should return Bad Request Error when strigified JSON body is not defined", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );

      await agent
        .post("/api/v1/pulse-stream-data/attractions/645691012a51fd1abe171360")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-type", "multipart/form-data")
        .field("strigifiedBody", "")
        .attach("file", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.BAD_REQUEST);
    });

    it("API: POST /pulse-stream-data/attractions/645691012a51fd1abe171360 --> Should return Not Found Error when attempted to add pulse stream data for an Attraction that doesnt exist", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );

      await agent
        .post("/api/v1/pulse-stream-data/attractions/6456a7940afbc164a2608bac")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{"tag":"Info","description":"Some Description"}`
        )
        .attach("file", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.NOT_FOUND);
    });

    it("API: POST /pulse-stream-data/attractions/645691012a51fd1abe171360 --> Should return status Created when successful", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );

      await agent
        .post("/api/v1/pulse-stream-data/attractions/645691012a51fd1abe171360")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{"tag":"Info","description":"Some Description"}`
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

  describe("Update Pulse Stream Data Tests", () => {
    it("API: PATCH /pulse-stream-data/6456a956522b62b558c5a603 --> Should return Unauthorized Error when attempted without auth tokens", async () => {
      await agent
        .patch("/api/v1/pulse-stream-data/6456a956522b62b558c5a603")
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{"tag":"Info","description":"Some Description"}`
        )
        .attach("file", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.UNAUTHORIZED);
    });

    it("API: PATCH /pulse-stream-data/6456a956522b62b558c5a603 --> Should return Not Found Error when the pulse stream record does not exist", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );

      await agent
        .patch("/api/v1/pulse-stream-data/6456aa5c62ac8607934bca1c")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{"tag":"Info","description":"Some Description"}`
        )
        .attach("file", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.NOT_FOUND);
    });

    it("API: PATCH /pulse-stream-data/6456a956522b62b558c5a603 --> Should return Forbidden Error when an unauthorized user attempts", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.TOUR_GUIDE,
        1
      );

      await agent
        .patch("/api/v1/pulse-stream-data/6456a956522b62b558c5a603")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{"tag":"Info","description":"Some Description"}`
        )
        .attach("file", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.FORBIDDEN);
    });

    it("API: PATCH /pulse-stream-data/6456a956522b62b558c5a603 --> Should return Bad Request Error when the json body is invalid", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );

      await agent
        .patch("/api/v1/pulse-stream-data/6456a956522b62b558c5a603")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{tag:"Info","description":"Some Description"}`
        )
        .attach("file", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.BAD_REQUEST);
    });

    it("API: PATCH /pulse-stream-data/6456a956522b62b558c5a603 --> Should return Bad Request Error when the json body is not defined", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );

      await agent
        .patch("/api/v1/pulse-stream-data/6456a956522b62b558c5a603")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-type", "multipart/form-data")
        .field("strigifiedBody", "")
        .attach("file", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.BAD_REQUEST);
    });

    it("API: PATCH /pulse-stream-data/6456a956522b62b558c5a603 --> Should return status OK on success", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );

      await agent
        .patch("/api/v1/pulse-stream-data/6456a956522b62b558c5a603")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{"tag":"Info","description":"Some Description"}`
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

  describe("Delete Pulse Stream Data Tests", () => {
    it("API: DELETE /pulse-stream-data/6456a956522b62b558c5a603 --> Should return Unauthorized Error when attempted without auth tokens", async () => {
      await agent
        .delete("/api/v1/pulse-stream-data/6456a956522b62b558c5a603")
        .expect("Content-Type", /json/)
        .expect(StatusCodes.UNAUTHORIZED);
    });

    it("API: DELETE /pulse-stream-data/6456a956522b62b558c5a603 --> Should return Not Found Error when pulse stream data doesn't exist", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );
      await agent
        .delete("/api/v1/pulse-stream-data/6456b0e014973ed0818cf807")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(StatusCodes.NOT_FOUND);
    });

    it("API: DELETE /pulse-stream-data/6456a956522b62b558c5a603 --> Should return Forbidden Error when an unauthorized user attempts", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.TOUR_GUIDE,
        1
      );

      await agent
        .delete("/api/v1/pulse-stream-data/6456a956522b62b558c5a603")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(StatusCodes.FORBIDDEN);
    });

    it("API: DELETE /pulse-stream-data/6456a956522b62b558c5a603 --> Should return status OK on success", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );
      await agent
        .delete("/api/v1/pulse-stream-data/6456a956522b62b558c5a603")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(StatusCodes.OK)
        .then((response) => {
          const body = response.body;
          expect(body).toBeTruthy();
        });
    });
  });

  describe("Get Paginated Pulse Stream Data Tests", () => {
    it("API: GET /pulse-stream-data/attractions/645691012a51fd1abe171360 --> Should return Not Found Error when attraction doesnt exist", async () => {
      await agent
        .get("/api/v1/pulse-stream-data/attractions/64500171bddd30a906652044")
        .expect("Content-Type", /json/)
        .expect(StatusCodes.NOT_FOUND);
    });

    it("API: GET /pulse-stream-data/attractions/645691012a51fd1abe171360 --> Should return status OK when successful", async () => {
      await agent
        .get("/api/v1/pulse-stream-data/attractions/645691012a51fd1abe171360")
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
