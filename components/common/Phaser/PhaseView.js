import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from '../../../lib/PropTypes';
import SVGInline from 'react-svg-inline';
import { Progress } from 'reactstrap';

@observer
export default class PhaseView extends Component {
  static propTypes = {
    elements: PropTypes.arrayOrObservableArrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      available: PropTypes.bool,
      active: PropTypes.bool.isRequired,
    })).isRequired,
    onPhaseChanged: PropTypes.func.isRequired,
  };
 
  render() {
    const { elements, onPhaseChanged } = this.props;

    return (
      <div className="phase-component">
        {/* <div className="phase-state-title">
          <div>{elements.find(item => item.active).title}</div>
        </div> */}
        <div className="phase-state-tabs">
          <div className="stepper">
            <Progress  color={'red'} value={elements.find(item => item.active).val} />
            {
              elements.map((element, idx) => {
                const { title: tabTitle } = element;
                const activeEleIndex = elements.findIndex(ele => ele.active)
                return (
                  <div className={`stepper-tab-group ${(idx <= activeEleIndex  ? 'active' : '')}${element.available ? '' : 'inactive'}`} key={idx} >
                    <div className="gapped">
                      <div
                        onClick={() => onPhaseChanged(element)}
                      >
                        <SVGInline svg={element.image} />
                      </div>
                      <div className="stepper-tab-label">{tabTitle}</div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}
