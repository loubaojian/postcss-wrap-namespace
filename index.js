var postcss = require('postcss');
require('colors');

const rootSelectors = [':root', 'html'];
const bodySelector = 'body';
const exclude = /(^:|^to$|^from$|%$|html$|body$)/;

module.exports = postcss.plugin('postcss-wrap-namespace', function (opts) {
    opts = opts || {};

    // Work with options here
    let skipSelectors = [];

    skipSelectors.push(exclude);

    if (opts.skip instanceof Array) {
        skipSelectors = skipSelectors.concat(opts.skip);
    } else if (opts.skip instanceof RegExp) {
        skipSelectors.push(opts.skip);
    }

    function isExclude(selector) {
        for (var i = 0; i < skipSelectors.length; i++) {
            if (selector.match(skipSelectors[i])) {
                return true;
            }
        }

        return false;
    }

    return function (root, result) {
        // Transform CSS AST here
        if (!opts.rootSelector) {
            result.warn('opts.rootSelector must be specified'.red);
            return;
        }

        if (!opts.namespace) {
            result.warn('opts.namespace must be specified'.red);
            return;
        }

        root.walkRules(function (rule) {
            rule.selectors = rule.selectors.map(function (selector) {
                if (rootSelectors.indexOf(selector) > -1) {
                    // html
                    return opts.rootSelector;
                } else if (selector === bodySelector) {
                    // body
                    return `${opts.rootSelector} ${opts.namespace}`;
                } else if (
                    selector.indexOf(opts.rootSelector) > -1 ||
                    selector.indexOf(opts.namespace) > -1
                ) {
                    // rootWrapper or namespace
                    return selector;
                } else if (!isExclude(selector)) {
                    // !excluded selectors
                    return `${opts.namespace} ${selector}`;
                } else {
                    // everything else
                    return selector;
                }
            });
        });
    };
});
