export default {
  SERVER: {
    PORT: 4002,
  },
  API: {
    PREFIX: "/api/v1",
  },
  SCHEMAS: {
    AUTH: "Auth",
    USER: "User",
    ATTRACTION: "Attraction",
  },
  GENDER: {
    MALE: "Male",
    FEMALE: "Female",
  },
  USER_TYPES: {
    ADMIN: "Admin",
    TOUR_GUIDE: "Tour Guide",
    TOURIST: "Tourist",
  },
  TOKEN_LIFE: 30 * 24 * 60 * 60,
};
