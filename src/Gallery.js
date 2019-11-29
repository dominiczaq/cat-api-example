import React, { createRef } from "react";
import { throttle } from "underscore";
import { CAT_API_KEY } from "./config";
const STATUS_FETCHING = "fetching";
const STATUS_FETCHED = "fetched";
const STATUS_LOADED = "loaded";
const AUTO_SCROLL_TO_BOTTOM_TIMEOUT = 10000;

export default class extends React.Component {
  constructor() {
    super();

    this.state = {
      page: 0,
      limit: 10,
      order: "asc",
      images: [],
      loadedCounter: 0,
      loadingState: STATUS_FETCHING,
      error: null
    };

    this.galleryListRef = createRef();
    this.autoScrollTimeout = null;
    this.infiniteScrollHandler = throttle(this.infiniteScrollHandler, 100);
  }

  componentDidMount() {
    this.fetchCats();
    window.addEventListener("scroll", this.infiniteScrollHandler);
    window.addEventListener("resize", this.infiniteScrollHandler);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.infiniteScrollHandler);
    window.removeEventListener("resize", this.infiniteScrollHandler);
    clearTimeout(this.autoScrollTimeout);
  }

  infiniteScrollHandler = () => {
    const { loadingState } = this.state;
    if (this.galleryListRef) {
      const element = this.galleryListRef.current;
      const bounding = element.getBoundingClientRect();

      if (
        bounding.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        loadingState === STATUS_LOADED
      ) {
        this.fetchCats();
      }
    }
  };

  fetchCats = () => {
    const { limit, page, order, images } = this.state;
    this.setState({
      loadingState: STATUS_FETCHING
    });
    fetch(
      `https://api.thecatapi.com/v1/images/search?limit=${limit}&page=${page}&order=${order}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": CAT_API_KEY
        }
      }
    )
      .then(data => data.json())
      .then(data => {
        if (data && data.length > 0) {
          this.setState({
            images: [...images, ...data],
            loadingState: STATUS_FETCHED,
            page: page + 1
          });
        } else {
          this.setState({
            error: "An error occured while loading cats :(",
            loadingState: STATUS_LOADED
          });
        }
      })
      .catch(err => {
        this.setState({
          error: `Connection error occured while loading cats :(. Details: ${err}`,
          loadingState: STATUS_LOADED
        });
      });
  };

  onImageLoad = () => {
    this.setState(state => ({
      loadedCounter: state.loadedCounter + 1,
      // change loading state, when all images are loaded
      loadingState:
        state.loadedCounter + 1 === state.images.length
          ? STATUS_LOADED
          : state.loadingState
    }));
  };

  onImageError = () => {
    // We could optionally log somewhere broken images, but for now
    // just do the same as when image is loaded
    this.onImageLoad();
  };

  onAutoScrollToBottomClick = () => {
    clearTimeout(this.autoScrollTimeout);
    this.autoautoScrollTimeout = setTimeout(
      this.scrollToBottom,
      AUTO_SCROLL_TO_BOTTOM_TIMEOUT
    );
    this.setState({
      autoScrollButtonDisabled: true
    });
  };

  scrollToBottom = () => {
    if (this.galleryListRef) {
      window.scroll({
        top: this.galleryListRef.current.scrollHeight + 100,
        left: 0,
        behavior: "smooth"
      });
    }

    this.setState({
      autoScrollButtonDisabled: false
    });
  };

  render() {
    const {
      loadingState,
      images,
      page,
      limit,
      autoScrollButtonDisabled,
      error
    } = this.state;
    return (
      <div className="gallery">
        {error && <div className="error">{error}</div>}
        <ul className="gallery__list" ref={this.galleryListRef}>
          {images &&
            images.length > 0 &&
            images.map((image, index) => (
              <li className="gallery__list-item" key={image.id}>
                <img
                  onLoad={this.onImageLoad}
                  onError={this.onImageError}
                  style={{
                    display:
                      // check only newly loaded images (all already loaded stays displayed)
                      index < page * limit || loadingState === STATUS_LOADED
                        ? "inline"
                        : "none"
                  }}
                  src={image.url}
                  alt="Cat"
                />
              </li>
            ))}
        </ul>
        {loadingState !== STATUS_LOADED && (
          <div className="loader">Loading...</div>
        )}
        <button
          className="gallery__scroll-button"
          disabled={autoScrollButtonDisabled}
          onClick={this.onAutoScrollToBottomClick}
        >
          {autoScrollButtonDisabled
            ? "Auto scroll will happen soon.."
            : "Auto scroll to bottom"}
        </button>
      </div>
    );
  }
}
