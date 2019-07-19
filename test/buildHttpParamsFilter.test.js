const buildHttpParamsFilter = require('../lib/buildHttpParamsFilter');
const filterText = '[FILTERED]';

describe('buildHttpParamsFilter', () => {
  describe('httpParamsFilter', () => {
    let f;
    beforeEach(() => {
      f = buildHttpParamsFilter(['email', 'password', 'wallet', 'secret']);
    });

    describe('文字列を渡したとき', () => {
      it('文字列を返す', () => {
        const res = f('STR');
        expect(res).toEqual('STR');
      });
    });

    describe('nullを渡したとき', () => {
      it('nullを返す', () => {
        const res = f(null);
        expect(res).toEqual(null);
      });
    });

    describe('オブジェクトを渡したとき', () => {
      describe('フィルターキーが含まれるとき', () => {
        it('該当キーの値がフィルターされる', () => {
          const obj = {
            user: {
              id: 1,
              email: 'hoge@example.com',
              password: 'hogehgoe',
              display_name: 'hogeo',
            },
            org: {
              name: 'orgName',
              email: 'org@example.com',
            },
            wallet: {
              number: '1111111111',
            },
            secret: 'secretValue',
          };
          const res = f(obj);

          expect(res).toEqual({
            user: {
              id: 1,
              email: filterText,
              password: filterText,
              display_name: 'hogeo',
            },
            org: {
              name: 'orgName',
              email: filterText,
            },
            wallet: filterText,
            secret: filterText,
          });

          expect(obj).toEqual({
            user: {
              id: 1,
              email: 'hoge@example.com',
              password: 'hogehgoe',
              display_name: 'hogeo',
            },
            org: {
              name: 'orgName',
              email: 'org@example.com',
            },
            wallet: {
              number: '1111111111',
            },
            secret: 'secretValue',
          });
        });
      });

      describe('フィルターキーが含まれないとき', () => {
        it('フィルターされずにかえる', () => {
          const obj = {
            user: {
              id: 1,
              __email: 'hoge@example.com',
              __password: 'hogehgoe',
              display_name: 'hogeo',
            },
            org: {
              name: 'orgName',
              __email: 'org@example.com',
            },
            __wallet: {
              number: '1111111111',
            }
          };
          const res = f(obj);

          expect(res).toEqual({
            user: {
              id: 1,
              __email: 'hoge@example.com',
              __password: 'hogehgoe',
              display_name: 'hogeo',
            },
            org: {
              name: 'orgName',
              __email: 'org@example.com',
            },
            __wallet: {
              number: '1111111111',
            }
          });
        });
      });

      describe('オブジェクトの深さがリミットより大きい場合', () => {
        it('リミットより深いところはかえされない', () => {
          const obj = {
            user: {
              email: 'hoge@example.com',
              password: 'hogehgoe',
              org: {
                name: 'orgName',
                email: 'org@example.com',
                users: [
                  {
                    email: 'fuga@example.com',
                    job: {
                      type: 1,
                      name: 'engineer',
                    }
                  }
                ]
              },
            }
          };
          const res = f(obj);

          expect(res).toEqual({
            user: {
              email: filterText,
              password: filterText,
              org: {
                name: 'orgName',
                email: filterText,
                users: [
                  {
                    email: filterText,
                    job: null
                  }
                ]
              },
            }
          });
          expect(obj).toEqual({
            user: {
              email: 'hoge@example.com',
              password: 'hogehgoe',
              org: {
                name: 'orgName',
                email: 'org@example.com',
                users: [
                  {
                    email: 'fuga@example.com',
                    job: {
                      type: 1,
                      name: 'engineer',
                    }
                  }
                ]
              },
            }
          });
        });
      });
    });
  });
});
