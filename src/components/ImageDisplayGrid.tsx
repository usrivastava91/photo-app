import React from "react";
import {setImageInfo} from "../store/images/actions"
import { ImageUploader } from "../components/ImageUploader";
import { connect } from "react-redux";
import {ImagesStore} from "../store/images/store";
import ImageInfo  from "../domain/ImageInfo";
import { storage, fire } from "../fire";
import {Container,Row,Col,Image} from "react-bootstrap";
interface storeProps { 
    Images: ImageInfo[];
}
interface ImageDisplayGridProps extends storeProps{}
class _ImageDisplayGrid extends React.Component<ImageDisplayGridProps>{
    constructor(props: ImageDisplayGridProps) {
        super(props);
    }
    componentDidMount() {
        const db = fire.firestore();
        db.collection("Images").get()
        .then((querySnapshot) => {
            querySnapshot.forEach( doc => {
                let data = doc.data()
                const url = data.url;
                const imageName = data.imageName;
                const payload = {url, imageName}
                console.log(payload)
                setImageInfo(payload);
            })
        })
    }
   
    render() {
        const { Images = []} = this.props;
        return( 
            <Container>
                <Row>
                    {Images.forEach(image => {
                        return  (<Col xs={6} md={4}>
                                    <Image src={image.url} rounded />
                                </Col>)
                    })}
                    <Col xs={6} md={4}>
                    
                    </Col>
                </Row>
            </Container>
        )
    }

}
const mapStateToProps = (state: ImagesStore) => {
    return {
        Images: state.setImageInfo
    }
}
export const ImageDisplayGrid = connect(
    mapStateToProps,
    {setImageInfo}
)(_ImageDisplayGrid)