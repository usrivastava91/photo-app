import { IRoute } from "./Route";
import { Home } from "../screens/Home";
import { ImageUploader } from "../components/ImageUploader";
import { ImageDisplayGrid } from "../components/ImageDisplayGrid";
import { FullImageCarousel } from "../components/FullImageCarousel";
const HomeRoute: IRoute = {
  path: "/",
  component: Home
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
  HomeRoute,
  imageUploaderRoute,
  imageDisplayGridRoute,
  FullImageCarouselRoute
];
