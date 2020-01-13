//domain imports
import { ImageActionsTypes } from "../../domain/Actions";
import ImageInfo from "../../domain/ImageInfo";

const SET_IMAGE_INFO = "SET_IMAGE_INFO";

export const ImageReducer = {
  setImageInfo(
    state: ImageInfo[] = [],
    action: ImageActionsTypes
  ): ImageInfo[] {
    switch (action.type) {
      case SET_IMAGE_INFO: {
        if (
          state.find(image => {
            return image.url === action.payload.url;
          }) == undefined
        )
          return [
            ...state,
            {
              url: action.payload.url,
              imageName: action.payload.imageName
            }
          ];
      }
      default:
        return state;
    }
  }
};
