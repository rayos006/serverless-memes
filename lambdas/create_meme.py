import os
import urllib
import base64
import boto3
import uuid

# Initiate Clients
rekognition = boto3.client('rekognition')
s3 = boto3.client('s3')
dynamo = boto3.client('dynamodb')


def lambda_handler(event, context):
    # Convert to bytes
    pic = base64.b64decode(event['data']['pic'])
    
    # Check if incoming image is explicit
    is_explicit = detect_explicit_content(pic)
    if is_explicit != None:
        return is_explicit

    # Create ID
    image_uuid = uuid.uuid1().urn[9:]

    # Add info to DynamoDB
    dynamo.put_item(
        TableName='meme_info', # CHANGE ME
        Item={
            "name": {
                "S": event['data']['name']
            },
            "username": {
                "S": event['data']['username']
            },
            "meme_id": {
                "S": image_uuid
            }
        }
    )

    # Add image to S3
    s3.put_object(
        ACL='private',
        Body=pic,
        Bucket='byuawsbootcamp-memes', # CHANGE ME
        Key="images/" + image_uuid
    )

    return


def detect_explicit_content(image_bytes):
    """ Checks image for explicit or suggestive content using Amazon Rekognition Image Moderation.
    Args:
        image_bytes (bytes): Blob of image bytes.
    Returns:
        (boolean)
        True if Image Moderation detects explicit or suggestive content in blob of image bytes.
        False otherwise.
    """
    try:
        response = rekognition.detect_moderation_labels(
            Image={
                'Bytes': image_bytes,
            }
        )
    except Exception as e:
        print(e)
        print('Unable to detect labels for image.')
        raise(e)

    # Return Moderation labels if needed
    labels = response['ModerationLabels']
    print(labels)
    if not labels:
        return None
    return labels
