import { TelegrafContext } from "telegraf/typings/context";
import { ILogger } from "../../../../logging";

interface IResolveable {
    currentResolver: (value: string) => void;
}

export function handleButtonPress<T extends IResolveable>(
    ALL_BUILDER: { [messageId: number]: T },
    LOGGER: ILogger,
    ctx: TelegrafContext,
    selection: string,
) {
    const messageId = ctx.callbackQuery?.message?.message_id || 0;
    LOGGER.debug("handleButtonPress", `MessageId: ${messageId}, Selected: ${selection}`);

    const currentBuilder = ALL_BUILDER[messageId];
    if (currentBuilder) {
        currentBuilder.currentResolver(selection);
    } else {
        LOGGER.info("handleButtonPress", "Message expired");
        ctx.editMessageText(
            "Nachricht konnte nicht weiter verarbeitet werden. Versuchen Sie es mit einem erneuten Befehl.",
        ).catch(error => LOGGER.error("handleButtonPress", error));
    }
}
