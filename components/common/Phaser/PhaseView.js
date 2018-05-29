import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from '../../../lib/PropTypes';

@observer
export default class PhaseView extends Component {
  static propTypes = {
    elements: PropTypes.arrayOrObservableArrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      available: PropTypes.bool.isRequired,
      active: PropTypes.bool.isRequired,
    })).isRequired,
    onPhaseChanged: PropTypes.func.isRequired,
  };

  render() {
    const { elements, onPhaseChanged } = this.props;

    return (
      <div className="phase-component">
        <div className="phase-state-title">
          <div>{elements.find(item => item.active).title}</div>
        </div>
        <div className="phase-state-tabs">
          <div className="stepper">
            <div className="line" />
            {
              elements.map((element, idx) => {
                const { title: tabTitle } = element;

                return (
                  <div className={`stepper-tab-group ${(element.active ? 'active' : '')}${element.available ? '' : 'inactive'}`} key={idx} >
                    <div className="gapped">
                      <div className="phase">
                        <div
                          className="phase-label"
                          onClick={() => onPhaseChanged(element)}
                        >
                          {idx + 1}
                        </div>
                      </div>
                    </div>
                    <div className="stepper-tab-label">{tabTitle}</div>
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
