//domain imports
import {
  setImageInfoTypes,
  setThumbnailInfoTypes,
  setInfiniteScrollInfoTypes,
  setUploadProgressTypes,
  setCurrentImageUrlTypes
} from "../../domain/Actions";
import ImageInfo from "../../domain/ImageInfo";
import ThumbnailInfo from "../../domain/ThumbnailInfo";
import { InfiniteScrollInfo } from "../../domain/InfiniteScrollInfo";
import create_UUID from "../../utils/uuid";
import { stat } from "fs";
import { setUploadProgress, setCurrentImageUrl } from "./actions";
const SET_IMAGE_INFO = "SET_IMAGE_INFO";
const SET_THUMBNAIL_INFO = "SET_THUMBNAIL_INFO";
const SET_INFINITE_SCROLL_INFO = "SET_INFINITE_SCROLL_INFO";
const SET_UPLOAD_PROGRESS = "SET_UPLOAD_PROGRESS";
const SET_CURRENT_IMAGE_URL = "SET_CURRENT_IMAGE_URL";

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
          ].sort((a, b) => {
            if (b.timeStamp > a.timeStamp) {
              return 1;
            } else return -1;
          });
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
          ].sort((a, b) => {
            if (b.timeStamp > a.timeStamp) {
              return 1;
            } else return -1;
          });
      }
      default:
        return state;
    }
  },
  setInfiniteScrollInfo(
    state: InfiniteScrollInfo = {
      allposts: [],
      posts: [],
      hasMore: true,
      curpage: 0,
      pagesize: 30,
      totalPage: 0,
      total: 0
    },
    action: setInfiniteScrollInfoTypes
  ): InfiniteScrollInfo {
    switch (action.type) {
      case SET_INFINITE_SCROLL_INFO: {
        const updatedInfiniteScrollInfo = {
          allposts:
            action.payload.allposts != undefined
              ? [...action.payload.allposts]
              : state.allposts,
          posts:
            action.payload.posts != undefined
              ? [...action.payload.posts]
              : state.posts,
          hasMore:
            action.payload.hasMore != undefined
              ? action.payload.hasMore
              : state.hasMore,
          curpage:
            action.payload.curpage != undefined
              ? action.payload.curpage
              : state.curpage,
          pagesize: 30,
          totalPage:
            action.payload.totalPage != undefined
              ? action.payload.totalPage
              : state.totalPage,
          total:
            action.payload.total != undefined
              ? action.payload.total
              : state.total
        };
        return updatedInfiniteScrollInfo;
      }
      default:
        return state;
    }
  },
  setUploadProgress(state: number = 0, action: setUploadProgressTypes) {
    switch (action.type) {
      case SET_UPLOAD_PROGRESS: {
        return action.payload;
      }
      default:
        return state;
    }
  },
  setCurrentImageUrl(state: string = "", action: setCurrentImageUrlTypes) {
    switch (action.type) {
      case SET_CURRENT_IMAGE_URL: {
        return action.payload;
      }
      default:
        return state;
    }
  }
};
