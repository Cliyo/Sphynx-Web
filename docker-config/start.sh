#!/bin/sh

dbus-daemon --system --print-address

avahi-daemon --no-drop-root &

nginx -g "daemon off;"