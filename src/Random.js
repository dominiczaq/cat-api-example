import React from "react";

const STATUS_FETCHING = "fetching";
const STATUS_FETCHED = "fetched";
const STATUS_LOADED = "loaded";

export default class extends React.Component {
  state = {
    image: null,
    loadingState: STATUS_FETCHING
  };

  componentDidMount() {
    this.fetchRandomCat();
  }

  fetchRandomCat = () => {
    this.setState({
      loadingState: STATUS_FETCHING
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
        this.setState({ image: url, loadingState: STATUS_FETCHED });
      });
  };

  render() {
    return (
      <div className="random">
        <div>
          <button onClick={this.fetchRandomCat}>Get random cat!</button>
        </div>
        <div>
          {this.state.loadingState !== STATUS_LOADED && (
            <div className="loader">Loading...</div>
          )}
          {this.state.loadingState !== STATUS_FETCHING && this.state.image ? (
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
