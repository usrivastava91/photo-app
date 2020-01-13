import React from "react";
import ImageInfo from "../domain/ImageInfo"
import {setImageInfo} from "../store/images/actions"
import { connect } from "react-redux";
import {ImagesStore} from "../store/images/store";
import { storage , fire } from "../fire";
import { useHistory } from "react-router-dom";

interface actionProps {
    setImageInfo: typeof setImageInfo
}

interface ImageUploaderProps extends actionProps {};

const _ImageUploader:React.FC<ImageUploaderProps> = (props:ImageUploaderProps)=>{

    const { setImageInfo } = props;
    let images:File[] = [];
    const history = useHistory();
    const handleOnChange = (e:any) => {
        [...images] = [...e.target.files]
        // console.log(images)
    }
    const uploadImages = () => {
        const db = fire.firestore();
        db.settings({
            timestampsInSnapshots: true
          });
        const dbImagesRef = db.collection('Images')
        images.forEach((image: any) => {
            const imageName = image.name;
            const uploadTask = storage.ref(`images/${imageName}`).put(image);
            uploadTask.on('state_changed',
                (snapshot) => {
                    //progress function
                    const progress = (snapshot.bytesTransferred/snapshot.totalBytes * 100) + "%";
                    console.log(progress)
                },
                (error) => {
                    //error function
                    console.log(error)
                },
                () => {
                    //complete function

                    storage.ref('images').child(image.name).getDownloadURL()
                    .then(
                        url => {
                            const payload = { url, imageName }
                            setImageInfo(payload);
                            dbImagesRef.add(payload);
                        }
                    )
                }
            )
        })
       
    }
    const routeToDisplay = () => {
        
        history.push("/");
    }
    return(
        <div>
            <input type="file" onChange={handleOnChange} multiple/>
            <button onClick = {uploadImages}> upload</button>
            <button onClick={routeToDisplay}>Back to display</button>
        </div>
    )
}

const mapStateToProps = (state: ImagesStore) => {
    return {}
}
export const ImageUploader = connect(
    mapStateToProps,
    {setImageInfo}
)(_ImageUploader)