const { default: mongoose } = require("mongoose");

const auths = [
  {
    _id: new mongoose.Types.ObjectId("6456a956522b62b558c5a603"),
    attraction: {
      _id: new mongoose.Types.ObjectId("645691012a51fd1abe171360"),
    },
    user: {
      _id: new mongoose.Types.ObjectId("6455e0211fe8fa83ebbfabe2"),
      name: "Benuka Punchihewa",
    },
    tag: "Info",
    description: "Some Description",
    image: {
      mimeType: "image/jpeg",
      firebaseStorageRef:
        "attractions/6455d4a852534a9e2659ca9e/pulse-stream-data/6456a956522b62b558c5a603",
    },
  },
];

module.exports = auths;
