"use strict";
exports.__esModule = true;
exports.Event = void 0;
var guid_typescript_1 = require("guid-typescript");
var Event = /** @class */ (function () {
    function Event(data) {
        this.id = guid_typescript_1.Guid.create();
        this.data = data;
    }
    return Event;
}());
exports.Event = Event;
