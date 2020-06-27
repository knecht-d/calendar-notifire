import { ISerializedTimeFrame } from "./Persistence";

export interface IEvent {
    start: Date;
    end: Date;
    title: string;
    description?: string;
    location?: string;
}

export interface ICommunication {
    send: (chatId: string, message: IMessage) => void;
}

export interface ITriggers {
    [key: string]: ISerializedTimeFrame;
}

export enum MessageKey {
    ADD_ADMIN = "ADD_ADMIN",
    REMOVE_ADMIN = "REMOVE_ADMIN",
    INITIALIZE_CHAT = "INITIALIZE_CHAT",
    SET_CONFIG = "SET_CONFIG",
    DELETE_CONFIG = "DELETE_CONFIG",
    READ_CONFIG = "READ_CONFIG",
    EVENTS = "EVENTS",
}

interface IBaseMessage {
    key: MessageKey;
    hasError?: boolean;
    message?: string;
}

interface ISetConfigMessage extends IBaseMessage {
    key: MessageKey.SET_CONFIG;
    triggerId: string;
}

interface IDeleteConfigMessage extends IBaseMessage {
    key: MessageKey.DELETE_CONFIG;
    triggerId: string;
}
interface IReadConfigMessage extends IBaseMessage {
    key: MessageKey.READ_CONFIG;
    triggers: ITriggers;
}

interface IInitializeChatMessage extends IBaseMessage {
    key: MessageKey.INITIALIZE_CHAT;
}

interface IEventsMessage extends IBaseMessage {
    key: MessageKey.EVENTS;
    events: IEvent[];
}

interface IAddAdminMessage extends IBaseMessage {
    key: MessageKey.ADD_ADMIN;
    newAdmin: string;
}
interface IRemoveAdminMessage extends IBaseMessage {
    key: MessageKey.REMOVE_ADMIN;
    oldAdmin: string;
}

export type IMessage =
    | ISetConfigMessage
    | IDeleteConfigMessage
    | IReadConfigMessage
    | IInitializeChatMessage
    | IEventsMessage
    | IAddAdminMessage
    | IRemoveAdminMessage;
