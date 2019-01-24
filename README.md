
# CloudQuery

Turn any website to serverless API (with SPA supported!)

Try online: https://2uvlp0y13b.execute-api.us-west-2.amazonaws.com/staging/

![](https://user-images.githubusercontent.com/5512552/51652692-86afc880-1fcb-11e9-92df-756090cd35dc.gif)

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

- Input `up` in terminal and hit enter :)
- `up url` to see the API baseURL of your CloudQUery

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
