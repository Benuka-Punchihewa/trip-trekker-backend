const { default: mongoose } = require("mongoose");

const hotel = [
    {
        _id: new mongoose.Types.ObjectId("6457434fa2be2a4221afda42"),
        name: "Kandy View Hotel",
        description:"Test description",
        registrationNumber: "KA-10KA",
        address: "No 2 Main St,Kandy",
        contactNumber: "055 6525412",
        email: "kandyView@gmail.com",
        openHours: {
            open: new Date("2023-05-06T09:00:00.000Z"),
            close: new Date("2023-05-06T18:00:00.000Z"),
        },
        hotelFacilities: ["Pool", "Spa", "Gym"],
        location: {
            type: "Point",
            coordinates: [80.636696, 7.291418],
        },
        images: [
            {
                "mimeType": "image/png",
                "firebaseStorageRef": "hotels/64574287c15c1cc298aaaa33/c58974aa-a3dc-4da2-95c0-9b11d5e3b439",
            },
            {
                "mimeType": "image/png",
                "firebaseStorageRef": "hotels/64574287c15c1cc298aaaa33/eb622daf-fd6e-431a-8f8c-8863e31b2a7b",
            },
            {
                "mimeType": "image/png",
                "firebaseStorageRef": "hotels/64574287c15c1cc298aaaa33/d11b9b27-e6d4-490d-afcf-7da722b4abae",
            }
        ],
    }
];

module.exports = hotel;