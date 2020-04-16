# IoT-app

## Table of content

1. [📝 About](#📝-about)
2. [🚀 Quick start](#🚀-quick-start)
3. [🏗 Architecture](#🏗-architecture)
4. [🎨 Features](#🎨-features)
5. [API documentation](#api-documentation)
6. [CI/CD](#cicd)

## 📝 About

This project enable the user to monitor devices. The app provide device's informations like his location, temperature, wind or humitidy.

![app-snapshot](/assets-doc/snapshot.png)

## 🚀 Quick start

```bash
$ docker-compose up
```

Both server and client side run in docker containers

## 🏗 Architecture

![architecture](/assets-doc/schema.png)

## 🎨 Features

* List all devices
* Search a device
* Get device details
* Get wind force based on [Beaufort scale](https://fr.wikipedia.org/wiki/Échelle_de_Beaufort)
* Get average of temperature, humidity and wind
* Display all devices on a map

## API documentation

Api documentation provided by [Openapi](https://www.openapis.org)

`http://localhost/explorer/#/`
`http://localhost/openapi.json`

## CI/CD

Usage of Github Action to build and deploy app on AWS server [here](http://ec2-15-188-53-1.eu-west-3.compute.amazonaws.com)

## Contributors

@Arnolddomaya
@mano
@Farsen976
@DGoms
