# http-params-filter
Function to filter the credential value contained in the object such as http parameter.

## install
```
npm install http-params-filter
```

## usage
```
const f = require('http-params-filter')(['email', 'password', 'wallet', 'secret']);

const params = {
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

const res = f(params);
// => {
//   user: {
//     id: 1,
//     email: '[FILTERD]',
//     password: '[FILTERD]',
//     display_name: 'hogeo',
//   },
//   org: {
//     name: 'orgName',
//     email: '[FILTERD]',
//   },
//   wallet: '[FILTERD]',
//   secret: '[FILTERD]'
// }
```
