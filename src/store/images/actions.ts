//domain imports
import ImageInfo from "../../domain/ImageInfo";
import ThumbnailInfo from "../../domain/ThumbnailInfo";
import { setImageInfoTypes, setThumbnailInfoTypes } from "../../domain/Actions";

const SET_IMAGE_INFO = "SET_IMAGE_INFO";
const SET_THUMBNAIL_INFO = "SET_THUMBNAIL_INFO";

export function setImageInfo(ImageInfo: ImageInfo): setImageInfoTypes {
  return {
    type: SET_IMAGE_INFO,
    payload: ImageInfo
  };
}

export function setThumbnailInfo(
  ThumbnailInfo: ThumbnailInfo
): setThumbnailInfoTypes {
  return {
    type: SET_THUMBNAIL_INFO,
    payload: ThumbnailInfo
  };
}
