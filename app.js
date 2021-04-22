const lark = require("@larksuiteoapi/allcore");
const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const appSettings = lark.core.newInternalAppSettings(
  "xxx",
  "xxx",
  "xxx",
  "xxx"
)
const conf = lark.core.newConfig(
  lark.core.Domain.FeiShu,
  appSettings,
  new lark.core.ConsoleLogger(),
  lark.core.LoggerLevel.INFO,
  new lark.core.DefaultStore()
)

lark.event.setTypeHandler(conf, "message", (ctx, event) => {
  const body = {
    "open_id": event.event.open_id,
    "msg_type": "text",
    "content": {
        "text": event.event.text,
    }
  }
  // Build request
  const req = lark.api.newRequest("message/v4/send", "POST", lark.api.AccessTokenType.Tenant, body)
  // Send request 
  lark.api.sendRequest(conf, req).then(r => {
      // Print the requestId of the request
      console.log(r.getRequestID())
      // Print the response status of the request
      console.log(r.getHTTPStatusCode())
      console.log(r) // r = response.body
  }).catch(e => {
      // Error handling of request
      console.log(e)
  })
})

app.post('/webhook/event', (req, res) => {
  const request = new lark.core.Request()
  Object.entries(req.headers).forEach(([k, v]) => {
      request.headers[k] = v
  })
  request.body = req.body
  lark.event.httpHandle(conf, request, undefined).then(response => {
      res.status(response.statusCode).send(response.body)
  })
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;
