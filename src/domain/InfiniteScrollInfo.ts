export default interface InfiniteScrollInfo {
  allposts: string[];
  posts: string[];
  hasMore: boolean;
  curpage: number;
  pagesize: number;
  totalPage: number;
  total: number;
}
