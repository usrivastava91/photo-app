//domain imports
import {ImageActionsTypes} from "../../domain/Actions";
import ImageInfo from "../../domain/ImageInfo";

const SET_IMAGE_INFO = "SET_IMAGE_INFO";

export const ImageReducer = {

  setImageInfo(state: ImageInfo[] = [],action: ImageActionsTypes): ImageInfo[]{
      switch(action.type) {
          case SET_IMAGE_INFO :{
                return [...state,
                  { 
                    url: action.payload.url,
                    fileName:action.payload.fileName
                  }
                ]
          }
          default: return state;
      };
  }
};