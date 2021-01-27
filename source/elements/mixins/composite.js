const CompositeElement = function (BaseElement, composite) {
  return class extends BaseElement {
    connectedCallback() {
      composite.connectedCallbacks.forEach(callback => callback());
    }

    disconnectedCallback() {
      composite.disconnectedCallbacks.forEach(callback => callback());
    }

    adoptedCallback() {
      composite.adoptedCallbacks.forEach(callback => callback());
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (composite.attributeChangedCallbacks[name]) {
        composite.attributeChangedCallbacks[name].forEach(callback => callback(oldValue, newValue));
      }
    }
  };
};

export default CompositeElement;
