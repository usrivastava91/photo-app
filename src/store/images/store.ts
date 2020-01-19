import ImageInfo from "../../domain/ImageInfo";
import ThumbnailInfo from "../../domain/ThumbnailInfo";
import { InfiniteScrollInfo } from "../../domain/InfiniteScrollInfo";
export interface ImagesStore {
  setImageInfo: [ImageInfo];
  setThumbnailInfo: [ThumbnailInfo];
  setInfiniteScrollInfo: InfiniteScrollInfo;
  setUploadProgress: number;
  setCurrentImageUrl: string;
}
