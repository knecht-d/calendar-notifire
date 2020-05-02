import { CommunicationError, CommunicationErrorCode } from "../CommunicationError";
import { Mappings } from "../Mappings";

function validateNumberOfArguments(parts: string[], expected: number, schema: string, example: string) {
    if (parts.length !== expected) {
        throw new CommunicationError(
            CommunicationErrorCode.INVALID_NUMBER_OF_ARGUMENTS,
            `${parts.length}`,
            `${expected} (${schema})`,
            example,
        );
    }
}

function validateDays(daysParameter: string) {
    const dayKeys = Object.values(Mappings.days).join("|");
    const reDays = new RegExp(`^(${dayKeys})(,(${dayKeys}))*$`);
    if (!reDays.exec(daysParameter)) {
        throw new CommunicationError(CommunicationErrorCode.INVALID_DAYS, daysParameter, dayKeys, "mo,di,so");
    }
}

function validateDayOfMonth(dayParameter: string) {
    const reTime = new RegExp("^([0-2]?[0-9]|[3][0-1])$");
    if (!reTime.exec(dayParameter)) {
        throw new CommunicationError(CommunicationErrorCode.INVALID_DAY_OF_MONTH, dayParameter, "1-31", "13");
    }
}

function validateTime(timeParameter: string) {
    const reTime = new RegExp("^([0-1]?[0-9]|[2][0-3]):([0-5]?[0-9])$");
    if (!reTime.exec(timeParameter)) {
        throw new CommunicationError(CommunicationErrorCode.INVALID_TIME, timeParameter, "0:0 - 23:59", "17:23");
    }
}

function validateTimeFrame(timeFrameParameter: string) {
    const timeFrameKeys = Object.keys(Mappings.timeFrames).join("|");
    const timeFramePart = `((${timeFrameKeys})(\\+|-)?(\\d+))`;
    const reFrame = new RegExp(`^(((${timeFramePart})(,(${timeFramePart}))*)|-)$`);
    if (!reFrame.exec(timeFrameParameter)) {
        throw new CommunicationError(
            CommunicationErrorCode.INVALID_FRAME_CONFIG,
            timeFrameParameter,
            `[${timeFrameKeys}](+|-)0-9 -`,
            "t+1,s0,m0",
        );
    }
}

export function validateMonthlyConfig(parts: string[]) {
    const schema = "m [day of month] [time] [start] [end]";
    const example = "m 15 17:30 M+1,t1,s0,m0 M+2,t1,s0,m0";
    validateNumberOfArguments(parts, 4, schema, example);
    validateDayOfMonth(parts[0]);
    validateTime(parts[1]);
    validateTimeFrame(parts[2]);
    validateTimeFrame(parts[3]);
}

export function validateDailyConfig(parts: string[]) {
    const schema = "t [days] [time] [start] [end]";
    const example = "t mo,di,so 17:30 t+1,s0,m0 t+2,s0,m0";
    validateNumberOfArguments(parts, 4, schema, example);
    validateDays(parts[0]);
    validateTime(parts[1]);
    validateTimeFrame(parts[2]);
    validateTimeFrame(parts[3]);
}

export function validateHourlyConfig(parts: string[]) {
    const schema = "s [days] [start time] [end time] [start] [end]";
    const example = "s mo,di,so 07:30 19:30 t+1,s0,m0 t+2,s0,m0";
    validateNumberOfArguments(parts, 5, schema, example);
    validateDays(parts[0]);
    validateTime(parts[1]);
    validateTime(parts[2]);
    validateTimeFrame(parts[3]);
    validateTimeFrame(parts[4]);
}
