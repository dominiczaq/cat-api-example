import React from "react";
import CatContainer from "./CatContainer";



export default class Gallery extends React.Component {
  state = {
    cats: 10,
    autoscroll: false
  };
  
  componentDidMount(){
    window.addEventListener('scroll', this.handleScroll);
  };
  componentWillUnmount(){
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    if (Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight-50) 
      this.loadMore();
  };

  makeCats() {
    let cats = [];
    for (let i=0;i<this.state.cats;i++){
      cats.push(<CatContainer key = {i} isButton = {false} ></CatContainer>);
    }
    return cats;
  }

  loadMore() {
      this.setState({ cats: this.state.cats+ 10})
  }

  changeAutoscroll = () => {
    this.setState ({
      autoscroll: !this.state.autoscroll
    }, () =>this.scrollBottomHandler() );
  }

  scrollBottomHandler() {
    if(this.state.autoscroll){
      document.body.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest"
      });
        setTimeout(() => {this.scrollBottomHandler()}, 10000)
    } else {
      clearTimeout();
    }
  };

  render() {
    return (
      <div className = 'gallery'>
          <div className='autoscroll'>
            <button onClick={this.changeAutoscroll} 
              className={this.state.autoscroll?'btn-green':'btn-red'}>
              {this.state.autoscroll?'Enable':'Disable'}
            </button>
            <p>Autoscroll</p>
          </div>
          <div onScroll={this.handleScroll}>
          {this.makeCats()}
          </div>
      </div>

    );
  }
}
