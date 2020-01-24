import React from "react";

const STATUS_FETCHING = "fetching";
const STATUS_LOADED = "loaded";

export default class Gallery extends React.Component {
  state = {
      loadingState: null,
      page: 0,
      loadLimit: 50,
      displayLimit: 10,
      limitImagesOnPage: 1000,
      isScrollbarVisible: false,
      isMobile: false,
      isFirstLoad: true
  };

  images = [];
  loadedImages = 0;

  componentDidMount() {
    this.fetchRandomCat();
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.screenWidth);
    this.setState({loadLimit: this.state.displayLimit})
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.screenWidth); 
  }

  handleScroll = () => {
    if ( (window.scrollY + window.innerHeight) >= document.body.offsetHeight - 400 ) {
      if (this.state.loadingState !== STATUS_FETCHING) {
        this.fetchRandomCat();
        this.loadImages();
      } 
    }
    if (!this.state.isScrollbarVisible && window.pageYOffset > 0) {
      this.setState({isScrollbarVisible: true});
    }
  }

  screenWidth = () => {
    if (window.innerWidth < 600 && !this.state.isMobile) {
      this.setState({isMobile: true});
    }
    if (window.innerWidth > 600 && this.state.isMobile) {
      this.setState({isMobile: false});
    }
  }

  autosSrollToBottom = () => {
    this.setState({limitImagesOnPage: 110})
    const startScrolling = (images = this.loadedImages, limitImages = this.state.limitImagesOnPage) => {
      if (!this.state.isScrollbarVisible) {
        this.fetchRandomCat();
        this.loadImages();
      } 
      window.scrollTo({
        top: document.body.offsetHeight - 400,
        behavior: 'smooth'
      });
      // console.log(images)
      if (images >= limitImages) {
        clearInterval(interval);
        window.scrollTo({
          top: document.body.offsetHeight,
          behavior: 'smooth'
        });
      }
    }
    const interval = setInterval(startScrolling, 1000);
  }

  fetchRandomCat = () => {
    if (this.images.length > (this.state.limitImagesOnPage - this.state.loadLimit) ) {
      return;
    }
    const { loadLimit , page } = this.state;
    this.setState({
      loadingState: STATUS_FETCHING
    });
    fetch(`https://api.thecatapi.com/v1/images/search?limit=${loadLimit}&page=${page}`, {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "4bebae0d-0ec4-4787-8e77-8602741525af"
    }
    })
    .then(data => data.json())
    .then(data => {
      for (let i=0; i < data.length; i++) {
        const { url, id, width, height } = data[i];
        this.images.push([url, id, width, height]);
      }
      if (this.state.isFirstLoad) {
        this.loadImages();
      }
      this.setState({
        page: this.state.page + 1,
        isFirstLoad: false,
      });
    });
  };

  loadImages = () => {
    if (this.loadedImages >= this.state.limitImagesOnPage ) {
      return;
    }
    this.screenWidth();
    const loadedImages = this.loadedImages;
    const imagesData = this.images;
    for (let i=loadedImages; i < loadedImages + this.state.displayLimit; i++) {
      const imgWidth = imagesData[i][2];
      const imgHeight = imagesData[i][3];
      let ratio = imgWidth / imgHeight;
      let height = 200;
      let width = Math.round(200 * ratio);
      if (this.state.isMobile) {
        ratio = imgHeight / imgWidth;
        width = 300;
        height = Math.round(300 * ratio);
      };
      const imgDiv = document.createElement("div");
      const img = document.createElement("img");
      imgDiv.setAttribute("key", `${imagesData[i][1]}`);
      imgDiv.setAttribute("class", "image-container");
      imgDiv.setAttribute("style", `width: ${width}px; height: ${height}px`);
      img.setAttribute("class", "image");
      img.setAttribute("src", `${imagesData[i][0]}`);
      img.setAttribute("alt", `cat-${imagesData[i][1]}`);
      imgDiv.appendChild(img);
      this.galleryContainer.insertBefore(imgDiv, this.loader);
    }
    this.loadedImages += this.state.displayLimit;
    this.setState({
      loadingState: STATUS_LOADED,
    });
    console.log('loaded/displayed ', this.images.length, this.loadedImages)
  }

  render() {
    return (
      <div className="gallery-container">
        <div className="scroll-to-bottom-button-container">
          <button className="scroll-to-bottom-button" onClick={() => this.autosSrollToBottom()}>Automatically Scroll Gallery</button>
        </div>
        <div className="gallery" ref={ el => this.galleryContainer = el }>
        {this.state.loadingState !== STATUS_LOADED && (
            <div className="loader" ref={ el => this.loader = el }>Loading...</div>
        )}
        </div>
        {!this.state.isScrollbarVisible && this.state.loadingState === STATUS_LOADED ? (
            <button className="load-more-button" onClick={() => {this.fetchRandomCat(); this.loadImages()}}>Show more images</button>
        ) : <div style={{height: 50}}></div> }
      </div>
    );
  }
}