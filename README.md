
# CloudQuery

[![Join us](https://badgen.net/badge/Join%20the%20community%20of%20t9t.io/Get%20in%20touch/green)](https://t9t.io/#contact)

Turn any website to API by several clicks.

Try online: https://cloudquery.t9t.io

![](https://user-images.githubusercontent.com/5512552/51655619-6b978580-1fd8-11e9-93a9-9accf8e25e54.gif)

## API

- Sample Query: [Best 3 posts on HN](https://cloudquery.t9t.io/query?url=https%3A%2F%2Fnews.ycombinator.com%2F&selectors=*:nth-child(3)%20*:nth-child(1)%20%3E%20*:nth-child(3)%20%3E%20*:nth-child(1),*:nth-child(4)%20%3E%20*:nth-child(3)%20%3E%20*:nth-child(1),*:nth-child(7)%20%3E%20*:nth-child(3)%20%3E%20*:nth-child(1))

Query params:

- url: url of the webpage you want to fetch
- selectors: css selectors describing the elements interests you

Returns:

- innerText: element innerText
- href: element href

## Run locally

```bash
# install dependencies
npm i
# start backend server(for auto restart when code change)
npm run sb
# start frontend server(for auto restart when code change)
npm run sf

# visit http://localhost:1234
```

## How to deploy your own CloudQuery to AWS lambda

### 1. Configuration

- update `profile`([AWS Credential Profiles](https://up.docs.apex.sh/#aws_credentials)) in `up.json` to use your own aws account
- update `rateLimit` in `config.json` to set your own rate limit (Default: 5 request/hour)

### 2. Deploy

```bash
# deploy to aws lambda
up

# see the URL of your CloudQuery
up url

# deploy production version(to cloudquery.t9t.io)
up deploy production

```

# Thanks

- [up](https://github.com/apex/up) for deploying serverless API to AWS with ease
- [serverless-chrome](https://github.com/adieuadieu/serverless-chrome) for running chrome on AWS lambda
- [finder](https://github.com/antonmedv/finder) for making it easy to select elements on webpage
