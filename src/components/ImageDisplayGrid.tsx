import React from "react";
import { setImageInfo } from "../store/images/actions";
import { ImageUploader } from "../components/ImageUploader";
import { connect } from "react-redux";
import { ImagesStore } from "../store/images/store";
import ImageInfo from "../domain/ImageInfo";
import { storage, fire } from "../fire";
import { Container, Row, Col, Image } from "react-bootstrap";
import create_UUID from "../utils/uuid";
import Axios from "axios";

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

  //WHAT: Fetches the URL of all the Images from the firestore db.
  //WHY: We need the URLs to fetch and display the images.
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
          const timeStamp = data.timeStamp;
          const id = create_UUID();
          const payload = { id, url, imageName, timeStamp };
          const { setImageInfo } = this.props;
          setImageInfo(payload);
        });
      });
    // Axios.get("https://fakeimg.pl/1600x1200/?text=air&font=lobster")
    // .then(res => {

    // })
  }

  render() {
    const { Images = [] } = this.props;
    return (
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
