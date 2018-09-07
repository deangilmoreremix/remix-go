import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';


import Project from '../../../../lib/editor/Project';
import PropTypes from '../../../../lib/PropTypes';
import EmbedDataContainer from '../EmbedDataContainer';

const SortableItem = SortableElement(({ value }) => <li className="token-list-item">{value}</li>);

const SortableList = SortableContainer(({ items }) => (
  <ul className="tokens-list">
    {items.map((value, index) => (
      <SortableItem key={`item-${index}`} index={index} value={value} />
    ))}
  </ul>),
);

@inject('store')
@observer
export default class EmailCampaign extends Component {
  static propTypes = {
    className: PropTypes.string,
    project: PropTypes.instanceOf(Project).isRequired,
    onCampaignFinished: PropTypes.func,
  };

  constructor(props) {
    super(props);

    const { project } = props;
    this.state = {
      personalizations: project.personalizations,
    };
  }

  embedCodeGenerator = (cdnUrl) => `<!-- Start of Vidcloud Embed Code -->
<script type="application/javascript">
  var tokens = '${this.state.personalizations.join(' ')}';
  window.addEventListener("load",function(){var f=tokens.split(" "),a=document.createElement("iframe");a.style.display="none";a.name="vidcloud-embed";a.src="${cdnUrl}/api/embed-helper";document.body.appendChild(a);var b=document.forms["undefined"!==typeof formName&&formName||0];b&&(a=function(){for(var a=[],c=0,d=0;d<b.elements.length;d++){var e=b.elements[d];"hidden"!==e.type&&e.value&&f.length>c&&(a.push(f[c]+"="+encodeURIComponent(e.value)),c++)}document["vidcloud-embed"].postMessage({personalizedString:a.join("&")},
      "${cdnUrl}");return!0},b.addEventListener("submit",a),b.addEventListener("click",a))});
</script>
<!-- End of Vidcloud Embed Code -->`;

  render() {
    const { store, className, project, onCampaignFinished } = this.props;
    const { personalizations } = this.state;

    return (
      <Fragment>
        <div className={`retarget-campaign ${className}`}>
          <div className="workspace">
            <ul className="steps-list">
              <li className="list-step">
                <p className="list-step-caption">Reorder personalized tokens by dragging as they defined at your form</p>
                <SortableList
                  className="tokens-list"
                  helperClass="token-list-drag-helper"
                  items={personalizations}
                  onSortEnd={({ oldIndex, newIndex }) => {
                    this.setState({
                      personalizations: arrayMove(personalizations, oldIndex, newIndex),
                    });
                  }}
                />
              </li>
              <li className="list-step">
                <p className="list-step-caption">Copy & Paste this embed code inside the custom HTML element</p>
                <EmbedDataContainer
                  className="embed-item"
                  url={project.make.url}
                  stringGenerator={() => this.embedCodeGenerator(store.common.cdnHostname)}
                />
              </li>
            </ul>
          </div>
          <div className="controls">
            <button
              className="go-button next"
              onClick={() => { onCampaignFinished(); }}
            >
              Done
            </button>
          </div>
        </div>
      </Fragment>);
  }
}
