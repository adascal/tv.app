#!/usr/bin/env bash

BASEDIR=$(dirname "$0")
cd $BASEDIR

BRANCH=$(git branch | sed -n '/\* /s///p')
PREV_LAST_COMMIT=$(git rev-parse HEAD)
git fetch origin
git reset --hard origin/$BRANCH
git rebase origin/$BRANCH
NEW_LAST_COMMIT=$(git rev-parse HEAD)

if [ "$PREV_LAST_COMMIT" != "$NEW_LAST_COMMIT" ]; then
    yarn install
    yarn build
    yes | cp -rf build/* /var/www/tv/
fi