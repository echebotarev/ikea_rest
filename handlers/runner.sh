export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 12.18.3
node /var/www/ikea_rest/handlers/createFbFeed.js > /root/fbFeed.log 2>&1
node /var/www/ikea_rest/handlers/createYmlCatalog.js > /root/yml.log 2>&1
node /var/www/ikea_rest/handlers/createSitemap.js > /root/sitemap.log 2>&1
node /var/www/ikea_rest/handlers/createKaspiKzFeed.js > /root/kaspiFeed.log 2>&1
node /var/www/ikea_rest/handlers/createKaspiKzFeed.js 004 > /root/kaspiFeed.log 2>&1
