"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var notification_type_1 = require("./notification-type");
/**
 * Notification service used to notify user about important events in the application.
 *
 * You may configure the service with: setDelay, setVerbose and setPersist.
 */
var NotificationService = (function () {
    /**
     * The default constructor
     */
    function NotificationService() {
        var _this = this;
        // time (in ms) the notifications are shown
        this.delay = 8000;
        this.modes = {};
        this.notifications = {};
        this.persist = { 'error': true, 'httpError': true };
        this.verbose = false;
        /**
         * Sets persist option for particular modes. Notification with persistent mode won't be dismissed after delay, but has
         * to be closed manually with the close button. By default, the "error" and "httpError" modes are set to persistent.
         *
         * @param persist Set to true to persist notifications
         */
        this.setPersist = function (persist) {
            this.persist = persist;
        };
        this.notifications.data = [];
        this.modes = [
            { info: { type: notification_type_1.NotificationType.INFO, header: 'Info!', log: 'info' } },
            { success: { type: notification_type_1.NotificationType.SUCCESS, header: 'Success!', log: 'info' } },
            { error: { type: notification_type_1.NotificationType.DANGER, header: 'Error!', log: 'error' } },
            { warn: { type: notification_type_1.NotificationType.WARNING, header: 'Warning!', log: 'warn' } }
        ];
        this.modes.forEach(function (mode, index) {
            _this.notifications[index] = _this.createNotifyMethod(index);
        });
    }
    /**
     * Get all notifications
     */
    NotificationService.prototype.getNotifications = function () {
        return this.notifications.data;
    };
    /**
     * Generate a notification for the given HTTP Response
     *
     * @param message The notification message
     * @param httpResponse The HTTP Response
     */
    NotificationService.prototype.httpError = function (message, httpResponse) {
        message += ' (' + (httpResponse.data.message || httpResponse.data.cause
            || httpResponse.data.cause || httpResponse.data.errorMessage) + ')';
        this.message('danger', 'Error!', message, this.persist.httpError, null, null);
        if (this.verbose) {
            console.log(message);
        }
    };
    /**
     * Generate a notification message
     *
     * @param type The notification type
     * @param header The notification header
     * @param message The notification message
     * @param isPersistent True if the notification should be persistent
     * @param primaryAction The primary action for the notifiaction
     * @param moreActions More actions for the kebab
     */
    NotificationService.prototype.message = function (type, header, message, isPersistent, primaryAction, moreActions) {
        var _this = this;
        var notification = {
            header: header,
            isPersistent: isPersistent,
            isViewing: false,
            message: message,
            moreActions: moreActions,
            primaryAction: primaryAction,
            showClose: false,
            type: type,
            visible: true
        };
        this.notifications.data.push(notification);
        if (notification.isPersistent !== true) {
            notification.isViewing = false;
            setTimeout(function () {
                notification.visible = false;
                if (!notification.isViewing) {
                    _this.remove(notification);
                }
            }, this.delay);
        }
    };
    /**
     * Remove notification
     *
     * @param notification The notification to remove
     */
    NotificationService.prototype.remove = function (notification) {
        var index = this.notifications.data.indexOf(notification);
        if (index !== -1) {
            this.removeIndex(index);
        }
    };
    /**
     * Set the delay after which the notification is dismissed. The argument of this method expects miliseconds. Default
     * delay is 8000 ms.
     *
     * @param delay The delay in ms
     */
    NotificationService.prototype.setDelay = function (delay) {
        this.delay = delay;
    };
    /**
     * Set the verbose mode to on (default) or off. During the verbose mode, each notification is printed in the console.
     *
     * @param verbose Set to true for verbose mode
     */
    NotificationService.prototype.setVerbose = function (verbose) {
        this.verbose = verbose;
    };
    /**
     * Set a flag indicating user is viewing the given notification
     *
     * @param notification The notification currently being viewed
     * @param isViewing True if the notification is being viewed
     */
    NotificationService.prototype.setViewing = function (notification, isViewing) {
        notification.isViewing = isViewing;
        if (isViewing !== true && notification.visible !== true) {
            this.remove(notification);
        }
    };
    // Private
    NotificationService.prototype.createNotifyMethod = function (index) {
        var _this = this;
        return function (message, header, persistent, primaryAction, moreActions) {
            if (header !== undefined) {
                header = _this.modes[index].header;
            }
            if (persistent !== undefined) {
                persistent = _this.persist[index];
            }
            _this.notifications.message(_this.modes[index].type, header, message, persistent, primaryAction, moreActions);
            if (_this.verbose) {
                console.log(message);
            }
        };
    };
    NotificationService.prototype.removeIndex = function (index) {
        this.notifications.data.splice(index, 1);
    };
    return NotificationService;
}());
NotificationService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map