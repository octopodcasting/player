import CompositeElement from '../elements/mixins/composite';

export function buildComposite(mixins) {
  const baseComposite = CompositeElement(HTMLElement);

  return [baseComposite, ...mixins].reduce((composite, wrapper) => wrapper(composite));
}
