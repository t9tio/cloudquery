
# CloudQuery

Turn any website to serverless API (with SPA support!)

Try online: https://2uvlp0y13b.execute-api.us-west-2.amazonaws.com/staging/

![](https://user-images.githubusercontent.com/5512552/51655619-6b978580-1fd8-11e9-93a9-9accf8e25e54.gif)

## API

Example url: [https://2uvlp0y13b.execute-api.us-west-2.amazonaws.com/staging/query?url=https://news.ycombinator.com/best&selectors=*:nth-child(1) > * > *:nth-child(2) > *:nth-child(2) > *:nth-child(1),*:nth-child(3) *:nth-child(1) > *:nth-child(3) > *:nth-child(1)](https://2uvlp0y13b.execute-api.us-west-2.amazonaws.com/staging/query?url=https://news.ycombinator.com/best&selectors=*:nth-child(1)%20%3E%20*%20%3E%20*:nth-child(2)%20%3E%20*:nth-child(2)%20%3E%20*:nth-child(1),*:nth-child(3)%20*:nth-child(1)%20%3E%20*:nth-child(3)%20%3E%20*:nth-child(1))

Query params:

- url: url of the webpage you want to fetch
- selectors: css selectors describing the elements interestes you

Returns:

- innerText: element innerText
- href: element href

## Run locally

```bash
npm i
npm start
```

## How to deploy your own CloudQuery to AWS lambda

### 1. Configuration

- update `profile`([AWS Credential Profiles](https://up.docs.apex.sh/#aws_credentials)) in `up.json` to use your own aws account
- update `rateLimit` in `config.json` to set your own rate limit (Default: 5 request/hour)

### 2. Deploy

1. `npm install`
1. install [`up`](https://up.docs.apex.sh)
1. Input `up` in terminal and hit enter :)
1. `up url` to see the API baseURL of your CloudQuery

## Contribute

### Backend

```bash
vim app.js
```

### Frontend

```bash
cd frontend
# develop
npm start
# build
npm run build
```

# Thanks

- [up](https://github.com/apex/up) for deploying serverless API to AWS with ease
- [serverless-chrome](https://github.com/adieuadieu/serverless-chrome) for running chrome on AWS lambda
- [finder](https://github.com/antonmedv/finder) for making it easy to select elements on webpage