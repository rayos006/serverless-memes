# Serverless Memes Website
S3 site with lambdas, API Gateway, and DynamoDB

# Setup
All code is in this repository for you to get started with your very own meme site. This is designed to run in AWS and specifically it has dependencies in BYU's traning account

## DynamoDB
Create a table using meme_id (String) as the primary key and default settings

Take note of your table name for the next parts

## API Gateway
Now that the lambdas are created, Go to API Gateway and create your meme API to front the lambdas. An example swagger file has been provided but feel free to be creative. You will need 4 endpoints that point to the following:
- POST (Your create meme lambda)
- GET (Your get all memes lambda)
- GET (Your get meme lambda)
-PUT (Your like meme lambda)
*** Make sure you are expecting ```meme_id``` in the url as a parameter for the last two.


Dont forget to add the Mapping Templates under the Integration Tab. This is what you will be forwarding to your lambdas. See examples below: (All are using ```application\json```)

- POST
```sh
  {
    "data" : $input.json("$")
  }
```

- GET (Your get meme lambda)
```sh
{
    "meme_id" : "$input.params('meme_id')"
}
```

- PUT 
```sh
{
    "meme_id" : "$input.params('meme_id')"
}
```

After all endpoints are created enable CORS by clicking Actions -> Enable CORS

You are ready to deploy your API! Follow along below:
- Actions
- Deploy API
- Create a new Deployment stage

Make note of your API URL for the next parts.

## S3 Website

Go to S3 and create yourself a bucket.

Next we will configure your new bucket to allow other people to see your work. Follow along below:
- Under Properties -> Static Website Hosting, Click Use this bucket to host a website
- Enter index.html as the Index Document
- Under Permissions -> Access Control List -> Public Access
- Let Everyone List Objects
- Under Permissions -> Bucket Policy
- Enter a policy like the one below (Make sure you add your bucket name!)
```sh
{
    "Version": "2019-02-20",
    "Id": "PolicyForPublicWebsiteContent",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```

Now your bucket is ready to host a website!

## Lambdas
To start using the code provided to create your lambdas. Make sure you assign the ```lambda-rekognition-full``` security group to allow the proper permissions

Find the ```change me``` comments in the code and change them to your ```S3 Bucket Name``` or ```DynamoDB Table Name```

## Meme Code

In S3 -> js -> meme.js, go add your API URLs where it says ```change me```

Now upload your code to your S3 bucket. Make sure your index.html is at the root and that you have the same file structure as the files in ```api```

## Route 53

Go back to S3 under Properties -> Static Website Hosting and find your website URL
*** Go ahead and try it out if you want

Go to Route53, under the awsbootcamp.byu.edu hosted zone, add your own ```A Record``` sub-domain that points to your S3 website

# Conclusion
You just made a completely serverless meme site. Now there is a twist, go look at the create meme code. It is using AWS Rekognition to filter out any inappropriate images. I have provided an image of a woman doing yoga that will be flagged it's under ```images```. Go ahead try it out!