//domain imports
import ImageInfo from "../../domain/ImageInfo";
import ThumbnailInfo from "../../domain/ThumbnailInfo";
import { InfiniteScrollInfo } from "../../domain/InfiniteScrollInfo";
import {
  setImageInfoTypes,
  setThumbnailInfoTypes,
  setInfiniteScrollInfoTypes,
  setUploadProgressTypes,
  setCurrentImageUrlTypes,
  setImageLoadStatusTypes
} from "../../domain/Actions";

const SET_IMAGE_INFO = "SET_IMAGE_INFO";
const SET_THUMBNAIL_INFO = "SET_THUMBNAIL_INFO";
const SET_INFINITE_SCROLL_INFO = "SET_INFINITE_SCROLL_INFO";
const SET_UPLOAD_PROGRESS = "SET_UPLOAD_PROGRESS";
const SET_CURRENT_IMAGE_URL = "SET_CURRENT_IMAGE_URL";
const SET_IMAGE_LOAD_STATUS = "SET_IMAGE_LOAD_STATUS";

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

export function setInfiniteScrollInfo(
  InfiniteScrollInfo: InfiniteScrollInfo
): setInfiniteScrollInfoTypes {
  return {
    type: SET_INFINITE_SCROLL_INFO,
    payload: InfiniteScrollInfo
  };
}

export function setUploadProgress(
  uploadProgress: number
): setUploadProgressTypes {
  return {
    type: SET_UPLOAD_PROGRESS,
    payload: uploadProgress
  };
}

export function setCurrentImageUrl(
  currentImageUrl: string
): setCurrentImageUrlTypes {
  return {
    type: SET_CURRENT_IMAGE_URL,
    payload: currentImageUrl
  };
}

export function setImageLoadStatus(
  imageLoadStatus: boolean
): setImageLoadStatusTypes {
  return {
    type: SET_IMAGE_LOAD_STATUS,
    payload: imageLoadStatus
  };
}
