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

describe("Hotel Module Tests", () => {
  const agent = supertest.agent(app);
  CommonTestUtil.setupDB();

  // API Tests
  describe("Create Hotel Tests", () => {
    //01
    it("API: POST /hotels --> Should return Unauthorized Error when attempted without auth tokens", async () => {
      await agent
        .post("/api/v1/hotels")
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{"name":"Maya Hotel","registrationNumber":"MA-10KA","address":"No 2 Main St,New Town,Kandy","contactNumber":"057 6525412","email":"MayaView@gmail.com","openHours":{"open":"2023-07-06T09:00:00Z","close":"2023-07-06T18:00:00Z"},"hotelFacilities":["Pool","Spa","Gym"],"location":{"type":"Point","coordinates":[80.636696, 7.291418]}}`
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

    //02
    it("API: POST /hotels --> Should return Bad Request Error when strigified JSON body is invalid", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );

      await agent
        .post("/api/v1/hotels")
        .set("Content-type", "multipart/form-data")
        .set("Authorization", `Bearer ${token}`)
        .field(
          "strigifiedBody",
          `{"name":"Maya Hotel","registrationNumber":"MA-10KA","address":"No 2 Main St,New Town,Kandy","contactNumber":"057 6525412","email":"MayaView@gmail.com","openHours":{"close":"2023-07-06T18:00:00Z"},"hotelFacilities":["Pool","Spa","Gym"],"location":{"type":"Point","coordinates":[80.636696, 7.291418]}}`
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

    //03
    it("API: POST /hotels --> Should return Bad Request Error when strigified body is not defined", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );

      await agent
        .post("/api/v1/hotels")
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

    //04
    it("API: POST /hotels --> Should return status Created on success", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );

      await agent
        .post("/api/v1/hotels")
        .set("Content-type", "multipart/form-data")
        .set("Authorization", `Bearer ${token}`)
        .field(
          "strigifiedBody",
          `{"name":"Maya Hotel","registrationNumber":"MA-10KA","address":"No 2 Main St,New Town,Kandy","contactNumber":"057 6525412","email":"MayaView@gmail.com","openHours":{"open":"2023-07-06T09:00:00Z","close":"2023-07-06T18:00:00Z"},"hotelFacilities":["Pool","Spa","Gym"],"location":{"type":"Point","coordinates":[80.636696, 7.291418]}}`
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


  describe("Get Paginated Hotel Tests", () => {
      //05
    it("API: GET /hotels?keyword=&page=1&limit=10&orderBy=desc --> Should return status OK on success", async () => {
      await agent
        .get("/api/v1/hotels?keyword=&page=1&limit=10&orderBy=desc")
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

  
  describe("Get Specific Hotel Tests", () => {
    //06
    it("API: GET /hotels/6457434fa2be2a4221afda43 --> Should return Not Found Error when hotel is not found", async () => {
      await agent
        .get("/api/v1/hotels/6457434fa2be2a4221afda43")
        .expect("Content-Type", /json/)
        .expect(StatusCodes.NOT_FOUND);
    });

    //07
    it("API: GET /hotels/6457434fa2be2a4221afda42 --> Should return status OK when successful", async () => {
      await agent
        .get("/api/v1/hotels/6457434fa2be2a4221afda42")
        .expect("Content-Type", /json/)
        .expect(StatusCodes.OK)
        .then((response) => {
          const body = response.body;
          expect(body).toBeTruthy();
        });
    });
  });

  describe("Update Hotel Tests", () => {
    //08
    it("API: PATCH /hotels/64574287c15c1cc298aaaa33 --> Should return Unauthorized Error when attempted without auth tokens", async () => {
      await agent
        .patch("/api/v1/hotels/64574287c15c1cc298aaaa33")
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{"name":"Updated Maya Hotel","registrationNumber":"MA-10KA","address":"No 2 Main St,New Town,Kandy","contactNumber":"057 6525412","email":"MayaView@gmail.com","openHours":{"open":"2023-07-06T09:00:00Z","close":"2023-07-06T18:00:00Z"},"hotelFacilities":["Pool","Spa","Gym"],"location":{"type":"Point","coordinates":[80.636696, 7.291418]}}`
        )
        .attach("files", "./src/testAttachments/img2.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.UNAUTHORIZED);
    });

    //09
    it("API: PATCH /hotels/64574287c15c1cc298aaaa31 --> Should return Not Found Error when the pulse stream record does not exist", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );

      await agent
        .patch("/api/v1/hotels/64574287c15c1cc298aaaa31")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{"name":"Updated Maya Hotel","registrationNumber":"MA-10KA","address":"No 2 Main St,New Town,Kandy","contactNumber":"057 6525412","email":"MayaView@gmail.com","openHours":{"open":"2023-07-06T09:00:00Z","close":"2023-07-06T18:00:00Z"},"hotelFacilities":["Pool","Spa","Gym"],"location":{"type":"Point","coordinates":[80.636696, 7.291418]}}`
        )
        .attach("files", "./src/testAttachments/img2.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.NOT_FOUND);
    });

    // 10
    it("API: PATCH /hotels/64574287c15c1cc298aaaa33 --> Should return Bad Request Error when the json body is invalid", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );

      await agent
        .patch("/api/v1/hotels/6457434fa2be2a4221afda42")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{"name":"Updated Maya Hotel","registrationNumber":"MA-10KA","address":"No 2 Main St,New Town,Kandy","contactNumber":"057 6525412","email":"MayaView@gmail.com","openHours":{"close":"2023-07-06T18:00:00Z"},"hotelFacilities":["Pool","Spa","Gym"],"location":{"type":"Point","coordinates":[80.636696, 7.291418]}}`
        )
        .attach("files", "./src/testAttachments/img2.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.BAD_REQUEST);
    });

    //11
    it("API: PATCH /hotels/64574287c15c1cc298aaaa33 --> Should return Bad Request Error when the json body is not defined", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );

      await agent
        .patch("/api/v1/hotels/64574287c15c1cc298aaaa33")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-type", "multipart/form-data")
        .field("strigifiedBody", "")
        .attach("file", "./src/testAttachments/img1.jpg", {
          contentType: "image/jpg",
        })
        .attach("files", "./src/testAttachments/img2.jpg", {
          contentType: "image/jpg",
        })
        .expect("Content-Type", /json/)
        .expect(StatusCodes.BAD_REQUEST);
    });

    //12
    it("API: PATCH /hotels/6457434fa2be2a4221afda42 --> Should return status OK on success", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );

      await agent
        .patch("/api/v1/hotels/6457434fa2be2a4221afda42")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-type", "multipart/form-data")
        .field(
          "strigifiedBody",
          `{"name":"Updated Maya Hotel","registrationNumber":"MA-10KA","address":"No 2 Main St,New Town,Kandy","contactNumber":"057 6525412","email":"MayaView@gmail.com","openHours":{"open":"2023-07-06T09:00:00Z","close":"2023-07-06T18:00:00Z"},"hotelFacilities":["Pool","Spa","Gym"],"location":{"type":"Point","coordinates":[80.636696, 7.291418]}}`
        )
        .attach("files", "./src/testAttachments/img2.jpg", {
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

  describe("Delete Hotel Data Tests", () => {
    //13
    it("API: DELETE /hotels/64574287c15c1cc298aaaa33 --> Should return Unauthorized Error when attempted without auth tokens", async () => {
      await agent
        .delete("/api/v1/hotels/64574287c15c1cc298aaaa33")
        .expect("Content-Type", /json/)
        .expect(StatusCodes.UNAUTHORIZED);
    });

    //14
    it("API: DELETE /hotels/64574287c15c1cc298aaaa33 --> Should return Not Found Error when pulse stream data doesn't exist", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );
      await agent
        .delete("/api/v1/hotels/64574287c15c1cc298aaaa33")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(StatusCodes.NOT_FOUND);
    });

    //15
    it("API: DELETE /hotels/6457434fa2be2a4221afda42 --> Should return status OK on success", async () => {
      const token = await AuthTestUtil.getAuthTokenByUserType(
        constants.USER_TYPES.ADMIN
      );
      await agent
        .delete("/api/v1/hotels/6457434fa2be2a4221afda42")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(StatusCodes.OK)
        .then((response) => {
          const body = response.body;
          expect(body).toBeTruthy();
        });
    });

  });

});




