import json
import boto3

dynamo = boto3.client('dynamodb')


def lambda_handler(event, context):
    # Get all memes from table
    response = dynamo.get_item(
        TableName='meme_info', #CHANGE ME
        Key={
            "meme_id": {
                "S": event['meme_id']
            }
        }
    )

    meme = {
        "meme_id": response['Item']['meme_id']['S'],
        "username": response['Item']['username']['S'],
        "name": response['Item']['name']['S'],
        "likes": response['Item']['likes']['N']
    }
    return meme
