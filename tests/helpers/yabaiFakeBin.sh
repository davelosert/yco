#! /usr/bin/env bash

# This is a stub or spy for the yabai binary to be used in CLI / E2E Tests.
# It can be used to fake outputs.
# It will mirror all commands into a file "yabai_calls.log" where it can be accessed
COMMAND=$@

touch $HOME/yabai_calls.log

if [[ $COMMAND == "-m query --spaces" ]]; then
	echo $QUERY_SPACES_RESULT
elif [[ $COMMAND == "-m query --windows" ]]; then
	echo $QUERY_WINDOWS_RESULT
else
	echo "yabai $@" >> $HOME/yabai_calls.log
fi
