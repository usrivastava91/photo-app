import React from "react";
import { connect } from "react-redux";
import { ImagesStore } from "../store/images/store";
import { storage, fire } from "../fire";
import { useHistory } from "react-router-dom";
import create_UUID from "../utils/uuid";
import { useDropzone } from "react-dropzone";
import { ProgressBar, Toast, Button } from "react-bootstrap";
import "./ImageUploader.css";
import { setUploadProgress } from "../store/images/actions";

interface storeProps {
  uploadProgress: number;
}
interface actionProps {
  setUploadProgress: typeof setUploadProgress;
}
interface ImageUploaderProps extends storeProps, actionProps {}
const _ImageUploader: React.FC<ImageUploaderProps> = (
  props: ImageUploaderProps
) => {
  const randomWords = [
    "actual",
    "actually",
    "add",
    "addition",
    "additional",
    "adjective",
    "adult",
    "adventure",
    "advice",
    "affect",
    "afraid",
    "after",
    "afternoon",
    "again",
    "against",
    "age",
    "ago",
    "agree",
    "ahead",
    "aid",
    "air",
    "airplane",
    "alike",
    "alive",
    "all",
    "allow",
    "almost",
    "alone",
    "along",
    "aloud",
    "alphabet",
    "already",
    "also",
    "although",
    "am",
    "among",
    "amount",
    "ancient",
    "angle",
    "angry",
    "animal",
    "announced",
    "another",
    "answer",
    "ants",
    "any",
    "anybody",
    "anyone",
    "anything",
    "anyway",
    "anywhere",
    "apart",
    "apartment",
    "appearance",
    "apple",
    "applied",
    "appropriate",
    "are",
    "area",
    "arm",
    "army",
    "around",
    "arrange",
    "arrangement",
    "arrive",
    "arrow",
    "art",
    "article",
    "as",
    "aside",
    "ask",
    "asleep",
    "at",
    "ate",
    "atmosphere",
    "atom",
    "atomic",
    "attached",
    "attack",
    "attempt",
    "attention",
    "audience",
    "author",
    "automobile",
    "available",
    "average",
    "avoid",
    "aware",
    "away",
    "baby",
    "back",
    "bad",
    "badly",
    "bag",
    "balance",
    "ball",
    "balloon",
    "band",
    "bank",
    "bar",
    "bare"
  ];
  let images: File[] = [];
  const history = useHistory();
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  [...images] = [...acceptedFiles];

  //WHAT: Pre-prossesing the image to resize it to a smaller size, and upload it along with the original image.
  //WHY: At the page load, To prevent long loading time,  we will only download the small images and show them as thumbnails in the display grid.
  //HOW:
  const resizeImageToThumbnail = (image: File) => {
    const getRandom = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };
    const reader = new FileReader();
    reader.onloadend = () => {
      let tempImg = new Image();
      tempImg.src = reader.result as string;
      tempImg.onload = function() {
        let MAX_WIDTH = getRandom(180, 240);
        let MAX_HEIGHT = getRandom(180, 240);
        let tempW = tempImg.width;
        let tempH = tempImg.height;
        if (tempW > tempH) {
          if (tempW > MAX_WIDTH) {
            tempH *= MAX_WIDTH / tempW;
            tempW = MAX_WIDTH;
          }
        } else {
          if (tempH > MAX_HEIGHT) {
            tempW *= MAX_HEIGHT / tempH;
            tempH = MAX_HEIGHT;
          }
        }
        let canvas = document.createElement("canvas");
        canvas.width = tempW;
        canvas.height = tempH;
        let ctx = canvas.getContext("2d")!;
        ctx.drawImage(tempImg, 0, 0, tempW, tempH);
        let dataURL = canvas.toDataURL("image/jpeg");
        const thumbnailName = `thumbnail_${image.name}`;
        uploadThumbnailToDB(dataURL, thumbnailName);
      };
    };
    reader.readAsDataURL(image);
  };

  const uploadThumbnailToDB = (dataURL: string, thumbnailName: string) => {
    const db = fire.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    const dbImagesRef = db.collection("Images");
    const uploadTask = storage
      .ref(`images/${thumbnailName}`)
      .putString(dataURL, "data_url");
    uploadTask.on(
      "state_changed",
      snapshot => {
        //progress function
        let uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        console.log(uploadProgress);
      },
      error => {
        //error function
        console.log(error);
      },
      () => {
        //image upload complete function
        storage
          .ref("images")
          .child(thumbnailName)
          .getDownloadURL()
          .then(url => {
            //Uploading the imageInfo to firestore db. Will use the url from the db to
            //fetch and display the images
            const id = create_UUID();
            const timeStamp = +new Date();
            const payload = { id, url, thumbnailName, timeStamp };
            dbImagesRef.add(payload);
          });
      }
    );
  };

  const uploadImagesToDB = (image: File, imageName: string) => {
    const db = fire.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    const dbImagesRef = db.collection("Images");
    const uploadTask = storage.ref(`images/${imageName}`).put(image);
    uploadTask.on(
      "state_changed",
      snapshot => {
        //progress function
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        props.setUploadProgress(uploadProgress);
      },
      error => {
        //error function
        console.log(error);
      },

      () => {
        //On image upload complete,store the image information(url, id, name, timestamp)
        //in a seperate firestorage,to be used to load images in the Image view page.
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            const id = create_UUID();
            const timeStamp = +new Date();
            const payload = { id, url, imageName, timeStamp };
            dbImagesRef.add(payload);
          });
      }
    );
  };

  const uploadImages = () => {
    images.forEach((image: File) => {
      const imageName = image.name;
      resizeImageToThumbnail(image);
      uploadImagesToDB(image, imageName);
    });
  };

  const routeToDisplay = () => {
    history.push("/");
  };

  return (
    <div className="container mt-5">
      {props.uploadProgress === 100 ? (
        <Toast className="success-toast">
          <Toast.Body>Image successfully uploaded</Toast.Body>
        </Toast>
      ) : null}
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <ProgressBar className="mt-1" now={props.uploadProgress} />
      <div className=" mt-3 d-flex justify-content-center">
        <Button className="mr-2" onClick={uploadImages}>
          upload
        </Button>
        <Button onClick={routeToDisplay}>Back to display</Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: ImagesStore) => {
  return {
    uploadProgress: state.UploadProgress
  };
};
export const ImageUploader = connect(mapStateToProps, { setUploadProgress })(
  _ImageUploader
);
