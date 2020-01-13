import React from "react";
import { setImageInfo } from "../store/images/actions";
import { ImageUploader } from "../components/ImageUploader";
import { connect } from "react-redux";
import { ImagesStore } from "../store/images/store";
import ImageInfo from "../domain/ImageInfo";
import { storage, fire } from "../fire";
import { Container, Row, Col, Image } from "react-bootstrap";
import create_UUID from "../utils/uuid";

interface storeProps {
  Images: ImageInfo[];
}

interface actionProps {
  setImageInfo: typeof setImageInfo;
}

interface ImageDisplayGridProps extends storeProps, actionProps {}

class _ImageDisplayGrid extends React.Component<ImageDisplayGridProps> {
  constructor(props: ImageDisplayGridProps) {
    super(props);
  }

  componentDidMount() {
    this.fetchImagesUrlsFromDB();
  }

  async fetchImagesUrlsFromDB() {
    const db = fire.firestore();
    await db
      .collection("Images")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let data = doc.data();
          const url = data.url;
          const imageName = data.imageName;
          const id = create_UUID();
          const payload = { id, url, imageName };
          const { setImageInfo } = this.props;
          setImageInfo(payload);
        });
      });
  }

  render() {
    const { Images = [] } = this.props;
    return (
      //   <Container>
      //     <Row>
      //       {Images.map((image, index) => {
      //         return (
      //           <Col className="m-3" key={index} xs={6} md={4}>
      //             <Image
      //               key={index}
      //               src={image.url}
      //               width="193"
      //               height="130"
      //               rounded
      //             />
      //           </Col>
      //         );
      //       })}
      //       <Col xs={6} md={4}></Col>
      //     </Row>
      //   </Container>
      <ol>
        {Images.map((image, index) => {
          return <li key={index}>{image.url}</li>;
        })}
      </ol>
    );
  }
}
const mapStateToProps = (state: ImagesStore) => {
  return {
    Images: state.setImageInfo
  };
};
export const ImageDisplayGrid = connect(mapStateToProps, { setImageInfo })(
  _ImageDisplayGrid
);
