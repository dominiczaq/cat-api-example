import React, { Component } from 'react'
import { STATUS } from './constants';
import { setTimeout } from 'timers';

class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cats: [],
            loadingState: STATUS.FETCHING,
            autoScroll: false,
        }

        this.setScroll = this.setScroll.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.handlecheckbox = this.handlecheckbox.bind(this);
        this.fetchCatsCollection = this.fetchCatsCollection.bind(this);
    };

    componentDidMount() {
        this.fetchCatsCollection();
        window.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount(){
        
    }

    scrollToBottom() {
        this.pageEnd.scrollIntoView({ behavior: "smooth" });
    }

    handleScroll(e) {
        if (Math.floor(e.target.scrollingElement.scrollHeight - e.target.scrollingElement.scrollTop) === e.target.scrollingElement.clientHeight) {
            this.fetchCatsCollection()
        }
    }

    fetchCatsCollection() {
        this.setState({ loadingState: STATUS.FETCHING })
        fetch("https://api.thecatapi.com/v1/images/search?limit=10", {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "4bebae0d-0ec4-4787-8e77-8602741525af"
            }
        })
            .then(data => data.json())
            .then(data => {
                data.map(item => {
                    const { url } = item;
                    this.setState({ cats: this.state.cats.concat(url), loadingState: STATUS.FETCHED });
                })
            });
    }

    handlecheckbox(e) {
        this.setState({ autoScroll: e.target.checked }, () => {
            this.setScroll()
        })
    }

    setScroll() {
        if (this.state.autoScroll) {
            setTimeout(() => {
                this.pageEnd.scrollIntoView({ behavior: "smooth" });
            }, 10 * 1000)
        }
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    Autoscroll <input type='checkbox' onChange={this.handlecheckbox} />
                    <div className='photos'>
                        {this.state.cats.map(cat => {
                            return < img
                                style={{
                                    display:
                                        this.state.loadingState === STATUS.FETCHED ? "inline" : "none"
                                }}
                                key={cat}
                                src={cat}
                                alt="Cat"
                            />
                        })}
                    </div>
                    {this.state.loadingState === STATUS.FETCHING && <div className="loader">Loading...</div>}
                </div>
                <div ref={(el) => { this.pageEnd = el; }}>
                </div>
            </React.Fragment >
        )
    }

}

export default Gallery;