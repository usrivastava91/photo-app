import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroller";
import ImageInfo from "../domain/ImageInfo";
import ThumbnailInfo from "../domain/ThumbnailInfo";
import { setImageInfo, setThumbnailInfo } from "../store/images/actions";
import { Container, Row, Col, Image } from "react-bootstrap";
const styles = (theme: { spacing: { unit: number } }) => ({
  root: {
    textAlign: "center",
    paddingTop: theme.spacing.unit * 20
  }
});

interface storeProps {
  Images: ImageInfo[];
  Thumbnails: ThumbnailInfo[];
}

interface actionProps {
  setImageInfo: typeof setImageInfo;
  setThumbnailInfo: typeof setThumbnailInfo;
}

interface DoodleProps extends storeProps, actionProps {}

class Doodle extends React.Component<DoodleProps> {
  state = {
    allposts: [],
    posts: [],
    hasMore: true,
    curpage: 0,
    pagesize: 30,
    totalPage: 0,
    total: 0
  };
  constructor(props: DoodleProps) {
    super(props);
  }
  componentDidMount() {
    let thumb;
    axios
      .get("https://jsonplaceholder.typicode.com/posts") //100 images
      .then((res: { data: string | any[] }) => {
        let curpage = this.state.curpage;
        let posts = res.data.slice(
          curpage * this.state.pagesize, // current page * 30 Images = 0
          (curpage + 1) * this.state.pagesize // current page+1 * 30 Images ( i.e: the next page ) = 30
        );
        this.setState({
          allposts: res.data,
          posts: posts,
          total: res.data.length,
          totalPage: Math.ceil(res.data.length / this.state.pagesize)
        });
      });
  }

  loadmoreItem = () => {
    if (this.state.curpage + 1 < this.state.totalPage) {
      let curpage =
        this.state.curpage < this.state.totalPage
          ? this.state.curpage + 1
          : this.state.curpage;
      let posts = this.state.allposts.slice(
        0,
        (curpage + 1) * this.state.pagesize
      );
      this.setState({ posts: posts, curpage });
    } else {
      this.setState({ hasMore: false });
    }
  };

  render() {
    if (this.state.posts.length === 0) return <h1>loading...</h1>;
    else {
      console.log(this.state);
      return (
        <div>
          <Table
            hasMore={this.state.hasMore}
            posts={this.state.posts}
            loadmoreItem={this.loadmoreItem}
          />
        </div>
      );
    }
  }
}

export default Doodle;

const Table = (props: any) => {
  console.log("props: ", props);
  return (
    <React.Fragment>
      <div style={{ height: "400px", overflow: "auto" }}>
        <InfiniteScroll
          pageStart={0}
          loadMore={props.loadmoreItem}
          hasMore={props.hasMore}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
          useWindow={false}
          threshold={550}
        >
          <table>
            <tr>
              <th>id</th>
              <th>title</th>
              <th>body</th>
            </tr>
            {props.posts.map((item: any) => {
              return (
                <tr>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.body}</td>
                </tr>
              );
            })}
          </table>

          {/* <Container>
            <Row>
              <Col xs={6} md={4}>
                <Image src="holder.js/171x180" rounded />
              </Col>
              <Col xs={6} md={4}>
                <Image src="holder.js/171x180" roundedCircle />
              </Col>
              <Col xs={6} md={4}>
                <Image src="holder.js/171x180" thumbnail />
              </Col>
            </Row>
          </Container> */}
          {/* <Container>
          <Row>
            {Images.map((image, index) => {
              return (
                <Col className="m-3" key={index} xs={6} md={4}>
                  <Image
                    key={index}
                    src={image.url}
                    width="193"
                    height="130"
                    rounded
                  />
                </Col>
              );
            })}
            <Col xs={6} md={4}></Col>
          </Row>
        </Container> */}
        </InfiniteScroll>
      </div>
      <button onClick={props.loadmoreItem}>next</button>
    </React.Fragment>
  );
};
