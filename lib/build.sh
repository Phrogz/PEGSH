#! /bin/sh
# Compile pegjslabeller.peg into pegjslabeller.js
# Requires Node.js installed and `npm install -g pegjs`
pegjs -e pegJSRuleLabeller --cache pegjslabeller.peg