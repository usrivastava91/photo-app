import React from "react";
import ImageInfo from "../domain/ImageInfo";
import { setImageInfo } from "../store/images/actions";
import { connect } from "react-redux";
import { ImagesStore } from "../store/images/store";
import { storage, fire } from "../fire";
import { useHistory } from "react-router-dom";
import create_UUID from "../utils/uuid";
interface ImageUploaderProps {}

const _ImageUploader: React.FC<ImageUploaderProps> = (
  props: ImageUploaderProps
) => {
  let images: File[] = [];
  const history = useHistory();
  const handleOnChange = (e: any) => {
    [...images] = [...e.target.files];
  };
  const uploadImages = () => {
    const db = fire.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    const dbImagesRef = db.collection("Images");
    images.forEach((image: any) => {
      const imageName = image.name;
      const uploadTask = storage.ref(`images/${imageName}`).put(image);
      uploadTask.on(
        "state_changed",
        snapshot => {
          //progress function
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100 + "%";
          console.log(progress);
        },
        error => {
          //error function
          console.log(error);
        },
        () => {
          //complete function
          const id = create_UUID();
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url => {
              const payload = { id, url, imageName };
              dbImagesRef.add(payload);
            });
        }
      );
    });
  };
  const routeToDisplay = () => {
    history.push("/");
  };
  return (
    <div>
      <input type="file" onChange={handleOnChange} multiple />
      <button onClick={uploadImages}> upload</button>
      <button onClick={routeToDisplay}>Back to display</button>
    </div>
  );
};

const mapStateToProps = (state: ImagesStore) => {
  return {};
};
export const ImageUploader = connect(mapStateToProps, { setImageInfo })(
  _ImageUploader
);
