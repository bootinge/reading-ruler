
echo 'compiling js files...'
type popup.js | uglifyjs -o ..\release\popup.js -c -m
type highlighter.js | uglifyjs -o ..\release\highlighter.js -c -m
type background.js | uglifyjs -o ..\release\background.js -c -m


copy jquery-2.0.3.min.js ..\release\
copy icon.png ..\release\
copy screenshot02.png ..\release\
copy popup.html ..\release\
copy manifest.json ..\release\
