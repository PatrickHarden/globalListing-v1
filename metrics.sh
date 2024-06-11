#!/bin/bash
USER=metricuser
PASS=YRuKqgECVMR6choLPykhUpd
URL='https://devopsmetrics.cbre.com/api/v2/metrics'
CURL=/usr/bin/curl
DATE=/bin/date

get_timestamp() {
	$DATE +"%Y-%m-%dT%T"
}


POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -a|--appid)
    APPID="$2"
    shift
    shift
    ;;
    -p|--procid)
    PROCID="$2"
    shift
    shift
    ;;
    -t|--toolid)
    TOOLID="$2"
    shift
    shift
    ;;
		-d|--desc)
    DESC="$2"
    shift
    shift
    ;;
		-v|--version)
    VERSION="$2"
    shift
    shift
    ;;
		-c|--cycle)
    CYCLE="$2"
    shift
    shift
    ;;
		-z|--passed)
    PASSED="$2"
    shift
    shift
    ;;
		-f|--failed)
    FAILED="$2"
    shift
    shift
    ;;
		-b|--blocked)
    BLOCKED="$2"
    shift
    shift
    ;;
		-s|--start)
    START="$2"
    shift
    shift
    ;;
		-e|--end)
    END="$2"
    shift
    shift
    ;;
		-h|--help)
		echo -e "Usage $0:  [-a|--appid] [-p|--procid] [-t|--toolid] (-d|--desc) (-v|--version) (-c|--cycle) (-z|--passed) (-f|--failed) (-b|--blocked) (-s|--start) (-e|--end)"
    shift
    ;;
    *)
    POSITIONAL+=("$1")
    shift
    ;;
esac
done

set -- "${POSITIONAL[@]}" # restore positional parameters


#
#TEST IF APPID, PROCID AND TOOLID ARE ALL SET.  IF NOT EXIT 1.
#
if [ -z "$APPID" ] || [ -z "$PROCID" ] || [ -z "$TOOLID" ]
then
	echo -e "\nApplication ID [ -a|--appid], Automation Process [-p|--procid] and Automation Tool ID [-t|--toolid]  MUST ALL be set.\n"
	exit 1
fi

#
#TEST IF START TIME IS SET.  IF NOT GET CURRENT DATE & TIME
#
if [ -z "$START" ]
then
	START=$(get_timestamp)
fi

#
#TEST IF END TIME IS SET.  IF NOT GET CURRENT DATE & TIME
#
if [ -z "$END" ]
then
  END=$(get_timestamp)
fi

if [ -z "$PASSED" ]
then
	PASSED=0
fi
if [ -z "$FAILED" ]
then
  FAILED=0
fi
if [ -z "$CYCLE" ]
then
	CYCLE=0
fi
if [ -z "$BLOCKED" ]
then
	BLOCKED=0
fi


$CURL -u $USER:$PASS -H "Content-Type: application/json" -X POST -d "{\"ApplicationId\":$APPID, \"AutomationProcessId\":$PROCID, \"AutomationToolId\":$TOOLID, \"Description\":\"$DESC\", \"Version\":\"$VERSION\", \"Cycle\":$CYCLE, \"Passed\":$PASSED, \"Failed\":$FAILED, \"Blocked\":$BLOCKED, \"StartDateTime\":\"$START\", \"EndDateTime\":\"$END\" }" $URL
