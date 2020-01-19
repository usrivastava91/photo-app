import { IRoute } from "./Route";
import { Test } from "../screens/Test";
import { ImageUploader } from "../components/ImageUploader";
import { ImageDisplayGrid } from "../components/ImageDisplayGrid";
import { FullImageCarousel } from "../components/FullImageCarousel";
import Doodle from "../screens/doodle";
const testRoute: IRoute = {
  path: "/",
  component: Test
};

const imageUploaderRoute: IRoute = {
  path: "/upload",
  component: ImageUploader
};

const imageDisplayGridRoute: IRoute = {
  path: "/Photos!!",
  component: ImageDisplayGrid
};

const FullImageCarouselRoute: IRoute = {
  path: "/FullScreen",
  component: FullImageCarousel
};

export const Routes: IRoute[] = [
  testRoute,
  imageUploaderRoute,
  imageDisplayGridRoute,
  FullImageCarouselRoute
];
