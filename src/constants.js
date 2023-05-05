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
    HOTEL:'Hotel',
    PULSE_STREAM_DATA: "PulseStreamData",
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
  PULSE_STREAM_DATA: {
    TAGS: {
      INFO: "Info",
      WARNING: "Warning",
      HAZARD: "Hazard",
    },
  },
  TOKEN_LIFE: 30 * 24 * 60 * 60,
};
