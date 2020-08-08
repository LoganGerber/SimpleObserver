import { Event } from "./Event";
/**
 * Type representing the structure of a listener callback.
 */
declare type Listener<T extends Event> = (x: T) => void;
/**
 * Valid types for passing to most EventObserver functions that take an
 * event.
 *
 * The only function that does not use this is EventObserver.prototype.emit, as
 * it requires specifically an Event.
 *
 * This type allows the user to, for example, call
 * ```ts
 *  myEventObserver.on(MyEventType, () => {});
 * ```
 * or
 * ```ts
 * let eventInstance = new MyEventType();
 * myEventObserver.on(eventInstance, () => {});
 * ```
 * and both behave identically.
 */
declare type EventType<T extends Event> = T | (new (...args: any) => T);
/**
 * Flags used to track how two EventObservers are bound.
 *
 * - RelayFlags.From sends the bound observer's events to the binding observer.
 * - RelayFlags.To sends the binding observer's events to the bound observer.
 * - RelayFlags.All sends all events from either observer to the other.
 * - RelayFlags.None sends no events between the observers.
 */
export declare enum RelayFlags {
    None = 0,
    To = 1,
    From = 2,
    All = 3
}
/**
 * Implementation of an Observer pattern bindable to other EventObservers.
 *
 * EventObserver is not an EventEmitter, and cannot be used as an EventEmitter.
 * This is because anywhere where an EventEmitter would accept a string or
 * symbol as an event, the EventObserver takes an Event object.
 *
 * The EventObserver takes Event objects because it needs to track each event's
 * id. This is so that when two or more EventObservers are bound to one
 * another, an event is not infinitely emitted between the two.
 *
 * Despite the fact that EventObserver cannot be used as an EventEmitter, it
 * shares all the same function names with EventEmitter. This is to make the
 * functions intuitive for the user.
 */
export declare class EventObserver {
    /**
     * Underlying EventEmitter used to handle event binding and emit.
     */
    private internalEmitter;
    /**
     * List of EventObservers bound to this EventObserver, as
     * well as the functions registered to bind the two.
     */
    private relays;
    /**
     * Cache of previously-emitted event ids. If an event is emitted, and its id
     * is found in here, the emit is canceled without anything happening.
     */
    private idCache;
    /**
     * Limit of how many entries can exist in the idCache array.
     */
    private idCacheLimit;
    /**
     * Get the limit of how many entries can exist in the id cache.
     *
     * @returns The maximum number of ids that can exist in cache.
     */
    getIdCacheLimit(): number;
    /**
     * Set the limit of how many entries can exist in the id cache.
     *
     * If the id cache is shrunk to less than the size of the current number of
     * id entries, the oldest entries will be purged.
     *
     * Setting the limit to <= 0 will remove the limit.
     *
     * More info on how ids are stored can be found in
     * EventObserver.prototype.emit documentation.
     *
     * @param limit The maximum number of ids to keep in cache. Setting to <= 0
     * removes the limit.
     *
     * @see EventObserver.prototype.on for info about storing ids in cache.
     */
    setIdCacheLimit(limit: number): void;
    /**
     * Get the current number of ids in cache.
     *
     * @returns The number of ids currently stored in cache.
     */
    getIdCacheSize(): number;
    /**
     * Remove all ids from the id cache
     */
    clearIdCache(): void;
    /**
     * @alias EventObserver.prototype.on
     */
    addListener<T extends Event>(event: EventType<T>, listener: Listener<T>): this;
    /**
     * Emit an event.
     *
     * When an event is emitted, its id is first compared with the cache of
     * stored ids. If its id is found in the cache, emit is terminated early,
     * returning `false`.
     *
     * If the event's id is not found in the cache, the id is stored in the
     * cache and emit continues to call any listeners bound to the event.
     *
     * When an event is emitted, a second event, an `EventInvokedEvent` is
     * also emitted, with the original event as its data. This event's id is
     * not stored in the id cache.
     *
     * @param event Event to emit.
     * @returns True if any listeners were called for the event, false
     * otherwise.
     */
    emit(event: Event): boolean;
    /**
     * @alias EventObserver.prototype.removeListener
     */
    off<T extends Event>(event: EventType<T>, listener: Listener<T>): this;
    /**
     * Bind a listener to an event.
     *
     * A listener is any function callback. Listeners will be called with a
     * single parameter: the event instance that triggered them.
     *
     * @param event The type of Event to bind to. This can either be an Event
     * class or an instance of an Event. Note: Binding to an instance of an
     * event will still allow the listener to be called when ANY instance of
     * that same event is emitted.
     * @param listener Callback to execute when the Event type is emitted.
     * @returns Reference to self.
     */
    on<T extends Event>(event: EventType<T>, listener: Listener<T>): this;
    /**
     * Same as EventObserver.prototype.on, but the listener is immediately unbound once it is
     * called.
     *
     * @param event The type of Event to bind to. This can either be an Event
     * class or an instance of an Event. Note: Binding to an instance of an
     * event will still allow the listener to be called when ANY instance of
     * that same event is emitted.
     * @param listener Callback to execute when the Event type is emitted.
     * @returns Reference to self.
     */
    once<T extends Event>(event: EventType<T>, listener: Listener<T>): this;
    /**
     * Same as EventObserver.prototype.on, but the listener is prepended to the list of bound
     * listeners. When the event is emitted, this listener will have priority
     * in execution order.
     *
     * @param event The type of Event to bind to. This can either be an Event
     * class or an instance of an Event. Note: Binding to an instance of an
     * event will still allow the listener to be called when ANY instance of
     * that same event is emitted.
     * @param listener Callback to execute when the Event type is emitted.
     * @returns Reference to self.
     */
    prependListener<T extends Event>(event: EventType<T>, listener: Listener<T>): this;
    /**
     * Same as EventObserver.prototype.once, but the listener is prepended to the list of bound
     * listeners. When the event is emitted, this listener will have priority
     * in execution order.
     *
     * @param event The type of Event to bind to. This can either be an Event
     * class or an instance of an Event. Note: Binding to an instance of an
     * event will still allow the listener to be called when ANY instance of
     * that same event is emitted.
     * @param listener Callback to execute when the Event type is emitted.
     * @returns Reference to self.
     */
    prependOnceListener<T extends Event>(event: EventType<T>, listener: Listener<T>): this;
    /**
     * Remove all listeners bound to a type of event. If event is omitted, all
     * listeners are removed from every event type.
     *
     * @param event The type of event to unbind from. This can either be an
     * Event class or an instance of an Event. If this parameter is omitted, all
     * listeners will be removed from every event.
     * @returns Reference to self.
     */
    removeAllListeners<T extends Event>(event?: EventType<T>): this;
    /**
     * Unbind a listener from an event.
     *
     * @param event Event the listener is bound to. This can either be an Event
     * class or an instance of an Event.
     * @param listener Listener to unbind.
     * @returns Reference to self.
     */
    removeListener<T extends Event>(event: EventType<T>, listener: Listener<T>): this;
    /**
     * Check if a listener is bound to a specific event.
     *
     * @param event Event the listener would be bound to. This can either be an
     * Event class or an instance of an Event.
     * @param listener Listener to check for.
     * @returns True if the listener is bound to the event, false otherwise.
     */
    hasListener<T extends Event>(event: EventType<T>, listener: Listener<T>): boolean;
    /**
     * Bind a EventObserver to this EventObserver.
     *
     * Bound observers emit their events on the other observer as defined by
     * the RelayFlags supplied.
     *
     * - RelayFlags.None means neither observer sends their events to the other.
     * - RelayFlags.From means relay emits its events on this observer.
     * - RelayFlags.To means this observer emits its events on relay.
     * - RelayFlags.All means both observers emit their events on one another.
     *
     * If no RelayFlags argument is provided, RelayFlags.All is used as default.
     *
     * @param relay EventObserver to bind to this observer.
     * @param relayFlags Direction events should be relayed. Default
     * RelayFlags.All.
     */
    bind(relay: EventObserver, relayFlags?: RelayFlags): void;
    /**
     * Check how a EventObserver is bound to this observer.
     *
     * @param relay EventObserver to check.
     * @returns RelayFlags specifying the direction events are passed between
     * the two observers. If relay is not bound to this observer, the function
     * returns `undefined`.
     */
    checkBinding(relay: EventObserver): RelayFlags | undefined;
    /**
     * Unbind a EventObserver from this EventObserver.
     *
     * If the provided observer is not bound to this observer, this is a no-op
     * function.
     *
     * @param relay EventObserver to unbind from this.
     */
    unbind(relay: EventObserver): void;
    /**
     * Create the function that will be used to relay events from one
     * EventObserver to another.
     *
     * @param observer The EventObserver whose emit function will be called.
     * @returns A function that is bindable to an event and that will call
     * observer.emit, emitting an EventInvokedEvent provided as a parameter.
     */
    private static generateBubbleFunction;
    /**
     * Change an EventType<T> to a string that can be used to register as an
     * event in the underlying EventEmitter.
     *
     * If the provided event is a function, that means the user passed the class
     * itself as a parameter. If it's not a function, that means the user passed
     * an instance of an event.
     *
     * The function returns the class's name, which should be unique to a given
     * type of Event in any one process. This is how event name collisions are
     * avoided when binding Events to listeners.
     *
     * @param event Event to get a name from to use as an EventEmitter event.
     * @returns Name of the event class.
     */
    private static getRegisterableEventName;
}
export {};