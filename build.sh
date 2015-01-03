#
# File: build.sh
#
# This script uses the Google Closure Compiler to build the client.min.js file.
#    https://developers.google.com/closure/compiler/
#

#
# The Closure Compiler is a tool for making JavaScript download and run faster.
# It is a true compiler for JavaScript. Instead of compiling from a source
# language to machine code, it compiles from JavaScript to better JavaScript.
# It parses your JavaScript, analyzes it, removes dead code and rewrites and
# minimizes what's left. It also checks syntax, variable references, and types,
# and warns about common JavaScript pitfalls.
#

#
# DEPENDIECIES
#
# 1. You must have the Java JRE installed.
#    http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
#
# 2. You must have compiler.jar installed at ~/bin/compiler.jar
#    https://code.google.com/p/closure-compiler/downloads/list
#

# Assume compiler.jar exists in the users $HOME/bin directory.
# Compile using proper settings and include vendor dependiencies.
java -jar ~/bin/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js=src/vendor/ua-parser.js --js=src/vendor/fontdetect.js --js=src/vendor/swfobject.js --js=src/vendor/murmurhash3.js --js=src/vendor/deployJava.js --js=src/client.js --js_output_file=src/client.min.js

# Copy the compiled source file to the dist (distribution) directory.
cp src/client.min.js dist/client.min.js
