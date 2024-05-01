rm build/*
browserify src/background/convert.js -o build/convert.js && ^
browserify src/content/popup.js -o build/popup.js
