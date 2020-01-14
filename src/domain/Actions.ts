//misc imports
import ImageInfo from "./ImageInfo";
import setThumbnailInfo from "./ThumbnailInfo";

export interface setImageInfoTypes {
  type: string;
  payload: ImageInfo;
}

export interface setThumbnailInfoTypes {
  type: string;
  payload: setThumbnailInfo;
}

// export type ImageActionsTypes = setImageInfoTypes | setThumbnailInfoTypes;
