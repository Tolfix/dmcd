#!/bin/bash

COMMAND=$1

start() {
    pm2 start ./build/Server.js
}

stop() {
    pm2 stop ./build/Server.js
}

build() {
    npm run build
}

restart() {
    pm2 restart ./build/Server.js
}

logs() {
    pm2 logs ./build/Server.js
}

update() {
    echo "* Getting the newest release"
    TAG=$(curl --silent "https://api.github.com/repos/tolfix/dmcd/releases/latest" |
        grep '"tag_name":' |
        sed -E 's/.*"([^"]+)".*/\1/')

    curl -L -o master.tar.gz https://github.com/Tolfix/dmcd/archive/refs/tags/$TAG.tar.gz
    tar xf master.tar.gz -C /var/dmcd --strip-components 1
    rm -r master.tar.gz
    echo "* Updated DMCD"
}

commands() {
    echo "
    Commands: 
    start => Starts the application
    build => Builds the application
    stop => Stops the application
    restart => Restarts the application
    logs => Shows what it has been logging
    update => Pulls new updates from github (if any)"
}

if [ "$COMMAND" = "start" ]; then
    start
fi

if [ "$COMMAND" = "stop" ]; then
    stop
fi

if [ "$COMMAND" = "build" ]; then
    build
fi

if [ "$COMMAND" = "restart" ]; then
    restart
fi

if [ "$COMMAND" = "logs" ]; then
    logs
fi

if [ "$COMMAND" = "update" ]; then
    update
fi

if [ ! "$COMMAND" ]; then
    commands
fi

