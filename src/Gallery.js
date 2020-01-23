import React from "react";

const STATUS_FETCHING = "fetching";
const STATUS_LOADED = "loaded";

export default class Gallery extends React.Component {
  state = {
      loadingState: null,
      page: 0,
      limit: 10,
      limitImagesOnPage: 100,
      isScrollbarVisible: false,
      isMobile: false
  };

  images = 0;

  componentDidMount() {
    this.fetchRandomCat();
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.screenWidth);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll); 
    window.removeEventListener("resize", this.screenWidth); 
  }

  handleScroll = () => {
    if ( (window.scrollY + window.innerHeight) === document.body.offsetHeight ) {
      if (this.state.loadingState !== STATUS_FETCHING) {
        this.fetchRandomCat();
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

  fetchRandomCat = () => {
    if (this.images > (this.state.limitImagesOnPage - this.state.limit) ) {
      return;
    }
    const { limit, page } = this.state;
    this.setState({
      loadingState: STATUS_FETCHING
    });
    fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}&page=${page}&order=ASC`, {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "4bebae0d-0ec4-4787-8e77-8602741525af"
    }
    })
    .then(data => data.json())
    .then(data => {
      const imagesUrl = [];
      for (let i=0; i < data.length; i++) {
        const { url, id, width, height } = data[i];
        imagesUrl.push([url, id, width, height]);
        this.images += 1;
      }
      // console.log(this.images)
      this.screenWidth();
      for (let i=0; i < imagesUrl.length; i++) {
        const imgWidth = imagesUrl[i][2];
        const imgHeight = imagesUrl[i][3];
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
        imgDiv.setAttribute("key", `${imagesUrl[i][1]}`);
        imgDiv.setAttribute("class", "image-container");
        imgDiv.setAttribute("style", `width: ${width}px; height: ${height}px`);
        img.setAttribute("class", "image");
        img.setAttribute("src", `${imagesUrl[i][0]}`);
        img.setAttribute("alt", `cat-${imagesUrl[i][1]}`);
        imgDiv.appendChild(img);
        this.galleryContainer.insertBefore(imgDiv, this.loader);
      }
      this.setState({
        loadingState: STATUS_LOADED,
        page: this.state.page + 1
      });
    });
  };

  render() {
    return (
      <div className="gallery-container">
        <div className="gallery" ref={ el => this.galleryContainer = el }>
        {this.state.loadingState !== STATUS_LOADED && (
            <div className="loader" ref={ el => this.loader = el }>Loading...</div>
        )}
        </div>
        {!this.state.isScrollbarVisible ? (
            <button className="load-more-button" onClick={() => this.fetchRandomCat()}>Show more images</button>
        ) : <div style={{height: 50}}></div> }
      </div>
    );
  }
}