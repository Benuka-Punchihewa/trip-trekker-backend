import constants from "../../constants.js";
import NotFoundError from "../error/error.classes/NotFoundError.js";
import userService from "../user/user.service.js";
import authUtil from "./auth.util.js";

const getAuthTokenByUserType = async (userType, typeIndex = 0) => {
  // if userType is tour guide and index is 1 return 2nd tourguide (1st index in the array)
  let dbUser;
  if (userType === constants.USER_TYPES.ADMIN)
    dbUser = await userService.findById("6455dfeb31254ef4a70ac318");
  else if (userType === constants.USER_TYPES.TOUR_GUIDE) {
    if (typeIndex === 0)
      dbUser = await userService.findById("6455e0211fe8fa83ebbfabe2");
    else dbUser = await userService.findById("6456ad7dbfabab38239359b3");
  } else dbUser = await userService.findById("6455e02a730fd892321c29cc");

  if (!dbUser) throw new NotFoundError("User not found!");

  const sessiontoken = authUtil.getSessionToken(
    dbUser.auth._id,
    dbUser._id.toString(),
    dbUser.type
  );

  return sessiontoken;
};

export default { getAuthTokenByUserType };
