const { default: mongoose } = require("mongoose");

const attractions = [
  {
    _id: new mongoose.Types.ObjectId("645691012a51fd1abe171360"),
    name: "Sigiriya",
    location: {
      type: "Point",
      coordinates: [80.75972, 7.956944],
    },
    description: `Sigiriya is one of the best places to visit in Sri Lanka`,
    openHours: {
      open: new Date("2023-05-01T01:00:00.000+00:00"),
      close: new Date("2023-05-01T12:00:00.000+00:00"),
    },
    accessibilityOptions: ["option 1, option 2"],
    rating: 5,
    images: [
      {
        mimeType: "image/jpeg",
        firebaseStorageRef:
          "attractions/6455d4a852534a9e2659ca9e/1db78536-3537-43ed-b594-23d1806bfb70",
      },
      {
        mimeType: "image/jpeg",
        firebaseStorageRef:
          "attractions/6455d4a852534a9e2659ca9e/6c67ad7c-da12-4a88-b931-2c44b13046aa",
      },
      {
        mimeType: "image/jpeg",
        firebaseStorageRef:
          "attractions/6455d4a852534a9e2659ca9e/ddb7eb1f-9d79-4dc5-b08d-f8920d119d29",
      },
      {
        mimeType: "image/jpeg",
        firebaseStorageRef:
          "attractions/6455d4a852534a9e2659ca9e/db8d2665-111e-4ae6-91cb-e26fe644ffd3",
      },
    ],
  },
];

module.exports = attractions;
