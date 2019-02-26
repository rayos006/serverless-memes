import json
import boto3

dynamo = boto3.client('dynamodb')

def lambda_handler(event, context):
    # Get all memes from table
    response = dynamo.scan(
        TableName='meme_info', # CHANGE ME
    )

    memes = []
    # Build JSON object for all items
    for item in response['Items']:
        memes.append(
            {
                'meme_id': item['meme_id']['S'],
                'name': item['name']['S'],
                'username': item['username']['S'],
                'likes': item['likes']['N']
            })

    return memes
