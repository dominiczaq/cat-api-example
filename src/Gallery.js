import React from "react";
import Cat from "./Cat";
const debounce = require('./util.js').debounce;

export default class extends React.Component {
    state = {
        batchSize: 10,
        catsArray: []
    };

    galleryScroll = React.createRef();

    componentDidMount() {
        this.fetchMeTheCats();
        document.querySelector(".gallery__container").addEventListener('scroll', debounce(this.trackScrolling));
    }

    trackScrolling = () => {
        if (this.galleryScroll.current.scrollTop + this.galleryScroll.current.clientHeight >= this.galleryScroll.current.scrollHeight) {
            this.fetchMeTheCats();
        }
    };

    fetchMeTheCats = () => {
        fetch("https://api.thecatapi.com/v1/images/search?limit=" + this.state.batchSize, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "4bebae0d-0ec4-4787-8e77-8602741525af"
            }
        })
            .then(data => data.json())
            .then(data => {
                this.setState({catsArray: this.state.catsArray.concat(data)})
            });
    };

    render() {
        return (
            <div className="gallery">
                <div ref={this.galleryScroll}   className="gallery__container">
                    {this.state.catsArray.map(cat =>
                        <Cat key={cat.id + Math.random().toString(36).substring(7)} url={cat.url}/>
                    )}
                </div>
            </div>
        );
    }
}
