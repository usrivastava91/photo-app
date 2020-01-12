import React from "react";
import { ImageUploader } from "../components/ImageUploader";
import { ImageDisplayGrid } from "../components/ImageDisplayGrid";
import { Route } from "react-router";
import { useHistory } from "react-router-dom";

interface TestProps {};

export const Test :React.FC<TestProps>= (props: TestProps)=>{
    const history = useHistory();

    const routeToUploader =() => {
        history.push("/upload");
    }
    return(
        <div>
                <button onClick={routeToUploader}>Upload images</button>
                <Route component = {ImageDisplayGrid}></Route>
        </div>

    )
}

