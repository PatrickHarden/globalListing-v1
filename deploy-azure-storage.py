import json
import os
import uuid
import sys
import mimetypes
import datetime
import argparse
from azure.storage.blob import BlockBlobService, PublicAccess
from azure.storage.blob.models import ContentSettings

# container_name = "$(AZURE_CONTAINER)"
# access_key = "$(AZURE_STORAGE_ACCESS_KEY_DEV_EUN)"
# account_name = "$(AZURE_STORAGE_ACCOUNT_DEV_EUN)"
# version number = "$(BuildNumber)"


def list_files(dir):
    r = []
    for root, dirs, files in os.walk(dir):
        for name in files:
            r.append(os.path.join(root, name))
    return r


def get_version():
    # if not args.VersionNumber:
    #     version = datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')
    # else:
    #     version = args.VersionNumber

    with open("build.json", "r") as read_file:
        data = json.load(read_file)
    
    latestBuild = data["latestBuild"] # latest build, updated in source code

    if not args.VersionNumber:
        buildversion = latestBuild
    else:
        buildversion = args.VersionNumber
    
    return buildversion


def copy_files(files, dest, cache_control):
    print("\nCopy static folder assets to %s" % (dest))

    block_blob_service = BlockBlobService(args.StorageAccount, args.StorageKey)

    for file in files:
        ctype, encoding = mimetypes.guess_type(file)
        buildTarget = dest + file

        print("Copying " + file + " to " + buildTarget)

        content_encoding = 'gzip' if 'gzip' in file else ''

        block_blob_service.create_blob_from_path(
            args.BlobName, buildTarget, file, content_settings=ContentSettings(content_type=(ctype or 'application/octet-stream'), cache_control=cache_control, content_encoding=content_encoding))



def deployToAzure():
    print("Started")
    files = list_files('release')

    version = get_version()

    # copy release files to versioned folder
    copy_files(files,  ("%s\\" % (version)), 'max-age=900')



# Main method.
if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Azure DevOps script to deploy assets from Github to Azure Storage blobs')

    parser.add_argument('--BlobName', '--b',
                        help="Azure Storage Blob", type=str)

    parser.add_argument('--StorageAccount', '-a',
                        help="Azure Storage Container", type=str)

    parser.add_argument('--StorageKey', '--ak',
                        help="Azure Storage Access Key", type=str)

    parser.add_argument('--VersionNumber', '--v', help="Current version number", type=str)

    args = parser.parse_args()

    if not any(vars(parser.parse_args()).values()):
        parser.print_help()
        exit()

    deployToAzure()

# test this script locally, and copy files to dev container
# python .\deploy-azure-storage.py --BlobName "cbre-search-spa" --StorageAccount "devlistingsearchcbreeun" --StorageKey "7y4JA2oLHS2NIlEDxIWkrazzkUZTc2OaHJYpB0K0/0zn91Gpfb6x3NT6nk0AYE2eV1JPKnTcJlbNOul7Fx4lhA=="


