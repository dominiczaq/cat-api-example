import React from "react";
import InfiniteScroll from 'react-infinite-scroller';

import './style.css';

const STATUS_FETCHING = "fetching";
const STATUS_FETCHED = "fetched";
const STATUS_LOADED = "loaded";

export default class extends React.Component {
  state = {
    images: [],
    loadingState: STATUS_FETCHING
  };

  componentDidMount() {
    this.fetchBatchCats();
  }
  
  handleClick = () => {
      alert('Here we would auto scroll');
  }
  
  fetchBatchCats = () => {
    this.setState({
      loadingState: STATUS_FETCHING
    });
    fetch("https://api.thecatapi.com/v1/images/search?limit=10", {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "4bebae0d-0ec4-4787-8e77-8602741525af"
      }
    })
      .then(data => data.json())
      .then(data => {        
        this.setState({ images: data, loadingState: STATUS_FETCHED });
      });
  };
  
  updateBatchCats = () => {
      var self = this;
      fetch("https://api.thecatapi.com/v1/images/search?limit=10", {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "4bebae0d-0ec4-4787-8e77-8602741525af"
        }
      })
      .then(data => data.json())
      .then(data => {     
          var images = self.state.images;
          
          data.map((cat) => {
              images.push(cat);
          });
          
          self.setState({
              images: images
          });
      });
  }
  
  render() {
      let items = [];
      this.state.images.map((catImage, index) => {
          items.push(
              <img
                onLoad={() => {
                  this.setState({
                    loadingState: STATUS_LOADED
                  });
                }}
                style={{
                  display:
                    this.state.loadingState === STATUS_LOADED ? "inline" : "none"
                }}
                key={catImage.id}
                src={catImage.url}
                alt="Cat"
              />
          )
      })
      
      return (
          <div>
            <button onClick={this.handleClick}>AUTO</button>
              <InfiniteScroll
                className="gallery"
                pageStart={0}
                hasMore={true}
                loadMore={this.updateBatchCats}
                loader={<div className="loader" key={0}>Loading...</div>}
                threshold={50}
              >
                {items}
              </ InfiniteScroll>
          </div>
      )
  }
}
