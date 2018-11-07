/**
 * Created by Eugene Butusov on 02/11/2018.
 */

class AbstractSocialProvider {
  static PostPreview;

  constructor(config) {
    this.config = config;
  }

  init() {
    throw new Error('Should be overridden in child class.');
  }

  shutdown() {
    throw new Error('Should be overridden in child class.');
  }

  isAuthorized() {
    throw new Error('Should be overridden in child class.');
  }

  logIn() {
    throw new Error('Should be overridden in child class.');
  }

  fetchUserData() {
    throw new Error('Should be overridden in child class.');
  }

  share() {
    throw new Error('Should be overridden in child class.');
  }
}

export default AbstractSocialProvider;
