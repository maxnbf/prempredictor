import { Dimensions } from "react-native";

export const getDimensions = () => {
  return {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  };
};
