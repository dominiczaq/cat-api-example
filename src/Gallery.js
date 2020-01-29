import React from "react";

const STATUS_FETCHING = "fetching";
const STATUS_LOADED = "loaded";

export default class Gallery extends React.Component {
  state = {
      loadingState: null,
      images: [],
      page: 0,
      loadLimit: 10,
      limitImagesOnPage: 1500,
      isScrollbarVisible: false,
      isMobile: false,
  };

  componentDidMount() {
    const loadImagesAtStart = () => {
      if (window.innerHeight > document.body.offsetHeight) {
        this.fetchRandomCat();
      } 
      if (window.innerHeight < document.body.offsetHeight) {
        clearInterval(interval);
        this.setState({isScrollbarVisible: true});
      }
    }
    const interval = setInterval(loadImagesAtStart, 500);
    this.screenWidth();
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.screenWidth);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.screenWidth); 
  }

  handleScroll = () => {
    if ( (window.scrollY + window.innerHeight) >= document.body.offsetHeight ) {
      if (this.state.loadingState !== STATUS_FETCHING) {
        this.fetchRandomCat();
      } 
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

  autoScrollToBottom = () => {
    const date = new Date();
    const scrollingTime = 10000;
    const endTime = date.getTime() + scrollingTime;
    const startScrolling = (images = this.loadedImages, limitImages = this.state.limitImagesOnPage) => {
      // if scrollbar is not visible, then load more images; if is visible, then scroll to bottom, which fires loading more images
      if (!this.state.isScrollbarVisible) {
        this.fetchRandomCat();
      } 
      window.scrollTo({
        top: document.body.offsetHeight,
        behavior: 'smooth'
      });
      // clear interval
      const newDate = new Date();
      const currentTime = newDate.getTime();
      if (this.galleryContainer === null) {
        clearInterval(interval);
      }
      if (currentTime >= endTime) {
        clearInterval(interval);
        window.scrollTo({
          top: (this.galleryContainer.offsetTop + this.galleryContainer.getBoundingClientRect().height) - window.innerHeight,
          behavior: 'smooth'
        });
      }
    }
    const interval = setInterval(startScrolling, 1000);
  }

  fetchRandomCat = () => {
    if (this.state.images.length > (this.state.limitImagesOnPage) ) {
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
      const newImages = [];
      for (let i=0; i < data.length; i++) {
        const { url, id, width, height } = data[i];
        newImages.push([url, id, width, height]);
      }
      this.setState({
        page: this.state.page + 1,
        images: [...this.state.images, ...newImages],
        loadingState: STATUS_LOADED,
      });
    });
  };

  render() {
    const displayImages = this.state.images.map( (image, index) => {
      const imgWidth = image[2];
      const imgHeight = image[3];
      let ratio = imgWidth / imgHeight;
      let height = 200;
      let width = Math.round(200 * ratio);
      if (this.state.isMobile) {
        ratio = imgHeight / imgWidth;
        width = 300;
        height = Math.round(300 * ratio);
      };
      return (
        <div className="image-container" key={image[1]+index} style={{width: width, height: height}}>
          <img src={image[0]} alt={"cat-"+image[1]} className="image"/>
        </div>
      )
    });

    return (
      <div className="gallery-container">
        <div className="scroll-to-bottom-button-container">
          <button className="scroll-to-bottom-button" onClick={() => this.autoScrollToBottom()} title='Lazy scroll button is dedicated to my husband - CLT  :)'>Automatically Scroll Gallery</button>
        </div>
        <div className="gallery" ref={el => this.galleryContainer = el}>
          {displayImages}
        </div>
        <div className="loader-container">
          {this.state.loadingState !== STATUS_LOADED && (
            <div className="loader">Loading...</div>
          )}
        </div>
      </div>
    );
  }
}