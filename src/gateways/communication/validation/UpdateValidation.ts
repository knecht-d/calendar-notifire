import { IDailyRecurrenceRule, IHourlyRecurrenceRule, IMonthlyRecurrenceRule } from "../../../useCases";
import { CommunicationError, CommunicationErrorCode } from "../CommunicationError";
import { IGenericFrame, IGenericFrameEntry } from "../interfaces";

function validateDayOfMonth(day?: number) {
    if (!day || day < 0 || day > 31) {
        throw new CommunicationError(CommunicationErrorCode.INVALID_DAY_OF_MONTH, `${day}`, "1-31", "17");
    }
}
function validateDays(days?: object) {
    if (!days) {
        throw new CommunicationError(CommunicationErrorCode.INVALID_DAYS, "Missing", "0-6", "2");
    }
    if (Object.values(days).filter(x => !!x).length === 0) {
        throw new CommunicationError(CommunicationErrorCode.INVALID_DAYS, "None Set", "0-6", "2");
    }
}

function validateHour(hour?: number) {
    if (hour === undefined || hour < 0 || hour > 23) {
        throw new CommunicationError(CommunicationErrorCode.INVALID_TIME, `${hour}`, "0-23", "17");
    }
}
function validateToHour(fromHour: number, toHour?: number) {
    if (toHour === undefined || toHour < fromHour || toHour > 23) {
        throw new CommunicationError(
            CommunicationErrorCode.INVALID_TIME,
            `${toHour}`,
            `${fromHour}-23`,
            `${Math.min(fromHour + 1, 23)}`,
        );
    }
}
function validateMinute(minute?: number) {
    if (minute === undefined || minute < 0 || minute > 59) {
        throw new CommunicationError(CommunicationErrorCode.INVALID_TIME, `${minute}`, "0-59", "42");
    }
}

export function validateTimeFrame(timeFrameParameter: IGenericFrame) {
    Object.entries(timeFrameParameter).forEach(([level, setting]: [string, IGenericFrameEntry]) => {
        if (setting.value === undefined) {
            throw new CommunicationError(CommunicationErrorCode.INVALID_FRAME_CONFIG, `Value for ${level} missing`);
        }
    });
}

export function validateMonthlyConfig(recurrence: Partial<IMonthlyRecurrenceRule>) {
    validateDayOfMonth(recurrence.day);
    validateHour(recurrence.hour);
    validateMinute(recurrence.minute);
}

export function validateDailyConfig(recurrence: Partial<IDailyRecurrenceRule>) {
    validateHour(recurrence.hour);
    validateMinute(recurrence.minute);
    validateDays(recurrence.days);
}

export function validateHourlyConfig(recurrence: Partial<IHourlyRecurrenceRule>) {
    validateHour(recurrence.fromHour);
    validateToHour(recurrence.fromHour!, recurrence.toHour);
    validateMinute(recurrence.minute);
    validateDays(recurrence.days);
}
