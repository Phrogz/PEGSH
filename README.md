# PEGSH - Parsing Expression Grammar Syntax Highlighter

PEGSH (pronounced…well, like it's spelled) is a web application that lets you develop and test a parsing expression grammar ("PEG") interactively. Type your grammar, and type your input, and it will create an HTML markup of your input with `<span class="rulename">…</span>` wrapped around it. There's also an area to enter CSS rules that control the coloring and other styles of the result.

[![Screenshot of PEGSH](http://phrogz.net/js/pegsh/screenshot.jpg)](http://phrogz.net/js/pegsh/)
{: style="display:block; margin:1em auto"}

All of this happens as you type, with PEG syntax errors or parsing errors letting you know what's going on.


## Try it Online
PEGSH is available online at [http://phrogz.net/js/pegsh/](http://phrogz.net/js/pegsh/).


## Known Limitations (aka TODO)
* There's no way to save or load your work currently. If you're making a good PEG, be sure to copy/paste it somewhere else occasionally.
* The PEG and CSS editors don't have any pretty syntax highlighting themselves.
* When there's an error parsing your input, you get line and column indications…but there are no line numbers in the text input, and no nice highlighting of the input to show where the problem occurred.
* There's no help available from the page itself telling you what sort of PEG syntax is supported. (It's [PEG.js][1], with a minor variation.)


## Credit & Contact
PEGSH is written and maintained by [Gavin Kistner](http://phrogz.net/).

PEGSH uses the excellent [PEG.js][1] JavaScript library by David Majda for generating a client-side parser from your grammar.

For bug reports or feature requests, please [file an issue on GitHub](https://github.com/Phrogz/PEGSH/issues).


## License
PEGSH is copyright ©2014 Gavin Kistner, and made freely available under an MIT License.
See the LICENSE file for details.

[1]: http://pegjs.majda.cz