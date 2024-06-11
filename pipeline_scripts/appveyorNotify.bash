#!/bin/bash -ex
DATE_VALUE=`date -u +"%Y-%m-%dT%H:%M:%SZ"`
curl -X POST \
-H "Authorization: Bearer ${APPVEYOR_TOKEN}" \
-H "Content-Type: application/json" \
-d "{'accountName':'${APPVEYOR_ACCOUNT}','projectSlug':'${APPVEYOR_PROJECT}','branch':'${BITBUCKET_BRANCH}','commitId':'${BITBUCKET_COMMIT}'}" \
https://ci.appveyor.com/api/builds