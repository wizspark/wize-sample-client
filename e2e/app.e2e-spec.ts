import { ClientNg2Page } from './app.po';

describe('client-ng2 App', () => {
  let page: ClientNg2Page;

  beforeEach(() => {
    page = new ClientNg2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
