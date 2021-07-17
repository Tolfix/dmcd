#!/bin/bash

set -e

# root user?
if [[ $EUID -ne 0 ]]; then
  echo "* Please run this script with root. (sudo)." 1>&2
  exit 1
fi

# Check if curl is installed
if ! [ -x "$(command -v curl)" ]; then
  echo "* curl is not installed, please ensure it is."
  exit 1
fi

# VARS

# Github
GITHUB_REPO="https://github.com/Tolfix/dmcd"
GITHUB_BRANCH="master"
GITHUB_IS_ACTION=$1

# General VARS
INSTALL_PATH="/var/dmcd"
SESSION_SECRET=""

# User information
USER_PASSWORD=""
USER_EMAIL=""

# Database
MONGO_URI=""
MONGO_ALREADY_HAS=false

# Domain/SSL
FQDN="localhost"
IS_SSL=false
CONFIGURE_SSL=false
PROTOCOL=http

# Update apt
apt_update() {
  apt update -q -y && apt upgrade -y
}

# Get the newest tag with the .zip file.
install_dmcd() {
    echo "* Getting the newest release"
    TAG=$(curl --silent "https://api.github.com/repos/tolfix/dmcd/releases/latest" |
        grep '"tag_name":' |
        sed -E 's/.*"([^"]+)".*/\1/')

    curl -L -o master.tar.gz https://github.com/Tolfix/dmcd/archive/refs/tags/$TAG.tar.gz
    tar xf master.tar.gz -C $INSTALL_PATH --strip-components 1
    rm -r master.tar.gz
    echo "* Installed the DMCD"
}

npm_install() {
    npm install
}

build_dmcd() {
    echo "* Building DMCD"
    npm run build
    echo "* Done building DMCD"
}

# Get a .env file with the vars we got.
create_env_file() {
    echo "* Creating .env file"
    echo -e 'MONGODB_URI='$MONGO_URI'\nSESSION_SECRET='$SESSION_SECRET'\nDOMAIN='$FQDN'\nHTTP='$PROTOCOL > .env
    cat .env
    echo "* Done creating .env file"
}

# Create a mongodb database
create_database() {
    echo "* Installing mongodb"
    curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
    apt_update
    apt install mongodb-org -y
    systemctl start mongod
    systemctl enable mongod
    MONGO_URI="mongodb://localhost/dmcd"
    echo "* Mongodb installed"
}

install_node() {
    echo "* Installing nodejs"
    curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
    apt -y install nodejs
    echo "* Nodejs installed"
    echo ""
    echo "* Installing typescript"
    npm install typescript -g
    echo "* Installed typescript"
}

gen_random_string() {
    SESSION_SECRET=$(node -e 'console.log(require("crypto").randomBytes(20).toString("hex"))')
}

install_docker() {
    echo "* Installing docker"
    apt install apt-transport-https ca-certificates curl software-properties-common -y
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
    apt_update
    apt install docker-ce -y
    systemctl start docker
    systemctl enable docker
    echo "* Installed docker"
    echo ""
    echo "* Install docker-compose"
    curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo "* Installed docker-compose"
}

create_admin() {
    npm run create-admin $MONGO_URI $USER_PASSWORD
}

configure_nginx() {
    # certbot
    # nginx
    apt install nginx -y
    apt-get install certbot python3-certbot-nginx -y
    ufw allow 'Nginx HTTP'
    
    rm -rf /etc/nginx/sites-enabled/default

    curl -o /etc/nginx/sites-available/dmcd.conf https://raw.githubusercontent.com/Tolfix/dmcd/master/Templates/nginx.conf
    
    sed -i -e "s@<domain>@${FQDN}@g" /etc/nginx/sites-available/dmcd.conf

    ln -sf /etc/nginx/sites-available/dmcd.conf /etc/nginx/sites-enabled/dmcd.conf

    systemctl start nginx
    systemctl enable nginx
}

configure_ssl() {
    certbot --nginx --redirect --no-eff-email --email "$USER_EMAIL" -d "$FQDN" || FAILED_SSL=true
}

main() {
    # Check if already installed.
    if [ -d $INSTALL_PATH ]; then
        echo "* You have already installed this once."
        echo -e -n "* Are you sure you want to proceed? (y/N): "
        read -r CONFIRM_PROCEED
        if [[ ! "$CONFIRM_PROCEED" =~ [Yy] ]]; then
            echo "Installation aborted!"
            exit 1
        fi
    fi

    if [ ! -d $INSTALL_PATH ]; then
        mkdir $INSTALL_PATH
    fi
    cd $INSTALL_PATH

    if [ "$GITHUB_IS_ACTION" = "action" ]; then
        echo "* Github action running now..."
        # apt_update
        # create_database
        # install_node
        # gen_random_string
        # install_docker
        # install_dmcd
        # npm_install
        # build_dmcd
        # create_env_file
        echo "* Github action stopped..."
    else
        echo ""
        echo -n "* Admin password: "
        read -r USER_PASSWORD

        echo ""
        echo -n "* Email: "
        read -r USER_EMAIL

        echo ""
        echo -n "* FQDN (localhost): "
        read -r FQDN

        echo -e -n "* Do you want to configure SSL? (y/N): "
        read -r CONFIRM_SSL

        echo ""
        echo "* For this application to run properly it needs a mongodb database."
        echo -e -n "* Do you already have a mongodb database? (y/N): "
        read -r MONGO_ALREADY_HAS

        if [[ ! "$MONGO_ALREADY_HAS" =~ [Yy] ]]; then
            apt_update
            create_database
        else
            echo ""
            echo -n "* Mongodb URI: "
            read -r MONGO_URI
        fi

        install_node
        configure_nginx

        if [[ "$CONFIRM_SSL" =~ [Yy] ]]; then
            CONFIGURE_SSL=true
            IS_SSL=true
            configure_ssl
        fi

        gen_random_string
        install_docker
        install_dmcd
        npm_install
        build_dmcd
        create_admin
        create_env_file

    fi

}

main