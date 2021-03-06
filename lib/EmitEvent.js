"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmitEvent = void 0;
var Event_1 = require("./Event");
/**
 * Event executed when another event is emitted by an BindableObserver.
 */
var EmitEvent = /** @class */ (function (_super) {
    __extends(EmitEvent, _super);
    function EmitEvent(event) {
        var _this = _super.call(this) || this;
        _this._emitted = event;
        return _this;
    }
    Object.defineProperty(EmitEvent.prototype, "emitted", {
        /**
         * Event that was emitted.
         */
        get: function () {
            return this._emitted;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EmitEvent.prototype, "name", {
        get: function () { return "Event Invoked"; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EmitEvent.prototype, "uniqueName", {
        get: function () { return "LoganGerber-BindableObserver-EmitEvent"; },
        enumerable: false,
        configurable: true
    });
    return EmitEvent;
}(Event_1.Event));
exports.EmitEvent = EmitEvent;
