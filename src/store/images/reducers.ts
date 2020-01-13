//domain imports
import { ImageActionsTypes } from "../../domain/Actions";
import ImageInfo from "../../domain/ImageInfo";
import create_UUID from "../../utils/uuid";
const SET_IMAGE_INFO = "SET_IMAGE_INFO";

export const ImageReducer = {
  setImageInfo(
    state: ImageInfo[] = [],
    action: ImageActionsTypes
  ): ImageInfo[] {
    switch (action.type) {
      case SET_IMAGE_INFO: {
        const id = create_UUID();
        if (
          state.find(image => {
            return image.url === action.payload.url;
          }) == undefined
        )
          return [
            ...state,
            {
              id: id,
              url: action.payload.url,
              imageName: action.payload.imageName,
              timeStamp: action.payload.timeStamp
            }
          ];
      }
      default:
        return state;
    }
  }
};
