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
  // const randomWords = [
  //   "actual",
  //   "actually",
  //   "add",
  //   "addition",
  //   "additional",
  //   "adjective",
  //   "adult",
  //   "adventure",
  //   "advice",
  //   "affect",
  //   "afraid",
  //   "after",
  //   "afternoon",
  //   "again",
  //   "against",
  //   "age",
  //   "ago",
  //   "agree",
  //   "ahead",
  //   "aid",
  //   "air",
  //   "airplane",
  //   "alike",
  //   "alive",
  //   "all",
  //   "allow",
  //   "almost",
  //   "alone",
  //   "along",
  //   "aloud",
  //   "alphabet",
  //   "already",
  //   "also",
  //   "although",
  //   "am",
  //   "among",
  //   "amount",
  //   "ancient",
  //   "angle",
  //   "angry",
  //   "animal",
  //   "announced",
  //   "another",
  //   "answer",
  //   "ants",
  //   "any",
  //   "anybody",
  //   "anyone",
  //   "anything",
  //   "anyway",
  //   "anywhere",
  //   "apart",
  //   "apartment",
  //   "appearance",
  //   "apple",
  //   "applied",
  //   "appropriate",
  //   "are",
  //   "area",
  //   "arm",
  //   "army",
  //   "around",
  //   "arrange",
  //   "arrangement",
  //   "arrive",
  //   "arrow",
  //   "art",
  //   "article",
  //   "as",
  //   "aside",
  //   "ask",
  //   "asleep",
  //   "at",
  //   "ate",
  //   "atmosphere",
  //   "atom",
  //   "atomic",
  //   "attached",
  //   "attack",
  //   "attempt",
  //   "attention",
  //   "audience",
  //   "author",
  //   "automobile",
  //   "available",
  //   "average",
  //   "avoid",
  //   "aware",
  //   "away",
  //   "baby",
  //   "back",
  //   "bad",
  //   "badly",
  //   "bag",
  //   "balance",
  //   "ball",
  //   "balloon",
  //   "band",
  //   "bank",
  //   "bar",
  //   "bare"
  // ];

  let images: File[] = [];
  const history = useHistory();
  const handleOnChange = (e: any) => {
    [...images] = [...e.target.files];
    debugger;
    resizeThumbnail(200);
  };

  const resizeThumbnail = (max: number) => {
    let data;
    debugger;
    if (images) {
      var reader = new FileReader();
      reader.onload = function(event) {
        var img = new Image();
        img.onload = function() {
          if (img.width > max) {
            var oc = document.createElement("canvas"),
              octx = oc.getContext("2d")!;
            oc.width = img.width;
            oc.height = img.height;
            octx.drawImage(img, 0, 0);
            if (img.width > img.height) {
              oc.height = (img.height / img.width) * max;
              oc.width = max;
            } else {
              oc.width = (img.width / img.height) * max;
              oc.height = max;
            }
            octx.drawImage(oc, 0, 0, oc.width, oc.height);
            octx.drawImage(img, 0, 0, oc.width, oc.height);
            data = oc.toDataURL();
            debugger;
          }
        };
        // img.src = event.target.result;
      };
      reader.readAsDataURL(images[0]);
    }
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
