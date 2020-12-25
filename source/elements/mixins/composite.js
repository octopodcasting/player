const CompositeElement = function (BaseElement) {
  return class extends BaseElement {
    #adoptedCallbacks = [];
    #attributeChangedCallbacks = [];
    #connectedCallbacks = [];
    #disconnectedCallbacks = [];

    connectedCallback() {
      this.#connectedCallbacks.forEach(callback => callback());
    }

    disconnectedCallback() {
      this.#disconnectedCallbacks.forEach(callback => callback());
    }

    adoptedCallback() {
      this.#adoptedCallbacks.forEach(callback => callback());
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (this.#attributeChangedCallbacks[name]) {
        this.#attributeChangedCallbacks[name].forEach(callback => callback(oldValue, newValue));
      }
    }

    addConnectedCallback(callback) {
      this.#connectedCallbacks.push(callback);
    }

    addDisconnectedCallback(callback) {
      this.#disconnectedCallbacks.push(callback);
    }

    addAdoptedCallback(callback) {
      this.#adoptedCallbacks.push(callback);
    }

    addAttributeChangedCallback(name, callback) {
      if (!this.#attributeChangedCallbacks[name]) {
        this.#attributeChangedCallbacks[name] = [];
      }

      this.#attributeChangedCallbacks[name].push(callback);
    }
  };
};

export default CompositeElement;
