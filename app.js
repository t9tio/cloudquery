// TODO: improve performance: not waiting for page load, but wait for element ready
// https://github.com/cyrus-and/chrome-remote-interface/wiki/Wait-for-a-specific-element
// TODO: improve code: same code appearing twice!!
// wait for ajax ref: 
// https://github.com/cyrus-and/chrome-remote-interface/issues/331#issuecomment-374254907
const launchChrome = require('@serverless-chrome/lambda');
const CDP = require('chrome-remote-interface');
const express = require('express');
const app = express();
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const config = require('./config');

app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

const limiter = rateLimit(config.rateLimit);

app.use('/fullHtml', limiter);
app.use('/query', limiter);

//  apply to all requests
// app.use(limiter);

app.use(cors());

app.set('json replacer', null); // property transformation rules
app.set('json spaces', 2); // number of spaces for indentation

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

app.use('/public', express.static('./public'));

/**
 * Sample query:
 * req.url: 'https://baidu.com'
 * req.selectors: .mnav:nth-child(3),.mnav:nth-child(4)
 */
app.get('/query', async function(req, res){
    // for searching log
    // https://up.docs.apex.sh/#guides.accessing_lambda_context
    let requestId = '';
    const xContext = req.headers['x-context'];
    if (xContext) {
        requestId = JSON.parse(xContext).requestId;
        console.log('__requestId', requestId);
    }

    let {url, selectors} = req.query;
    console.log('__url:', url);
    console.log('__selectors:', selectors);

    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
        res.status(400).send('must provide a url');
        throw new Error('throwing as url not valid');
    }
    if (!selectors) {
        res.status(400).send('must provide selectors');
        throw new Error('throwing as selectors not valid');
    }

    selectorArr = selectors.split(',');

    await launchChrome({
        flags: ['--window-size=1280,1696', '--hide-scrollbars'],
    });

    let client;
    try {
        // connect to endpoint
        client = await CDP();
        // extract domains
        const {Network, Page, Runtime} = client;

        // enable events then start!
        await Network.enable();
        await Page.enable();
        await Network.setCacheDisabled({cacheDisabled: true});
        await Page.navigate({url});

        const requestCounterMinWaitMs = 1500;
        const requestCounterMaxWaitMs = 20000;

        let numSent = 0;
        let numReceived = 0;
        let startTime = new Date().getTime();

        function minWaitTimeExceeded() {
        return new Date().getTime() - startTime > requestCounterMinWaitMs;
        }

        function maxWaitTimeExceeded() {
        return new Date().getTime() - startTime > requestCounterMaxWaitMs;
        }

        Network.requestWillBeSent((params) => {
            if (params.type == 'XHR') {
              console.log('Sent ' + params.type);  
              ++numSent;
            }
        });
        Network.responseReceived((params) => {
            if (params.type == 'XHR') {
              console.log('Recieved ' + params.type);
              ++numReceived;
            }
        });

        // TODO: let user choose if it is a page sending ajax?
        await new Promise((resolve, reject) => {
            Page.loadEventFired(() => {
                var ajaxDoneInterval = setInterval(function() {
                    if (numSent == numReceived && minWaitTimeExceeded()) {
                      clearInterval(ajaxDoneInterval);
                      resolve();
                    } else if (maxWaitTimeExceeded()) {
                      reject('ajax timeout after 20 seconds');
                    } else {
                      if (numSent == numReceived) {
                        console.log('No pending ajax requests, but still waiting for minWaitTime of ' + requestCounterMinWaitMs + '. Current wait: ' + (new Date().getTime() - startTime));
                      } else {
                        console.log('Still waiting for ' + (numSent - numReceived) + ' ajax requests');
                      }
                    }
                  }, 300);
            });
        });

        const promiseArr = selectorArr.map(async selector => {
            const innerTextRes = await Runtime.evaluate({
                expression: `document.querySelector('${selector}').innerText`,
            });
            const hrefRes = await Runtime.evaluate({
                expression: `document.querySelector('${selector}').href`,
            });
            const srcRes = await Runtime.evaluate({
                expression: `document.querySelector('${selector}').src`,
            });
            return {
                // selector,
                innerText: innerTextRes.result.value,
                href: hrefRes.result.value,
                imgSrc: srcRes.result.value
            }
        });

        const queryRes = await Promise.all(promiseArr.map(p => p.catch(e => e.message)));

        console.log('__res: ', queryRes);

        res.json({
            requestId,
            url,
            selectors,
            contents: queryRes
        });
  } catch (err) {
    console.error(err);
    // TODO: easier way to identify error, maybe an errId?
    res.status(503).send({
        requestId,
        msg: 'request error',
        emsg: err.message,
    });
  } finally {
    if (client) {
        await client.close();
    }
  }
});
/**
 * Sample query:
 * req.url: 'https://baidu.com'
 */
app.get('/fullHtml', async function(req, res){
    // for searching log
    // https://up.docs.apex.sh/#guides.accessing_lambda_context
    let requestId = '';
    const xContext = req.headers['x-context'];
    if (xContext) {
        requestId = JSON.parse(xContext).requestId;
        console.log('__requestId', requestId);
    }

    let {url} = req.query;
    console.log('__url:', url);


    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
        res.status(400).send('must provide a url');
        throw new Error('throwing as url not valid');
    }

    await launchChrome({
        flags: ['--window-size=1280,1696', '--hide-scrollbars'],
    });

    let client;
    try {
        // connect to endpoint
        client = await CDP();
        // extract domains
        const {Network, Page, Runtime} = client;

        // enable events then start!
        await Network.enable();
        await Page.enable();
        await Network.setCacheDisabled({cacheDisabled: true});
        await Page.navigate({url});

        const requestCounterMinWaitMs = 1500;
        const requestCounterMaxWaitMs = 20000;

        let numSent = 0;
        let numReceived = 0;
        let startTime = new Date().getTime();

        function minWaitTimeExceeded() {
        return new Date().getTime() - startTime > requestCounterMinWaitMs;
        }

        function maxWaitTimeExceeded() {
        return new Date().getTime() - startTime > requestCounterMaxWaitMs;
        }

        Network.requestWillBeSent((params) => {
            if (params.type == 'XHR') {
              console.log('Sent ' + params.type);  
              ++numSent;
            }
        });
        Network.responseReceived((params) => {
            if (params.type == 'XHR') {
              console.log('Recieved ' + params.type);
              ++numReceived;
            }
        });

        // TODO: let user choose if it is a page sending ajax?
        await new Promise((resolve, reject) => {
            Page.loadEventFired(() => {
                var ajaxDoneInterval = setInterval(function() {
                    if (numSent == numReceived && minWaitTimeExceeded()) {
                      clearInterval(ajaxDoneInterval);
                      resolve();
                    } else if (maxWaitTimeExceeded()) {
                      reject('ajax timeout after 20 seconds');
                    } else {
                      if (numSent == numReceived) {
                        console.log('No pending ajax requests, but still waiting for minWaitTime of ' + requestCounterMinWaitMs + '. Current wait: ' + (new Date().getTime() - startTime));
                      } else {
                        console.log('Still waiting for ' + (numSent - numReceived) + ' ajax requests');
                      }
                    }
                  }, 300);
            });
        });

        const result = await Runtime.evaluate({
            expression: 'document.documentElement.outerHTML'
        });
        const html = result.result.value;

        res.send({
            requestId,
            url,
            html,
        });
  } catch (err) {
    console.error(err);
    // TODO: easier way to identify error, maybe an errId?
    res.status(503).send({
        requestId,
        msg: 'request error',
        emsg: err.message,
    });
  } finally {
    if (client) {
        await client.close();
    }
  }
});

const { PORT = 3000 } = process.env;
console.log(`server running on http://localhost:${PORT}`);
app.listen(PORT);
