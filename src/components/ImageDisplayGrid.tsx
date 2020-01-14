import React from "react";
import { setImageInfo, setThumbnailInfo } from "../store/images/actions";
import { ImageUploader } from "../components/ImageUploader";
import { connect } from "react-redux";
import { ImagesStore } from "../store/images/store";
import ImageInfo from "../domain/ImageInfo";
import ThumbnailInfo from "../domain/ThumbnailInfo";
import { storage, fire } from "../fire";
import { Container, Row, Col, Image } from "react-bootstrap";
import create_UUID from "../utils/uuid";
import Axios from "axios";

interface storeProps {
  Images: ImageInfo[];
  Thumbnails: ThumbnailInfo[];
}

interface actionProps {
  setImageInfo: typeof setImageInfo;
  setThumbnailInfo: typeof setThumbnailInfo;
}

interface ImageDisplayGridProps extends storeProps, actionProps {}

class _ImageDisplayGrid extends React.Component<ImageDisplayGridProps> {
  constructor(props: ImageDisplayGridProps) {
    super(props);
  }

  componentDidMount() {
    this.fetchThumbnailsInfofromDB();
  }

  //WHAT: Fetches the URL, name, timestamp of all the Images from the firestore db.
  //WHY: We need the URLs to fetch and display the images.
  async fetchThumbnailsInfofromDB() {
    debugger;
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
            debugger;
            setThumbnailInfo(payload);
          }
        });
      });
    // Axios.get("https://fakeimg.pl/1600x1200/?text=air&font=lobster")
    // .then(res => {

    // })
  }

  render() {
    const { Thumbnails = [] } = this.props;
    return (
      <ol>
        {Thumbnails.map((thumbnail, index) => {
          return <li key={index}>{thumbnail.url}</li>;
        })}
      </ol>
    );
  }
}
const mapStateToProps = (state: ImagesStore) => {
  return {
    Thumbnails: state.setThumbnailInfo
  };
};
export const ImageDisplayGrid = connect(mapStateToProps, { setThumbnailInfo })(
  _ImageDisplayGrid
);
