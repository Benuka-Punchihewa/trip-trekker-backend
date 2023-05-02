import { StatusCodes } from "http-status-codes";
import { startSession } from "mongoose";
import NotFoundError from "../error/error.classes/NotFoundError.js";
import UnAuthorizedError from "../error/error.classes/UnAuthorizedError.js";
import User from "../user/user.model.js";
import UserService from "../user/user.service.js";
import Auth from "./auth.model.js";
import AuthService from "./auth.service.js";
import AuthUtil from "./auth.util.js";
import constants from "../../constants.js";
import BadRequestError from "../error/error.classes/BadRequestError.js";
import InternalServerError from "../error/error.classes/InternalServerError.js";
import UserUtil from "../user/user.util.js";
import CommonService from "../common/common.service.js";


const signUp = async (req, res) => {
  const { strigifiedBody } = req.body;

  // parse strigifiedBody
  let parsedBody;
  if (strigifiedBody) {
    try {
      parsedBody = JSON.parse(strigifiedBody);
    } catch (err) {
      throw new BadRequestError("Invalid JSON body!");
    }
  }

  if (!parsedBody) throw new BadRequestError("Request body is undefined!");

  const file = req.file 
  // validate image
  if (parsedBody.type === constants.USER_TYPES.TOUR_GUIDE) {
    if (!file) throw new BadRequestError("Tour guide certificate is required!");

    // validate mimetype
    if (file.mimetype.split("/")[1] !== "pdf")
      throw new BadRequestError("Only PDF file are permitted!");
  }

  if (parsedBody.type === constants.USER_TYPES.ADMIN)
    // validate type
    throw new UnAuthorizedError(
      "You're not authorized to create admininstrators!"
    );

  // validate password
  AuthUtil.validatePassword(parsedBody.password);

  // hash password
  const hashedPassword = await AuthUtil.hashPassword(parsedBody.password);

  // construct Auth document
  const auth = new Auth({
    _id: parsedBody.email,
    password: hashedPassword,
  });

  // construct User document
  const user = new User({
    auth: {
      _id: auth._id,
    },
    name: parsedBody.name,
    address: parsedBody.address,
    mobileNumber: parsedBody.mobileNumber,
    birthday: parsedBody.birthday,
    gender: parsedBody.gender,
    type: parsedBody.type,
  });

  let dbUser = null;
  const session = await startSession();
  try {
    await session.withTransaction(async () => {
      await AuthService.save(auth, session);
      dbUser = await UserService.save(user, session);
    });
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }

  if (!dbUser) throw new InternalServerError("Failed to Create the user!");

  // upload tour guide certificate
  if (dbUser.type === constants.USER_TYPES.TOUR_GUIDE && file) {
    try {
      const path = UserUtil.getFirebasePathForCertificateUploads(
        dbUser._id.toString()
      );

      // upload image to firebase
      await CommonService.uploadToFirebase(file, path);

      const firebaseFile = {
        mimeType: file.mimetype,
        firebaseStorageRef: path,
      };

      // set image and update user
      dbUser.tourGuide.certificate = firebaseFile;
      dbUser = await UserService.save(dbUser);
    } catch (err) {
      // rollback auth and user
      const session = await startSession();
      try {
        await session.withTransaction(async () => {
          await AuthService.removeById(auth._id, session);
          await UserService.removeById(user._id, session);
        });
      } catch (error) {
        throw error;
      } finally {
        await session.endSession();
      }
    }
  }

  const token = AuthUtil.getSessionToken(
    auth._id.toString(),
    user._id.toString(),
    user.type
  );

  return res.status(StatusCodes.CREATED).json({ user: dbUser, token });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  const [dbAuth, dbUser] = await Promise.all([
    AuthService.findById(email),
    UserService.findByAuthId(email),
  ]);

  if (!dbAuth || !dbUser) throw new NotFoundError("Bad Credentials!");

  // validate password
  await AuthUtil.verifyPassword(password, dbAuth.password);

  const token = AuthUtil.getSessionToken(
    dbAuth._id.toString(),
    dbUser._id.toString(),
    dbUser.type
  );

  return res.status(StatusCodes.OK).json({ user: dbUser, token });
};

export default { signUp, signIn };
