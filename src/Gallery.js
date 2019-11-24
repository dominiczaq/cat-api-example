import React from "react";
import Cat from "./Cat";

export default class extends React.Component {
    state = {
        batchSize: 10,
        catsArray: []
    };

    componentDidMount() {
        this.fetchMeTheCats();
    }

    populateTheCatArray = (element, index, array) => {
        this.state.catsArray.push(<Cat key={element.id} url={element.url}/>)
    }

    fetchMeTheCats = () => {
        this.setState({
            loadingState: STATUS_FETCHING
        });
        fetch("https://api.thecatapi.com/v1/images/search?limit=" + this.state.batchSize, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "4bebae0d-0ec4-4787-8e77-8602741525af"
            }
        })
            .then(data => data.json())
            .then(data => {
                data.forEach(this.populateTheCatArray);
            });
    };

    render() {
        return (
            <div className="gallery">

                <div className="gallery__container">
                    {this.state.catsArray.map(cat => (cat))}
                </div>
            </div>
        );
    }
}
