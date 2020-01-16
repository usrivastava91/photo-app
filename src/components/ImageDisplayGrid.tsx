import React from "react";
import {
  setThumbnailInfo,
  setImageInfo,
  setInfiniteScrollInfo
} from "../store/images/actions";
import { connect } from "react-redux";
import { ImagesStore } from "../store/images/store";
import ImageInfo from "../domain/ImageInfo";
import ThumbnailInfo from "../domain/ThumbnailInfo";
import InfiniteScrollInfo from "../domain/InfiniteScrollInfo";
import { fire } from "../fire";
import { Container, Row, Col, Image } from "react-bootstrap";
import create_UUID from "../utils/uuid";
import InfiniteScroll from "react-infinite-scroller";
import FullSizeImageModal from "./FullSizeImageModal";
import "./ImageDisplayGrid.css";
interface storeProps {
  Images: ImageInfo[];
  Thumbnails: ThumbnailInfo[];
  InfiniteScrollInfo: InfiniteScrollInfo;
}

interface actionProps {
  setImageInfo: typeof setImageInfo;
  setThumbnailInfo: typeof setThumbnailInfo;
  setInfiniteScrollInfo: typeof setInfiniteScrollInfo;
}

interface ImageDisplayGridProps extends storeProps, actionProps {}

class _ImageDisplayGrid extends React.Component<ImageDisplayGridProps> {
  constructor(props: ImageDisplayGridProps) {
    super(props);
  }
  modalShow: boolean = false;
  InfiniteScrollInfo = {
    allposts: [] as string[],
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

    let allPosts = Thumbnails.map(({ url }) => {
      return url;
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
    }
  };
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
    debugger;
    // const [modalShow, setModalShow] = React.useState(false);
    // modalShow = !this.modalShow;
    // this.modalShow = true;
    // this.forceUpdate();
    const target = event.target;
    const imgUrl = target.getAttribute("data-imgurl");
    window.open(imgUrl, "_blank");
  };

  render() {
    const { Images = [], InfiniteScrollInfo } = this.props;
    console.log(Images);
    return (
      <div className="image-grid">
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
          <div className="d-flex justify-content-center flex-wrap">
            {InfiniteScrollInfo.allposts.map((thumbnail, index) => {
              debugger;
              let imgUrl = "";
              if (Images.length > 0) {
                debugger;
                imgUrl = Images[index].url;
              }
              return (
                <img
                  data-imgurl={imgUrl}
                  onClick={this.renderFullView}
                  className="m-1"
                  key={index}
                  src={thumbnail}
                  alt=""
                />
              );
            })}
            {/* {this.modalShow == true ? (
              <FullSizeImageModal
                onHide={() => (this.modalShow = !this.modalShow)}
              />
            ) : null} */}
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}
const mapStateToProps = (state: ImagesStore) => {
  return {
    Thumbnails: state.setThumbnailInfo,
    InfiniteScrollInfo: state.setInfiniteScrollInfo,
    Images: state.setImageInfo
  };
};
export const ImageDisplayGrid = connect(mapStateToProps, {
  setThumbnailInfo,
  setImageInfo,
  setInfiniteScrollInfo
})(_ImageDisplayGrid);
