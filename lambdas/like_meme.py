import json
import boto3

dynamo = boto3.resource('dynamodb')
table = dynamo.Table('meme_info') #CHANGE ME


def lambda_handler(event, context):
    # Update Like in dynamo
    r = table.update_item(
        Key={
            'meme_id': event['meme_id']
        },
        UpdateExpression='SET likes = likes + :val1',
        ExpressionAttributeValues={
            ':val1': 1
        },
        ReturnValues="UPDATED_NEW"
    )
    # Return updated value
    print(r['Attributes']['likes'])
    return str(r['Attributes']['likes'])
