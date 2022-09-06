export interface EventSubscriber {
    eventName: string | symbol;
    listener: (...args: any[]) => void;
    once?: boolean;
}
