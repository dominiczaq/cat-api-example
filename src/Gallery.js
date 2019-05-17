import React from "react";

export default class extends React.Component {
  state = {
    images: []
  };
  
  loaderElem = React.createRef();

  componentDidMount() {
    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.fetchBatchCats();
            }
        });
    }, {
        threshold: .25
    }).observe(this.loaderElem.current);
  }
  
  fetchBatchCats = () => {
    fetch(`https://api.thecatapi.com/v1/images/search?limit=${this.props.number}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "4bebae0d-0ec4-4787-8e77-8602741525af"
      }
    })
    .then(data => data.json())
    .then(data => {        
        this.setState({ images: [...this.state.images, ...data] });
    });
  };
  
  render() {
      return (
          <div className='gallery'>
            {this.state.images.map((cat, index) => {
                return (
                    <div key={cat.id}>
                        <div>{index+1}</div>
                        <img
                          src={cat.url}
                          alt="Cat"
                        />
                    </div>
                )
            })}
            <div className="loader" ref={this.loaderElem}>Loading...</div>
          </div>
      );
  }
}
