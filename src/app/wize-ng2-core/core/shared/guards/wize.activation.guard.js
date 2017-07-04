"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var WizeActivationGuard = (function () {
    function WizeActivationGuard() {
    }
    WizeActivationGuard.prototype.canLoad = function (route) {
        return true;
    };
    WizeActivationGuard.prototype.canActivate = function (next, state) {
        console.log('WizeActivationGuard:canActivate');
        return true;
    };
    WizeActivationGuard.prototype.canActivateChild = function (route, state) {
        console.log('WizeActivationGuard:canActivateChild');
        return true;
    };
    return WizeActivationGuard;
}());
WizeActivationGuard = __decorate([
    core_1.Injectable()
], WizeActivationGuard);
exports.WizeActivationGuard = WizeActivationGuard;
