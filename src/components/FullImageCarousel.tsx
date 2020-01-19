import React from "react";
import { ImagesStore } from "../store/images/store";
import { connect } from "react-redux";
import { Container, Row, Col, Image, Carousel, Button } from "react-bootstrap";

interface stateProps {}
interface actionProps {}
interface FullImageCarouselProps extends stateProps, actionProps {
  location: any;
}
class _FullImageCarousel extends React.Component<FullImageCarouselProps> {
  constructor(props: FullImageCarouselProps) {
    super(props);
  }
  render() {
    return (
      <div className="d-flex">
        <Button className="prev">prev</Button>

        <div className="image">
          <img src={this.props.location.state.currentImage} />
        </div>
        <Button className="next">next</Button>
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
export const FullImageCarousel = connect(
  mapStateToProps,
  {}
)(_FullImageCarousel);
