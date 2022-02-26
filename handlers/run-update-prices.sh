export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 12.18.3

node /var/www/ikea_rest/handlers/updateProductDbPrices.js.js > /root/updateProductDbPrices.log 2>&1
