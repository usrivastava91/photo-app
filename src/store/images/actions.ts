//domain imports
import ImageInfo from "../../domain/ImageInfo";
import { ImageActionsTypes } from "../../domain/Actions"

const SET_IMAGE_INFO = "SET_IMAGE_INFO";


export function setImageInfo(ImageInfo: ImageInfo) : ImageActionsTypes{
    return {
        type: SET_IMAGE_INFO,
        payload: ImageInfo

    }    
}