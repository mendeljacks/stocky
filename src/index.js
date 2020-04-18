import { uniq } from 'ramda';

const ppp = (s) => uniq(s).join('');
global.ppp = ppp;
