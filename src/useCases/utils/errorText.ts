import { EntityErrorCode } from "../../entities";

export function toText(error: EntityErrorCode) {
    switch (error) {
        case EntityErrorCode.CHAT_ALREADY_EXISTING:
            return "Chat existiert bereits";
        case EntityErrorCode.CHAT_NOT_EXISTING:
            return "Chat existiert nicht";
        case EntityErrorCode.LAST_ADMIN:
            return "Letzer Eintrag kann nicht entfernt werden";
        case EntityErrorCode.MISSING_PRIVILEGES:
            return "Fehlende Berechtigung";
        case EntityErrorCode.NO_ADMIN:
            return "Person gehört nicht zur Administration";
        case EntityErrorCode.TRIGGER_NOT_DEFINED:
            return "Erinnerung ist nicht definiert";
    }
}
