# calendar-nortifire

Use a telegram-bot to notify users about upcoming calendar events.

> **Note:** : Currently the language of the bot is German only. Support for other languages will be added in the future.

## How to use?

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
