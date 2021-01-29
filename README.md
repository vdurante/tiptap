> Don’t try this at home! Nothing here is production-ready, don’t use it anywhere.

# tiptap 2 (Preview!)

A headless and extendable rich text editor, based on [ProseMirror](https://github.com/ProseMirror/prosemirror), which is already in use at many well-known companies such as *New York Times*, *The Guardian* or *Atlassian*.

<!-- [![Version](https://img.shields.io/npm/v/tiptap.svg?label=version)](https://www.npmjs.com/package/tiptap)
[![Downloads](https://img.shields.io/npm/dm/tiptap.svg)](https://npmcharts.com/compare/tiptap?minimal=true)
[![License](https://img.shields.io/npm/l/tiptap.svg)](https://www.npmjs.com/package/tiptap)
[![Filesize](https://img.badgesize.io/https://unpkg.com/tiptap/dist/tiptap.min.js?compression=gzip&label=size&colorB=000000)](https://www.npmjs.com/package/tiptap) -->
[![Build Status](https://github.com/ueberdosis/tiptap-next/workflows/build/badge.svg)](https://github.com/ueberdosis/tiptap-next/actions)
[![Sponsor](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub)](https://github.com/sponsors/ueberdosis)

## Feedback
We’re looking for your feedback to improve tiptap 2 before the first public release! Share everything that helps to make it better for everyone!

* Create issues on GitHub! [Link](https://github.com/ueberdosis/tiptap-next/issues)
* Send an email! [humans@tiptap.dev](mailto:humans@tiptap.dev)
* Follow us on Twitter! [@tiptap_editor](https://twitter.com/tiptap_editor) [@hanspagel](https://twitter.com/hanspagel) [@_philippkuehn](https://twitter.com/_philippkuehn)

## Why we built tiptap
We were looking for a text editor for [Vue.js](https://github.com/vuejs/vue) and found some solutions that didn’t really satisfy us. An editor should be easy to extend and not based on old dependencies such as jQuery. For React there is already a great editor called [Slate.js](https://github.com/ianstormtaylor/slate), which impresses with its modularity. We came across [ProseMirror](https://github.com/prosemirror) and decided to build on it. ProseMirror is a toolkit for building rich text editors that are already in use at many well-known companies such as *Atlassian* or *New York Times*.

### What does `headless` mean?
With headless components you'll have (almost) full control over markup and styling. We don’t want to tell you what a menu should look like or where it should be rendered in the DOM. That’s all up to you. There is also a [great article about headless components](https://adamwathan.me/renderless-components-in-vuejs/) by Adam Wathan.

### How is the data stored under the hood?
You can save your data as a raw `HTML` string or can get a `JSON`-serializable representation of your document. And of course, you can also pass `HTML` or `JSON` content back to the editor.

## 💖 Sponsor the development
Are you using tiptap in production? We need your sponsorship to maintain, update and develop tiptap. [Become a Sponsor now!](https://github.com/sponsors/ueberdosis)

## Documentation
To check out some live examples, visit [next.tiptap.dev](https://next.tiptap.dev/).

## Contributing
Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Maintainers
- [Philipp Kühn](https://github.com/philippkuehn) (development)
- [Hans Pagel](https://github.com/hanspagel) (documentation)

## Premium Sponsors
- [überdosis](https://ueberdosis.io/)
- Jason Nelson from [mymind](https://mymind.com/)
- Gordon Mickel from [DocIQ](https://www.dociq.io/)

## Credits
- [Christoph Flathmann](https://github.com/Chrissi2812)
- [Erick Wilder](https://github.com/erickwilder)
- [Marius Tolzmann](https://github.com/mariux)
- [jjangga0214](https://github.com/jjangga0214)
- [Maya Nedeljkovich](https://github.com/mayacoda)
- [Ryan Bliss](https://github.com/ryanbliss)
- [Gregor](https://github.com/gambolputty)
- [All Contributors](../../contributors)

## Links
- https://github.com/ueberdosis/awesome-tiptap

## Become a sponsor
Your benefits as a sponsor:

* Give back to the open source community
* Get early access private repositories
* Your issues and pull requests get a `sponsor 💖` label
* Get a sponsor badge in all your comments on GitHub
* Show support in your GitHub profile
* Receive monthly reports about our open source work

Does that sound good? [Sponsor us on GitHub!](https://github.com/sponsors/ueberdosis)

## License
The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
