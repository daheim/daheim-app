[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) [![Travis CI](https://api.travis-ci.org/daheim/daheim-app.svg)](https://travis-ci.org/daheim/daheim-app) [![Crowdin](https://d322cqt584bo4o.cloudfront.net/daheim-app/localized.svg)](https://crowdin.com/project/daheim-app) [![Docker Image](https://imagelayers.io/badge/egergo/daheim-app:latest.svg)](https://imagelayers.io/?images=egergo/daheim-app:latest 'Get your own badge on imagelayers.io')

Welcome home! Willkommen Daheim! [willkommen-daheim.org](https://willkommen-daheim.org)

Daheim is a German non-profit NGO with the mission of teaching language and culture for free to refugees arriving to Germany. We connect German native volunteers with people that would like to learn over an online video platform.

# Getting Started

Prerequisites:

  * node greater than 6.0.0
  * npm greater than 3.0
  * docker running and controllable with docker-compose

Install dependencies:

```bash
npm install
```

Copy `.env.example` file to `.env` in the follwing directories:

  * packages/daheim-app-api
  * packages/daheim-app-live
  * packages/daheim-app-ui

Run local development version:

```bash
npm run dev
```


# Daheim App Monorepo

This repository contains the web application that connects the users through WebRTC. It contains different modules that are organized into microservices. The different modules are wired together by [Lerna](https://lernajs.io/).

Original module sources were:
- https://github.com/daheim/daheim-app-ui
- https://github.com/daheim/daheim-app-api

## Internationalization

The main target language of the platform is German. Although, to make international collaboration easier, code is written in English and messages translated from English to German. Our choice of internationalization is library is [react-intl](https://github.com/yahoo/react-intl). Translations are maintained in an open [Crowdin](https://crowdin.com/project/daheim-app) project.


# Administrative Tasks

## Manage Translations

To run these scripts, a `CROWDIN_KEY` environment variable must specify a valid API key for the Crowdin project.

Upload messages to translate:

```bash
npm run crowdin-upload
```

Build and package translations:

```bash
npm run crowdin-build
```

Download updated translations:

```bash
npm run crowdin-download
```

## Deploy Latest Version

The application is hosted in a Kubernetes cluster. This scripts need a fully setup `kubectl`.

Deploy all components to `latest` Docker tag and watch the deployment rolling out:

```bash
bin/devops --latest-api --latest-ui --latest-live --watch
```
