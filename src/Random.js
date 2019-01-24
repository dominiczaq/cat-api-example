import React from "react";

import { STATUS } from './constants';

export default class extends React.Component {
  state = {
    image: null,
    loadingState: STATUS.FETCHING
  };

  componentDidMount() {
    this.fetchRandomCat();
  }

  fetchRandomCat = () => {
    this.setState({
      loadingState: STATUS.FETCHING
    });
    fetch("https://api.thecatapi.com/v1/images/search", {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "4bebae0d-0ec4-4787-8e77-8602741525af"
      }
    })
      .then(data => data.json())
      .then(data => {
        const { url } = data[0];
        this.setState({ image: url, loadingState: STATUS.FETCHED });
      });
  };

  render() {
    return (
      <div className="random">
        <div>
          <button onClick={this.fetchRandomCat}>Get random cat!</button>
        </div>
        <div>
          {this.state.loadingState !== STATUS.LOADED && (
            <div className="loader">Loading...</div>
          )}
          {this.state.loadingState !== STATUS.FETCHING && this.state.image ? (
            <img
              onLoad={() => {
                this.setState({
                  loadingState: STATUS.LOADED
                });
              }}
              style={{
                display:
                  this.state.loadingState === STATUS.LOADED ? "inline" : "none"
              }}
              key={this.state.image}
              src={this.state.image}
              alt="Cat"
            />
          ) : null}
        </div>
      </div>
    );
  }
}
