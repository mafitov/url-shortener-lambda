# URL Shortener Lambda

A lightweight **Serverless URL Shortener** built with **AWS Lambda**, **API Gateway (HTTP API)**, and **DynamoDB**, using the **Serverless Framework v3**.

This service provides two main endpoints:

* `POST /` — Create a shortened URL
* `GET /{hash}` — Retrieve and redirect to the original long URL

## Architecture Overview

```
Client ─▶ API Gateway (HTTP API)
               │
               ▼
          AWS Lambda
          ├── url-create
          └── url-get
               │
               ▼
          DynamoDB (URLTable)
```

## Configuration

**Service name:** `url-shortener-lambda`
**Framework version:** `3`
**Runtime:** `Node.js 20.x`
**Region:** `eu-central-1`
**Stage:** `dev`

## Environment Variables

| Variable    | Description                                        |
| ----------- | -------------------------------------------------- |
| `URL_TABLE` | Name of the DynamoDB table storing shortened URLs. |

## Packaging & Plugins

This service uses the `serverless-bundle` plugin to optimize and package functions individually for deployment.

```yaml
package:
  individually: true

plugins:
  - serverless-bundle
```

## IAM Permissions

Each function runs with a minimal IAM role allowing access to DynamoDB operations required by the service.

```yaml
iam:
  role:
    statements:
      - Effect: Allow
        Action:
          - dynamodb:GetItem
          - dynamodb:PutItem
        Resource:
          - Fn::GetAtt: [ URLTable, Arn ]
```

## Functions

### 1. `url-create`

**Handler:** `src/functions/url-create.handler`
**Method:** `POST /`

Creates a new short URL entry in DynamoDB.

### Example Request

```bash
curl -X POST https://<api-id>.execute-api.eu-central-1.amazonaws.com/ \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### Example Response

```json
{
  "shortUrl": "https://<domain>/<hash>"
}
```

### 2. `url-get`

**Handler:** `src/functions/url-get.handler`
**Method:** `GET /{hash}`

Fetches the original URL from DynamoDB using the short hash.
If found, it redirects to the long URL.

### Example Request

```bash
curl -i https://<api-id>.execute-api.eu-central-1.amazonaws.com/abc123
```

### Example Response

```
HTTP/1.1 302 Found
Location: https://example.com
```

## DynamoDB Table Definition

| Attribute | Type | Key   | Description                               |
| --------- | ---- | ----- | ----------------------------------------- |
| `hash`    | `S`  | HASH  | Unique identifier for the shortened URL.  |
| `ttl`     | `N`  | (TTL) | Optional time-to-live for URL expiration. |

**Properties:**

* `BillingMode: PAY_PER_REQUEST`
* `TimeToLiveSpecification` enabled
* `DeletionPolicy: Delete`

```yaml
Resources:
  URLTable:
    Type: AWS::DynamoDB::Table
    Properties:
      AttributeDefinitions:
        - AttributeName: hash
          AttributeType: S
      KeySchema:
        - AttributeName: hash
          KeyType: HASH
      TimeToLiveSpecification:
        AttributeName: ttl
        Enabled: true
      BillingMode: PAY_PER_REQUEST
      TableName: ${self:provider.environment.URL_TABLE}
```

## Deployment

### Prerequisites

* [Node.js 20+](https://nodejs.org/)
* [Serverless Framework v3+](https://www.serverless.com/framework/docs/getting-started)
* AWS credentials configured with sufficient permissions.

### Deploy Command

```bash
serverless deploy
```

This will:

* Create the Lambda functions.
* Provision DynamoDB.
* Deploy an API Gateway endpoint.

### Removal

To remove all deployed resources:

```bash
serverless remove
```

This will delete the Lambda functions, API Gateway endpoints, and DynamoDB table.
