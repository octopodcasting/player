import CompositeElement from '../elements/components/composite';

export function buildComposite(mixins) {
  const helper = new CompositeHelper();
  const baseComposite = CompositeElement(HTMLElement, helper);

  return [baseComposite, ...mixins].reduce((composite, wrapper) => wrapper(composite, helper));
}

class CompositeHelper {

  adoptedCallbacks = [];
  attributeChangedCallbacks = {};
  connectedCallbacks = [];
  disconnectedCallbacks = [];

  addConnectedCallback(callback) {
    this.connectedCallbacks.push(callback);
  }

  addDisconnectedCallback(callback) {
    this.disconnectedCallbacks.push(callback);
  }

  addAdoptedCallback(callback) {
    this.adoptedCallbacks.push(callback);
  }

  addAttributeChangedCallback(name, callback) {
    if (!this.attributeChangedCallbacks[name]) {
      this.attributeChangedCallbacks[name] = [];
    }

    this.attributeChangedCallbacks[name].push(callback);
  }
}
