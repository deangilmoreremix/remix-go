import React, { Component, Fragment } from 'react';
import ReactTooltip from 'react-tooltip';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';


import Project from '../../../../lib/editor/Project';
import PropTypes from '../../../../lib/PropTypes';
import EmbedDataContainer from '../EmbedDataContainer';

const SortableItem = SortableElement(({ value }) => <li>{value}</li>);

const SortableList = SortableContainer(({ items }) => (
  <ul>
    {items.map((value, index) => (
      <SortableItem key={`item-${index}`} index={index} value={value} />
    ))}
  </ul>),
);

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

  embedCodeGenerator = () => `<!-- Start of Vidcloud Embed Code -->
<script type="application/javascript">
  var tokens = '${this.state.personalizations.join(' ')}';
  window.addEventListener("load",function(){var f=tokens.split(" "),a=document.createElement("iframe");a.style.display="none";a.name="vidcloud-embed";a.src="https://cdn.vidcloud.io/api/embed-helper";document.body.appendChild(a);var b=document.forms["undefined"!==typeof formName&&formName||0];b&&(a=function(){for(var a=[],c=0,d=0;d<b.elements.length;d++){var e=b.elements[d];"hidden"!==e.type&&e.value&&f.length>c&&(a.push(f[c]+"="+encodeURIComponent(e.value)),c++)}document["vidcloud-embed"].postMessage({personalizedString:a.join("&")},
      "https://cdn.vidcloud.io");return!0},b.addEventListener("submit",a),b.addEventListener("click",a))});
</script>
<!-- End of Vidcloud Embed Code -->`;

  render() {
    const { className, project, onCampaignFinished } = this.props;
    const { personalizations } = this.state;

    return (
      <Fragment>
        <div className={`email-campaign ${className}`}>
          <ReactTooltip
            effect="solid"
          />
          <div className="workspace">
            <div className="service-provider">
              <ul className="service-provider-inner">
                <li className="service-provider-step">
                  <span>Reorder personalized tokens by dragging as they defined at your form</span>
                  <SortableList
                    items={personalizations}
                    onSortEnd={({ oldIndex, newIndex }) => {
                      this.setState({
                        personalizations: arrayMove(personalizations, oldIndex, newIndex),
                      });
                    }}
                  />
                </li>
                <li className="service-provider-step">
                  <span>Copy & Paste this embed code inside the custom HTML element</span>
                  <EmbedDataContainer
                    className="embed-item"
                    url={project.make.url}
                    stringGenerator={() => this.embedCodeGenerator()}
                  />
                </li>
              </ul>
            </div>
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
