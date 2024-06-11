#!/usr/bin/env python
import requests
import os
import argparse
import datetime
from enum import Enum


class ApplicationProcessId(Enum):
    CheckIn = 3
    UnitTests = 5


def post_DevOps(AutomationProcessId, StartTime, EndTime, Passed=1, Failed=0, Blocked=0, MetaData="{}"):
    API_URL = "https://stg-devopsmetricsservice.azurewebsites.net/api/metrics/submit"
    data = {
        "ApplicationId": "117",
        "AutomationProcessId": AutomationProcessId,
        "AutomationToolId": "97",
        "Description": "",
        "Version": "2",
        "Cycle": os.getenv('BITBUCKET_BUILD_NUMBER', 'NONE'),
        "StartDateTime": StartTime,
        "EndDateTime": EndTime,
        "Passed": Passed,
        "Failed": Failed,
        "Blocked": Blocked,
        # "{'CodeCoverage' = '15%', 'Vulnerabilities' = '12'}"
        "Metadata": MetaData
    }
    resp = requests.post(API_URL, json=data)
    if resp.status_code != 200:
        print('Error' + format(resp))
    else:
        print('Metric subitted - Type: ' + str(AutomationProcessId) +
              ' Start: ' + StartTime + ' End: ' +
              EndTime + ' data:' + str(data))


# Main method.
if __name__ == '__main__':
    _StartTime = datetime.datetime.now().isoformat()
    parser = argparse.ArgumentParser(
        description='Script to send data to Dev ops Dashboard')
    parser.add_argument('--AutomationProcessId', '-id',
                        help="Automation Process Id", type=str, default=3)
    parser.add_argument('--StartTime', '-s',
                        help="Start Time", type=str, default=datetime.datetime.now().isoformat())
    parser.add_argument('--EndTime', '-e',
                        help="End Time", type=str, default=datetime.datetime.now().isoformat())
    args = parser.parse_args()
    print(format(datetime.datetime.now().isoformat()))
    post_DevOps(args.AutomationProcessId,
                _StartTime, args.EndTime)
    # post_DevOps(args.AutomationProcessId, args.CycleNumber,
    # args.StartTime, args.EndTime)
