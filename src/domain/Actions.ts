//misc imports
import ImageInfo from "./ImageInfo";
import setThumbnailInfo from "./ThumbnailInfo";
import { InfiniteScrollInfo } from "./InfiniteScrollInfo";
export interface setImageInfoTypes {
  type: string;
  payload: ImageInfo;
}

export interface setThumbnailInfoTypes {
  type: string;
  payload: setThumbnailInfo;
}

export interface setInfiniteScrollInfoTypes {
  type: string;
  payload: InfiniteScrollInfo;
}

export interface setUploadProgressTypes {
  type: string;
  payload: number;
}
// export type ImageActionsTypes = setImageInfoTypes | setThumbnailInfoTypes;
