#!/usr/bin/env bash

if [[ `whoami` != 'root' ]]; then
    echo "You are not root."
    exit 1
fi

which npm || (echo "Npm not found. Please install Node.js bundle first." && exit 1)
which git || (echo "Git not found. Please install git first." && exit 1)

cd /opt && git clone https://github.com/Like-all/btce-mobile.git
cd /opt/btce-mobile && npm install

mkdir -p /var/opt/btce-mobile/
echo 1 > /var/opt/btce-mobile/btcenonce

initsystems=`ps -ho cmd 1 | cut -f 1 -d ' '`

case $initsystems in
    'init')
        cp /opt/btce-mobile/util/initscripts/btce-mobile /etc/init.d/
        update-rc.d btce-mobile defaults
        cp /opt/btce-mobile/util/initscripts/btce-watchdog /etc/init.d/
        update-rc.d btce-watchdog defaults

        service btce-watchdog start
        echo "Init-scripts done"
        ;;
    '/usr/lib/systemd/systemd')
        echo "Currently systemd is not supported."
        exit 1
        ;;
esac

cd /opt/btce-mobile/ && mv settings.js.example settings.js

echo "Type your username:"
read site_username
sed -i 's|site_username|'$site_username'|' /opt/btce-mobile/settings.js

echo "Type your password:"
read -s site_password
sed -i 's|site_password|'$site_password'|' /opt/btce-mobile/settings.js

echo "Type your BTCe api key:"
read btc_e_api_key
sed -i 's|btc-e_api_key|'$btc_e_api_key'|' /opt/btce-mobile/settings.js

echo "Type your BTCe api secret:"
read btc_e_api_secret
sed -i 's|btc-e_api_secret|'$btc_e_api_secret'|' /opt/btce-mobile/settings.js

echo "Type path to certificate:"
read path_to_cert
sed -i 's|path_to_cert.pem|'$path_to_cert'|' /opt/btce-mobile/settings.js

echo "Type path to private key:"
read path_to_privkey
sed -i 's|path_to_cert.key|'$path_to_privkey'|' /opt/btce-mobile/settings.js
