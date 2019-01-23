# CloudQuery

Turn any website to serverless API (with SPA supported!)

## API

baseURL: lambda function url
queries: url; selectors
example: https://56yv878hel.execute-api.us-west-2.amazonaws.com/staging?url=https://news.ycombinator.com/best&selectors=*:nth-child(1) > * > *:nth-child(2) > *:nth-child(2) > *:nth-child(1),*:nth-child(3) *:nth-child(1) > *:nth-child(3) > *:nth-child(1),

## Run locally

```bash
npm i
npm start
```

## Preview in action

https://cloudfetch.info/createFetcher

## Prerequest

- An aws account used to deploy lambda function
- [`up`](https://up.docs.apex.sh) used to deploing to lambda with ease.

AWS Credential Profiles
Most AWS tools support the ~/.aws/credentials file for storing credentials, allowing you to specify AWS_PROFILE environment variable so Up knows which one to reference. To read more on configuring these files view Configuring the AWS CLI.

Here’s an example of ~/.aws/credentials, where export AWS_PROFILE=myaccount would activate these settings.

```bash
[myaccount]
aws_access_key_id = xxxxxxxx
aws_secret_access_key = xxxxxxxxxxxxxxxxxxxxxxxx
```

## Deploy

```bash
# deploy cloudquery
up

# get cloudquery base URL
up url
```