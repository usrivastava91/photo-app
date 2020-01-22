import React from "react";
import { ImagesStore } from "../store/images/store";
import { connect } from "react-redux";
import { Container, Row, Col, Image, Carousel, Button } from "react-bootstrap";
import { imagesLoaded } from "../utils/imagesLoaded";

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
}
interface actionProps {
  setCurrentImageUrl: typeof setCurrentImageUrl;
  setImageLoadStatus: typeof setImageLoadStatus;
}
interface FullImageCarouselProps extends stateProps, actionProps {}
class _FullImageCarousel extends React.Component<FullImageCarouselProps> {
  imageRef: React.RefObject<HTMLDivElement>;

  constructor(props: FullImageCarouselProps) {
    super(props);
    this.imageRef = React.createRef();
  }
  componentDidMount = () => {};

  handleImageLoadChange = () => {
    const abc = this.imageRef;
    debugger;
    const { setImageLoadStatus } = this.props;
    setImageLoadStatus(!imagesLoaded(this.imageRef));
  };

  renderSpinner() {
    debugger;
    const { ImageLoadStatus } = this.props;
    debugger;
    if (!ImageLoadStatus) {
      return null;
    }
    return <h2 className="loader"></h2>;
  }

  onNext = () => {
    const { Images = [], currentImgUrl, setCurrentImageUrl } = this.props;
    const currentImageInfo = Images.filter(image => {
      return image.url == currentImgUrl;
    });
    const currentImageIndex = Images.indexOf(currentImageInfo[0]);
    const nextIndex =
      currentImageIndex + 1 == Images.length
        ? currentImageIndex
        : currentImageIndex + 1;
    const nextImageUrl = Images[nextIndex].url;
    console.table({ CurrentIndex: currentImageIndex, "next index": nextIndex });
    setCurrentImageUrl(nextImageUrl);
  };

  onPrev = () => {
    const { Images = [], currentImgUrl, setCurrentImageUrl } = this.props;
    const currentImageInfo = Images.filter(image => {
      return image.url == currentImgUrl;
    });
    const currentImageIndex = Images.indexOf(currentImageInfo[0]);
    const prevIndex =
      currentImageIndex == 0 ? currentImageIndex : currentImageIndex - 1;
    const prevImageUrl = Images[prevIndex].url;
    console.table({ CurrentIndex: currentImageIndex, "prev index": prevIndex });
    setCurrentImageUrl(prevImageUrl);
  };

  render() {
    const { currentImgUrl } = this.props;
    return (
      <div className="d-flex carousel justify-content-around">
        {this.renderSpinner()}
        <Button className="prev align-self-center" onClick={this.onPrev}>
          prev
        </Button>
        <div className="image" ref={this.imageRef}>
          <img
            className="full-image"
            src={currentImgUrl}
            onLoad={this.handleImageLoadChange}
            onError={this.handleImageLoadChange}
          />
          {/* <img
            src="https://firebasestorage.googleapis.com/v0/b/photo-app-typito.appspot.com/o/images%2FZ2HAYEQKSQ.jpg?alt=media&token=52f85530-7dc5-4c94-bb2f-78d1460b4e05"
            alt=""
          /> */}
        </div>
        <Button className="next align-self-center" onClick={this.onNext}>
          next
        </Button>
      </div>
    );
  }
}
const mapStateToProps = (state: ImagesStore) => {
  return {
    Images: state.setImageInfo,
    currentImgUrl: state.setCurrentImageUrl,
    ImageLoadStatus: state.setImageLoadStatus
  };
};
export const FullImageCarousel = connect(mapStateToProps, {
  setCurrentImageUrl,
  setImageLoadStatus
})(_FullImageCarousel);
