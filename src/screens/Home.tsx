import React from "react";
import { ImageUploader } from "../components/ImageUploader";
import { ImageDisplayGrid } from "../components/ImageDisplayGrid";
import { Route } from "react-router";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./home.css";
interface HomeProps {}

export const Home: React.FC<HomeProps> = (props: HomeProps) => {
  const history = useHistory();

  const routeToUploader = () => {
    history.push("/upload");
  };
  return (
    <div className="home">
      <Route component={ImageDisplayGrid}></Route>
      <i
        onClick={routeToUploader}
        className="fa fa-upload fa-2x upload-btn"
        aria-hidden="true"
      ></i>
    </div>
  );
};
