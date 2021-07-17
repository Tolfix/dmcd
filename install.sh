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

# User information
USER_PASSWORD=""

# Database
MONGO_URI=""
MONGO_ALREADY_HAS=false

# Domain/SSL
FQDN=""
IS_SSL=false
CONFIGURE_SSL=false

# Update apt
apt_update() {
  apt update -q -y && apt upgrade -y
}

# Get the newest tag with the .zip file.
get_newest_release_github() {
    echo "* Getting the newest release"
}

# Get a .env file with the vars we got.
create_env_file() {
    echo 'MONGODB_URI=${MONGO_URI}' > .env
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
}

main() {
    # Check if already installed.
    if [ -d $INSTALL_PATH ]; then
        echo "* You have already installed this once."
        echo -e -n "* Are you sure you want to proceed? (y/N): "
        read -r CONFIRM_PROCEED
        if [[ ! "$CONFIRM_PROCEED" =~ [Yy] ]]; then
            print_error "Installation aborted!"
            exit 1
        fi
    fi

    cd INSTALL_PATH

    if [ "$GITHUB_IS_ACTION" = "action" ]; then
        apt_update
        create_database

        create_env_file
    else
        echo ""
        echo -n "* Admin password: "
        read -r USER_PASSWORD

        echo ""
        echo "* For this application to run properly it needs a mongodb database."
        echo "* Do you already have a mongodb database? (true/false): "
        read -r MONGO_ALREADY_HAS

        if [ "$MONGO_ALREADY_HAS" = false ]; then
            create_database
        else
            echo ""
            echo "* Mongodb URI: "
            read -r MONGO_URI
        fi

    fi

}

main