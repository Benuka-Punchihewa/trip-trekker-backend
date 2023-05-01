import { ClientSession } from "mongoose";
import { IPulseStreamDataModel } from "./pulseStreamData.interface";

const save = async (
  pulseStreamData: IPulseStreamDataModel,
  session?: ClientSession
) => {
  return pulseStreamData.save({ session });
};

export default { save };
