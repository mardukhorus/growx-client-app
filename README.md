# GROWX — CLIENT APP

## Description

Non custodial version of @growx market maker, for self hosted market making applications. This app acts as a bridge between @growx market maker and user owned account on one of 100+ centralized crypto exchanges. Client app is fully automated and does not require any intervention other than configuration prior to initiation.

## Market making features

- Liquidity management
- Transaction volume management

## Prerequisites

- API keys for one or more accounts on supported exchanges (contact support if your exchange is not among 100+ available in @growx/rpcs)
- @growx access token 
- node v14.17+
- npm v9.1+

## Quick Start

#### 1. Get the latest version

You can start by cloning the latest version of GROWX - CLIENT APP on your
local machine by running:

```shell
$ git clone https://github.com/mardukhorus/growx-client-app.git @growx/client-app
$ cd @growx/client-app
```

#### 2. Run `npm install`

This will install both run-time project dependencies and developer tools listed
in [package.json](package.json) file.

#### 3. Complete config

Copy directory client-app-config outside client-app directory including 3 files
- [credentials.json](credentials.json) API keys for each exchange account
- [growx-bot.json](growx-bot.json) config parameters for growx market making service

Edit parameters according to your private settings.

#### 4. Run `npm test`

Runs tests against exchanges specified in config files.

#### 5. Run `npm start`

Runs the app.

Your app is ready!

## Support

For any additional information please go to (https://t.me/mardukhorus) and raise your questions or provide feedback there. We highly appreciate your participation!
