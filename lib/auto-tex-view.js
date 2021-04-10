'use babel';

export default class AutoTexView {

  constructor(serializedState) {

  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
  }

  getElement() {
    return this.element;
  }

}
