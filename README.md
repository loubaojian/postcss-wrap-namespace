# PostCSS Wrap Namespace [![Build Status][ci-img]][ci]

[PostCSS] plugin to wrap css rules into a namespace and change the rules on html or :root in rootSelector, eg .my-selector {} to .namespace .my-selector {}, html {} to .rootSelector {}"

[postcss]: https://github.com/postcss/postcss
[ci-img]: https://travis-ci.org/loubaojian/postcss-wrap-namespace.svg
[ci]: https://travis-ci.org/loubaojian/postcss-wrap-namespace

#### Example Input

```css
.foo {
    /* Input example */
}

html {
    /* Input example */
}
```

#### Example OutPut

```css
.namespace .foo {
    /* Output example */
}

#rootSelector {
    /* Input example */
}
```

## Installation

npm i -D postcss-wrap-namespace

## Usage

```js
postcss([require('postcss-wrap-namespace')]);
```

## Options

#### options.namespace

Type: String

Provide a namespace selector in which to wrap CSS.

#### options.rootSelector

Type: String

Provide a root selector in which to replace html or :root.

#### options.skip

Type: Regular Expression or Array of Regular Expressions

Skip selectors from being wrapped. Even if you will not set this option, it will still skip css animation selectors from, to and endingWithPercentSymbol%
