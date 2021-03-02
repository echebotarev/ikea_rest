#!/usr/bin/env sh
node /var/www/ikea_rest/handlers/createFbFeed.js > /root/fbFeed.log 2>&1
node /var/www/ikea_rest/handlers/createYmlCatalog.js > /root/yml.log 2>&1
node /var/www/ikea_rest/handlers/createSitemap.js > /root/sitemap.log 2>&1
