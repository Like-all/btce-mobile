#!/usr/bin/env bash

if [[ `whoami` != 'root' ]]; then
    echo "You are not root."
    exit 1
fi
