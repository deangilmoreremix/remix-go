import React, { Component, Fragment } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';

import CTAGallery from 'react-masonry-infinite';

import Waiter from '../../../common/Waiter';
import PropTypes from '../../../../lib/PropTypes';
import InfiniteLoading from '../../../common/InfiniteLoading';
import Search from '../../../common/Search';
import CTAItem from '../call-to-actions/CTAItem';
import ImageLTItem from '../imageLT/ImageLTItem';
import EmbeddedPlayback from '../../../common/EmbeddedPlayback';

@inject('api')
@observer
export default class EndScreens extends Component {
  static propTypes = {
    className: PropTypes.string,
    onCtaSelected: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeItem: "",
      hasMore: true,
      elements: [],
      query: '',
      waiter: null,
    };
  }

  onSearch = async (query) => {
    this.setState({ elements: [] });
    const { api } = this.props;
    const newElements = await api.endScreens(0, query);
   
    this.setState({
      elements: newElements,
      hasMore: newElements.length > 0,
      query,
    });
  };

  @observable
  currentPlayback = null;

  loadMore = async () => {
    const { api } = this.props;
    const { elements } = this.state;
    const { query } = this.state;
    const newElements = await api.endScreens(elements.length, query);
    if (newElements.length && this.state.activeItem == "") {
      this.setState({
        activeItem: newElements[0]
      })
    }
    this.setState({
      elements: elements.concat(newElements),
      hasMore: newElements.length > 0,
      query,
    });
  };

  render() {
    const { className } = this.props;
    const { waiter } = this.state;

    return (
      <Fragment>
        <div className={className}>

          <CTAGallery
            className={'image-lt-items'}
            useWindow={false}
            hasMore={this.state.hasMore}
            loader={<InfiniteLoading key="loader" />}
            loadMore={this.loadMore}
          // sizes={[
          //   { columns: 1, gutter: 30 },
          //   { mq: '512px', columns: 2, gutter: 30 },
          //   { mq: '768px', columns: 3, gutter: 30 },
          //   { mq: '1024px', columns: 4, gutter: 30 },
          //   { mq: '1536px', columns: 5, gutter: 30 },
          // ]}
          >
            {console.log(this.state.elements, "this.state.elements")}
            {/* <div className='image-lt-gallry'> */}
            {
              this.state.elements.map((item, idx) => (
                <ImageLTItem
                  key={idx}
                  cta={item}
                  onClick={(cta) => this.setState({ activeItem: cta })}
                  activeItem={this.state.activeItem}
                // onUse={(cta) => {
                //   this.setState({ waiter: { message: 'Loading CTA...' } });
                //   const { onCtaSelected } = this.props;
                //   this.setState({activeItem:cta});
                //   onCtaSelected(cta);
                // }}
                />
              ))
            }
            {/* </div> */}
            {/* <div>
           
          
   
        </div> */}
          </CTAGallery>
          Preview
          <div className='image-lt-preview'>
            <EmbeddedPlayback source={this.state.activeItem.contenturl}
              className={'preview-video'}
              playerUrl={this.state.activeItem.contenturl}
              title={this.state.activeItem.title}
              width="840"
              height="480" />
          </div>
          <button onClick={() => {
            this.setState({ waiter: { message: 'Loading CTA...' } });
            this.props.onCtaSelected(this.state.activeItem)
          }
          }>Use</button>
        </div>
      </Fragment>);
  }
}
