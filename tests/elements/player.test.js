import {expect, fixture} from '@open-wc/testing';

import '../../distribution/octopod-player';

describe('octopod-player', () => {
  it('has default mode', async () => {
    const element = await fixture('<octopod-player></octopod-player>');

    expect(element.mode).to.equal('audio');
  });

  // it('throws error on invalid mode attribute', async done => {
  //   const element = await fixture('<octopod-player mode="foo"></octopod-player>');
  // });

  // it('throws error on invalid mode', async () => {
  //   const element = await fixture('<octopod-player></octopod-player>');
  //
  //   element.mode = 'foo';
  // });

  it('has a mode attribute reflecting the mode property', async () => {
    const element = await fixture('<octopod-player></octopod-player>');

    element.mode = 'cover';

    expect(element.getAttribute('mode')).to.equal('cover');
  });
});
