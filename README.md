[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) [![Travis CI](https://api.travis-ci.org/daheim/daheim-app.svg)](https://travis-ci.org/daheim/daheim-app) [![Crowdin](https://d322cqt584bo4o.cloudfront.net/daheim-app/localized.svg)](https://crowdin.com/project/daheim-app) [![Docker Image](https://imagelayers.io/badge/egergo/daheim-app:latest.svg)](https://imagelayers.io/?images=egergo/daheim-app:latest 'Get your own badge on imagelayers.io')

Welcome home! Willkommen Daheim! [willkommen-daheim.org](https://willkommen-daheim.org)

Daheim is a German non-profit NGO with the mission of teaching language and culture for free to refugees arriving to Germany. We connect German native volunteers with people that would like to learn over an online video platform.

# Daheim App Monorepo

This repository contains the web application that connects the users through WebRTC. It contains different modules that are organized into microservices. The different modules are wired together by [Lerna](https://lernajs.io/).

Original module sources were:
- https://github.com/daheim/daheim-app-ui
- https://github.com/daheim/daheim-app-api
