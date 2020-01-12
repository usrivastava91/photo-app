import React from "react";
import {setImageInfo} from "../store/images/actions"
import { ImageUploader } from "../components/ImageUploader";
import { connect } from "react-redux";
import {ImagesStore} from "../store/images/store";
import ImageInfo  from "../domain/ImageInfo";
import ListGroup from "react-bootstrap/ListGroup";
interface storeProps { 
    Images: ImageInfo[];
}
interface ImageDisplayGridProps extends storeProps{}
const _ImageDisplayGrid: React.FC<ImageDisplayGridProps> = (props: ImageDisplayGridProps)=> {

    const { Images = [] } = props
    // console.log(images)
const handleCLick = () => {
    console.log(Images)
}
    return(
    //   <ul>
    //       {Images.map(image => {
    //           return <li> {image.url} </li>
    //       })}
    //   </ul>
      
    <div><button onClick={handleCLick}>click </button></div>
    )
}

const mapStateToProps = (state: ImagesStore) => {
    return {
        Images: state.Images
    }
}
export const ImageDisplayGrid = connect(
    mapStateToProps,
    {setImageInfo}
)(_ImageDisplayGrid)