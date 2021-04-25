[ "$1" = "production" ] || npm run lint
[ "$1" = "production" ] && sed -i 's/development/production/' src/webpack.config.js

npm run build:frontend:production &
npm run build:backend &
wait

[ "$1" = "production" ] && sed -i 's/production/development/' src/webpack.config.js
exit 0
