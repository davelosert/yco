#! /usr/bin/env bash

# This is a stub or spy for the yabai binary to be used in CLI / E2E Tests.
# It can be used to fake outputs.
# It will mirror all commands into a file "yabai_calls.log" where it can be accessed
COMMAND=$@

touch $HOME/yabai_calls.log



if [[ $COMMAND == "-m query --spaces" ]]; then
	echo $QUERY_SPACES_RESULT
elif [[ $COMMAND == "-m query --windows" ]]; then
	# Maintain a call count file so we can know the right json to return.
	# THis is necessary as e.g. `apply-layout` quersies yabai windows multiple times
	CALL_FILE=$HOME/yabai_window_call_count
	if test -f $CALL_FILE; then
		CALL_COUNT=$(cat ${CALL_FILE})
	else
		CALL_COUNT=0
	fi

	cat "$HOME/yabaiWindowResult${CALL_COUNT}.json"

	CALL_COUNT=$(($CALL_COUNT+1))
	echo $CALL_COUNT > $CALL_FILE
else
	echo "yabai $@" >> $HOME/yabai_calls.log
fi
