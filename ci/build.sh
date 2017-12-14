#!/usr/bin/env bash
. ./config.sh
yarn install && yarn pre-build && yarn build
