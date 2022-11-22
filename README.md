# GROWX — CLIENT APP

## Description

Non custodial version of @growx market making bot, for self hosted market making applications. This app acts as a bridge between @growx market maker and user owned account on one of 100+ centralized crypto exchanges. Client app is fully automated and does not require any intervention other than configuration prior to initiation.

## Market making features

- Liquidity management
- Transaction volume management

## Prerequisites

- API keys for one or more accounts on supported exchanges (contact support if your exchange is not among 100+ available in @growx/rpcs)
- @growx access token 
- cloud server with latest stable versions of "node" and "npm"

## Quick Start

#### 1. Get the latest version

You can start by cloning the latest version of GROWX - CLIENT aAPP on your
local machine by running:

```shell
$ git clone https://github.com/mardukhorus/growx-client-app.git @growx/client-app
$ cd @growx/client-app
```

#### 2. Run `npm install`

This will install both run-time project dependencies and developer tools listed
in [package.json](package.json) file.

#### 3. Complete config

In config directory you will find 3 files
- [assets.json](assets.json) config parameters for each asset pair
- [credentials.json](credentials.json) API keys for each exchange account
- [growx-mm.json](growx-mm.json) config parameters for growx market making service

#### 4. Run `npm test`

Runs tests using config params from ####3.

#### 5. Run `npm start`

Runs the app.

Your app is ready to be deployed!

## Support

For any additional information please go to (https://t.me/mardukhorus) and raise your questions or feedback provide there. We highly appreciate your participation!
