var postcss = require('postcss');

var plugin = require('./');

const NAMESPACE = '.namespace';
const ROOTSELECTOR = '#rootSelector';

function run(input, output, opts) {
    return postcss([plugin(opts)])
        .process(input)
        .then(result => {
            expect(result.css).toEqual(output);
            expect(result.warnings().length).toBe(0);
        });
}

/* Write tests here

it('does something', () => {
    return run('a{ }', 'a{ }', { });
});

*/

it('should return warning if opts.rootSelector was not passed', () => {
    const inputCss = 'a{ }';
    const outputCss = 'a{ }';
    return postcss([plugin({ namespace: '.namespace' })])
        .process(inputCss)
        .then(result => {
            expect(result.css).toEqual(outputCss);
            expect(result.warnings().length).toBe(1);
        });
});

it('should return warning if opts.namespace was not passed', () => {
    const inputCss = '.foo{ }';
    const outputCss = `${inputCss}`;
    return postcss([plugin({ rootSelector: '#rootSelector' })])
        .process(inputCss)
        .then(result => {
            expect(result.css).toEqual(outputCss);
            expect(result.warnings().length).toBe(1);
        });
});

it('should replace html', () => {
    const inputCss = 'html{ }';
    const outputCss = `${ROOTSELECTOR}{ }`;
    return run(inputCss, outputCss, {
        namespace: NAMESPACE,
        rootSelector: ROOTSELECTOR
    });
});

it('should wrap namespace', () => {
    const inputCss = '.foo{ }';
    const outputCss = `${NAMESPACE} ${inputCss}`;
    return run(inputCss, outputCss, {
        namespace: NAMESPACE,
        rootSelector: ROOTSELECTOR
    });
});

it('should wrap namespace and replace html', () => {
    const inputCss = 'html{ } .foo{ }';
    const outputCss = `${ROOTSELECTOR}{ } ${NAMESPACE} .foo{ }`;
    return run(inputCss, outputCss, {
        namespace: NAMESPACE,
        rootSelector: ROOTSELECTOR
    });
});

it('[css-animations] should not wrap "from" selector', () => {
    const inputCss = 'from{ }';
    const outputCss = `${inputCss}`;
    return run(inputCss, outputCss, {
        namespace: NAMESPACE,
        rootSelector: ROOTSELECTOR
    });
});

it('[css-animations] should not wrap "to" selector', () => {
    const inputCss = 'to{ }';
    const outputCss = `${inputCss}`;
    return run(inputCss, outputCss, {
        namespace: NAMESPACE,
        rootSelector: ROOTSELECTOR
    });
});

it('[css-animations] should not wrap selectors ending with %', () => {
    const inputCss = '0%{ }';
    const outputCss = `${inputCss}`;
    return run(inputCss, outputCss, {
        namespace: NAMESPACE,
        rootSelector: ROOTSELECTOR
    });
});

test('should skip selectors from opts.skip', () => {
    let inputCss = '.foo{ } .skip{ }';
    let outputCss = `${NAMESPACE} .foo{ } .skip{ }`;

    return run(inputCss, outputCss, {
        namespace: NAMESPACE,
        rootSelector: ROOTSELECTOR,
        skip: /^.skip/
    });
});

test('should skip selectors from opts.skip array', () => {
    let inputCss = '.no{ }.foo{ }.skip{ }';
    let outputCss = `.no{ }${NAMESPACE} .foo{ }.skip{ }`;

    return run(inputCss, outputCss, {
        namespace: NAMESPACE,
        rootSelector: ROOTSELECTOR,
        skip: [/^.skip/, /^.no/]
    });
});

it('should skip html body', () => {
    const inputCss = 'html{ } body{ }';
    const outputCss = `${inputCss}`;
    return run(inputCss, outputCss, {
        namespace: NAMESPACE,
        rootSelector: ROOTSELECTOR,
        skip: [/^html/, /^body/]
    });
});

it('should all done', () => {
    let inputCss = 'html{ } .skip{ } .foo{ } .no{ } from{ } to{ } 0%{ }';
    let outputCss =
        `${ROOTSELECTOR}{ } .skip{ } ${NAMESPACE} .foo{ } ` +
        '.no{ } from{ } to{ } 0%{ }';

    return run(inputCss, outputCss, {
        namespace: NAMESPACE,
        rootSelector: ROOTSELECTOR,
        skip: [/^.skip/, /^.no/]
    });
});
