import React from "react";

const STATUS_FETCHING = "fetching";
// const STATUS_FETCHED = "fetched";
const STATUS_LOADED = "loaded";

export default class Gallery extends React.Component {
    state = {
        images: null,
        loadingState: STATUS_FETCHING,
        page: 0,
        limit: 10
    };

    componentDidMount() {
        this.fetchRandomCat();
    }

    fetchRandomCat = () => {
        const { limit, page } = this.state;
        this.setState({
        loadingState: STATUS_FETCHING
        });
        fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}&order=ASC&page=${page}`, {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "4bebae0d-0ec4-4787-8e77-8602741525af"
        }
        })
        .then(data => data.json())
        .then(data => {
            const imagesUrl = [];
            for (let i=0; i < data.length; i++) {
                const { url, id } = data[i];
                imagesUrl.push([url, id]);
            }
            console.log(imagesUrl)
            this.setState({
                images: imagesUrl,
                loadingState: STATUS_LOADED,
                page: this.state.page + 1
            });
        });
    };

    render() {
        console.log(this.state.images)
        let images = [];
        if (this.state.images) {
            images = this.state.images.map( image => {
                return (
                    <img
                        style={{
                            width: 'auto', height: 200,
                            display:
                            this.state.loadingState === STATUS_LOADED ? "inline" : "none"
                        }}
                        key={image[1]}
                        src={image[0]}
                        alt="Cat"
                    />
                );
            });
        }
        
        return (
            <div className="gallery">
                <div>
                {this.state.loadingState !== STATUS_LOADED && (
                    <div className="loader">Loading...</div>
                )}
                {this.state.loadingState !== STATUS_FETCHING && this.state.images ? (
                    images
                ) : null}
                </div>
                <button onClick={() => this.fetchRandomCat()}>Show more images</button>
            </div>
        )
    }
}