'use strict';

const buildHttpParamsFilter = function(filterParams = [], opts = {}) {
  const depthLimit = opts.depthLimit || 5;
  const filterText = opts.filterText || '[FILTERED]';

  const filterKeyMap = {};
  filterParams.forEach((key) => {
    filterKeyMap[key] = true;
  });

  const httpParamsFilter = function(params = {}, depth = 1) {
    try {
      // stack overflowしないように depthLimit までしか掘らない
      if (depthLimit < depth){
        return null;
      }

      if (typeof params !== 'object') {
        return params;
      }

      if (params === null) {
        return params;
      }

      if (Array.isArray(params)) {
        let list = [];
        params.forEach((val, i) => {
          // 値がArrayだった場合は再帰的にfilterをかける
          list[i] = httpParamsFilter(val, (depth + 1));
        });
        return list;
      }
 
      let _params = {};
      Object.keys(params).forEach((key) => {
        if (filterKeyMap[key]) {
          _params[key] = filterText;
  
        // 値がobjectだった場合は再帰的にfilterをかける
        } else if (typeof params[key] === 'object') {
          _params[key] = httpParamsFilter(params[key], (depth + 1));
        }
      });
  
      return Object.assign({}, params, _params);
    } catch(e) {
      console.error('paramsFilter', e);
      return null;
    }
  };

  return httpParamsFilter;
}

module.exports = buildHttpParamsFilter;
