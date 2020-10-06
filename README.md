# calendar-notifire <!-- omit in toc -->

[![codecov](https://codecov.io/gh/knecht-d/calendar-notifire/branch/master/graph/badge.svg?token=7GO8TABD0A)](https://codecov.io/gh/knecht-d/calendar-notifire)

[![Docker Cloud Automated build](https://img.shields.io/docker/cloud/automated/knechtd/calendar-notifire)](https://hub.docker.com/r/knechtd/calendar-notifire)
[![Pulls](https://shields.beevelop.com/docker/pulls/knechtd/calendar-notifire.svg)](https://hub.docker.com/r/knechtd/calendar-notifire)
[![Layers](https://shields.beevelop.com/docker/image/layers/knechtd/calendar-notifire/latest.svg)](https://hub.docker.com/r/knechtd/calendar-notifire)
[![Size](https://shields.beevelop.com/docker/image/image-size/knechtd/calendar-notifire/latest.svg)](https://hub.docker.com/r/knechtd/calendar-notifire)
[![Docker Image Version (latest semver)](https://img.shields.io/docker/v/knechtd/calendar-notifire)](https://hub.docker.com/r/knechtd/calendar-notifire)

Use a telegram-bot to notify users about upcoming calendar events.

> **Note:** : Currently the language of the bot is German only. Support for other languages will be added in the future.

-   [How to use?](#how-to-use)
    -   [Docker](#docker)
    -   [Node.js](#nodejs)
-   [Bot-Commands](#bot-commands)
-   [Development](#development)
    -   [npm-Commands](#npm-commands)
-   [Naming](#naming)

## How to use?

### Docker

1. Create a folder `data` and inside a `setup.json` similar to [data/setup.example.json](data/setup.example.json)
   and enter
    - `telegram`: The Telegram-token (see [Telegram-Bots](https://core.telegram.org/bots))
    - `calendarURL`: The URL to the calendar in iCal-format
    - `chatConfig`: The file where the configuration should be stored (can be kept as default)
    - `logLevel`: The desired log level. (Select one from the list)
2. Run the docker container
    - `docker run -v <your data folder>:/usr/src/app/data knechtd/calendar-notifire`

### Node.js

1. Install Node (at least version 14 for propert localisation support)
    > Due to localisation this project requires Node version 14
2. Clone the project and install the dependencies
    ```
    > git clone git@github.com:deeKay93/calendar-notifire.git
    > cd calendar-notifire
    > npm install
    ```
3. Copy `data/setup.example.json` to `data/setup.json`
   and enter
    - `telegram`: The Telegram-token (see [Telegram-Bots](https://core.telegram.org/bots))
    - `calendarURL`: The URL to the calendar in iCal-format
    - `chatConfig`: The file where the configuration should be stored (can be kept as default)
    - `logLevel`: The desired log level. (Select one from the list)
4. Build the project using `npm run build` (or start it directly using `npm run start`)
5. (Re)start it using `npm run start:prod`
6. Start using the bot (See [Bot-Commands](#bot-commands))

> **Note:** The time settings will be executed using the local timezone of the server!

## Bot-Commands

-   `/start` - Initialize the chat in the bot (required before first use)
-   `/set [reminder]` - Start setting up a new reminder
    -   e.g. `/set New Reminder` sets up the trigger "New Reminder"
-   `/read` - Get the current settings
-   `/delete [reminder]` - Delete the settings for a reminder
-   `/addAdmin [userID]` - Add a new user to the administrators (for group chats)
    -   e.g. `/addAdmin 08154711`)
-   `/removeAdmin [userID]` - Remove an admin from the administrators
-   `/info` - Print IDs of the current user and the current chat. (For debugging and for the adding/removing administrators)

## Development

### npm-Commands

The most important npm-commands are:

-   `build`: Build the project
-   `start`: Build and run the project
-   `start:prod`: Run the built project
-   `start:dev`: Run the ts-code directly
-   `test`: Run tests
-   `cover`: run tests with coverage

They can be executed with `npm run <command>` (e.g. `npm run test`).

For other command see [package.json](package.json).

## Naming

The name is a combination of calendar, notifier and fire.
The origin of the name are:

-   the (future) capabilities of this project --> To notifiy about up coming calendar-events
-   _fire_, because the idea comes from a volunteer fire department
