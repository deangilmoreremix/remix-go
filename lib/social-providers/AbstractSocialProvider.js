/**
 * Created by Eugene Butusov on 02/11/2018.
 */

class AbstractSocialProvider {
  static MESSAGE_TOPICS = {
    logIn: 'LOG_IN',
    settleAuth: 'SETTLE_AUTH',
    init: 'INIT',
    fetchUserData: 'FETCH_USER_DATA',
    fetchPagesData: 'FETCH_PAGE_DATA',
    getPageTabs: 'GET_PAGE_TABS',
    createTab: 'CREATE_TAB',
    share: 'SHARE',
  };

  static PostPreview;

  _postResponsiveMessage(data) {
    const { conductor } = this.config;
    const messageId = `${Date.now()}/${Math.random()}`;

    const result = new Promise((resolve, reject) => {
      const receiver = ({ data: messageData }) => {
        if (messageData.messageId !== messageId) {
          return;
        }
        window.removeEventListener('message', receiver);
        if (messageData.error) {
          console.log(messageData.error,"messageData.error")
          reject(messageData.error);
        } else {
          resolve(messageData);
        }
      };
      window.addEventListener('message', receiver);
    });

    conductor.contentWindow.postMessage({
      messageId,
      topic: data.topic,
      source: data.source,
      arguments: data.arguments,
    }, conductor.src);
    return result;
  }

  constructor(config) {
    this.config = config;

    const { conductor } = this.config;
    console.log(conductor,"conductor")
    conductor.contentWindow.postMessage({
      topic: 'Initial load',
      config: {},
      topics: this.constructor.MESSAGE_TOPICS,
      parentWindowUrl: window.location.origin + window.location.pathname,
    }, conductor.src);
  }

  init() {
    throw new Error('Should be overridden in child class.');
  }

  shutdown() {
    throw new Error('Should be overridden in child class.');
  }

  isAuthorized(permissions) {
    throw new Error('Should be overridden in child class.');
  }

  logIn(permissions) {
    throw new Error('Should be overridden in child class.');
  }

  fetchUserData() {
    throw new Error('Should be overridden in child class.');
  }

  share() {
    throw new Error('Should be overridden in child class.');
  }

  collapseConductor() {
    const { conductor } = this.config;
    conductor.style.width = '1px';
    conductor.style.height = '1px';
  }

  expandConductor() {
    const { conductor } = this.config;
    conductor.style.width = '100%';
    conductor.style.height = '100%';
    conductor.style.zIndex = '11000';
    conductor.style.position = 'fixed';
    conductor.style.top = 0;
    conductor.style.left = 0;
    conductor.style.display = 'none';
  }
}

export default AbstractSocialProvider;
