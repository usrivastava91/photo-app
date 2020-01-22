import ImageInfo from "../../domain/ImageInfo";
import ThumbnailInfo from "../../domain/ThumbnailInfo";
import { InfiniteScrollInfo } from "../../domain/InfiniteScrollInfo";
export interface ImagesStore {
  ImageInfo: [ImageInfo];
  ThumbnailInfo: [ThumbnailInfo];
  InfiniteScrollInfo: InfiniteScrollInfo;
  UploadProgress: number;
  CurrentImageUrl: string;
  ImageLoadStatus: boolean;
}
