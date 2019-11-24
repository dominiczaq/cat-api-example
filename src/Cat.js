import React from "react";

export default class extends React.Component {
    render() {
        return (
            <div>
                <img
                    onLoad={() => {
                        console.log("meow!")
                    }}
                    style={{
                        display:
                            this.props.url === null ? "none" : "inline"
                    }}
                    key={this.props.id}
                    src={this.props.url}
                    alt={this.props.name}
                />
            </div>
        );
    }

}