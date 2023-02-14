import React from 'react';
import PropTypes from '../../lib/PropTypes';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import EmbeddedPlayback from './EmbeddedPlayback';
import CallToActions from '../wizard/editor/call-to-actions/CallToActions';
import Personalizer from '../wizard/editor/workspaces/construction/Personalizer';
import NicheScriptsWorkspace from '../wizard/niche-scripts/NicheScriptsWorkspace';
import EndScreens from '../wizard/editor/endScreens/EndScreens';
import ImageLT from '../wizard/editor/imageLT/ImageLT';
import EmailCampaign from '../wizard/publisher/campaigns/EmailCampaign';
import SocialCampaign from '../wizard/publisher/campaigns/SocialCampaign';
import RetargetCampaign from '../wizard/publisher/campaigns/RetargetCampaign';
import { errMaxSize2mb } from '../../lib/validators/projectValidator';
import ImageUpload from './ImageUpload';
import Project from '../../lib/editor/Project';
// import RetargetCampaign ""
class VideoPlayer extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        setShow: PropTypes.func,
        onActiveProject:PropTypes.func
        // contentType:PropTypes.string
    };
    constructor(props) {
        super(props);
        this.onPlay = this.onPlay.bind(this);
        this.state = {
            isPlayVideo: false,
            waiter: null,
        }
    }
    onPlay() {
        this.setState({
            isPlayVideo: true
        })
    }
    onTokenChosen = (token) => {
        // const { store: { activeProject: { activeElement }, activeProject } } = this.props;
        // const {
        //   _activeHandle: { type, target },
        //   caretOffsets: offset = {},
        // } = activeElement;
        // const newText = insertAtCaret(activeElement[type], offset[type] || 0, token);

        // const event = new Event('input');
        // target.dispatchEvent(event);

        // const updatedProps = {};
        // updatedProps[type] = newText;
        // activeElement._natives._update
        //   .call(this, activeElement, updatedProps);
        // activeProject.update(activeElement, updatedProps);
        // this.checkForm();
    };


    render() {
        const { isOpen, className, setShow, contentType, item = null, playbackUrl, isFooter, title, onActiveProject,  activeProject, store } = this.props;
        return (
            <div>
                <Modal centered={true} className={'modal-container'} isOpen={isOpen} fade={false} toggle={() => setShow(contentType)}>
                    {title !== '' && <ModalHeader toggle={this.toggle}>
                        {title}
                        <a className='close-modal' onClick={() => setShow(contentType)}>
                        <img src='https://cdn.vidcloud.io/resources/go/static/images/close.png' /></a>
                    </ModalHeader>}
                    <ModalBody>
                        {contentType == 'CALL_TO_ACTION' && <CallToActions className="cta-library"
                           onCtaSelected={(cta) => {
                            store.activeProject = Project.fromTemplate(cta, true);
                            setShow(contentType);
                          }} 
                            />
                            }
                        {contentType == 'video' &&
                            <div className='preview-play-button'>
                                {!this.state.isPlayVideo && <div> <img className='img-preview' src={item.thumbnail} />
                                    <a class="button btn-preview" onClick={() => { this.onPlay(item) }}><img src={'https://cdn.vidcloud.io/resources/go/static/images/play-icon.png'}></img></a> </div>}

                                {this.state.isPlayVideo &&
                                    <EmbeddedPlayback source={item.contenturl}
                                    className={'preview-video'}
                                        playerUrl={playbackUrl}
                                        title={item.title}
                                        width="840"
                                        height="480" />
                                }
                            </div>
                        }
                        {contentType == 'PERSONALIZER_CUSTOMISE' && <Personalizer
                            className="personalizer"
                            onTokenChosen={this.onTokenChosen}
                        />}
                        {contentType == 'NICHE_SCRIPT_CUSTOMISE' && <NicheScriptsWorkspace
                            className="niche-scripts"
                            useWaiter
                            onScriptSelected={async (script) => {
                                const regeneratedProject = Project.fromTemplate(script, true);
                                await regeneratedProject.updateVideo(activeProject.video);
                                regeneratedProject.usedWizard = activeProject.wizardType;
                                regeneratedProject.thumbnail = store.common.defaultPosterframe;
                                store.activeProject = regeneratedProject;
                                activeProject.version = Math.random();
                                setShow(contentType)
                            }}
                        />

                        }
                        {contentType == 'END_SCREENS_CUSTOMISE' && <EndScreens
                            className="image-lt-library"
                            // onCtaSelected={(cta) => onActiveProject(cta)}
                            onCtaSelected={(cta) => {
                                store.activeProject = Project.fromTemplate(cta, true);
                                setShow(cta);
                            }}
                        />

                        }
                        {contentType == 'IMAGE_LT_CUSTOMISE' && <ImageLT
                            className="image-lt-library"
                            onCtaSelected={(cta) => { 
                                store.activeProject = Project.fromTemplate(cta, true);
                                setShow(cta);}
                            }
                        />

                        }
                        {contentType == 'socialCampaign' && <SocialCampaign className="campaign"
                            project={activeProject}
                            onCampaignFinished={() => PopupboxManager.close()} />}
                        {contentType == 'emailCampaign' && <EmailCampaign className="campaign"
                            project={activeProject}
                            onCampaignFinished={() => PopupboxManager.close()} />}
                        {contentType == 'retargetCampaign' && <RetargetCampaign className="campaign"
                            project={activeProject}
                            onCampaignFinished={() => PopupboxManager.close()} />}

                        {contentType == 'imageUpload' &&
                            <ImageUpload
                                onFileUploaded={(url) => {
                                    this.updateElement('src', url);
                                }}
                                onValidate={errMaxSize2mb}
                            />

                        }
                    </ModalBody>
                    {isFooter && <ModalFooter >
                        {/* <Button color="primary" onClick={statechanger}>Do Something</Button>{' '} */}
                        <Button color="secondary" onClick={() => setShow(item)}>Cancel</Button>
                    </ModalFooter>}
                </Modal>
            </div>
        );
    }
}

export default VideoPlayer;
