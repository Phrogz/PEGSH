# PEG Syntax Highlighter

PEGSH (pronounced…well, like it's spelled) is a web application that lets you develop and test a parsing expression grammar ("PEG") interactively. Type your grammar, and type your input, and it will create an HTML markup of your input with `<span class="rulename">…</span>` wrapped around it. There's also an area to enter CSS rules that control the coloring and other styles of the result.

[![Screenshot of PEGSH](https://raw.github.com/Phrogz/PEGSH/master/screenshot.jpg)](http://phrogz.net/js/pegsh/)

All of this happens as you type, with PEG syntax errors or parsing errors letting you know what's going on.

PEGSH is available online at [http://phrogz.net/js/pegsh/](http://phrogz.net/js/pegsh/).

## Documentation

### Writing Grammars

The syntax for writing a PEG grammar is that of [PEG.js][1]. Read the PEG.js documentation for [syntax details](http://pegjs.majda.cz/documentation#grammar-syntax-and-semantics), but note the following modification:

Any grammar you write is automatically modified to provide rule details. For example, if you write this simple PEG grammar…

~~~
paragraph = sentence+
sentence  = (word sp)+ word punc sp?
word      = [a-zA-Z]+
sp        = ' '
punc      = [.!]
~~~

…it is internally converted into this PEG.js grammar—that labels the results of each rule and uses parser actions to annotate the matched text with the rule name—before parsing your input:

~~~
paragraph = paragraph_pEgSh:(sentence+)               { …some important javascript… }
sentence  = sentence_pEgSh:((word sp)+ word punc sp?) { …some important javascript… }
word      = word_pEgSh:([a-zA-Z]+)                    { …some important javascript… }
sp        = sp_pEgSh:(' ')                            { …some important javascript… }
punc      = punc_pEgSh:([.!])                         { …some important javascript… }
~~~

If you attempt to add your own parser action at a high level…

~~~
sentence = (word sp)+ word punc sp? { return 'sentence' }
~~~

…it will be converted into something that gets rid of parse tree information below that node:

~~~
sentence = sentence_pEgSh:((word sp)+ word punc sp? { return 'sentence' }) { …pegsh js… }
~~~

### Styling the Parse Tree

The results of successfully parsing your input will be a hierarchical pile of HTML `<span>` elements with CSS classes applied based on the rule that matched. For example, using the grammar above to parse `Hello cats. Goodbye dogs!` will produce this HTML (all on one line):

~~~~ html
<span class="paragraph">
	<span class="sentence">
		<span class="word">Hello</span>
		<span class="sp"> </span>
		<span class="word">cats</span>
		<span class="punc">.</span>
		<span class="sp"> </span>
	</span>
	<span class="sentence">
		<span class="word">Goodbye</span>
		<span class="sp"> </span>
		<span class="word">dogs</span>
		<span class="punc">!</span>
	</span>
</span>
~~~~

If you change the grammar to use rule-based letter matching…

~~~~
word   = letter+
letter = [a-z]i
~~~~

…then you get this more verbose parse tree (again, all on one line):

~~~~ html
<span class="paragraph">
	<span class="sentence">
		<span class="word">
			<span class="letter">H</span>
			<span class="letter">e</span>
			<span class="letter">l</span>
			<span class="letter">l</span>
			<span class="letter">o</span>
		</span>
		<span class="sp"> </span>
		<span class="word">
			<span class="letter">c</span>
			<span class="letter">a</span>
			<span class="letter">t</span>
			<span class="letter">s</span>
		</span>
		<span class="punc">.</span>
		<span class="sp"> </span>
	</span>
	<span class="sentence">
		<span class="word">
			<span class="letter">G</span>
			<span class="letter">o</span>
			<span class="letter">o</span>
			<span class="letter">d</span>
			<span class="letter">b</span>
			<span class="letter">y</span>
			<span class="letter">e</span>
		</span>
		<span class="sp"> </span>
		<span class="word">
			<span class="letter">d</span>
			<span class="letter">o</span>
			<span class="letter">g</span>
			<span class="letter">s</span>
		</span>
		<span class="punc">!</span>
	</span>
</span>
~~~~

#### Simplifying the Output

To avoid the noise and slight perf hit that adding extra rules results in, any rule that you name with a leading underscore will not generate its own `<span>` in the parse tree. For example, if we change our grammar to this…

~~~~
paragraph = sentence+
sentence  = (word _sp)+ word punc _sp?
word      = _letter+
_letter   = [a-z]i
_sp       = ' '
punc      = [.!]
~~~~

…then the parse tree result becomes far simpler:

~~~~ html
<span class="paragraph">
	<span class="sentence">
		<span class="word">Hello</span> <span class="word">cats</span><span class="punctuation">.</span> 
	</span>
	<span class="sentence">
		<span class="word">Goodbye</span> <span class="word">dogs</span><span class="punctuation">!</span>
	</span>
</span>
~~~~

Note, however, that the underscore does not 'silence' child rules. For example, this grammar…

~~~~
animal    = _dogORcat !.
_dogORcat = canine / feline
canine    = 'dog' / 'wolf'
feline    = 'cat' / 'lion'
~~~~

produces this output:

~~~~ html
<span class="animal"><span class="feline">cat</span></span>
~~~~

_If you do not want the `canine` or `feline` wrappers, then you need to name those rules with underscores, also._

## Known Limitations (aka TODO)
* There's no way to save or load your work currently. If you're making a good PEG, be sure to copy/paste it somewhere else occasionally.
* The PEG and CSS editors don't have any pretty syntax highlighting themselves.
* When there's an error parsing your input, you get line and column indications…but there are no line numbers in the text input, and no nice highlighting of the input to show where the problem occurred.


## Credit & Contact
PEGSH is written and maintained by [Gavin Kistner](http://phrogz.net/).

PEGSH uses the excellent [PEG.js][1] JavaScript library by David Majda for generating a client-side parser from your grammar.

For bug reports or feature requests, please [file an issue on GitHub](https://github.com/Phrogz/PEGSH/issues).


## License
PEGSH is copyright ©2014 Gavin Kistner, and made freely available under an MIT License.
See the LICENSE file for details.

[1]: http://pegjs.majda.cz