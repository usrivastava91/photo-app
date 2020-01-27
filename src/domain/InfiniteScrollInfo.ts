export interface allPostType {
  url: string;
  thumbnailName: string;
  imgUrl: string;
  timeStamp: number;
}
export interface InfiniteScrollInfo {
  allposts: allPostType[];
  posts: allPostType[];
  hasMore: boolean;
  curpage: number;
  pagesize: number;
  totalPage: number;
  total: number;
}
