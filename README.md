# altv-config

What is this? It's a configuration generator that lets you throw in JSON files to generate a dynamic `server.cfg`.

## Why?

In the Athena Framework I needed a way to generate different environment configuration(s) and allow different configuration(s) to be used without having to switch variables around constantly. This allows me to setup multiple configuration(s) that get auto-generated before the server is started.

## How to Use

Save this package as a development dependency.

```
npm i --save-dev @stuyk/altv-config
```

Create a JSON configuration somewhere in your project. ie. `./configs/dev.json`

```json
{
    "name": "Athena 3.0.0",
    "host": "0.0.0.0",
    "port": 7788,
    "players": 512,
    "password": null,
    "announce": false,
    "gamemode": "Roleplay",
    "website": "athenaframework.com",
    "language": "en",
    "description": "A Roleplay Framework for alt:V",
    "debug": true,
    "streamingDistance": 400,
    "migrationDistance": 150,
    "timeout": 1,
    "announceRetryErrorDelay": 10000,
    "announceRetryErrorAttempts": 50,
    "modules": [
        "js-module"
    ],
    "resources": [
        "webserver", 
        "core"
    ],
    "tags": [
        "athena",
        "framework",
        "version",
        "3"
    ],
    "useEarlyAuth": false,
    "earlyAuthUrl": null,
    "useCdn": false,
    "cdnUrl": null,
    "voice": {
        "bitrate": 64000,
        "externalSecret": null,
        "externalHost": null,
        "externalPort": null,
        "externalPublicHost": null,
        "externalPublicPort": null
    }
}
```

Then use this package to generate the configuration dynamically.

```
npx altv-config ./configs/dev.json
```