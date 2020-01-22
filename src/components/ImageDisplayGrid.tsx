import React from "react";
import {
  setThumbnailInfo,
  setImageInfo,
  setInfiniteScrollInfo,
  setCurrentImageUrl,
  setImageLoadStatus
} from "../store/images/actions";
import { connect } from "react-redux";
import { ImagesStore } from "../store/images/store";
import ImageInfo from "../domain/ImageInfo";
import ThumbnailInfo from "../domain/ThumbnailInfo";
import { InfiniteScrollInfo, allPostType } from "../domain/InfiniteScrollInfo";
import { fire } from "../fire";
import create_UUID from "../utils/uuid";
import InfiniteScroll from "react-infinite-scroller";
import { withRouter } from "react-router-dom";
import { imagesLoaded } from "../utils/imagesLoaded";
import "./ImageDisplayGrid.css";

interface storeProps {
  Images: ImageInfo[];
  Thumbnails: ThumbnailInfo[];
  InfiniteScrollInfo: InfiniteScrollInfo;
  ImageLoadStatus: boolean;
}

interface actionProps {
  setImageInfo: typeof setImageInfo;
  setThumbnailInfo: typeof setThumbnailInfo;
  setInfiniteScrollInfo: typeof setInfiniteScrollInfo;
  setCurrentImageUrl: typeof setCurrentImageUrl;
  setImageLoadStatus: typeof setImageLoadStatus;
}

interface ImageDisplayGridProps extends storeProps, actionProps {
  history: any;
}

class _ImageDisplayGrid extends React.Component<ImageDisplayGridProps> {
  imageGridRef: React.RefObject<HTMLDivElement>;
  constructor(props: ImageDisplayGridProps) {
    super(props);
    this.imageGridRef = React.createRef();
  }
  InfiniteScrollInfo = {
    allposts: [] as allPostType[],
    posts: [] as string[],
    hasMore: true,
    curpage: 0,
    pagesize: 30,
    totalPage: 0,
    total: 0
  };

  async componentDidMount() {
    await this.fetchThumbnailsInfofromDB();
    await this.initializingInfiniteScroll();
  }

  initializingInfiniteScroll() {
    const {
      Thumbnails,
      setInfiniteScrollInfo,
      InfiniteScrollInfo
    } = this.props;

    let allPosts = Thumbnails.map(({ url, thumbnailName }) => {
      return { url, thumbnailName };
    });
    let curpage = this.InfiniteScrollInfo.curpage;

    let currPageThumbnails = allPosts.slice(
      curpage * this.InfiniteScrollInfo.pagesize, // current page * 30 Images = 0
      (curpage + 1) * this.InfiniteScrollInfo.pagesize // current page+1 * 30 Images ( i.e: the next page ) = 30
    );

    const payload = {
      allposts: allPosts,
      posts: [...currPageThumbnails],
      total: allPosts.length,
      hasMore: InfiniteScrollInfo.hasMore,
      curpage: InfiniteScrollInfo.curpage,
      pagesize: InfiniteScrollInfo.pagesize,
      totalPage: Math.ceil(allPosts.length / this.InfiniteScrollInfo.pagesize)
    };

    setInfiniteScrollInfo(payload);
  }

  loadmoreItem = () => {
    const { InfiniteScrollInfo, setInfiniteScrollInfo } = this.props;
    if (InfiniteScrollInfo.curpage + 1 < InfiniteScrollInfo.totalPage) {
      let curpage =
        InfiniteScrollInfo.curpage < InfiniteScrollInfo.totalPage
          ? InfiniteScrollInfo.curpage + 1
          : InfiniteScrollInfo.curpage;
      let currPageThumbnails = InfiniteScrollInfo.allposts.slice(
        0,
        (curpage + 1) * InfiniteScrollInfo.pagesize
      );
      const payload = {
        allposts: InfiniteScrollInfo.allposts,
        posts: [...currPageThumbnails],
        total: InfiniteScrollInfo.total,
        hasMore: InfiniteScrollInfo.hasMore,
        curpage: curpage,
        pagesize: InfiniteScrollInfo.pagesize,
        totalPage: InfiniteScrollInfo.totalPage
      };
      setInfiniteScrollInfo(payload);
    } else {
      const payload = {
        allposts: InfiniteScrollInfo.allposts,
        posts: InfiniteScrollInfo.posts,
        total: InfiniteScrollInfo.total,
        hasMore: false,
        curpage: InfiniteScrollInfo.curpage,
        pagesize: InfiniteScrollInfo.pagesize,
        totalPage: InfiniteScrollInfo.totalPage
      };
      setInfiniteScrollInfo(payload);
    }
  };

  handleImageLoadChange = () => {
    debugger;
    const { setImageLoadStatus } = this.props;
    setImageLoadStatus(!imagesLoaded(this.imageGridRef));
  };

  renderSpinner() {
    const { ImageLoadStatus } = this.props;
    debugger;
    if (!ImageLoadStatus) {
      return null;
    }
    return <h2 className="loader"></h2>;
  }
  //WHAT: Fetches the URL, name, timestamp of all the Images from the firestore db.
  //WHY: We need the URLs to fetch and display the images.
  async fetchThumbnailsInfofromDB() {
    const db = fire.firestore();
    await db
      .collection("Images")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let data = doc.data();
          if (data.thumbnailName) {
            const url = data.url;
            const thumbnailName = data.thumbnailName;
            const timeStamp = data.timeStamp;
            const id = create_UUID();
            const payload = { id, url, thumbnailName, timeStamp };
            const { setThumbnailInfo } = this.props;
            setThumbnailInfo(payload);
          } else if (data.imageName) {
            const url = data.url;
            const imageName = data.imageName;
            const timeStamp = data.timeStamp;
            const id = create_UUID();
            const payload = { id, url, imageName, timeStamp };
            const { setImageInfo } = this.props;
            setImageInfo(payload);
          }
        });
      });
  }

  renderFullView = (event: any) => {
    const { history } = this.props;
    const currentImageUrl = event.target.getAttribute("data-imgurl");
    const { setCurrentImageUrl } = this.props;
    setCurrentImageUrl(currentImageUrl);
    history.push({
      pathname: "/FullScreen"
    });
  };
  render() {
    const { Images = [], InfiniteScrollInfo } = this.props;
    return (
      <div className="d-flex justify-content-center image-grid-container">
        {this.renderSpinner()}
        <div className="">
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadmoreItem}
            hasMore={InfiniteScrollInfo.hasMore}
            loader={
              <div className="loader" key={0}>
                ruko ...
              </div>
            }
            useWindow={false}
            threshold={550}
          >
            <div className="image-grid" ref={this.imageGridRef}>
              {InfiniteScrollInfo.allposts.map((thumbnail, index) => {
                let currentImgUrl = "";
                if (Images.length > 0) {
                  const currentImgName = thumbnail.thumbnailName.replace(
                    "thumbnail_",
                    ""
                  );
                  let currentImg = Images.filter(image => {
                    return image.imageName === currentImgName;
                  });
                  currentImgUrl = currentImg[0].url;
                }

                return (
                  <img
                    data-imgurl={currentImgUrl}
                    data-index={index}
                    onClick={this.renderFullView}
                    key={index}
                    src={thumbnail.url}
                    onLoad={this.handleImageLoadChange}
                    onError={this.handleImageLoadChange}
                    alt=""
                  />
                );
              })}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state: ImagesStore) => {
  return {
    Thumbnails: state.setThumbnailInfo,
    InfiniteScrollInfo: state.setInfiniteScrollInfo,
    Images: state.setImageInfo,
    ImageLoadStatus: state.setImageLoadStatus
  };
};
const __ImageDisplayGrid = connect(mapStateToProps, {
  setThumbnailInfo,
  setImageInfo,
  setInfiniteScrollInfo,
  setCurrentImageUrl,
  setImageLoadStatus
})(_ImageDisplayGrid);

export const ImageDisplayGrid = withRouter(__ImageDisplayGrid);
