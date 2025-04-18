import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export const getUUID = () => {
  const uuid = uuidv4();
  console.log({ uuid });
  return uuid;
};
