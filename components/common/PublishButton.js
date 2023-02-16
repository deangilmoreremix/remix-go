import React, { Component, Fragment } from 'react';
import SVGInline from 'react-svg-inline';
import Router from 'next/router';
import Waiter from './Waiter';
// import PropTypes from '../../lib/PropTypes';

// import SVGSearch from '../../static/images/magnifying-glass.svg';

export default class PublishButton extends Component {
    //   static propTypes = {
    //     onSearch: PropTypes.func.isRequired,
    //     placeholder: PropTypes.string,
    //   };
    constructor(props) {
        super(props)
        this.toggle = this.toggle.bind(this);
        this.state = {
            waiter: null
        }
    }

    toggle() {

    }
    //   state = {
    //     query: '',
    //   };

    //   queryHandler = (value) => {
    //     const { onSearch } = this.props;
    //     this.setState({ query: value });
    //     onSearch(value);
    //   };

    render() {
        const { activeProject, api } = this.props;
        return (
            <Fragment>
        {this.state.waiter ? <Waiter message={this.state.waiter.message} />: null}
                
            <div className='button-container'>
                <button
                    className="go-button action-button mr_15"
                    onClick={() => {
                        this.toggle()
                    }}
                >
                    Preview
                </button>
                <button
                    className="go-button action-button mr_15"
                    onClick={async () => {
                        // no need to have it working now, but who knows for future...
                        // if (activeProject.audio) {
                        //   this.setState({
                        //     waiter: {
                        //       message: 'Making your media mobile-friendly...',
                        //     },
                        //   });
                        //   const { url } = await api.mergeMedia(
                        //     activeProject.video,
                        //     activeProject.audio,
                        //   );
                        //   await activeProject.updateAudio(null);
                        //   await activeProject.updateVideo(url);
                        // }
                        this.setState({ waiter: { message: 'Saving your project...' } });
                        const savedProject = await api.publish(await api.save(activeProject));
                        Router.push({
                            pathname: '/publish',
                            query: { project: savedProject.make._id },
                        });
                        this.setState({ waiter: null });
                    }}
                >
                    Publish & Share
                </button>
            </div>
            </Fragment>
        );
    }
}

