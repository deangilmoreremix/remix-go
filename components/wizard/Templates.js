import React, {Component, Fragment} from 'react';
import {inject, observer} from 'mobx-react';

import Masonry from 'react-masonry-infinite';
import shortid from 'shortid';

import TemplateItem from './templates/TemplateItem';
import InfiniteLoading from '../common/InfiniteLoading';

@inject('store')
@observer
export default class Templates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasMore: true,
      elements: [],
    };
  }

  colors = ['#EC407A', '#EF5350', '#AB47BC', '#7E57C2', '#5C6BC0', '#42A5F5', '#29B6F6', '#26C6DA', '#26A69A', '#66BB6A', '#9CCC65', '#827717', '#EF6C00'];

  heights = [200];

  getRandomElement = array => array[Math.floor(Math.random() * array.length)];

  generateElements = () => [...Array(10).keys()].map(() => ({
    key: shortid.generate(),
    color: this.getRandomElement(this.colors),
    height: `${this.getRandomElement(this.heights)}px`,
  }));

  loadMore = () => setTimeout(() => this.setState(state => ({
    elements: state.elements.concat(this.generateElements()),
  })), 2500);

  render() {
    return <Fragment>
      <Masonry
        className="masonry"
        hasMore={this.state.hasMore}
        loader={<InfiniteLoading />}
        loadMore={this.loadMore}
      >
        {
          this.state.elements.map(({ key, color, height }, i) => (
            <TemplateItem key={key} className="card" color={color} height={height}/>
          ))
        }
      </Masonry>
    </Fragment>;
  }
}
