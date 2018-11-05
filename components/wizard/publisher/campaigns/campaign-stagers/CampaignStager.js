/**
 * Created by Eugene Butusov on 05/11/2018.
 */

/* eslint-disable no-underscore-dangle */


class CampaignStager {
  _currentStage = -1;

  constructor(strategy) {
    this.strategy = strategy;
  }

  nextStage() {
    throw new Error('Should be overridden in child class.');
  }

  prevStage() {
    if (this._currentStage > 0) {
      this._currentStage -= 1;
    }
    return this._stages[this._currentStage];
  }

  _setStage(stageName) {

  }

  get embedLocations() {
    return this.constructor.EMBED_LOCATIONS;
  }

  get stages() {
    return this.constructor._stages;
  }

  get currentStage() {
    return this._stages[this._currentStage];
  }
}

export default CampaignStager;
