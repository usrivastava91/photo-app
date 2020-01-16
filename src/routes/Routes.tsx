import { IRoute } from "./Route";
import { Test } from "../screens/Test";
import { ImageUploader } from "../components/ImageUploader";
import { ImageDisplayGrid } from "../components/ImageDisplayGrid";
import Doodle from "../screens/doodle";
const testRoute: IRoute = {
  path: "/",
  component: Test
};

const imageUploaderRoute: IRoute = {
  path: "/upload",
  component: Doodle
};

const imageDisplayGridRoute: IRoute = {
  path: "/Photos!!",
  component: ImageDisplayGrid
};
export const Routes: IRoute[] = [
  testRoute,
  imageUploaderRoute,
  imageDisplayGridRoute
];
