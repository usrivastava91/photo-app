//domain imports
import { setImageInfoTypes, setThumbnailInfoTypes } from "../../domain/Actions";
import ImageInfo from "../../domain/ImageInfo";
import ThumbnailInfo from "../../domain/ThumbnailInfo";
import create_UUID from "../../utils/uuid";
const SET_IMAGE_INFO = "SET_IMAGE_INFO";
const SET_THUMBNAIL_INFO = "SET_THUMBNAIL_INFO";
export const ImageReducer = {
  setImageInfo(
    state: ImageInfo[] = [],
    action: setImageInfoTypes
  ): ImageInfo[] {
    switch (action.type) {
      case SET_IMAGE_INFO: {
        const id = create_UUID();
        if (
          state.find(image => {
            return image.url === action.payload.url; // Check if thumbnailInfo is already present.
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
  },
  setThumbnailInfo(
    state: ThumbnailInfo[] = [],
    action: setThumbnailInfoTypes
  ): ThumbnailInfo[] {
    switch (action.type) {
      case SET_THUMBNAIL_INFO: {
        const id = create_UUID();

        if (
          state.find(thumbnail => {
            return thumbnail.url === action.payload.url; // Check if thumbnailInfo is already present.
          }) == undefined
        )
          return [
            ...state,
            {
              id: id,
              url: action.payload.url,
              thumbnailName: action.payload.thumbnailName,
              timeStamp: action.payload.timeStamp
            }
          ];
      }
      default:
        return state;
    }
  }
};
