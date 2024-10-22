import React from "react";
import { ImagesStore } from "../store/images/store";
import { connect } from "react-redux";
import { imagesLoaded } from "../utils/imagesLoaded";
import { InfiniteScrollInfo } from "../domain/InfiniteScrollInfo";
import { withRouter } from "react-router-dom";
import "./FullImageCarousel.css";
import {
  setCurrentImageUrl,
  setImageLoadStatus
} from "../store/images/actions";
import ImageInfo from "../domain/ImageInfo";
interface stateProps {
  currentImgUrl: string;
  Images: ImageInfo[];
  ImageLoadStatus: boolean;
  InfiniteScrollInfo: InfiniteScrollInfo;
}
interface actionProps {
  setCurrentImageUrl: typeof setCurrentImageUrl;
  setImageLoadStatus: typeof setImageLoadStatus;
}
interface FullImageCarouselProps extends stateProps, actionProps {
  history: any;
}
class _FullImageCarousel extends React.Component<FullImageCarouselProps> {
  imageRef: React.RefObject<HTMLDivElement>;

  constructor(props: FullImageCarouselProps) {
    super(props);
    this.imageRef = React.createRef();
  }

  //Changing the opacity on image load for a transition effect, and setting the image load status
  //to render the loading spinner
  handleImageLoadChange = () => {
    const image = this.imageRef.current!;
    image.style.opacity = "1";
    const { setImageLoadStatus } = this.props;
    setImageLoadStatus(!imagesLoaded(this.imageRef));
  };

  renderSpinner() {
    const { ImageLoadStatus } = this.props;
    if (!ImageLoadStatus) {
      return null;
    }
    return <h2 className="loader"></h2>;
  }

  onNext = () => {
    const {
      InfiniteScrollInfo,
      currentImgUrl,
      setCurrentImageUrl
    } = this.props;
    const currentImageInfo = InfiniteScrollInfo.allposts.filter(post => {
      return post.imgUrl == currentImgUrl;
    });
    const currentImageIndex = InfiniteScrollInfo.allposts.indexOf(
      currentImageInfo[0]
    );
    const nextIndex =
      currentImageIndex + 1 === InfiniteScrollInfo.allposts.length
        ? currentImageIndex
        : currentImageIndex + 1;
    const nextImageUrl = InfiniteScrollInfo.allposts[nextIndex].imgUrl;
    setCurrentImageUrl(nextImageUrl);
    const image = this.imageRef.current!;
    image.style.opacity = "0";
  };

  onPrev = () => {
    const {
      InfiniteScrollInfo,
      currentImgUrl,
      setCurrentImageUrl
    } = this.props;
    const currentImageInfo = InfiniteScrollInfo.allposts.filter(post => {
      return post.imgUrl == currentImgUrl;
    });
    const currentImageIndex = InfiniteScrollInfo.allposts.indexOf(
      currentImageInfo[0]
    );
    const prevIndex =
      currentImageIndex == 0 ? currentImageIndex : currentImageIndex - 1;
    const prevImageUrl = InfiniteScrollInfo.allposts[prevIndex].imgUrl;
    setCurrentImageUrl(prevImageUrl);
    const image = this.imageRef.current!;
    image.style.opacity = "0";
  };

  routeToDisplay = () => {
    const { history } = this.props;
    history.push({
      pathname: "/"
    });
  };

  render() {
    const { currentImgUrl } = this.props;
    return (
      <div className="d-flex carousel justify-content-around container">
        <i
          className="fa fa-home fa-2x nav align-self-start"
          aria-hidden="true"
          onClick={this.routeToDisplay}
        ></i>
        {this.renderSpinner()}
        <i
          className="fa fa-hand-o-left nav align-self-center fa-2x"
          onClick={this.onPrev}
          aria-hidden="true"
        ></i>
        <div className="image-container" ref={this.imageRef}>
          <img
            className="full-image"
            src={currentImgUrl}
            onLoad={this.handleImageLoadChange}
            onError={this.handleImageLoadChange}
          />
        </div>
        <i
          className="fa fa-hand-o-right nav align-self-center fa-2x"
          onClick={this.onNext}
          aria-hidden="true"
        ></i>
      </div>
    );
  }
}
const mapStateToProps = (state: ImagesStore) => {
  return {
    Images: state.ImageInfo,
    currentImgUrl: state.CurrentImageUrl,
    ImageLoadStatus: state.ImageLoadStatus,
    InfiniteScrollInfo: state.InfiniteScrollInfo
  };
};
const __FullImageCarousel = connect(mapStateToProps, {
  setCurrentImageUrl,
  setImageLoadStatus
})(_FullImageCarousel);

export const FullImageCarousel = withRouter(__FullImageCarousel);
