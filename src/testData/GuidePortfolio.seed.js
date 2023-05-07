const { default: mongoose } = require("mongoose");

const guidePortfolio = [
  {
    _id: new mongoose.Types.ObjectId("6457724c8d4f5c73603f8735"),
    user: {
      _id: new mongoose.Types.ObjectId("6455e0211fe8fa83ebbfabe2"),
    },
    description: "this is description... ",
    image: {
      mimeType: "image/jpeg",
      firebaseStorageRef:
        "users/6455d42152534a9e2659ca94/portfolio/64575fdf8ad9cbfab6856fdc",
    },
  },
];

module.exports = guidePortfolio;
