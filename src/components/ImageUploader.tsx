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
  const handleOnChange = (e: any) => {
    [...images] = [...e.target.files];
  };

  //WHAT: Pre-prossesing the image to resize it to a smaller size, and upload it along with the original image.
  //WHY: At the page load, To prevent long loading time,  we will only download the small images and show them as thumbnails in the display grid.
  //HOW:
  const uploadThumbnail = async () => {
    images.forEach(image => {
      const imgDataUrl = resizeImageToThumbnail(image);
    });
  };

  const resizeImageToThumbnail = (image: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      let tempImg = new Image();
      tempImg.src = reader.result as string;
      tempImg.onload = function() {
        var MAX_WIDTH = 400;
        var MAX_HEIGHT = 300;
        var tempW = tempImg.width;
        var tempH = tempImg.height;
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
        var canvas = document.createElement("canvas");
        canvas.width = tempW;
        canvas.height = tempH;
        var ctx = canvas.getContext("2d")!;
        ctx.drawImage(tempImg, 0, 0, tempW, tempH);
        var dataURL = canvas.toDataURL("image/jpeg");
        return dataURL;
      };
    };
    reader.readAsDataURL(image);
  };

  const uploadImages = () => {
    uploadThumbnail();
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
          //image upload complete callback function
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url => {
              const id = create_UUID();
              const timeStamp = +new Date();
              const payload = { id, url, imageName, timeStamp };
              dbImagesRef.add(payload);
              // console.log("length", randomWords.length);
              // randomWords.forEach(word => {
              //   const url = `https://fakeimg.pl/1600x1200/?text=${word}&font=lobster`;
              //   const id = create_UUID();
              //   const timeStamp = +new Date();
              //   const imageName = word;
              //   const payload = { id, url, imageName, timeStamp };
              //   dbImagesRef.add(payload);
              // });
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
