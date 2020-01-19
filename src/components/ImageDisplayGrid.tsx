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
import { InfiniteScrollInfo, allPostType } from "../domain/InfiniteScrollInfo";
import { fire } from "../fire";
import { Container, Row, Col, Image, Carousel, Button } from "react-bootstrap";
import create_UUID from "../utils/uuid";
import InfiniteScroll from "react-infinite-scroller";
import { withRouter } from "react-router-dom";
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

interface ImageDisplayGridProps extends storeProps, actionProps {
  history: any;
}

class _ImageDisplayGrid extends React.Component<ImageDisplayGridProps> {
  carouselRef: React.RefObject<HTMLDivElement>;
  imageGridRef: React.RefObject<HTMLDivElement>;
  // currentImageUrl = "";
  constructor(props: ImageDisplayGridProps) {
    super(props);
    this.carouselRef = React.createRef();
    this.imageGridRef = React.createRef();
    // let carouselView = this.carouselRef.current;
    // console.log("REFFFFFF", this.carouselRef, this.imageGridRef);
    // if (carouselView !== null) {
    //   carouselView.style.display = "none";
    // }

    // let imageGridView = this.imageGridRef.current;
    // if (imageGridView !== null) {
    //   imageGridView.style.display = "block";
    // }
  }
  dummyUrls = [
    "https://fakeimg.pl/1600x1200/?text=abc&font=lobster",
    "https://fakeimg.pl/1600x1200/?text=def&font=lobster",
    "https://fakeimg.pl/1600x1200/?text=ghi&font=lobster",
    "https://fakeimg.pl/1600x1200/?text=jkl&font=lobster",
    "https://fakeimg.pl/1600x1200/?text=mno&font=lobster",
    "https://fakeimg.pl/1600x1200/?text=pqr&font=lobster",
    "https://fakeimg.pl/1600x1200/?text=stu&font=lobster",
    "https://fakeimg.pl/1600x1200/?text=vwx&font=lobster",
    "https://fakeimg.pl/1600x1200/?text=yz1&font=lobster",
    "https://fakeimg.pl/1600x1200/?text=234&font=lobster",
    "https://fakeimg.pl/1600x1200/?text=567&font=lobster",
    "https://fakeimg.pl/1600x1200/?text=890&font=lobster",
    "https://fakeimg.pl/1600x1200/?text=last&font=lobster"
  ];
  modalShow: boolean = false;

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
    // let carouselView = this.carouselRef.current!;
    // carouselView.style.display = "none";
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
    // let imageGridView = this.imageGridRef.current!;
    // imageGridView.style.display = "none";
    // debugger;
    // const target = event.target;
    // this.currentImageUrl = target.getAttribute("data-imgurl");
    // // window.open(imgUrl, "_blank");
    // let carouselView = this.carouselRef.current!;
    // carouselView.style.display = "block";
    const { history } = this.props;
    const currentImageUrl = event.target.getAttribute("data-imgurl");
    console.log("URLSLSALGLASLFASL", currentImageUrl);
    history.push({
      pathname: "/FullScreen",
      state: { currentImage: currentImageUrl }
    });
  };

  renderGridView = (event: any) => {
    let imageGridView = this.imageGridRef.current!;
    imageGridView.style.display = "block";
    let carouselView = this.carouselRef.current!;
    carouselView.style.display = "none";
  };
  render() {
    const { Images = [], InfiniteScrollInfo } = this.props;
    console.log(Images);
    return (
      <div className="d-flex justify-content-center">
        <div ref={this.imageGridRef} className="image-grid">
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
                let currentImgUrl = "";
                if (Images.length > 0) {
                  const currentImgName = thumbnail.thumbnailName.replace(
                    "thumbnail_",
                    ""
                  );
                  debugger;
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
                    className="m-1"
                    key={index}
                    src={thumbnail.url}
                    alt=""
                  />
                );
              })}
            </div>
          </InfiniteScroll>
        </div>
        <div className="full-view-carousel" ref={this.carouselRef}>
          {/* <Button className="carousel-exit-btn" onClick={this.renderGridView}>
            return to image grid
          </Button> */}

          {/* <Carousel className="img-carousel">
            {this.dummyUrls.map((image, index) => {
              return (
                <Carousel.Item key={index}>
                  <img className="d-block" src={image} alt="First slide" />
                  <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>
                      Nulla vitae elit libero, a pharetra augue mollis interdum.
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
              );
            })}
          </Carousel> */}
        </div>
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
const __ImageDisplayGrid = connect(mapStateToProps, {
  setThumbnailInfo,
  setImageInfo,
  setInfiniteScrollInfo
})(_ImageDisplayGrid);

export const ImageDisplayGrid = withRouter(__ImageDisplayGrid);

// export default ImageDisplayGrid;
