import {expect, fixture} from '@open-wc/testing';

import '../../distribution/octopod-player';

describe('octopod-cover', () => {
  it('shows placeholder', async () => {
    const element = await fixture('<octopod-cover></octopod-cover>');

    expect(element.imageUrl).to.equal(null);
  });

  it('shows an image', async () => {
    const element = await fixture('<octopod-cover image="https://placehold.it/500"></octopod-cover>');

    expect(element.imageUrl).to.equal('https://placehold.it/500');
  });
});
