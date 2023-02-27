const { atom, selector } = require('recoil');

const userState = atom({
  key: 'userState',
  default: '',
});

export { userState };
