import React from "react";

const STATUS_FETCHING = "fetching";
// const STATUS_FETCHED = "fetched";
const STATUS_LOADED = "loaded";

export default class Gallery extends React.Component {
    state = {
        loadingState: STATUS_FETCHING,
        page: 0,
        limit: 10,
        limitImagesOnPage: 100
    };

    images = [];

    componentDidMount() {
        this.fetchRandomCat();
    }

    fetchRandomCat = () => {
        if (this.images.length > (this.state.limitImagesOnPage - this.state.limit) ) {
            return;
        }
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
                this.images.push([url, id]);
            }
            
            for (let i=0; i < imagesUrl.length; i++) {
                const imgDiv = document.createElement("div");
                const img = document.createElement("img");
                imgDiv.setAttribute("key", `${imagesUrl[i][1]}`);
                imgDiv.setAttribute("class", "image-container");
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
            <div className="gallery">
                <div ref={ el => this.galleryContainer = el }>
                {this.state.loadingState !== STATUS_LOADED && (
                    <div className="loader" ref={ el => this.loader = el }>Loading...</div>
                )}
                </div>
                <button onClick={() => this.fetchRandomCat()}>Show more images</button>
            </div>
        )
    }
}