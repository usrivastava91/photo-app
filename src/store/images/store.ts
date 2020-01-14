import ImageInfo from "../../domain/ImageInfo";
import ThumbnailInfo from "../../domain/ThumbnailInfo";
export interface ImagesStore {
  setImageInfo: [ImageInfo];
  setThumbnailInfo: [ThumbnailInfo];
}
