#!/usr/bin/env python
import argparse
import datetime
import devOpsAPI
import xml.etree.ElementTree as ET


def code_checkin():
    print ('Code Checkin')
    devOpsAPI.post_DevOps(
        3, _StartTime, datetime.datetime.now().isoformat())


def code_build():
    print ('Code Build')
    devOpsAPI.post_DevOps(
        4, _StartTime, datetime.datetime.now().isoformat())


def unit_tests():
    print ('Unit Tests')
    root = ET.parse('test-reports/junit.xml')
    testsuites = root.find('.')
    devOpsAPI.post_DevOps(
        5, _StartTime, datetime.datetime.now().isoformat(), Passed=testsuites.attrib['tests'], Failed=testsuites.attrib['failures'])
    code_coverage()


def code_coverage():
    print ('Code Coverage')
    root = ET.parse('coverage/clover.xml')
    codeMetrics = root.find('.//metrics')
    coveredconditionals = float(codeMetrics.attrib['coveredconditionals'])
    coveredstatements = float(codeMetrics.attrib['coveredstatements'])
    coveredmethods = float(codeMetrics.attrib['coveredmethods'])
    conditionals = float(codeMetrics.attrib['conditionals'])
    statements = float(codeMetrics.attrib['statements'])
    methods = float(codeMetrics.attrib['methods'])
    coveragePercentage = str(((coveredconditionals + coveredstatements +
                               coveredmethods) / (conditionals + statements + methods))*100)+'%'

    devOpsAPI.post_DevOps(
        6, _StartTime, datetime.datetime.now().isoformat(), MetaData="{'CodeCoverage' = '" + coveragePercentage + "'}")


def regression_tests():
    print ('Regression Tests')
    devOpsAPI.post_DevOps(
        16, _StartTime, datetime.datetime.now().isoformat())


def CD_staging():
    print ('CD Staging')
    devOpsAPI.post_DevOps(
        32, _StartTime, datetime.datetime.now().isoformat())


def CD_prod():
    print ('CD Prod')
    devOpsAPI.post_DevOps(
        33, _StartTime, datetime.datetime.now().isoformat())


def types_to_functions(argument):
    print(argument)
    switcher = {
        'CODE_CHECKIN': code_checkin,
        'CODE_BUILD': code_build,
        'UNIT_TESTS': unit_tests,
        'REGRESSION_TESTS': regression_tests,
        'CD_STAGING': CD_staging,
        'CD_PROD': CD_prod
    }
    # Get the function from switcher dictionary
    func = switcher.get(argument, lambda: "Invalid Type")
    # Execute the function
    print (func())


# Main method.
if __name__ == '__main__':
    _StartTime = datetime.datetime.now().isoformat()
    parser = argparse.ArgumentParser(
        description='Script to send data to Dev ops Dashboard')
    parser.add_argument('--Type', '-id',
                        help="Automation Process Id", type=str, default='CODE_CHECKIN')
    args = parser.parse_args()
    if not any(vars(parser.parse_args()).values()):
        parser.print_help()
        exit()
    types_to_functions(args.Type)
