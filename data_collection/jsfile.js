/* Minification failed. Returning unminified contents.
(9194,37-40): run-time error JS1009: Expected '}': ...
(9195,44): run-time error JS1004: Expected ';'
(9195,44-45): run-time error JS1195: Expected expression: :
(9196,48): run-time error JS1004: Expected ';'
(9196,48-49): run-time error JS1195: Expected expression: :
(9198,33-34): run-time error JS1195: Expected expression: }
(9198,34-35): run-time error JS1009: Expected '}': ;
(9198,34-35): run-time error JS1009: Expected '}': ;
(9198,34-35): run-time error JS1006: Expected ')': ;
(9213,33): run-time error JS1004: Expected ';'
(9213,33-34): run-time error JS1195: Expected expression: :
(9214,37): run-time error JS1004: Expected ';'
(9214,37-38): run-time error JS1195: Expected expression: :
(9215,38): run-time error JS1004: Expected ';'
(9215,38-39): run-time error JS1195: Expected expression: :
(9216,33): run-time error JS1004: Expected ';'
(9216,33-34): run-time error JS1195: Expected expression: :
(9217,31): run-time error JS1004: Expected ';'
(9217,31-32): run-time error JS1195: Expected expression: :
(9219,34): run-time error JS1004: Expected ';'
(9219,34-35): run-time error JS1195: Expected expression: :
(9221,22): run-time error JS1004: Expected ';'
(9221,22-23): run-time error JS1195: Expected expression: )
(9222,18-19): run-time error JS1194: Expected ',' or ']': ;
(9222,18-19): run-time error JS1006: Expected ')': ;
(9224,13-14): run-time error JS1002: Syntax error: }
(9278,9-10): run-time error JS1002: Syntax error: }
(9287,5-6): run-time error JS1002: Syntax error: }
(9288,1-2): run-time error JS1195: Expected expression: ]
(9288,2-3): run-time error JS1195: Expected expression: )
 */
var MyApp = angular.module('MyApp', [
    "kendo.directives"
    , 'ui.bootstrap'
    , 'daterangepicker'
    , 'angularFileUpload'
    , 'shareModule'
    , 'ngMaterial'
    , 'ngSanitize'
    ]);

var BaseService = function ($rootScope, $http, $q, $filter, $timeout, $log) {

    function postData(controller, action, isValidateToken, data) {
        var result = $q.defer();
        $http({
            method: 'POST',
            contentType: 'application/json',
            url: $rootScope.baseUrl + controller + "/" + action,
            data: data,
            headers: {
                'RequestVerificationToken': $(':input:hidden[id*="antiForgeryToken"]').val()
            }
        })
           .success(function (response) {
               result.resolve(response);
           })
           .error(function (response) {
               result.reject(response);
           });

        return result.promise;
    }

    function postDataFromAPI(link, isValidateToken, data, token) {
        var result = $q.defer();
        $http({
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            data: data,
            contentType: 'json',
            url: link,

        })
           .success(function (response) {
               result.resolve(response);
           })
           .error(function (response) {
               result.reject(response);
           });

        return result.promise;
    }

    function ValidatorForm(form) { 
        $(form).formValidation({
            framework: 'bootstrap',
            icon: {

            },
            excluded: ':disabled',
            fields: {

            },
        })
        .off('success.form.fv')
        .on('success.form.fv', function (e) {
            var $form = $(e.target),
            fv = $(e.target).data('formValidation');
            fv.defaultSubmit();

        })
        .on('err.field.fv', function (e, data) {
            if (data.fv.getSubmitButton()) {
                data.fv.disableSubmitButtons(false);
            }

        })
        .on('success.field.fv', function (e, data) {
            if (data.fv.getSubmitButton()) {
                data.fv.disableSubmitButtons(false);
            }
        }).on('err.validator.fv', function (e, data) {
            // $(e.target)    --> The field element
            // data.fv        --> The FormValidation instance
            // data.field     --> The field name
            // data.element   --> The field element
            // data.validator --> The current validator name

            data.element
                .data('fv.messages')
                // Hide all the messages
                .find('.help-block[data-fv-for="' + data.field + '"]').hide()
                // Show only message associated with current validator
                .filter('[data-fv-validator="' + data.validator + '"]').show();
        });
    };

    function isNullOrEmpty(val) {

        if (val != null && val != undefined && val != "") {
            return false;
        } else
            return true;
    };

    //function showCommonDialog(msgInfor) {

    //    var defer = $q.defer();
    //    var modalInstance = $modal.open({
    //        animation: true,
    //        size: msgInfor.size,
    //        backdrop: 'static',
    //        windowClass: 'center-modal',
    //        templateUrl: 'NotificationCommonModal.html',
    //        controller: "CommonDialogController",
    //        resolve: {
    //            items: function () {
    //                return msgInfor;
    //            }
    //        }
    //    });
    //    modalInstance.result.then(function (response) {
            
    //        if (response == "1") {
    //            defer.resolve(modalInstance);
    //        }
    //        else {
    //            defer.reject();
    //        }
    //        modalInstance.close();
           

    //    }, function () {
    //        modalInstance.close();
    //        defer.reject();
    //        $log.info('Modal dismissed at: ' + new Date());
    //    });
    //    return defer.promise;
    //}

    function displaySuccess(message, timeOut) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "onclick": null,
            "fadeIn": 300,
            "fadeOut": 1000,
            "timeOut": timeOut == null ? 3000 : timeOut,
            "extendedTimeOut": 1000,
            "showMethod": "slideDown",
            "hideMethod": "slideUp"
        };
        toastr.success(message);
    }

    function displayError(error, timeOut) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "onclick": null,
            "fadeIn": 300,
            "fadeOut": 1000,
            "timeOut": timeOut == null ? 5000 : timeOut,
            "extendedTimeOut": 1000,
            "showMethod": "slideDown",
            "hideMethod": "slideUp"
        };
        if (Array.isArray(error)) {
            error.each(function (err) {
                toastr.error(err);
            });
        }
        else {
            toastr.error(error);
        }
    }

    function displayWarning(message, timeOut) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "onclick": null,
            "fadeIn": 300,
            "fadeOut": 1000,
            "timeOut": timeOut == null ? 5000 : timeOut,
            "extendedTimeOut": 1000,
            "showMethod": "slideDown",
            "hideMethod": "slideUp"
        };
        toastr.warning(message);
    }

    function displayInfo(message, timeOut) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "onclick": null,
            "fadeIn": 300,
            "fadeOut": 1000,
            "timeOut": timeOut == null ? 3000 : timeOut,
            "extendedTimeOut": 1000,
            "showMethod": "slideDown",
            "hideMethod": "slideUp"
        };
        toastr.info(message);
    }

    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    function getJsonDateObj(jsonDate) {
        var dateObj = null;
        if (jsonDate == null) {
            return null;
        } else {
            d = new Date(jsonDate);
            if (d.valid()) {
                dateObj = new Date(jsonDate);
            } else {
                dateObj = new Date(parseInt(jsonDate.replace('/Date(', '')));
            }

        }
        return dateObj;

    }

    function calculateWordDimensions(text, size) {
        var font = "bold " + size + "px arial"
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    }

    function formatFullDateTime(sDate) {
        if (sDate != "" && sDate != undefined) {
            return $filter('jsDate')(sDate, $filter('uppercase')($rootScope.RootScopeDateFormat) + ' HH:mm');
        } else {
            return "";
        }
    }

    function formatPrice(price) {
        return $filter('currency')(price, $rootScope.CurrencySymbol, $rootScope.RootScopeDecimalplace, 'after');
    }

    function formatPriceValue(price) {
        return parseFloat(($filter('number')(price, 0)).replace(/,/g, ''));
    }

    function formatPriceString(price) {
        return ($filter('number')(price, 0));
    }

    function parseStringToInt(string) {
        return parseInt(string.split(',').join(''));
    }

    function formatDate(sDate) {
        if (sDate != "" && sDate != undefined) {
            var s = $rootScope.RootScopeDateFormat;
            var s = $filter('uppercase')(s);
            s = s.replace("DDD", "ddd");
            return $filter('jsDate')(sDate, s);
        } else {
            return "";
        }
    }

    function hasUnicode(str) {
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 127) return true;
        }
        return false;
    }

    return {
        formatPriceValue: formatPriceValue,
        formatPrice: formatPrice,
        postData: postData,
        ValidatorForm: ValidatorForm,
        postDataFromAPI: postDataFromAPI,
        //showCommonDialog: showCommonDialog,
        displaySuccess: displaySuccess,
        displayError: displayError,
        displayWarning: displayWarning,
        displayInfo: displayInfo,
        formatFullDateTime: formatFullDateTime,
        formatDate: formatDate,
        hasUnicode: hasUnicode,
        formatPriceString: formatPriceString,
        parseStringToInt: parseStringToInt
    };
}
BaseService.$inject = ['$rootScope', '$http', '$q', '$filter', '$timeout', '$log'];

MyApp.service('BaseService', BaseService);

MyApp.run(['$rootScope', 'BaseService', '$window', '$timeout', function ($rootScope, BaseService, $window, $timeout) {

    var baseUrl = $('baseurl').attr('value');
    $rootScope.baseUrl = baseUrl;
    $rootScope.RootScopeDateFormat = $('dateformat').attr('value');
    $rootScope.CurrencySymbol = $('currencysymbol').attr('value');
    $rootScope.RootScopeDecimalplace = $('decimalplace').attr('value');
    $rootScope.RootScopeSessionExpiredShowing = false;

}]);

MyApp.factory('httpAuthInterceptor', ['$q', '$rootScope', '$window', '$timeout', function ($q, $rootScope, $window, $timeout) {
    return {
        'responseError': function (response) {
            // NOTE: detect error because of unauthenticated user
            if ([401, 403].indexOf(response.status) >= 0) {
                // redirecting to login page
                $window.location.href = 'https://dichvucong.dav.gov.vn/Account/Login?autosso=False'
                $rootScope.$broadcast('event:loginRequired');
                return response;
            } else {
                abp.notify.error('Có lỗi xảy ra');
                //return $q.reject(rejection);
            }
        }
    };
}])
MyApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    $httpProvider.interceptors.push('httpAuthInterceptor');
}]);
MyApp.factory('errorInterceptor', ['$q', '$rootScope',
    function ($q, $rootScope) {
        return {
            request: function (config) {
                return config || $q.when(config);
            },
            requestError: function (request) {
                return $q.reject(request);
            },
            response: function (response) {
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (response && response.status === 404) {
                }
                if (response && response.status === 401) {
                    alert("Session Error");
                }
                if (response && response.status >= 500) {
                }
                return $q.reject(response);
            }
        };
    }]);

MyApp.filter("jsDate", function ($log) {
    return function (x, formatDate) {
        return moment(x).format(formatDate);

    };
});

MyApp.filter("formatDate", ['$log', '$filter', '$rootScope', function ($log, $filter, $rootScope) {
    return function (sDate) {
        if (sDate != "" && sDate != undefined) {
            var s = $rootScope.RootScopeDateFormat;
            if (s == '' || s == undefined || s == null) {
                s = "MM/dd/yyyy";
            }
            var s = $filter('uppercase')(s);
            s = s.replace("DDD", "ddd");
            return $filter('jsDate')(sDate, s);
        } else {
            return "";
        }
        return $filter('jsDate')(sDate, $filter('uppercase')($rootScope.RootScopeDateFormat));

    };
}]);


MyApp.directive('enterKey', [
    function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.enterKey);
                    });

                    event.preventDefault();
                }
            });
        };
    }
]);
;
MyApp.controller('frontend.congboblacklist', [
    '$scope', '$sce', '$location', '$http', '$window', '$timeout', '$uibModal',
    function ($scope, $sce, $location, $http, $window, $timeout, $uibModal) {
        vm = this;
        var getThuocCongBoPagingService = (input, ajaxParams) => {
            return abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/blacklist/GetAllPublicServerPaging',
                type: 'POST',
                data: JSON.stringify(input)
            }, ajaxParams));
        };
        var checkDateTimeNow = function (dateCheck, dateShow) {
            if (dateCheck == null || typeof (dateCheck) == 'undefined') return false;
            var dateF = new Date(dateCheck);
            if (dateF == 'Invalid Date') {
                return false;
            }
            var month = dateF.getMonth() + 1;
            if (month < 10)
                month = "0" + month;
            var dateFx = dateF.getDate();
            if (dateFx < 10)
                dateFx = "0" + dateFx;
            dateCheck = dateF.getFullYear() + "-" + month + "-" + dateFx;

            if (dateShow == null) {
                return false;
            }
            var start = new Date(dateCheck),
                end = new Date(),
                diff = new Date(start - end),
                days = diff / 1000 / 60 / 60 / 24;

            if ((days + 1) > 0 && (days + 1) < dateShow) {
                return true;
            } else {
                return false;
            }
        };
        //#region Tìm kiếm
        var chucnangTimKiem = () => {
            vm.isNangCaoFilter = false;
            vm.changeNangCaoFilter = ($event) => {
                vm.isNangCaoFilter = !vm.isNangCaoFilter;
                vm.filterAll = "";
                vm.filterCongBo = {};
            };
            $scope.$watch('vm.filterAll', function myfunction() {
                if (vm.filterAll != null && vm.filterAll != "") {
                    vm.isNangCaoFilter = false;
                    vm.filterCongBo = {};
                }
            })
            $scope.totalRow = 0;
            $scope.keyWord = "";
            vm.switchFilter = 0;
            vm.changeSwitchFilter = function ($event, d) {
                $('#search_concept').text($event.currentTarget.firstChild.text);
                vm.switchFilter = d;
            };
            vm.filterCongBo = {};
            vm.refreshFilter = function () {
                vm.filterAll = "";
                vm.filterCongBo = {};
                vm.filterCongBo.tieuChuanId = null;
                vm.filterCongBo.phanLoaiThuocEnum = null;
                vm.filterCongBo.ngayCapSoDangKy = null;
                vm.getGridData();
            };
        };
        //#endregion
        //#region Grid Data
        var gridBlacklist = () => {
            vm.refreshColumns = function () {
                vm.columns = [];
                var _colSTT = {
                    field: "stt",
                    title: app.localize('STT'),
                    template: "<div class='row-number text-center'></div>",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 50
                };
                var _colNuocSanXuat = {
                    field: "nuocSanXuat",
                    title: app.localize('Nước'),
                    template: "{{this.dataItem.nuocSanXuat}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 270
                };
                var _colCoSoSanXuat = {
                    field: "coSoSanXuat",
                    title: app.localize('Công ty sản xuất'),
                    template: "{{this.dataItem.coSoSanXuat}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                };

                var _colThongTinViPham = {
                    title: "Số lần vi phạm",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    columns: [
                        {
                            title: "Tiền kiểm",
                            attributes: { class: "text-center" },
                            headerAttributes: { style: "text-align: center;" },
                            columns: [
                                {
                                    field: "level3_tk",
                                    title: "Mức 3",
                                    template: `<a href="" style="text-decoration: none;" ng-click="vm.viewThuocViPham(this.dataItem, 1, 3)">{{this.dataItem.level3_tk | number:0}}</a>`,
                                    attributes: { class: "text-center" },
                                    headerAttributes: { style: "text-align: center;" },
                                    width: "70px"
                                },
                                {
                                    field: "level2_tk",
                                    title: "Mức 2",
                                    attributes: { class: "text-center" },
                                    template: `<a href="" style="text-decoration: none;" ng-click="vm.viewThuocViPham(this.dataItem, 1, 2)">{{this.dataItem.level2_tk | number:0}}</a>`,
                                    headerAttributes: { style: "text-align: center;" },
                                    width: "70px"
                                }
                            ]
                        },
                        {
                            title: "Hậu kiểm",
                            attributes: { class: "text-center" },
                            headerAttributes: { style: "text-align: center;" },
                            columns: [
                                {
                                    field: "level3_hk",
                                    title: "Mức 3",
                                    attributes: { class: "text-center" },
                                    template: `<a href="" style="text-decoration: none;" ng-click="vm.viewThuocViPham(this.dataItem, 2, 3)">{{this.dataItem.level3_hk | number:0}}</a>`,
                                    headerAttributes: { style: "text-align: center;" },
                                    width: "70px"
                                },
                                {
                                    field: "level2_hk",
                                    title: "Mức 2",
                                    attributes: { class: "text-center" },
                                    template: `<a href="" style="text-decoration: none;" ng-click="vm.viewThuocViPham(this.dataItem, 2, 2)">{{this.dataItem.level2_hk | number:0}}</a>`,
                                    headerAttributes: { style: "text-align: center;" },
                                    width: "70px"
                                }
                            ]
                        },
                        {
                            title: "Tổng cộng",
                            attributes: { class: "text-center" },
                            headerAttributes: { style: "text-align: center;" },
                            columns: [
                                {
                                    field: "level3_t",
                                    title: "Mức 3",
                                    attributes: { class: "text-center" },
                                    template: `<a href="" style="text-decoration: none;" ng-click="vm.viewThuocViPham(this.dataItem, 4, 3)">{{this.dataItem.level3_t | number:0}}</a>`,
                                    headerAttributes: { style: "text-align: center;" },
                                    width: "70px"
                                },
                                {
                                    field: "level2_t",
                                    title: "Mức 2",
                                    template: `<a href="" style="text-decoration: none;" ng-click="vm.viewThuocViPham(this.dataItem, 4, 2)">{{this.dataItem.level2_t | number:0}}</a>`,
                                    attributes: { class: "text-center" },
                                    headerAttributes: { style: "text-align: center;" },
                                    width: "70px"
                                }
                            ]
                        },
                    ]
                };
                var _colNgayCapNhat= {
                    field: "ngayCapNhat",
                    title: app.localize('Ngày cập nhật'),
                    template: "{{this.dataItem.ngayCapNhat | date:'dd/MM/yyyy'}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 120
                };
                var _colNgayHetHan = {
                    field: "ngayHetHan",
                    title: app.localize('Ngày hết hạn'),
                    template: `<div ng-if="!this.dataItem.isDaRut"><span style='color:red' ng-if="this.dataItem.ngayHetHanRed">{{this.dataItem.ngayHetHan | date:'dd/MM/yyyy'}}</span><span ng-if='!this.dataItem.ngayHetHanRed'>{{this.dataItem.ngayHetHan | date:'dd/MM/yyyy'}}</span><div>`,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center; vertical-align: middle;" },
                    width: 120
                };
                var _colNgayRut = {
                    field: "ngayRut",
                    title: app.localize('Ngày rút'),
                    template: `<div ng-if="this.dataItem.isDaRut">{{this.dataItem.ngayRut | date:'dd/MM/yyyy'}}<div>`,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center; vertical-align: middle;" },
                    width: 120
                };
                var _colTrangThai = {
                    field: "trangThai",
                    title: app.localize('Tình trạng cập nhật'),
                    template: "{{this.dataItem.trangThai}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 120
                };
                var setColForForm = function () {
                    vm.columns = [_colSTT, _colNuocSanXuat, _colCoSoSanXuat, _colThongTinViPham, _colNgayCapNhat, _colNgayHetHan, _colTrangThai];
                };
                setColForForm();
                vm.columnBlacklist = vm.columns;
            };

            vm.refreshColumns();
            vm.requestParams = {
                skipCount: 0,
                maxResultCount: 10,
                sorting: null
            };
            vm.refreshDataSource = function () {
                vm.blacklistDataSoure = [];
                vm.setDataSource = function () {
                    vm.blacklistDataSoure = new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                $scope.totalRow = 0;
                                $scope.keyWord = "";
                                vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                                vm.requestParams.maxResultCount = options.data.pageSize;
                                var _req = {
                                    filterText: vm.filterAll,
                                    Blacklist: vm.filterCongBo,
                                    KichHoat: true
                                };
                                switch (vm.switchFilter) {
                                    case 1:
                                        _req.Blacklist.NuocSanXuat = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 2:
                                        _req.Blacklist.CoSoSanXuat = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 3:
                                        _req.Blacklist.NgayCapNhat = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    default:
                                        _req.filterText = vm.filterAll;
                                        break;
                                }
                                getThuocCongBoPagingService($.extend(_req, vm.requestParams))
                                    .then(function (result) {
                                        for (var i = 0; i < result.items.length; i++) {
                                            if (checkDateTimeNow(result.items[i].ngayHetHan, 3)) {
                                                result.items[i].ngayHetHanRed = true;
                                            } else {
                                                result.items[i].ngayHetHanRed = false;
                                            }
                                        }
                                        options.success(result);
                                        $scope.totalRow = result.totalCount;
                                        $scope.keyWord = vm.filterAll;
                                        $scope.$apply();
                                        $scope.filter = {};
                                    });
                            }
                        },
                        pageSize: 15,
                        serverPaging: true,
                        serverSorting: true,
                        sortable: true,
                        schema: {
                            data: "items",
                            total: "totalCount"
                        }
                    });
                };
                vm.setDataSource();
            };
            vm.refreshDataSource();
            vm.blacklistGridOptions = {
                pageable:
                {
                    "refresh": true,
                    "pageSizes": [5, 10, 15, 20, 50, 100],
                    messages: {
                        empty: "Không có dữ liệu",
                        display: "Hiển thị từ {0} đến {1}/{2} bản ghi",
                        itemsPerPage: "Bản ghi mỗi trang"
                    }
                },
                resizable: true,
                height: 800,
                scrollable: true,
                dataBound: function (e) {
                    var grid = this;
                    var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                    grid.tbody.find(".row-number").each(function () {
                        var index = record++;
                        $(this).html(index);
                    });
                },
                columns: vm.columnBlacklist
            };
            function isValidDate(s) {
                if (s != null && s.length > 0) {
                    var bits = s.split('/');
                    var d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
                    return !!(d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]));
                } else {
                    return true;
                }
            }
            vm.getGridData = function () {
                var date = vm.filterCongBo.ngayCapSoDangKy;
                if (date != 'undefined' && !isValidDate(date)) {
                    abp.notify.error("Năm cấp không đúng định dạng!");
                    return;
                } else {
                    vm.blacklistDataSoure.read();
                }
            };
        };
        var initDataHistory = () => {
            vm.histories = [];
        };
        //#endregion 
        function init() {
            chucnangTimKiem();
            gridBlacklist();
            initDataHistory();
        };
        init();
        vm.viewCongVan = (url) => {
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn kiến nghị</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congbothuocvipham.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };

        vm.viewCongVanById = (id) => {
            var _id = parseInt(id);
            var f = vm.getByParentPagingServiceDS.filter(x => x.id == _id);
            var url = "";
            if (f.length > 0) {
                url = f[0].urlCongVanKienNghiDieuChinhGia;
            }
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn kiến nghị</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congbothuocvipham.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };

        vm.viewLichSu = (d) => {
            app.soDangKyId = d.id;
            app.danhSachLichSu = [];
            var getHistoryService = (soDangKyId, ajaxParams) => {
                return abp.ajax($.extend({
                    url: abp.appPath + 'api/services/app/davSoDangKyHistory/GetHistory' + abp.utils.buildQueryString([{ name: 'soDangKyId', value: soDangKyId }]) + '',
                    type: 'POST',
                    data: JSON.stringify({})
                }, ajaxParams));
            };
            if (app.soDangKyId > 0) {
                getHistoryService(app.soDangKyId)
                    .then(function (result) {
                        app.danhSachLichSu = result;
                        var modalInstance = $uibModal.open({
                            template: `
                                <div class="modal-header">
                                <span class="caption-subject bold uppercase">Lịch sử thay đổi thông tin số đăng ký</span>
                                </div>
                                <div class="modal-body">
                                <div frontend.congbothuocvipham.viewlichsu></div>
                                </div>
                                <div class="modal-footer">
                                <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                                </div>
                                `,
                            size: 'lg',
                            windowClass: 'my-modal-popup',
                            resolve: {
                                thuoc: d
                            },
                            controller: ['$scope', '$uibModalInstance', 'thuoc', function ($scope, $uibModalInstance, thuoc) {
                                $scope.thuoc = thuoc;
                                app.IsNullOrEmpty = function (o) {
                                    f = false;
                                    if (typeof (o) === 'undefined') f = true;
                                    if (o == null) f = true;
                                    o = String(o);
                                    if (o == '') f = true;
                                    return f;
                                };
                                $scope.cancel = function () {
                                    $uibModalInstance.close();
                                };
                            }]
                        });
                    });
            }
        };

   
        // Popup viewThuocViPham
        vm.viewThuocViPham = (d, loaivipham, level) => {
            app.danhSachViPham = [];
            var thuocViPhamService = (cososanxuatid, loaivipham, level, ajaxParams) => {
                return abp.ajax($.extend({
                    url: abp.appPath + 'api/services/app/thuocViPham/GetThuocViPham' + abp.utils.buildQueryString([{ name: 'cososanxuatid', value: cososanxuatid }, { name: 'loaivipham', value: loaivipham }, { name: 'level', value: level }]) + '',
                    type: 'POST',
                    data: JSON.stringify({})
                }, ajaxParams));
            };
             
            thuocViPhamService(d.coSoSanXuatId, loaivipham, level)
                    .then(function (result) {
                        app.danhSachViPham = result;
                        var modalInstance = $uibModal.open({
                            template: `
                                <div class="modal-header">
                                <span class="caption-subject bold uppercase">Danh sách cơ sở có thuốc vi phạm chất lượng</span>
                                </div>
                                <div class="modal-body">
                                <div frontend.congbothuocvipham.viewdanhsachvipham></div>
                                </div>
                                <div class="modal-footer">
                                <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng </button>
                                </div>
                                `,
                            size: 'lg',
                            windowClass: 'my-modal-popup',
                            resolve: {
                                //thuoc: d
                            },
                            controller: ['$scope', '$uibModalInstance' , function ($scope, $uibModalInstance) {
                                //$scope.thuoc = thuoc;
                                app.IsNullOrEmpty = function (o) {
                                    var f = false;
                                    if (typeof (o) === 'undefined') f = true;
                                    if (o == null) f = true;
                                    o = String(o);
                                    if (o == '') f = true;
                                    return f;
                                };
                                $scope.cancel = function () {
                                    $uibModalInstance.close();
                                };
                            }]
                        });
                    });
        };
    }
]);
(function () {
    MyApp.directive('frontend.congboblacklist.viewlichsu', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                vm.lichSuThayDoi = app.danhSachLichSu;
                vm.srcQuyetDinh = function (src) {
                    return "/File/GoToViewTaiLieu?url=" + src + "#zoom=100";
                };
                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
                vm.viewCongVan = (url) => {
                    app.urlCongVanCongBoGiaThuoc = url;
                    var modalInstance = $uibModal.open({
                        template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn thu hồi</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congboblacklist.viewcongvancongbogia ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                        size: 'lg',
                        windowClass: 'my-modal-popup',
                        resolve: {
                            urlFileCV: { urlDuongDanCV: url }
                        },
                        controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                            $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                            app.IsNullOrEmpty = function (o) {
                                var f = false;
                                if (typeof (o) === 'undefined') f = true;
                                if (o == null) f = true;
                                o = String(o);
                                if (o == '') f = true;
                                return f;
                            };
                            $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                            $scope.cancel = function () {
                                $uibModalInstance.close();
                            };
                        }]
                    });
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="container-fluid">
                        <div class="row form-group">
                            <div class="col-md-12">
                                <div class="timeline">
                                    <div class="timeline-item" ng-repeat="ls in vm.lichSuThayDoi">
                                        <div class="timeline-badge">
                                            <div class="timeline-icon">
                                                <em class="fa fa-history" ng-class="$index==0? 'font-green-haze':'font-red'"></em>
                                            </div>
                                        </div>
                                        <div class="timeline-body">
                                            <div class="timeline-body-arrow"> </div>
                                            <div class="timeline-body-content" style="margin-top: 0px;">
                                            <div class="portlet light" style="margin-bottom: 0px;">
                                            <div class="portlet-title tabbable-line">
                                                <div class="caption">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta">Lúc {{ls.ngaySuaDoi | date :'dd/MM/yyyy HH:mm'}}</span>
                                                </div>
                                                <ul class="nav nav-tabs"  ng-if="ls.contentJsonObj.ThongTinDangKyThuoc.SoQuyetDinh.length>0">
                                                    <li class="active">
                                                        <a href="#portlet_taba{{ls.id}}" data-toggle="tab" aria-expanded="true"> SỐ ĐĂNG KÝ </a>
                                                    </li>
                                                    <li class="">
                                                        <a href="#portlet_tabb{{ls.id}}" data-toggle="tab" aria-expanded="false"> QUYẾT ĐỊNH </a>
                                                    </li>                                       
                                                </ul>
                                            </div>
                                            <div class="portlet-body">
                                                <div class="tab-content" style="padding:0">
                                                    <div class="tab-pane active" id="portlet_taba{{ls.id}}">
                                                    
                                                <table class="table table-bordered table-hover">
                                                    <thead>
                                                        <tr class="bg-blue font-white">
                                                            <th class="text-center">Số GPLH </th>
                                                            <th class="text-center" style="width:200px"> Tên thuốc </th>
                                                            <th class="text-center" style="width:200px"> Hoạt chất</th>
                                                            <th class="text-center" style="width:200px"> Hàm lượng </th>
                                                            <th class="text-center" style="width:200px"> Số quyết định </th>
                                                            <th class="text-center" style="width:200px"> Năm cấp </th>
                                                            <th class="text-center" style="width:200px"> Đợt cấp </th>
                                                            <th class="text-center" style="width:200px"> Dạng bào chế </th>
                                                            <th class="text-center" style="width:200px"> Quy cách đóng gói</th>
                                                            <th class="text-center" style="width:200px"> Tiêu chuẩn </th>
                                                            <th class="text-center"> Tuổi thọ </th>
                                                      
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td class="text-center">
                                                                {{ls.contentJsonObj.SoDangKy}}
                                                            </td>
                                                            <td>
                                                            {{ls.contentJsonObj.TenThuoc}}
                                                            </td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.HoatChatChinh}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.HamLuong}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinDangKyThuoc.SoQuyetDinh}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinDangKyThuoc.NgayCapSoDangKy | date :'dd/MM/yyyy'}}</td>
                                                            <td class="text-center">{{ls.contentJsonObj.ThongTinDangKyThuoc.DotCap}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.DangBaoChe}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.DongGoi}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.TieuChuan}}</td>
                                                            <td class="text-center">{{ls.contentJsonObj.ThongTinThuocCoBan.TuoiTho}}</td>
                                                          
                                                        </tr>
                                                        <tr>
                                                        <td colspan="11">
                                                            <form class="form-horizontal" role="form">
                                                            <div class="form-body">
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Công ty đăng ký</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTyDangKy.TenCongTyDangKy}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Địa chỉ  công ty đăng ký, nước đăng ký</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTyDangKy.DiaChiDangKy}}, {{ls.contentJsonObj.CongTyDangKy.NuocDangKy}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Công ty sản xuất</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTySanXuat.TenCongTySanXuat}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Địa chỉ công ty sản xuất, nước sản xuất</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTySanXuat.DiaChiSanXuat}}, {{ls.contentJsonObj.CongTySanXuat.NuocSanXuat}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            </div>
                                                            </form>
                                                        </td>                                                           
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="tab-pane" id="portlet_tabb{{ls.id}}">
                                             <iframe ng-if='ls.contentJsonObj.ThongTinDangKyThuoc.UrlSoQuyetDinh.length>0' title="Xem tài liệu" style="width: 100%; height: 600px;border:0" ng-src="{{vm.trustSrc(vm.srcQuyetDinh(ls.contentJsonObj.ThongTinDangKyThuoc.UrlSoQuyetDinh))}}"  ></iframe>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
            };
        }
    ]);
})();

(function () {
    MyApp.directive('frontend.congboblacklist.viewcongvan', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                if (app.urlCongVanCongBoGiaThuoc != "") {
                    vm.taiLieuDinhKemUrl = "/File/GoToViewTaiLieu?url=" + app.urlCongVanCongBoGiaThuoc + "#zoom=100";
                } else {
                    vm.taiLieuDinhKemUrl = "";
                }
                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="row form-group">
                            <div class="col-md-12">
                                <div class="portlet light bordered" style="height: 630px">
                                        <span ng-if="!vm.taiLieuDinhKemUrl || vm.taiLieuDinhKemUrl == ''">
                                    </span>
                                    <iframe ng-if='vm.taiLieuDinhKemUrl ||vm.taiLieuDinhKemUrl!=""' title="Xem tài liệu" style="width: 100%; height: 100%;border:0" ng-src="{{vm.trustSrc(vm.taiLieuDinhKemUrl)}}"  ></iframe>
                                </div>
                            </div>
                        </div>`,
            };
        }
    ]);
})();

(function () {
    MyApp.directive('frontend.congbothuocvipham.viewdanhsachvipham', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
             
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                vm.danhSachBlackList = app.danhSachViPham;
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="container-fluid">
                            <table class="table table-bordered table-hover">
                                <thead>
                                    <tr class="bg-blue font-white">
                                        <th class="text-center" width="15">STT</th>
                                        <th style="width:100px" class="text-center">Số công văn</th>
                                        <th style="width:220px" class="text-center"> Tên Thuốc </th>
                                        <th style="width:100px" class="text-center"> Số GPLH </th>
                                        <th class="text-center" style="width:200px"> Số Lô - Ngày sản xuất - Hạn dùng </th>
                                        <th style="width:220px" class="text-center"> Nơi lấy mẫu </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr ng-repeat="ls in vm.danhSachBlackList">
                                        <td class="text-center">{{$index + 1}}</td>
                                        <td class="text-center">{{ls.thongTinThuHoi.soCongVanThuHoi}} </br> {{ls.thongTinThuHoi.ngayCongVanThuHoi| date:'dd/MM/yyyy'}}</td>
                                        <td class="">{{ls.tenThuoc}}</td>
                                        <td class="text-center">{{ls.soDangKy}}</td>
                                        <td>Số Lô: {{ls.thongTinThuocViPham.soLo}} </br> Ngày sản xuất: {{ls.thongTinThuocViPham.ngaySanXuat| date:'dd/MM/yyyy'}} </br> Hạn dùng: {{ls.thongTinThuocViPham.hanDung|date:'dd/MM/yyyy'}}</td>
                                        <td>{{ls.thongTinViPham.noiLayMau}}</td>
                                    </tr>
                                </tbody>
                            </table>                                    
                </div>`,
            };
        }
    ]);
})();
;
MyApp.controller('frontend.congbogiathuoc', [
    '$scope', '$sce', '$location', '$http', '$window', '$timeout', '$uibModal',
    function ($scope, $sce, $location, $http, $window, $timeout, $uibModal) {
        vm = this;
        vm.getByParentPagingServiceDS = [];

        var getListCongBoPagingService = (input, ajaxParams) => {
            return abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/quanLyGiaThuoc/GetListCongBoPublicPaging',
                type: 'POST',
                data: JSON.stringify(input)
            }, ajaxParams));
        };
        var getByParentPagingService = (input, ajaxParams) => {
            return abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/quanLyGiaThuoc/GetPublicByParentPaging',
                type: 'POST',
                data: JSON.stringify(input)
            }, ajaxParams));
        };
        //#region Tìm kiếm
        var chucnangTimKiem = () => {
            vm.isNangCaoFilter = false;
            vm.changeNangCaoFilter = ($event) => {
                vm.isNangCaoFilter = !vm.isNangCaoFilter;
                vm.filterCongBo = {};
            };
            vm.ngayKeKhaiModel = {
                startDate: null,
                endDate: null
            };
            vm.switchFilter = 0;
            vm.nuocSanXuatIds = [],
                vm.changeSwitchFilter = function ($event, d) {
                    $('#search_concept').text($event.currentTarget.firstChild.text);
                    vm.switchFilter = d;
                };
            vm.filterCongBo = {};
            vm.dataFilter = {
                loaiGiaId: null,
            };
            vm.refreshFilter = function () {
                vm.filterAll = "";
                vm.ngayKeKhaiModel = "";
                vm.loaiGiaFillter = null;
                vm.filterCongBo = {
                    loaiGiaId: null,
                    parentId: null
                };
                vm.getGridData();
            };
        };
        //#endregion
        //#region Grid Data
        var gridGiaThuoc = () => {
            vm.refreshColumns = function () {
                vm.columns = [];
                var _colSTT = {
                    field: "stt",
                    title: app.localize('STT'),
                    template: "<div class='row-number text-center'></div>",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 50
                };
                var _colLoaiGia = {
                    field: "loaiGia",
                    title: app.localize('Phân loại'),
                    template: "{{this.dataItem.loaiGia}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 170
                };
                var _colTenThuoc = {
                    field: "tenThuoc",
                    title: app.localize('Tên thuốc'),
                    template: "{{this.dataItem.tenThuoc}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 100
                };
                var _colSoDK = {
                    field: "soDangKy",
                    title: app.localize('Số GPLH/GPNK'),
                    template: "{{this.dataItem.soDangKy}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 130
                };
                var _colHoatChat = {
                    field: "hoatChat",
                    title: app.localize('Tên HC'),
                    template: "{{this.dataItem.hoatChat}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 150
                };
                var _colHamLuong = {
                    field: "hamLuong",
                    title: app.localize('NĐ/HL'),
                    template: "{{this.dataItem.hamLuong}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 150
                };
                var _colCoSoSanXuat = {
                    field: "doanhNghiepSanXuat",
                    title: app.localize('Cơ sở SX'),
                    template: "{{this.dataItem.doanhNghiepSanXuat.length>0?this.dataItem.doanhNghiepSanXuat:'N/A'}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 400
                };
                var _colNuocSanXuat = {
                    field: "nuocSanXuat",
                    title: app.localize('Nước SX'),
                    template: "{{this.dataItem.nuocSanXuat.length>0?this.dataItem.nuocSanXuat:'N/A'}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 200
                };
                var _colDangBaoChe = {
                    field: "dangBaoChe",
                    title: app.localize('Dạng bào chế'),
                    template: "{{this.dataItem.dangBaoChe}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 100
                };
                var _colQuyCachDongGoi = {
                    field: "quyCachDongGoi",
                    title: app.localize('Quy cách đóng gói'),
                    template: "{{this.dataItem.quyCachDongGoi}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 120
                };
                var _colDVT = {
                    field: "donViTinh",
                    title: app.localize('ĐVT'),
                    template: "{{this.dataItem.donViTinh}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 100
                };
                var _colGiaBanBuonDuKien = {
                    field: "giaBanBuonDuKien",
                    title: app.localize('Giá bán buôn dự kiến (VNĐ) (VAT)'),
                    template: "{{this.dataItem.giaBanBuonDuKien | number:0}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 150
                };
                var _colGiaBanLeDuKien = {
                    field: "giaBanLeDuKien",
                    title: app.localize('Giá bán lẻ dự kiến (theo đề xuất của Doanh nghiệp) (VNĐ) (VAT)'),
                    template: "{{this.dataItem.giaBanLeDuKien == 0 ? '' : this.dataItem.giaBanLeDuKien }}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 150
                };
                var _colNgayKK_KKL = {
                    field: "ngayTiepNhan",
                    title: app.localize('Ngày công bố'),
                    template: "{{this.dataItem.ngayTiepNhan !=null?(this.dataItem.ngayTiepNhan | date:'dd/MM/yyyy'):'N/A'}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 100
                };
                var _colDonViKeKhai = {
                    field: "donViKeKhai",
                    title: app.localize('Đối tượng thực hiện công bố'),
                    template: "{{this.dataItem.donViKeKhai}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 400
                };
                var _colSoVanBanKNMG = {
                    field: "soCongVanKienNghiDieuChinhGia",
                    title: app.localize('Văn bản kiến nghị'),
                    template: `<div ng-if='this.dataItem.isNotCongVanDienTu'>
                                <div align='center' ng-show='this.dataItem.soCongVanKienNghiDieuChinhGia.length>0 && (!this.dataItem.isActive || !this.dataItem.isDaRaSoat || !this.dataItem.isHieuLuc)'>
                                 <a ng-if="this.dataItem.isVanThuDongDau" href="" style=" text-decoration: none;" ng-click="vm.viewCongVan(this.dataItem.urlCongVanKienNghiDieuChinhGia)"> {{this.dataItem.soCongVanKienNghiDieuChinhGia}}</a>
                                <div ng-if="!this.dataItem.isVanThuDongDau" align='center'>{{this.dataItem.soCongVanKienNghiDieuChinhGia}}</div>
                                <div align='center'>{{this.dataItem.ngayCongVanKienNghiDieuChinhGia | date:'dd/MM/yyyy'}}</div>
                                <div align='center' ng-if='this.dataItem.isRaCongVanNhanh'>Công văn nhanh</div>
                               </div>
                               </div>
                               `,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 120
                };

                var _colTrangThaiHieuLuc = {
                    field: "isHieuLuc",
                    title: "Trạng thái",
                    width: 100,
                    template: `<div><span ng-if="dataItem.isHieuLuc==true && dataItem.isDaRaSoat==true" class="bold font-green">Đã rà soát, không có văn bản</span>
                                       <span ng-if="dataItem.isHieuLuc==false && this.dataItem.soCongVanKienNghiDieuChinhGia.length>0 && !dataItem.isRaCongVanNhanh" class="bold font-red">Có văn bản kiến nghị</span>
                                       <span ng-if="dataItem.isHieuLuc==false && this.dataItem.soCongVanKienNghiDieuChinhGia.length>0 && dataItem.isRaCongVanNhanh" class="bold font-red">Có văn bản kiến nghị ra công văn nhanh</span>
                                    </div>`,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" }
                };

                var _colLichSu = {
                    title: '',
                    template: `<a href="" style="text-decoration:none;" title="Lịch sử công bố" ng-click="vm.viewLichSu(this.dataItem)"><em class="fa fa-history"></em></a>`,
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 30
                };
                var setColForForm = function () {
                    vm.columns = [/*_colSTT, */_colNgayKK_KKL, _colTrangThaiHieuLuc, _colSoVanBanKNMG, _colTenThuoc, _colHoatChat, _colHamLuong, _colSoDK, _colDangBaoChe, _colQuyCachDongGoi,
                        _colDVT, _colGiaBanBuonDuKien, _colCoSoSanXuat, _colNuocSanXuat, _colDonViKeKhai];
                };
                setColForForm();
                vm.columnGiaThuoc = vm.columns;
            };
            vm.refreshColumns();
            vm.requestParams = {
                skipCount: 0,
                maxResultCount: 10,
                sorting: null
            };
            vm.refreshDataSource = function () {
                vm.giathuocDS = [];
                vm.setDataSource = function () {
                    vm.giathuocDS = new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                                vm.requestParams.maxResultCount = options.data.pageSize;
                                var _req = {
                                    filterAll: vm.filterAll,
                                    CongBoGiaThuoc: vm.filterCongBo,
                                    KichHoat: true
                                };
                                switch (vm.switchFilter) {
                                    case 1:
                                        _req.CongBoGiaThuoc.SoDangKy = vm.filterAll;
                                        _req.filterAll = "";
                                        break;
                                    case 2:
                                        _req.CongBoGiaThuoc.TenThuoc = vm.filterAll;
                                        _req.filterAll = "";
                                        break;
                                    case 3:
                                        _req.CongBoGiaThuoc.DonViKeKhai = vm.filterAll;
                                        _req.filterAll = "";
                                        break;
                                    case 4:
                                        _req.CongBoGiaThuoc.DoanhNghiepSanXuat = vm.filterAll;
                                        _req.filterAll = "";
                                        break;
                                    case 5:
                                        _req.CongBoGiaThuoc.NuocSanXuat = vm.filterAll;
                                        _req.filterAll = "";
                                        break;
                                    default:
                                        _req.filterAll = vm.filterAll;
                                        break;
                                }
                                getListCongBoPagingService($.extend(_req, vm.requestParams))
                                    .then(function (result) {
                                      
                                        options.success(result);
                                        $scope.filter = {};
                                    });
                            }
                        },
                        pageSize: 15,
                        serverPaging: true,
                        serverSorting: true,
                        sortable: true,
                        schema: {
                            data: "items",
                            total: "totalCount"
                        }
                    });
                };
                vm.setDataSource();
            }
            vm.refreshDataSource();
            vm.giaThuocGridOptions = {
                pageable:
                {
                    "refresh": true,
                    "pageSizes": [5, 10, 15, 20, 50, 100],
                    messages: {
                        empty: "Không có dữ liệu",
                        display: "Hiển thị từ {0} đến {1}/{2} bản ghi",
                        itemsPerPage: "Bản ghi mỗi trang"
                    }
                },
                resizable: true,
                height: 800,
                scrollable: true,
                detailInit: detailInit,
                dataBound: function (e) {
                    var grid = this;
                    var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                    grid.tbody.find(".row-number").each(function () {
                        var index = record++;
                        $(this).html(index);
                    });
                    var gridData = grid.dataSource.view();
                    for (var i = 0; i < gridData.length; i++) {
                        var currentUid = gridData[i].uid;
                        if (!gridData[i].isExitsHistory) {
                            var currentRow = grid.table.find("tr[data-uid='" + currentUid + "']");
                            var createUserButton = $(currentRow).find(".k-icon");
                            createUserButton.hide();
                        }
                    }
                },
                columns: vm.columnGiaThuoc
            };
            vm.getGridData = function () {
                //vm.giathuocDS.read();
                vm.setPageNumber();
            };
            vm.setPageNumber = function () {
                var grid = $('#gridGiaThuoc').data('kendoGrid');
                grid.dataSource.page(1);
            }
            //Lịch sử công bố
            function detailInit(e) {
                function formatDate(date) {
                    if (date == null || typeof (date) == 'undefined') return null;
                    if (date.toString().indexOf('/') > 0) {
                        return date;
                    } else {
                        var dateF = new Date(date);
                        if (dateF == 'Invalid Date') {
                            return date;
                        }
                        var month = dateF.getMonth() + 1;
                        if (month < 10)
                            month = "0" + month;
                        var dateFx = dateF.getDate();
                        if (dateFx < 10)
                            dateFx = "0" + dateFx;
                        return dateFx + "/" + month + "/" + dateF.getFullYear();
                    }
                }
                $("<div/>").appendTo(e.detailCell).kendoGrid({
                    dataSource: {
                        //type: "odata",
                        transport: {
                            read: function (options) {
                                vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                                vm.requestParams.maxResultCount = options.data.pageSize;
                                var filterCongBoCopy = angular.copy(vm.filterCongBo);
                                filterCongBoCopy.parentId = e.data.id;
                                var _req = {
                                    CongBoGiaThuoc: filterCongBoCopy
                                };
                                getByParentPagingService($.extend(_req, vm.requestParams))
                                    .then(function (result) {
                                        if (result.totalCount > 0) {
                                            /*result.items = result.items.filter(x => x.soCongVanKienNghiDieuChinhGia == null);*/
                                        }
                                        options.success(result);
                                        vm.getByParentPagingServiceDS = vm.getByParentPagingServiceDS.concat(result.items);
                                        $scope.filter = {};
                                    });
                            }
                        },
                        pageSize: 15,
                        serverPaging: true,
                        serverSorting: true,
                        sortable: true,
                        schema: {
                            data: "items",
                            total: "totalCount"
                        }
                    },
                    pageable:
                    {
                        "refresh": true,
                        "pageSizes": [5, 10, 15, 20, 50, 100],
                        messages: {
                            empty: "Không có dữ liệu",
                            display: "Hiển thị từ {0} đến {1}/{2} bản ghi",
                            itemsPerPage: "Bản ghi mỗi trang"
                        }
                    },
                    resizable: true,
                    height: 400,
                    scrollable: true,
                    noRecords: {
                        template: "<div class='k-nodata' style='margin-top: 134px;'><div><div><em class='fa fa-info-circle fa-2x'></em><br><br>Không có lịch sử thay đổi nào!</div></div></div>"
                    },
                    dataBound: function (e) {
                        var grid = this;
                        var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                        grid.tbody.find(".row-number").each(function () {
                            var index = record++;
                            $(this).html(index);

                        });

                    },
                    columns: [
                        {
                            field: "stt",
                            title: app.localize('STT'),
                            template: "<div class='row-number text-center'></div>",
                            attributes: { class: "text-center" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 41
                        },
                        {
                            field: "loaiGia",
                            title: app.localize('Phân loại'),
                            attributes: { class: "text-left" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 170
                        },
                        {
                            field: "ngayTiepNhan",
                            title: app.localize('Ngày kê khai'),
                            template: function (dataItem) {
                                if (kendo.toString(kendo.parseDate(dataItem.ngayTiepNhan, 'yyyy-MM-dd'), 'dd/MM/yyyy') == null) {
                                    return `N/A`;
                                } else {
                                    var a = kendo.toString(kendo.parseDate(dataItem.ngayTiepNhan, 'yyyy-MM-dd'), 'dd/MM/yyyy');
                                    return a;
                                }
                            },
                            attributes: { class: "text-center" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 140
                        },
                        {
                            field: "isHieuLuc",
                            title: "Trạng thái",
                            width: 170,
                            template:
                                function (dataItem) {
                                    if (dataItem.isHieuLuc && dataItem.isDaRaSoat) {
                                        return `<span class="bold font-green">Đã rà soát, không có văn bản</span>`;
                                    } else if (!dataItem.isHieuLuc && dataItem.soCongVanKienNghiDieuChinhGia != null) {
                                        return `<span class="bold font-red">Có văn bản kiến nghị</span>`;
                                    } else {
                                        return "";
                                    }
                                },
                            attributes: { class: "text-center" },
                            headerAttributes: { style: "text-align: center;" }
                        },
                        {
                            field: "urlCongVanKienNghiDieuChinhGia",
                            title: app.localize('Văn bản kiến nghị'),
                            template: function (dataItem) {
                                //var url = dataItem.urlCongVanKienNghiDieuChinhGia;
                                //if (dataItem.soCongVanKienNghiDieuChinhGia != null) {
                                //    return "<div  class='cell-file' align = 'center'><a href='' onclick='vm.viewCongVanById(\"" + dataItem.id + "\")' style='text-decoration: none;'>" + dataItem.soCongVanKienNghiDieuChinhGia + "</a><div align='center'>" + kendo.toString(kendo.parseDate(dataItem.ngayCongVanKienNghiDieuChinhGia, 'yyyy-MM-dd'), 'dd/MM/yyyy') + "</div></div>";
                                //} else {
                                //    return ``;
                                //}
                                if (dataItem.soCongVanKienNghiDieuChinhGia != null && dataItem.soCongVanKienNghiDieuChinhGia.length > 0 && (!dataItem.isActive || !dataItem.isDaRaSoat || !dataItem.isHieuLuc)) {
                                    return "<div  class='cell-file' align = 'center'><a href='' onclick='vm.viewCongVanById(\"" + dataItem.id + "\")' style='text-decoration: none;'>" + dataItem.soCongVanKienNghiDieuChinhGia + "</a><div align='center'>" + kendo.toString(kendo.parseDate(dataItem.ngayCongVanKienNghiDieuChinhGia, 'yyyy-MM-dd'), 'dd/MM/yyyy') + "</div></div>";
                                } else {
                                    return ``;
                                }
                            },
                            attributes: { class: "text-center" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 180
                        },
                        {
                            field: "tenThuoc",
                            title: app.localize('Tên thuốc'),
                            attributes: { class: "text-left" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 100
                        },
                        {
                            field: "hoatChat",
                            title: app.localize('Tên HC'),
                            attributes: { class: "text-left" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 400
                        },
                        {
                            field: "hamLuong",
                            title: app.localize('NĐ/HL'),
                            attributes: { class: "text-left" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 100
                        },
                        {
                            field: "soDangKy",
                            title: app.localize('Số GPLH/GPNK'),
                            attributes: { class: "text-center" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 120
                        },
                        {
                            field: "quyCachDongGoi",
                            title: app.localize('Quy cách đóng gói'),
                            attributes: { class: "text-left" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 170
                        },
                        {
                            field: "donViTinh",
                            title: app.localize('ĐVT'),
                            attributes: { class: "text-center" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 100
                        },
                        {
                            field: "giaBanBuonDuKien",
                            format: "{0:n0}",
                            title: app.localize('Giá'),
                            attributes: { class: "text-left" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 100
                        },
                        {
                            field: "doanhNghiepSanXuat",
                            title: app.localize('Cơ sở SX'),
                            attributes: { class: "text-left" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 400
                        },
                        {
                            field: "nuocSanXuat",
                            title: app.localize('Nước SX'),
                            attributes: { class: "text-left" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 200
                        },
                        {
                            field: "donViKeKhai",
                            title: app.localize('Đơn vị CB'),
                            attributes: { class: "text-left" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 400
                        }
                    ]
                });
            }
        };
        //#endregion 
        function init() {
            chucnangTimKiem();
            gridGiaThuoc();
        };
        init();
        vm.viewCongVan = (url) => {
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn kiến nghị</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congbogiathuoc.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
        vm.viewCongVanById = (id) => {
            var _id = parseInt(id);
            var f = vm.getByParentPagingServiceDS.filter(x => x.id == _id);
            var url = "";
            if (f.length > 0) {
                url = f[0].urlCongVanKienNghiDieuChinhGia;
            }
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn kiến nghị</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congbogiathuoc.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
        vm.viewLichSu = (d) => {
            abp.ui.setBusy();
            app.thuocCongBoId = d.id;
            app.danhSachLichSu = [];
            var getHistoryService = (congBoId, ajaxParams) => {
                return abp.ajax($.extend({
                    url: abp.appPath + 'api/services/app/davCongBoGiaThuocHistory/GetHistory' + abp.utils.buildQueryString([{ name: 'congBoId', value: congBoId }]) + '',
                    type: 'POST',
                    data: JSON.stringify({})
                }, ajaxParams));
            };
            if (app.thuocCongBoId > 0) {
                getHistoryService(app.thuocCongBoId)
                    .then(function (result) {
                        app.danhSachLichSu = result;
                        var modalInstance = $uibModal.open({
                            template: `
                                <div class="modal-header">
                                <span class="caption-subject bold uppercase">Lịch sử công bố</span>
                                </div>
                                <div class="modal-body">
                                <div frontend.congbogiathuoc.viewlichsu></div>
                                </div>
                                <div class="modal-footer">
                                <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                                </div>
                                `,
                            size: 'lg',
                            windowClass: 'my-modal-popup',
                            resolve: {
                                thuoc: d
                            },
                            controller: ['$scope', '$uibModalInstance', 'thuoc', function ($scope, $uibModalInstance, thuoc) {
                                $scope.thuoc = thuoc;
                                app.IsNullOrEmpty = function (o) {
                                    var f = false;
                                    if (typeof (o) === 'undefined') f = true;
                                    if (o == null) f = true;
                                    o = String(o);
                                    if (o == '') f = true;
                                    return f;
                                };
                                $scope.cancel = function () {
                                    $uibModalInstance.close();
                                };
                            }]
                        });
                        abp.ui.clearBusy();
                    });
            }
        };
    }
]);

(function () {
    MyApp.directive('frontend.congbogiathuoc.viewlichsu', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                vm.lichSuCongBo = app.danhSachLichSu;
                vm.srcCongVan = function (src) {
                    return "/File/GoToViewTaiLieu?url=" + src + "#zoom=100";
                };

                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="container-fluid">
                        <div class="row form-group">
                            <div class="col-md-12">
                                <div class="timeline">
                                    <div class="timeline-item" ng-repeat="ls in vm.lichSuCongBo">
                                        <div class="timeline-badge">
                                            <div class="timeline-icon">
                                                <em class="fa fa-history" ng-class="$index==0? 'font-green-haze':'font-red'"></em>
                                            </div>
                                        </div>
                                        <div class="timeline-body">
                                            <div class="timeline-body-arrow"> </div>
                                            <div class="timeline-body-content" style="margin-top: 0px;">
                                            <div class="portlet light" style="margin-bottom: 0px;">
                                            <div class="portlet-title tabbable-line">
                                                <div class="caption">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta" ng-if='!ls.contentJsonObj.LastModificationTime'>Lúc {{ls.contentJsonObj.CreationTime | date :'dd/MM/yyyy HH:mm'}}</span>
                                                    <span class="caption-subject bold font-yellow-crusta" ng-if='ls.contentJsonObj.LastModificationTime'>Lúc {{ls.contentJsonObj.LastModificationTime | date :'dd/MM/yyyy HH:mm'}}</span>
                                                </div>
                                                <ul class="nav nav-tabs"  ng-if="ls.contentJsonObj.SoCongVanKienNghiDieuChinhGia.length>0">
                                                    <li class="active">
                                                        <a href="#portlet_taba{{ls.id}}" data-toggle="tab" aria-expanded="true"> THUỐC </a>
                                                    </li>
                                                    <li class="">
                                                        <a href="#portlet_tabb{{ls.id}}" data-toggle="tab" aria-expanded="false"> CÔNG VĂN </a>
                                                    </li>                                       
                                                </ul>
                                            </div>
                                            <div class="portlet-body">
                                                <div class="tab-content" style="padding:0">
                                                    <div class="tab-pane active" id="portlet_taba{{ls.id}}">
                                                    <span class="font-grey-cascade margin-bottom-15" ng-if="ls.contentJsonObj.LyDoSuaDoi">
                                                    <strong>Lý do sửa: </strong><span ng-bind-html="ls.contentJsonObj.LyDoSuaDoi"></span>
                                                </span>
                                                <table class="table table-bordered table-hover">
                                                    <thead>
                                                        <tr class="bg-blue font-white">
                                                            <th class="text-center">Số GPLH/GPNK </th>
                                                            <th class="text-center" style="width:200px"> Văn bản kiến nghị </th>
                                                            <th class="text-center" style="width:200px"> Tên thuốc </th>
                                                            <th class="text-center" style="width:200px"> Hoạt chất </th>
                                                            <th class="text-center" style="width:200px"> NĐ/HL </th>
                                                            <th class="text-center" style="width:200px"> Quy cách đóng gói </th>
                                                            <th class="text-center" style="width:200px"> ĐVT </th>
                                                            <th class="text-center" style="width:200px"> Cơ sở SX </th>
                                                            <th class="text-center" style="width:200px"> Nước SX</th>
                                                            <th class="text-center" style="width:200px"> Đơn vị CB/CBL </th>
                                                            <th class="text-center"> Ngày KK/KKL </th>
                                                            <th class="text-center" style="width:200px"> Giá bán buôn </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td class="text-center">
                                                                {{ls.contentJsonObj.SoDangKy}}<br />
                                                                <strong ng-if="ls.contentJsonObj.IsHieuLuc" style="color:blue">Đã rà soát, không có văn bản</strong>
                                                                <strong ng-if="!ls.contentJsonObj.IsHieuLuc" style="color:red">Có văn bản kiến nghị</strong>
                                                            </td>
                                                            <td>
                                                            <div align="center" ng-show="ls.contentJsonObj.SoCongVanKienNghiDieuChinhGia.length>0">
                                                                 <a href="" style="text-decoration: none;">{{ls.contentJsonObj.SoCongVanKienNghiDieuChinhGia}}</a>
                                                                <div align='center'>{{ls.contentJsonObj.NgayCongVanKienNghiDieuChinhGia | date:'dd/MM/yyyy'}}</div>
                                                               </div>
                                                            </td>
                                                            <td>{{ls.contentJsonObj.TenThuoc}}</td>
                                                            <td>{{ls.contentJsonObj.HoatChat}}</td>
                                                            <td>{{ls.contentJsonObj.HamLuong}}</td>
                                                            <td>{{ls.contentJsonObj.QuyCachDongGoi}}</td>
                                                            <td class="text-center">{{ls.contentJsonObj.DonViTinh}}</td>
                                                            <td>{{ls.contentJsonObj.DoanhNghiepSanXuat}}</td>
                                                            <td>{{ls.contentJsonObj.NuocSanXuat}}</td>
                                                            <td>{{ls.contentJsonObj.DonViKeKhai}}</td>
                                                            <td class="text-center">{{ls.contentJsonObj.NgayKK_KKL | date :'dd/MM/yyyy'}}</td>
                                                            <td>{{ls.contentJsonObj.GiaBanBuonDuKien |  number:0}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="tab-pane" id="portlet_tabb{{ls.id}}">
                                             <iframe ng-if='ls.contentJsonObj.UrlCongVanKienNghiDieuChinhGia!=""' title="Xem tài liệu" style="width: 100%; height: 600px;border:0" ng-src="{{vm.trustSrc(vm.srcCongVan(ls.contentJsonObj.UrlCongVanKienNghiDieuChinhGia))}}"  ></iframe>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
            };
        }
    ]);
})();
(function () {
    MyApp.directive('frontend.congbogiathuoc.viewcongvan', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                if (app.urlCongVanCongBoGiaThuoc != "") {
                    vm.taiLieuDinhKemUrl = "/File/GoToViewTaiLieu?url=" + app.urlCongVanCongBoGiaThuoc + "#zoom=100";
                } else {
                    vm.taiLieuDinhKemUrl = "";
                }
                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="row form-group">
                            <div class="col-md-12">
                                <div class="portlet light bordered" style="height: 630px">
                                        <span ng-if="!vm.taiLieuDinhKemUrl || vm.taiLieuDinhKemUrl == ''">
                                    </span>
                                    <iframe ng-if='vm.taiLieuDinhKemUrl ||vm.taiLieuDinhKemUrl!=""' title="Xem tài liệu" style="width: 100%; height: 100%;border:0" ng-src="{{vm.trustSrc(vm.taiLieuDinhKemUrl)}}"  ></iframe>
                                </div>
                            </div>
                        </div>`,
            };
        }
    ]);
})();;
MyApp.controller('frontend.congbogiathuocbackup', [
    '$scope', '$sce', '$location', '$http', '$window', '$timeout', '$uibModal',
    function ($scope, $sce, $location, $http, $window, $timeout, $uibModal) {
        vm = this;
        vm.getByParentPagingServiceDS = [];

        var getListCongBoPagingService = (input, ajaxParams) => {
            return abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/quanLyGiaThuocBackup/GetListCongBoPublicPaging',
                type: 'POST',
                data: JSON.stringify(input)
            }, ajaxParams));
        };
        var getByParentPagingService = (input, ajaxParams) => {
            return abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/quanLyGiaThuocBackup/GetPublicByParentPaging',
                type: 'POST',
                data: JSON.stringify(input)
            }, ajaxParams));
        };
        //#region Tìm kiếm
        var chucnangTimKiem = () => {
            vm.isNangCaoFilter = false;
            vm.changeNangCaoFilter = ($event) => {
                vm.isNangCaoFilter = !vm.isNangCaoFilter;
                vm.filterCongBo = {};``
            };
            vm.ngayKeKhaiModel = {
                startDate: null,
                endDate: null
            };
            vm.switchFilter = 0;
            vm.nuocSanXuatIds = [],
                vm.changeSwitchFilter = function ($event, d) {
                    $('#search_concept').text($event.currentTarget.firstChild.text);
                    vm.switchFilter = d;
                };
            vm.filterCongBo = {};
            vm.dataFilter = {
                loaiGiaId: null,
            };
            vm.refreshFilter = function () {
                vm.filterAll = "";
                vm.ngayKeKhaiModel = "";
                vm.loaiGiaFillter = null;
                vm.filterCongBo = {
                    loaiGiaId: null,
                    parentId: null
                };
                vm.getGridData();
            };
        };
        //#endregion
        //#region Grid Data
        var gridGiaThuoc = () => {
            vm.refreshColumns = function () {
                vm.columns = [];
                var _colSTT = {
                    field: "stt",
                    title: app.localize('STT'),
                    template: "<div class='row-number text-center'></div>",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 50
                };
                var _colLoaiGia = {
                    field: "loaiGia",
                    title: app.localize('Phân loại'),
                    template: "{{this.dataItem.loaiGia}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 170
                };
                var _colTenThuoc = {
                    field: "tenThuoc",
                    title: app.localize('Tên thuốc'),
                    template: "{{this.dataItem.tenThuoc}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 100
                };
                var _colSoDK = {
                    field: "soDangKy",
                    title: app.localize('Số GPLH/GPNK'),
                    template: "{{this.dataItem.soDangKy}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 130
                };
                var _colHoatChat = {
                    field: "hoatChat",
                    title: app.localize('Tên HC'),
                    template: "{{this.dataItem.hoatChat}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 150
                };
                var _colHamLuong = {
                    field: "hamLuong",
                    title: app.localize('NĐ/HL'),
                    template: "{{this.dataItem.hamLuong}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 150
                };
                var _colCoSoSanXuat = {
                    field: "doanhNghiepSanXuat",
                    title: app.localize('Cơ sở SX'),
                    template: "{{this.dataItem.doanhNghiepSanXuat.length>0?this.dataItem.doanhNghiepSanXuat:'N/A'}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 400
                };
                var _colNuocSanXuat = {
                    field: "nuocSanXuat",
                    title: app.localize('Nước SX'),
                    template: "{{this.dataItem.nuocSanXuat.length>0?this.dataItem.nuocSanXuat:'N/A'}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 200
                };
                var _colDangBaoChe = {
                    field: "dangBaoChe",
                    title: app.localize('Dạng bào chế'),
                    template: "{{this.dataItem.dangBaoChe}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 100
                };
                var _colQuyCachDongGoi = {
                    field: "quyCachDongGoi",
                    title: app.localize('Quy cách đóng gói'),
                    template: "{{this.dataItem.quyCachDongGoi}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 120
                };
                var _colDVT = {
                    field: "donViTinh",
                    title: app.localize('ĐVT'),
                    template: "{{this.dataItem.donViTinh}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 100
                };
                var _colGiaBanBuonDuKien = {
                    field: "giaBanBuonDuKien",
                    title: app.localize('Giá bán buôn dự kiến (VNĐ) (VAT)'),
                    template: "{{this.dataItem.giaBanBuonDuKien | number:0}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 150
                };
                var _colGiaBanLeDuKien = {
                    field: "giaBanLeDuKien",
                    title: app.localize('Giá bán lẻ dự kiến (theo đề xuất của Doanh nghiệp) (VNĐ) (VAT)'),
                    template: "{{this.dataItem.giaBanLeDuKien == 0 ? '' : this.dataItem.giaBanLeDuKien }}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 150
                };
                var _colNgayKK_KKL = {
                    field: "ngayTiepNhan",
                    title: app.localize('Ngày kê khai'),
                    template: "{{this.dataItem.ngayTiepNhan !=null?(this.dataItem.ngayTiepNhan | date:'dd/MM/yyyy'):'N/A'}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 100
                };
                var _colDonViKeKhai = {
                    field: "donViKeKhai",
                    title: app.localize('Đơn vị KK'),
                    template: "{{this.dataItem.donViKeKhai}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 400
                };
                var _colSoVanBanKNMG = {
                    field: "soCongVanKienNghiDieuChinhGia",
                    title: app.localize('Văn bản kiến nghị'),
                    template: `<div ng-if='this.dataItem.isNotCongVanDienTu'>
                                <div align='center' ng-show='this.dataItem.soCongVanKienNghiDieuChinhGia.length>0 && (!this.dataItem.isActive || !this.dataItem.isDaRaSoat || !this.dataItem.isHieuLuc)'>
                                 <a ng-if="this.dataItem.isVanThuDongDau" href="" style=" text-decoration: none;" ng-click="vm.viewCongVan(this.dataItem.urlCongVanKienNghiDieuChinhGia)"> {{this.dataItem.soCongVanKienNghiDieuChinhGia}}</a>
                                <div ng-if="!this.dataItem.isVanThuDongDau" align='center'>{{this.dataItem.soCongVanKienNghiDieuChinhGia}}</div>
                                <div align='center'>{{this.dataItem.ngayCongVanKienNghiDieuChinhGia | date:'dd/MM/yyyy'}}</div>
                                <div align='center' ng-if='this.dataItem.isRaCongVanNhanh'>Công văn nhanh</div>
                               </div>
                               </div>
                               `,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 120
                };

                var _colTrangThaiHieuLuc = {
                    field: "isHieuLuc",
                    title: "Trạng thái",
                    width: 100,
                    template: `<div><span ng-if="dataItem.isHieuLuc==true && dataItem.isDaRaSoat==true" class="bold font-green">Đã rà soát, không có văn bản</span>
                                       <span ng-if="dataItem.isHieuLuc==false && this.dataItem.soCongVanKienNghiDieuChinhGia.length>0 && !dataItem.isRaCongVanNhanh" class="bold font-red">Có văn bản kiến nghị</span>
                                       <span ng-if="dataItem.isHieuLuc==false && this.dataItem.soCongVanKienNghiDieuChinhGia.length>0 && dataItem.isRaCongVanNhanh" class="bold font-red">Có văn bản kiến nghị ra công văn nhanh</span>
                                    </div>`,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" }
                };

                var _colLichSu = {
                    title: '',
                    template: `<a href="" style="text-decoration:none;" title="Lịch sử công bố" ng-click="vm.viewLichSu(this.dataItem)"><em class="fa fa-history"></em></a>`,
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 30
                };
                var setColForForm = function () {
                    vm.columns = [/*_colSTT, */_colNgayKK_KKL, _colTrangThaiHieuLuc, _colSoVanBanKNMG, _colTenThuoc, _colHoatChat, _colHamLuong, _colSoDK, _colDangBaoChe, _colQuyCachDongGoi,
                        _colDVT, _colGiaBanBuonDuKien, _colGiaBanLeDuKien, _colCoSoSanXuat, _colNuocSanXuat, _colDonViKeKhai, _colLoaiGia];
                };
                setColForForm();
                vm.columnGiaThuoc = vm.columns;
            };
            vm.refreshColumns();
            vm.requestParams = {
                skipCount: 0,
                maxResultCount: 10,
                sorting: null
            };
            vm.refreshDataSource = function () {
                vm.giathuocDS = [];
                vm.setDataSource = function () {
                    vm.giathuocDS = new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                                vm.requestParams.maxResultCount = options.data.pageSize;
                                var _req = {
                                    filterAll: vm.filterAll,
                                    CongBoGiaThuoc: vm.filterCongBo,
                                    KichHoat: true
                                };
                                switch (vm.switchFilter) {
                                    case 1:
                                        _req.CongBoGiaThuoc.SoDangKy = vm.filterAll;
                                        _req.filterAll = "";
                                        break;
                                    case 2:
                                        _req.CongBoGiaThuoc.TenThuoc = vm.filterAll;
                                        _req.filterAll = "";
                                        break;
                                    case 3:
                                        _req.CongBoGiaThuoc.DonViKeKhai = vm.filterAll;
                                        _req.filterAll = "";
                                        break;
                                    case 4:
                                        _req.CongBoGiaThuoc.DoanhNghiepSanXuat = vm.filterAll;
                                        _req.filterAll = "";
                                        break;
                                    case 5:
                                        _req.CongBoGiaThuoc.NuocSanXuat = vm.filterAll;
                                        _req.filterAll = "";
                                        break;
                                    default:
                                        _req.filterAll = vm.filterAll;
                                        break;
                                }
                                getListCongBoPagingService($.extend(_req, vm.requestParams))
                                    .then(function (result) {
                                      
                                        options.success(result);
                                        $scope.filter = {};
                                    });
                            }
                        },
                        pageSize: 15,
                        serverPaging: true,
                        serverSorting: true,
                        sortable: true,
                        schema: {
                            data: "items",
                            total: "totalCount"
                        }
                    });
                };
                vm.setDataSource();
            }
            vm.refreshDataSource();
            vm.giaThuocGridOptions = {
                pageable:
                {
                    "refresh": true,
                    "pageSizes": [5, 10, 15, 20, 50, 100],
                    messages: {
                        empty: "Không có dữ liệu",
                        display: "Hiển thị từ {0} đến {1}/{2} bản ghi",
                        itemsPerPage: "Bản ghi mỗi trang"
                    }
                },
                resizable: true,
                height: 800,
                scrollable: true,
                detailInit: detailInit,
                dataBound: function (e) {
                    var grid = this;
                    var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                    grid.tbody.find(".row-number").each(function () {
                        var index = record++;
                        $(this).html(index);
                    });
                    var gridData = grid.dataSource.view();
                    for (var i = 0; i < gridData.length; i++) {
                        var currentUid = gridData[i].uid;
                        if (!gridData[i].isExitsHistory) {
                            var currentRow = grid.table.find("tr[data-uid='" + currentUid + "']");
                            var createUserButton = $(currentRow).find(".k-icon");
                            createUserButton.hide();
                        }
                    }
                },
                columns: vm.columnGiaThuoc
            };
            vm.getGridData = function () {
                //vm.giathuocDS.read();
                vm.setPageNumber();
            };
            vm.setPageNumber = function () {
                var grid = $('#gridGiaThuoc').data('kendoGrid');
                grid.dataSource.page(1);
            }
            //Lịch sử công bố
            function detailInit(e) {
                function formatDate(date) {
                    if (date == null || typeof (date) == 'undefined') return null;
                    if (date.toString().indexOf('/') > 0) {
                        return date;
                    } else {
                        var dateF = new Date(date);
                        if (dateF == 'Invalid Date') {
                            return date;
                        }
                        var month = dateF.getMonth() + 1;
                        if (month < 10)
                            month = "0" + month;
                        var dateFx = dateF.getDate();
                        if (dateFx < 10)
                            dateFx = "0" + dateFx;
                        return dateFx + "/" + month + "/" + dateF.getFullYear();
                    }
                }
                $("<div/>").appendTo(e.detailCell).kendoGrid({
                    dataSource: {
                        //type: "odata",
                        transport: {
                            read: function (options) {
                                vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                                vm.requestParams.maxResultCount = options.data.pageSize;
                                var filterCongBoCopy = angular.copy(vm.filterCongBo);
                                filterCongBoCopy.parentId = e.data.id;
                                var _req = {
                                    CongBoGiaThuoc: filterCongBoCopy
                                };
                                getByParentPagingService($.extend(_req, vm.requestParams))
                                    .then(function (result) {
                                        if (result.totalCount > 0) {
                                            /*result.items = result.items.filter(x => x.soCongVanKienNghiDieuChinhGia == null);*/
                                        }
                                        options.success(result);
                                        vm.getByParentPagingServiceDS = vm.getByParentPagingServiceDS.concat(result.items);
                                        $scope.filter = {};
                                    });
                            }
                        },
                        pageSize: 15,
                        serverPaging: true,
                        serverSorting: true,
                        sortable: true,
                        schema: {
                            data: "items",
                            total: "totalCount"
                        }
                    },
                    pageable:
                    {
                        "refresh": true,
                        "pageSizes": [5, 10, 15, 20, 50, 100],
                        messages: {
                            empty: "Không có dữ liệu",
                            display: "Hiển thị từ {0} đến {1}/{2} bản ghi",
                            itemsPerPage: "Bản ghi mỗi trang"
                        }
                    },
                    resizable: true,
                    height: 400,
                    scrollable: true,
                    noRecords: {
                        template: "<div class='k-nodata' style='margin-top: 134px;'><div><div><em class='fa fa-info-circle fa-2x'></em><br><br>Không có lịch sử thay đổi nào!</div></div></div>"
                    },
                    dataBound: function (e) {
                        var grid = this;
                        var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                        grid.tbody.find(".row-number").each(function () {
                            var index = record++;
                            $(this).html(index);

                        });

                    },
                    columns: [
                        {
                            field: "stt",
                            title: app.localize('STT'),
                            template: "<div class='row-number text-center'></div>",
                            attributes: { class: "text-center" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 41
                        },
                        {
                            field: "loaiGia",
                            title: app.localize('Phân loại'),
                            attributes: { class: "text-left" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 170
                        },
                        {
                            field: "ngayTiepNhan",
                            title: app.localize('Ngày kê khai'),
                            template: function (dataItem) {
                                if (kendo.toString(kendo.parseDate(dataItem.ngayTiepNhan, 'yyyy-MM-dd'), 'dd/MM/yyyy') == null) {
                                    return `N/A`;
                                } else {
                                    var a = kendo.toString(kendo.parseDate(dataItem.ngayTiepNhan, 'yyyy-MM-dd'), 'dd/MM/yyyy');
                                    return a;
                                }
                            },
                            attributes: { class: "text-center" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 140
                        },
                        {
                            field: "isHieuLuc",
                            title: "Trạng thái",
                            width: 170,
                            template:
                                function (dataItem) {
                                    if (dataItem.isHieuLuc && dataItem.isDaRaSoat) {
                                        return `<span class="bold font-green">Đã rà soát, không có văn bản</span>`;
                                    } else if (!dataItem.isHieuLuc && dataItem.soCongVanKienNghiDieuChinhGia != null) {
                                        return `<span class="bold font-red">Có văn bản kiến nghị</span>`;
                                    } else {
                                        return "";
                                    }
                                },
                            attributes: { class: "text-center" },
                            headerAttributes: { style: "text-align: center;" }
                        },
                        {
                            field: "urlCongVanKienNghiDieuChinhGia",
                            title: app.localize('Văn bản kiến nghị'),
                            template: function (dataItem) {
                                //var url = dataItem.urlCongVanKienNghiDieuChinhGia;
                                //if (dataItem.soCongVanKienNghiDieuChinhGia != null) {
                                //    return "<div  class='cell-file' align = 'center'><a href='' onclick='vm.viewCongVanById(\"" + dataItem.id + "\")' style='text-decoration: none;'>" + dataItem.soCongVanKienNghiDieuChinhGia + "</a><div align='center'>" + kendo.toString(kendo.parseDate(dataItem.ngayCongVanKienNghiDieuChinhGia, 'yyyy-MM-dd'), 'dd/MM/yyyy') + "</div></div>";
                                //} else {
                                //    return ``;
                                //}
                                if (dataItem.soCongVanKienNghiDieuChinhGia != null && dataItem.soCongVanKienNghiDieuChinhGia.length > 0 && (!dataItem.isActive || !dataItem.isDaRaSoat || !dataItem.isHieuLuc)) {
                                    return "<div  class='cell-file' align = 'center'><a href='' onclick='vm.viewCongVanById(\"" + dataItem.id + "\")' style='text-decoration: none;'>" + dataItem.soCongVanKienNghiDieuChinhGia + "</a><div align='center'>" + kendo.toString(kendo.parseDate(dataItem.ngayCongVanKienNghiDieuChinhGia, 'yyyy-MM-dd'), 'dd/MM/yyyy') + "</div></div>";
                                } else {
                                    return ``;
                                }
                            },
                            attributes: { class: "text-center" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 180
                        },
                        {
                            field: "tenThuoc",
                            title: app.localize('Tên thuốc'),
                            attributes: { class: "text-left" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 100
                        },
                        {
                            field: "hoatChat",
                            title: app.localize('Tên HC'),
                            attributes: { class: "text-left" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 400
                        },
                        {
                            field: "hamLuong",
                            title: app.localize('NĐ/HL'),
                            attributes: { class: "text-left" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 100
                        },
                        {
                            field: "soDangKy",
                            title: app.localize('Số GPLH/GPNK'),
                            attributes: { class: "text-center" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 120
                        },
                        {
                            field: "quyCachDongGoi",
                            title: app.localize('Quy cách đóng gói'),
                            attributes: { class: "text-left" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 170
                        },
                        {
                            field: "donViTinh",
                            title: app.localize('ĐVT'),
                            attributes: { class: "text-center" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 100
                        },
                        {
                            field: "giaBanBuonDuKien",
                            format: "{0:n0}",
                            title: app.localize('Giá'),
                            attributes: { class: "text-left" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 100
                        },
                        {
                            field: "doanhNghiepSanXuat",
                            title: app.localize('Cơ sở SX'),
                            attributes: { class: "text-left" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 400
                        },
                        {
                            field: "nuocSanXuat",
                            title: app.localize('Nước SX'),
                            attributes: { class: "text-left" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 200
                        },
                        {
                            field: "donViKeKhai",
                            title: app.localize('Đơn vị KK'),
                            attributes: { class: "text-left" },
                            headerAttributes: { style: "text-align: center;" },
                            width: 400
                        }
                    ]
                });
            }
        };
        //#endregion 
        function init() {
            chucnangTimKiem();
            gridGiaThuoc();
        };
        init();
        vm.viewCongVan = (url) => {
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn kiến nghị</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congbogiathuoc.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
        vm.viewCongVanById = (id) => {
            var _id = parseInt(id);
            var f = vm.getByParentPagingServiceDS.filter(x => x.id == _id);
            var url = "";
            if (f.length > 0) {
                url = f[0].urlCongVanKienNghiDieuChinhGia;
            }
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn kiến nghị</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congbogiathuoc.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
        vm.viewLichSu = (d) => {
            abp.ui.setBusy();
            app.thuocCongBoId = d.id;
            app.danhSachLichSu = [];
            var getHistoryService = (congBoId, ajaxParams) => {
                return abp.ajax($.extend({
                    url: abp.appPath + 'api/services/app/davCongBoGiaThuocHistory/GetHistory' + abp.utils.buildQueryString([{ name: 'congBoId', value: congBoId }]) + '',
                    type: 'POST',
                    data: JSON.stringify({})
                }, ajaxParams));
            };
            if (app.thuocCongBoId > 0) {
                getHistoryService(app.thuocCongBoId)
                    .then(function (result) {
                        app.danhSachLichSu = result;
                        var modalInstance = $uibModal.open({
                            template: `
                                <div class="modal-header">
                                <span class="caption-subject bold uppercase">Lịch sử công bố</span>
                                </div>
                                <div class="modal-body">
                                <div frontend.congbogiathuoc.viewlichsu></div>
                                </div>
                                <div class="modal-footer">
                                <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                                </div>
                                `,
                            size: 'lg',
                            windowClass: 'my-modal-popup',
                            resolve: {
                                thuoc: d
                            },
                            controller: ['$scope', '$uibModalInstance', 'thuoc', function ($scope, $uibModalInstance, thuoc) {
                                $scope.thuoc = thuoc;
                                app.IsNullOrEmpty = function (o) {
                                    var f = false;
                                    if (typeof (o) === 'undefined') f = true;
                                    if (o == null) f = true;
                                    o = String(o);
                                    if (o == '') f = true;
                                    return f;
                                };
                                $scope.cancel = function () {
                                    $uibModalInstance.close();
                                };
                            }]
                        });
                        abp.ui.clearBusy();
                    });
            }
        };
    }
]);

(function () {
    MyApp.directive('frontend.congbogiathuocbackup.viewlichsu', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                vm.lichSuCongBo = app.danhSachLichSu;
                vm.srcCongVan = function (src) {
                    return "/File/GoToViewTaiLieu?url=" + src + "#zoom=100";
                };

                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="container-fluid">
                        <div class="row form-group">
                            <div class="col-md-12">
                                <div class="timeline">
                                    <div class="timeline-item" ng-repeat="ls in vm.lichSuCongBo">
                                        <div class="timeline-badge">
                                            <div class="timeline-icon">
                                                <em class="fa fa-history" ng-class="$index==0? 'font-green-haze':'font-red'"></em>
                                            </div>
                                        </div>
                                        <div class="timeline-body">
                                            <div class="timeline-body-arrow"> </div>
                                            <div class="timeline-body-content" style="margin-top: 0px;">
                                            <div class="portlet light" style="margin-bottom: 0px;">
                                            <div class="portlet-title tabbable-line">
                                                <div class="caption">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta" ng-if='!ls.contentJsonObj.LastModificationTime'>Lúc {{ls.contentJsonObj.CreationTime | date :'dd/MM/yyyy HH:mm'}}</span>
                                                    <span class="caption-subject bold font-yellow-crusta" ng-if='ls.contentJsonObj.LastModificationTime'>Lúc {{ls.contentJsonObj.LastModificationTime | date :'dd/MM/yyyy HH:mm'}}</span>
                                                </div>
                                                <ul class="nav nav-tabs"  ng-if="ls.contentJsonObj.SoCongVanKienNghiDieuChinhGia.length>0">
                                                    <li class="active">
                                                        <a href="#portlet_taba{{ls.id}}" data-toggle="tab" aria-expanded="true"> THUỐC </a>
                                                    </li>
                                                    <li class="">
                                                        <a href="#portlet_tabb{{ls.id}}" data-toggle="tab" aria-expanded="false"> CÔNG VĂN </a>
                                                    </li>                                       
                                                </ul>
                                            </div>
                                            <div class="portlet-body">
                                                <div class="tab-content" style="padding:0">
                                                    <div class="tab-pane active" id="portlet_taba{{ls.id}}">
                                                    <span class="font-grey-cascade margin-bottom-15" ng-if="ls.contentJsonObj.LyDoSuaDoi">
                                                    <strong>Lý do sửa: </strong><span ng-bind-html="ls.contentJsonObj.LyDoSuaDoi"></span>
                                                </span>
                                                <table class="table table-bordered table-hover">
                                                    <thead>
                                                        <tr class="bg-blue font-white">
                                                            <th class="text-center">Số GPLH/GPNK </th>
                                                            <th class="text-center" style="width:200px"> Văn bản kiến nghị </th>
                                                            <th class="text-center" style="width:200px"> Tên thuốc </th>
                                                            <th class="text-center" style="width:200px"> Hoạt chất </th>
                                                            <th class="text-center" style="width:200px"> NĐ/HL </th>
                                                            <th class="text-center" style="width:200px"> Quy cách đóng gói </th>
                                                            <th class="text-center" style="width:200px"> ĐVT </th>
                                                            <th class="text-center" style="width:200px"> Cơ sở SX </th>
                                                            <th class="text-center" style="width:200px"> Nước SX</th>
                                                            <th class="text-center" style="width:200px"> Đơn vị KK/KKL </th>
                                                            <th class="text-center"> Ngày KK/KKL </th>
                                                            <th class="text-center" style="width:200px"> Giá bán buôn </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td class="text-center">
                                                                {{ls.contentJsonObj.SoDangKy}}<br />
                                                                <strong ng-if="ls.contentJsonObj.IsHieuLuc" style="color:blue">Đã rà soát, không có văn bản</strong>
                                                                <strong ng-if="!ls.contentJsonObj.IsHieuLuc" style="color:red">Có văn bản kiến nghị</strong>
                                                            </td>
                                                            <td>
                                                            <div align="center" ng-show="ls.contentJsonObj.SoCongVanKienNghiDieuChinhGia.length>0">
                                                                 <a href="" style="text-decoration: none;">{{ls.contentJsonObj.SoCongVanKienNghiDieuChinhGia}}</a>
                                                                <div align='center'>{{ls.contentJsonObj.NgayCongVanKienNghiDieuChinhGia | date:'dd/MM/yyyy'}}</div>
                                                               </div>
                                                            </td>
                                                            <td>{{ls.contentJsonObj.TenThuoc}}</td>
                                                            <td>{{ls.contentJsonObj.HoatChat}}</td>
                                                            <td>{{ls.contentJsonObj.HamLuong}}</td>
                                                            <td>{{ls.contentJsonObj.QuyCachDongGoi}}</td>
                                                            <td class="text-center">{{ls.contentJsonObj.DonViTinh}}</td>
                                                            <td>{{ls.contentJsonObj.DoanhNghiepSanXuat}}</td>
                                                            <td>{{ls.contentJsonObj.NuocSanXuat}}</td>
                                                            <td>{{ls.contentJsonObj.DonViKeKhai}}</td>
                                                            <td class="text-center">{{ls.contentJsonObj.NgayKK_KKL | date :'dd/MM/yyyy'}}</td>
                                                            <td>{{ls.contentJsonObj.GiaBanBuonDuKien |  number:0}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="tab-pane" id="portlet_tabb{{ls.id}}">
                                             <iframe ng-if='ls.contentJsonObj.UrlCongVanKienNghiDieuChinhGia!=""' title="Xem tài liệu" style="width: 100%; height: 600px;border:0" ng-src="{{vm.trustSrc(vm.srcCongVan(ls.contentJsonObj.UrlCongVanKienNghiDieuChinhGia))}}"  ></iframe>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
            };
        }
    ]);
})();
(function () {
    MyApp.directive('frontend.congbogiathuocbackup.viewcongvan', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                if (app.urlCongVanCongBoGiaThuoc != "") {
                    vm.taiLieuDinhKemUrl = "/File/GoToViewTaiLieu?url=" + app.urlCongVanCongBoGiaThuoc + "#zoom=100";
                } else {
                    vm.taiLieuDinhKemUrl = "";
                }
                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="row form-group">
                            <div class="col-md-12">
                                <div class="portlet light bordered" style="height: 630px">
                                        <span ng-if="!vm.taiLieuDinhKemUrl || vm.taiLieuDinhKemUrl == ''">
                                    </span>
                                    <iframe ng-if='vm.taiLieuDinhKemUrl ||vm.taiLieuDinhKemUrl!=""' title="Xem tài liệu" style="width: 100%; height: 100%;border:0" ng-src="{{vm.trustSrc(vm.taiLieuDinhKemUrl)}}"  ></iframe>
                                </div>
                            </div>
                        </div>`,
            };
        }
    ]);
})();;
(function () {
    MyApp.controller('frontend.congbonguyenlieu', [
        '$scope', '$timeout', '$uibModal',
        function ($scope, $timeout, $uibModal) {
            var vm = this;
            vm.formView = '';
            vm.isNangCaoFilter = false;
            vm.TRANG_THAI_CONG_BO_NGUYEN_LIEU = {
                LAN_DAU: 0,
                DINH_CHINH: 1,
                THAY_DOI: 2,
                BO_SUNG: 3,
                GIA_HAN: 4
            };
            var chucnangTimKiem = () => {
                vm.isNangCaoFilter = false;
                vm.changeNangCaoFilter = ($event) => {
                    vm.isNangCaoFilter = !vm.isNangCaoFilter;
                };
                $scope.totalRow = 0;
                $scope.keyWord = "";
                vm.switchFilter = 0;
                vm.changeSwitchFilter = function ($event, d) {
                    $('#search_concept').text($event.currentTarget.firstChild.text);
                    vm.switchFilter = d;
                };
                vm.ngayHetHanSoDangKyModel = {
                    startDate: null,
                    endDate: null
                };
                vm.ngayKyCongVanModel = {
                    startDate: null,
                    endDate: null
                };
                vm.filter = {};
                vm.refreshFilter = function () {
                    vm.filterAll = "";
                    vm.ngayHetHanSoDangKyModel = "";
                    vm.ngayKyCongVanModel = "";
                    vm.filter = {};
                    vm.filter.tieuChuanChatLuongNguyenLieu = null;
                    vm.filter.soDangKy = null;
                    vm.filter.tenCoSoSanXuatNguyenLieu = null;
                    vm.filter.nuocSanXuatNguyenLieu = null;
                    vm.filter.tenThuoc = null;
                    vm.filter.tenCoSoSanXuatThuoc = null;
                    vm.filter.hoatChatChuanID = null;
                    vm.reloadgrid();
                };
            };
            //#endregion
            vm.setFormView = (d) => {
                vm.formView = d;
            };
            var gridNguyenLieu = () => {
                vm.requestParams = {
                    skipCount: 0,
                    maxResultCount: 10,
                    sorting: null
                };
                vm.nguyenLieuLamThuocGridOptions = {
                    pageable:
                    {
                        "refresh": true,
                        "pageSizes": true,
                        messages: {
                            empty: "Không có dữ liệu",
                            display: "Tổng {2} bản ghi",
                            itemsPerPage: "Bản ghi mỗi trang"
                        }
                    },
                    resizable: true,
                    height: 800,
                    scrollable: true,
                    dataBound: function (e) {
                        var grid = this;
                        var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                        grid.tbody.find(".row-number").each(function () {
                            var index = record++;
                            $(this).html(index);
                        });
                    }
                };
                vm.nguyenLieuLamThuocColumn = [
                    {
                        title: app.localize('#'),
                        template: "<div class='row-number text-center'></div>",
                        attributes: { class: "text-center" },
                        headerAttributes: { style: "text-align: center;" },
                        width: 50
                    },
                    {
                        field: "soDangKy",
                        title: "Số GPLH",
                        template: `<div align='center'>
                                        <a href="" style=" text-decoration: none;" ng-click="vm.viewHistory(this.dataItem)"> {{this.dataItem.soDangKy}}</a><br/>
                                    </div>
                                    `,
                        width: 120
                    },
                    {
                        field: "ngayHetHan",
                        title: "Ngày hết hạn",
                        template: `<div align='center'>
                                        <div align='center'>{{dataItem.ngayHetHanSoDangKy | date:'dd/MM/yyyy'}}</div> 
                                        <div align='center' ng-show="this.dataItem.trangThai == vm.TRANG_THAI_CONG_BO_NGUYEN_LIEU.DINH_CHINH && !this.dataItem.isDaRutSoDangKy" style="font-weight:bold;color:red">Đính chính</div>
                                        <div align='center' ng-show="this.dataItem.trangThai == vm.TRANG_THAI_CONG_BO_NGUYEN_LIEU.THAY_DOI && !this.dataItem.isDaRutSoDangKy"style="font-weight:bold;color:blue">Thay đổi</div>
                                        <div align='center' ng-show="this.dataItem.trangThai == vm.TRANG_THAI_CONG_BO_NGUYEN_LIEU.BO_SUNG && !this.dataItem.isDaRutSoDangKy"style="font-weight:bold;color:green">Bổ sung</div>
                                        <div align='center' ng-show="this.dataItem.trangThai == vm.TRANG_THAI_CONG_BO_NGUYEN_LIEU.GIA_HAN && !this.dataItem.isDaRutSoDangKy">Gia hạn</div>
                                        <a ng-click="vm.xemCongVan(this.dataItem.urlCongVanRutSoDangKy)" ng-if="this.dataItem.isDaRutSoDangKy" style="text-decoration: none; color: red; font-style: italic; font-weight: bold; font-size: 13px;" title="Số đăng ký đã bị rút (Không còn hiệu lực)">(Đã rút số)</a>
                                    </div>
                                    `,
                        width: 120
                    },
                    {
                        field: "tenNguyenLieu",
                        title: "Tên nguyên liệu",
                        width: 200,
                        template: `<span ng-bind-html="this.dataItem.tenNguyenLieu"></span>`,
                    },
                    {
                        field: "phanLoai",
                        title: "Phân loại",
                        width: 120,
                    },
                    {
                        field: "tieuChuanChatLuongNguyenLieu",
                        title: "Tiêu chuẩn",
                        attributes: { class: "text-center" },
                        headerAttributes: { style: "text-align: center;" },
                        width: 100,
                    },
                    {
                        field: "tenCoSoSanXuatNguyenLieu",
                        title: "Cơ sở sản xuất nguyên liệu",
                        width: 200,
                    },
                    {
                        field: "nuocSanXuatNguyenLieu",
                        title: "Nước sản xuất nguyên liệu",
                        width: 120
                    },
                    //{
                    //    field: "diaChiCoSoSanXuatNguyenLieu",
                    //    title: "Địa chỉ cơ sở sản xuất nguyên liệu",
                    //    template: '<div style="margin: 0;">' +
                    //        '<p ng-if="#: hcc_DanhMucKiemSoatDacBietID # == 2 || #: hcc_DanhMucKiemSoatDacBietID # == 3 || #: hcc_DanhMucKiemSoatDacBietID # == 7">{{dataItem.diaChiCoSoSanXuatNguyenLieu}}</p>' +
                    //        '<p style="text-align:center;" ng-if="#: hcc_DanhMucKiemSoatDacBietID # != 2 && #: hcc_DanhMucKiemSoatDacBietID # != 3 && #: hcc_DanhMucKiemSoatDacBietID # != 7" > -- </p></div>',
                    //    width: 200,
                    //},
                    {
                        field: "",
                        title: "Phải cấp phép nhập khẩu",
                        template: '<p style="margin: 0;text-align:center;">' +
                            '<em ng-if="#: isPhaiCapPhepNhapKhau # == 1" class="fa fa-times fa-3 font-red" aria-hidden="true"></em>' +
                            '<em ng-if="#: isPhaiCapPhepNhapKhau # == 0" ></em></p>',
                        width: 120,
                    },
                    //{
                    //    field: "soCongVan",
                    //    title: "Số công văn",
                    //    attributes: { class: "text-center" },
                    //    headerAttributes: { style: "text-align: center;" },
                    //    template: `<div ng-show="dataItem.soCongVan" >{{dataItem.soCongVan}}/QLD-DK </div>`,
                    //    width: 120
                    //},
                    //{
                    //    field: "ngayKyCongVan",
                    //    title: "Ngày ký công văn",
                    //    attributes: { class: "text-center" },
                    //    headerAttributes: { style: "text-align: center;" },
                    //    template: "{{dataItem.ngayKyCongVan | date:'dd/MM/yyyy'}}",
                    //    width: 100

                    //},
                    //{
                    //    field: "ngayHetHanCongVan",
                    //    title: "Ngày hết hạn công văn",
                    //    attributes: { class: "text-center" },
                    //    headerAttributes: { style: "text-align: center;" },
                    //    template: "{{dataItem.ngayHetHanCongVan | date:'dd/MM/yyyy'}}",
                    //    width: 100

                    //},
                ];


                vm.nguyenLieuLamThuocDS = new kendo.data.DataSource({
                    transport: {
                        read: function (options) {
                            $scope.totalRow = 0;
                            $scope.keyWord = "";
                            vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                            vm.requestParams.maxResultCount = options.data.pageSize;
                            vm.loading = true;
                            var _reqFilter = angular.copy(vm.filter);
                            _reqFilter.isActive = true;
                            if (vm.ngayHetHanSoDangKyModel) {
                                _reqFilter.ngayHetHanSoDangKyTu = vm.ngayHetHanSoDangKyModel.startDate;
                                _reqFilter.ngayHetHanSoDangKyToi = vm.ngayHetHanSoDangKyModel.endDate;
                            }
                            if (vm.ngayKyCongVanModel) {
                                _reqFilter.ngayKyCongVanTu = vm.ngayKyCongVanModel.startDate;
                                _reqFilter.ngayKyCongVanToi = vm.ngayKyCongVanModel.endDate;
                            }
                            switch (vm.switchFilter) {
                                case 1:
                                    _reqFilter.SoDangKy = vm.filterAll;
                                    break;
                                case 2:
                                    _reqFilter.soCongVan = vm.filterAll;
                                    break;
                                case 3:
                                    _reqFilter.tenNguyenLieu = vm.filterAll;
                                    break;
                                //case 4:
                                //    _reqFilter.TenThuoc = vm.filterAll;
                                //    break;
                                default:
                                    _reqFilter.keyword = vm.filterAll;
                            }

                            abp.services.app.nguyenLieuLamThuoc.getAllServerPaging($.extend(_reqFilter, vm.requestParams))
                                .then(function (result) {
                                    angular.forEach(result.items, function (it) {
                                        it.isCongVan = it.soCongVan ? true : false;
                                    });
                                    vm.gvHoSoCallBack = options;
                                    options.success(result);
                                    $scope.totalRow = result.totalCount;
                                    $scope.keyWord = vm.filterAll;
                                    $scope.$apply();
                                    $scope.filter = {};
                                });
                        }
                    },
                    pageSize: 10,
                    serverPaging: true,
                    serverSorting: true,
                    sortable: true,
                    schema: {
                        data: "items",
                        total: "totalCount"
                    }
                });
                vm.getGridData = function () {
                    vm.nguyenLieuLamThuocDS.page(1);
                };
            };
            var gridNguyenLieuAction = () => {
                vm.editActionBtn = (dataItem) => {
                    vm.nguyenLieuItem = dataItem;
                    vm.setFormView('edit');
                };
                vm.viewCongVan = (d) => {
                    app.urlCongVanCongBoNguyenLieu = d.urlCongVan;
                    var modalInstance = $uibModal.open({
                        template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase font-white">Công văn đính kèm: {{nguyenLieu.soCongVan}}/QLD-DK</span>
                        </div>

                        <div class="modal-body">
                        <div ng-if='isCongVan' app.danhmuc.nguyenlieulamthuoc.viewcongvan></div>
                        <div ng-if='!isCongVan'> Lý do không đính kèm công văn :{{nguyenLieu.lyDo}}</div>
                        </div>

                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                        size: 'lg',
                        resolve: {
                            nguyenlieu: d
                        },
                        controller: ['$scope', '$uibModalInstance', 'nguyenlieu', function ($scope, $uibModalInstance, nguyenlieu) {
                            $scope.nguyenLieu = nguyenlieu;
                            $scope.isCongVan = !app.IsNullOrEmpty(nguyenlieu.urlCongVan);
                            $scope.cancel = function () {
                                $uibModalInstance.close();
                            };
                        }]
                    });
                };
            };

            vm.reloadgrid = function () {
                vm.nguyenLieuLamThuocDS.page(1);
            };
            var init = () => {
                gridNguyenLieu();
                gridNguyenLieuAction();
                chucnangTimKiem();
            };
            init();
            vm.xemCongVan = (url) => {
                app.urlCongVanCongBoNguyenLieu = url;
                var modalInstance = $uibModal.open({
                    template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn rút số đăng ký thuốc</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congbonguyenlieu.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                    size: 'lg',
                    windowClass: 'my-modal-popup',
                    resolve: {
                        urlFileCV: { urlDuongDanCV: url }
                    },
                    controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                        $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                        app.IsNullOrEmpty = function (o) {
                            var f = false;
                            if (typeof (o) === 'undefined') f = true;
                            if (o == null) f = true;
                            o = String(o);
                            if (o == '') f = true;
                            return f;
                        };
                        $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                        $scope.cancel = function () {
                            $uibModalInstance.close();
                        };
                    }]
                });
            };
        }
    ]);
})();

(function () {
    MyApp.directive('frontend.congbonguyenlieu.viewcongvan', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                if (app.urlCongVanCongBoNguyenLieu != "") {
                    vm.taiLieuDinhKemUrl = "/File/GoToViewTaiLieu?url=" + app.urlCongVanCongBoNguyenLieu + "#zoom=100";
                } else {
                    vm.taiLieuDinhKemUrl = "";
                }
                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="row form-group">
                            <div class="col-md-12">
                                <div class="portlet light bordered" style="height: 630px">
                                        <span ng-if="!vm.taiLieuDinhKemUrl || vm.taiLieuDinhKemUrl == ''">
                                    </span>
                                    <iframe ng-if='vm.taiLieuDinhKemUrl ||vm.taiLieuDinhKemUrl!=""' title="Xem tài liệu" style="width: 100%; height: 100%;border:0" ng-src="{{vm.trustSrc(vm.taiLieuDinhKemUrl)}}"  ></iframe>
                                </div>
                            </div>
                        </div>`,
            };
        }
    ]);
})();;
MyApp.controller('ctrl.congbotaduocvonang', [
    '$scope', '$location', '$http', '$window', '$sce', 
    function ($scope, $location, $http, $window,  $sce) {
        var vm = this;
        vm.loading = false;
        vm.filter = {
            keyword: null
        };
        var chucnangTimKiem = () => {
            $scope.totalRow = 0;
            $scope.keyWordSearch = "";
            vm.refreshFilter = function () {
                vm.filter.keyword = null;
                vm.getGridData();
            };
        };
        var grid = () => {
            vm.requestParams = {
                skipCount: 0,
                maxResultCount: 10,
                sorting: null
            };
            vm.congBoTaDuocVoNangGridOptions = {
                pageable:
                {
                    "refresh": true,
                    "pageSizes": true,
                    messages: {
                        empty: "Không có dữ liệu",
                        display: "Tổng {2} bản ghi",
                        itemsPerPage: "Bản ghi mỗi trang"
                    }
                },
                resizable: true,
                height: 800,
                scrollable: true,
                dataBound: function (e) {
                    var grid = this;
                    var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                    grid.tbody.find(".row-number").each(function () {
                        var index = record++;
                        $(this).html(index);
                    });
                }
            };
            vm.congBoTaDuocVoNangColumn = [
                {
                    title: app.localize('#'),
                    template: "<div class='row-number text-center'></div>",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 50
                },
                {
                    field: "soDangKyLuuHanh",
                    title: "Số đăng ký lưu hành",
                    width: 120,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                },
                {
                    field: "ngayHetHieuLucSDK",
                    title: "Ngày hết hiệu lực số đăng ký",
                    width: 120,
                    template: "{{dataItem.ngayHetHieuLucSDK != null ? (dataItem.ngayHetHieuLucSDK | date:'dd/MM/yyyy') : 'N/A'}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" }
                },
                {
                    field: "tenTaDuocVoNang",
                    title: "Tên tá dược, vỏ nang",
                    width: 200,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                },
                {
                    field: "tenCoSoSanXuat",
                    title: "Tên cơ sở sản xuất",
                    width: 300,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                },
                {
                    field: "diaChiCoSoSanXuat",
                    title: "Địa chỉ cơ sở sản xuất",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                },
                {
                    field: "nuocSanXuat",
                    title: "Nước sản xuất",
                    width: 150,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                },
                {
                    field: "tieuChuanChatLuong",
                    title: "Tiêu chuẩn chất lượng",
                    width: 250,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                },
                //{
                //    field: "creationTime",
                //    title: "Thời gian công bố",
                //    width: 150,
                //    attributes: { class: "text-center" },
                //    headerAttributes: { style: "text-align: center;" },
                //    template: "{{dataItem.creationTime | date:'dd/MM/yyyy hh:mm'}}",
                //}

            ];
            vm.congBoTaDuocVoNang = new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        $scope.totalRow = 0;
                        $scope.keyWordSearch = "";
                        vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                        vm.requestParams.maxResultCount = options.data.pageSize;
                        vm.loading = true;
                        vm.filter.filterByIsActive = true;
                        var _reqFilter = angular.copy(vm.filter);
                        $http.post('/api/services/app/congBoTaDuocVoNang/getAllServerPaging', $.extend(vm.filter, vm.requestParams)).then(function (result) {
                            if (result.data) {
                                vm.loading = false;
                                vm.gvHoSoCallBack = options;
                                options.success(result.data.result);
                                $scope.totalRow = result.totalCount;
                                $scope.keyWordSearch = vm.filter.keyword;
                                $scope.filter = {};
                            }
                        });
                    }
                },
                pageSize: 10,
                serverPaging: true,
                serverSorting: true,
                sortable: true,
                schema: {
                    data: "items",
                    total: "totalCount"
                }
            });
            vm.getGridData = function () {
                vm.congBoTaDuocVoNang.page(1);
            };

        };

        var init = () => {
            grid();
            chucnangTimKiem();
        };
        init();
    }
]);;
MyApp.controller('ctrl.congbothongtinquangcao', [
    '$scope', '$location', '$http', '$window', '$sce', '$uibModal',
    function ($scope, $location, $http, $window, $sce, $uibModal) {
        var vm = this;
        vm.loading = false;
        vm.filter = {
            keyword: null
        };
        var chucnangTimKiem = () => {
            $scope.totalRow = 0;
            $scope.keyWordSearch = "";
            vm.refreshFilter = function () {
                vm.filter.keyword = null;
                vm.getGridData();
            };
        };
        var grid = () => {
            vm.requestParams = {
                skipCount: 0,
                maxResultCount: 10,
                sorting: null
            };
            vm.congbothongtinquangcaoGridOptions = {
                pageable:
                {
                    "refresh": true,
                    "pageSizes": true,
                    messages: {
                        empty: "Không có dữ liệu",
                        display: "Tổng {2} bản ghi",
                        itemsPerPage: "Bản ghi mỗi trang"
                    }
                },
                resizable: true,
                height: 800,
                scrollable: true,
                dataBound: function (e) {
                    var grid = this;
                    var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                    grid.tbody.find(".row-number").each(function () {
                        var index = record++;
                        $(this).html(index);
                    });
                }
            };
            vm.congbothongtinquangcaoColumn = [
                {
                    title: app.localize('#'),
                    template: "<div class='row-number text-center'></div>",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 50
                },
                {
                    field: "soGiayXacNhan",
                    title: "Số giấy xác nhận",
                    width: 120,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                },
                {
                    field: "namGiayXacNhan",
                    title: "Năm xác nhận",
                    width: 120,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                },
                {
                    field: "tenThuoc",
                    title: "Tên thuốc",
                    width: 200,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                },
                {
                    field: "soDangKyThuoc",
                    title: "Số đăng ký thuốc",
                    width: 200,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                },
                {
                    field: "tenCongTyDangKyThongTinQuangCao",
                    title: " Công ty đăng ký thông tin, quảng cáo thuốc",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                },
                {
                    title: "File giấy xác nhận",
                    template: `
                            <button ng-click="vm.xemGiayXacNhan(this.dataItem)" class="btn btn-xs btn-default custom-button" title="Xem giấy xác nhận">    
                             <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
                            </button>`,
                    width: 80,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                }
            ];
            vm.congbothongtinquangcao = new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        $scope.totalRow = 0;
                        $scope.keyWordSearch = "";
                        vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                        vm.requestParams.maxResultCount = options.data.pageSize;
                        vm.loading = true;
                        vm.filter.filterByIsActive = true;
                        $http.post('/api/services/app/congbothongtinquangcao/getAllServerPaging', $.extend(vm.filter, vm.requestParams)).then(function (result) {
                            if (result.data) {
                                vm.loading = false;
                                vm.gvHoSoCallBack = options;
                                options.success(result.data.result);
                                $scope.totalRow = result.totalCount;
                                $scope.keyWordSearch = vm.filter.keyword;
                                $scope.filter = {};
                            }
                        });
                    }
                },
                pageSize: 10,
                serverPaging: true,
                serverSorting: true,
                sortable: true,
                schema: {
                    data: "items",
                    total: "totalCount"
                }
            });
            vm.getGridData = function () {
                vm.congbothongtinquangcao.page(1);
            };
            vm.xemGiayXacNhan = function (data) {
                var modalInstance = $uibModal.open({
                    template: `
                        <div class="modal-header text-center" style="background: #428bca;color: #ebebeb;">
                            <h4 class="modal-title">
                                <span class="uppercase">Xem tài liệu</span>
                                <button type="button" class="close" ng-click="cancel()" aria-hidden="true"></button>
                            </h4>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="portlet light bordered">
                                   <div style="height: 600px" frontend.congbothongtinquangcao.viewchitiet></div>
                                </div>
                            </div>
                        </div>
                        `,
                    size: 'lg',
                    resolve: {
                        dataItem: data
                    },
                    windowClass: 'my-modal-popup',
                    controller: ['$scope', '$uibModalInstance', 'dataItem', function ($scope, $uibModalInstance, dataItem) {
                        let data = dataItem;
                        app.IsNullOrEmpty = function (o) {
                            var f = false;
                            if (typeof (o) === 'undefined') f = true;
                            if (o == null) f = true;
                            o = String(o);
                            if (o == '') f = true;
                            return f;
                        };
                        if (!app.IsNullOrEmpty(data.fileGiayXacNhan)) {
                            app.fileGiayXacNhan = data.fileGiayXacNhan;
                        }
                        $scope.cancel = function () {
                            $uibModalInstance.close();
                        };
                    }]
                });
                modalInstance.result.then(function () {
                }, function () {
                });
            }
        };

        var init = () => {
            grid();
            chucnangTimKiem();
        };
        init();
    }
]);


(function () {
    MyApp.directive('frontend.congbothongtinquangcao.viewchitiet', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                if (app.fileGiayXacNhan != "") {
                    vm.giayTiepNhanUrl = "/File/GoToViewTaiLieu?url=" + app.fileGiayXacNhan + "#zoom=100";
                } else {
                    vm.giayTiepNhanUrl = "";
                }
                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<iframe title="Xem giấy tiếp nhận" style="width: 100%; height: 100%;border:0" ng-src="{{vm.trustSrc(vm.giayTiepNhanUrl)}}"></iframe>`,
            };
        }
    ]);
})();;
MyApp.controller('frontend.congbothongtinquangcao', [
    '$scope', '$sce', '$location', '$http', '$window', '$timeout', '$uibModal',
    function ($scope, $sce, $location, $http, $window, $timeout, $uibModal) {
        vm = this;
        var getCongBoQuangCaoPagingService = (input, ajaxParams) => {
            return abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/congBoThongTinQuangCao/GetAllPublicServerPaging',
                type: 'POST',
                data: JSON.stringify(input)
            }, ajaxParams));
        };

        //#region Tìm kiếm
        var chucnangTimKiem = () => {
            vm.isNangCaoFilter = false;
            vm.changeNangCaoFilter = ($event) => {
                vm.isNangCaoFilter = !vm.isNangCaoFilter;
                vm.filterAll = "";
                vm.filterCongBo = {};
                vm.filterCongBo.soGiayXacNhan = null;
                vm.filterCongBo.dongGoi = null;
                vm.filterCongBo.tenThuoc = null;
                vm.filterCongBo.soDangKyThuoc = null;
                vm.filterCongBo.congTyDangKyQuangCao = null;
                vm.filterCongBo.filterByLoaiHinhThongTinQuangCao = null;

            };
            $scope.$watch('vm.filterAll', function myfunction() {
                if (vm.filterAll != null && vm.filterAll != "") {
                    vm.isNangCaoFilter = false;
                    vm.filterCongBo = {};
                }
            })
            $scope.totalRow = 0;
            $scope.keyWordFilter = "";
            vm.switchFilter = 0;
            vm.changeSwitchFilter = function ($event, d) {
                $('#search_concept').text($event.currentTarget.firstChild.text);
                vm.switchFilter = d;
            };
            vm.filterCongBo = {};
            vm.refreshFilter = function () {
                vm.filterAll = "";
                vm.filterCongBo = {};
                vm.getGridData();
            };
            var data = [
                { name: "Tài liệu thông tin cho cán bộ y tế", value: 0 },
                { name: "Quảng cáo trên báo nói, báo hình", value: 1 },
                { name: "Quảng cáo thông qua hội thảo, hội nghị, tổ chức sự kiện", value: 2 },
                { name: "Quảng cáo trên các phương tiện quảng cáo khác (không phải báo nói, báo hình)", value: 3 },
            ];
            vm.loaiHinhThongTinOptions = {
                dataSource: data,
                dataValueField: "value",
                dataTextField: "name",
                optionLabel: app.localize('Chọn ...'),
                filter: "contains",
                change: function (e) {
                    if (e.sender.selectedIndex == 1) {
                        vm.filterCongBo.filterByLoaiHinhThongTinQuangCao = 0;
                    }
                    else if (e.sender.selectedIndex == 2) {
                        vm.filterCongBo.filterByLoaiHinhThongTinQuangCao = 1;
                    }
                    else if (e.sender.selectedIndex == 3) {
                        vm.filterCongBo.filterByLoaiHinhThongTinQuangCao = 2;
                    }
                    else if (e.sender.selectedIndex == 4) {
                        vm.filterCongBo.filterByLoaiHinhThongTinQuangCao = 3;
                    }
                    else {
                        vm.filterCongBo.filterByLoaiHinhThongTinQuangCao = null;
                    }
                }
            };
        };
        //#endregion

        //DropDownList Năm
        {
            let data = [];
            var year = new Date().getFullYear() + 10;
            for (var i = year; i >= 2000; i--) {
                data.push({
                    id: i,
                    name: "Năm " + i
                });
            }

            vm.namOptions = {
                dataSource: data,
                dataValueField: "id",
                dataTextField: "name",
                optionLabel: app.localize('Chọn ...'),
                filter: "contains",
                select: function (e) {
                    var dataItem = e.dataItem;
                    $scope.name = dataItem.name;
                }
            };
        }

        //#region Grid Data
        var gridCongBo = () => {
            vm.congBoThongTinQuangCaoColumn = [
                {
                    title: "STT",
                    template: "<div class='row-number text-center'></div>",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 50
                },

                {
                    field: "soGiayXacNhan",
                    title: "Số giấy xác nhận",
                    width: 200,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                },
                {
                    field: "namGiayXacNhan",
                    title: "Năm xác nhận",
                    width: 120,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                },
                {
                    field: "tenThuoc",
                    title: "Tên thuốc",
                    width: 220,
                    attributes: { class: "" },
                    headerAttributes: { style: "" },
                },
                {
                    field: "soDangKyThuoc",
                    title: "Số đăng ký thuốc / Số GPLH",
                    width: 200,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                },
                {
                    field: "tenCongTyDangKyThongTinQuangCao",
                    title: "Công ty đăng ký quảng cáo thuốc",
                    width: 200,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                },
                {
                    field: "loaiHinhThongTinQuangCao",
                    title: "Loại hình thông tin quảng cáo thuốc",
                    width: 250,
                    template: `<div>
                                       <span ng-if="dataItem.loaiHinhThongTinQuangCao == 0">Tài liệu thông tin cho cán bộ y tế</span>
                                       <span ng-if="dataItem.loaiHinhThongTinQuangCao == 1">Quảng cáo trên báo nói, báo hình</span>
                                       <span ng-if="dataItem.loaiHinhThongTinQuangCao == 2">Quảng cáo thông qua hội thảo, hội nghị, tổ chức sự kiện</span>
                                       <span ng-if="dataItem.loaiHinhThongTinQuangCao == 3">Quảng cáo trên các phương tiện quảng cáo khác (không phải báo nói, báo hình)</span>
                               </div>`,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                },
                {
                    field: "tenCongTyDangKyThongTinQuangCao",
                    title: "Giấy xác nhận nội dung thông tin quảng cáo thuốc",
                    width: 250,
                    template: `<a href="" style="text-decoration:none;" class="bold font-green"  ng-click="vm.viewGiayXacNhan(this.dataItem.fileGiayXacNhan)">Xem chi tiết</a>`,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                },
            ];
            vm.requestParams = {
                skipCount: 0,
                maxResultCount: 10,
                sorting: null
            };
            vm.refreshDataSource = function () {
                vm.thuocCongBoDataSoure = [];
                vm.setDataSource = function () {
                    vm.thuocCongBoDataSoure = new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                $scope.totalRow = 0;
                                $scope.keyWordFilter = "";
                                vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                                vm.requestParams.maxResultCount = options.data.pageSize;
                                var _req = {
                                    keyWord: vm.filterAll,
                                    filterCongBo: vm.filterCongBo,
                                    soGiayXacNhan: vm.filterCongBo.soGiayXacNhan,
                                    filterByLoaiHinhThongTinQuangCao: vm.filterCongBo.filterByLoaiHinhThongTinQuangCao,
                                    namXacNhan: vm.filterCongBo.namXacNhan,
                                    congTyDangKyQuangCao: vm.filterCongBo.congTyDangKyQuangCao,
                                    tenThuoc: vm.filterCongBo.tenThuoc,
                                    soDangKyThuoc: vm.filterCongBo.soDangKyThuoc
                                };
                                switch (vm.switchFilter) {
                                    case 1:
                                        _req.soDangKyThuoc = vm.filterAll;
                                        _req.keyWord = "";
                                        break;
                                    case 2:
                                        _req.tenThuoc = vm.filterAll;
                                        _req.keyWord = "";
                                        break;
                                    case 3:
                                        _req.soGiayXacNhan = vm.filterAll;
                                        _req.keyWord = "";
                                        break;
                                    default:
                                        _req.keyWord = vm.filterAll;
                                        break;
                                }
                                getCongBoQuangCaoPagingService($.extend(_req, vm.requestParams))
                                    .then(function (result) {
                                        options.success(result);
                                        $scope.totalRow = result.totalCount;
                                        $scope.keyWordFilter = vm.filterAll;
                                        $scope.$apply();
                                        $scope.filter = {};
                                    });
                            }
                        },
                        pageSize: 15,
                        serverPaging: true,
                        serverSorting: true,
                        sortable: true,
                        schema: {
                            data: "items",
                            total: "totalCount"
                        }
                    });
                };
                vm.setDataSource();
            };
            vm.refreshDataSource();
            vm.thuocCongBoGridOptions = {
                pageable:
                {
                    "refresh": true,
                    "pageSizes": [5, 10, 15, 20, 50, 100],
                    messages: {
                        empty: "Không có dữ liệu",
                        display: "Hiển thị từ {0} đến {1}/{2} bản ghi",
                        itemsPerPage: "Bản ghi mỗi trang"
                    }
                },
                resizable: true,
                height: 800,
                scrollable: true,
                dataBound: function (e) {
                    var grid = this;
                    var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                    grid.tbody.find(".row-number").each(function () {
                        var index = record++;
                        $(this).html(index);
                    });
                },
                columns: vm.congBoThongTinQuangCaoColumn
            };
            vm.getGridData = function () {
                vm.thuocCongBoDataSoure.read();
            };
        };
        var initDataHistory = () => {
            vm.histories = [];
        };
        //#endregion 
        function init() {
            chucnangTimKiem();
            gridCongBo();
            initDataHistory();
        };
        init();

        vm.viewGiayXacNhan = (url) => {
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Xem tài liệu</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congbothongtinquangcao.viewgiayxacnhan ng-if='isGiayXacnhan'></div>
                        <div ng-if='!isGiayXacnhan'> Giấy xác nhận không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isGiayXacnhan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
    }
]);
(function () {
    MyApp.directive('frontend.congbothongtinquangcao.viewgiayxacnhan', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                if (app.urlCongVanCongBoGiaThuoc != "") {
                    vm.taiLieuDinhKemUrl = "/File/GoToViewTaiLieu?url=" + app.urlCongVanCongBoGiaThuoc + "#zoom=70";
                } else {
                    vm.taiLieuDinhKemUrl = "";
                }
                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="row form-group">
                             <div class="col-md-12">
                                <div class="portlet light bordered" style="height: 630px">
                                        <span ng-if="!vm.taiLieuDinhKemUrl || vm.taiLieuDinhKemUrl == ''"></span>
                                        <iframe ng-if='vm.taiLieuDinhKemUrl ||vm.taiLieuDinhKemUrl!=""' title="Xem tài liệu" style="width: 100%; height: 100%;border:0" ng-src="{{vm.trustSrc(vm.taiLieuDinhKemUrl)}}"  ></iframe>
                                </div>
                             </div>
                           </div>`,
            };
        }
    ]);
})();;
MyApp.controller('frontend.congbothuoc', [
    '$scope', '$sce', '$location', '$http', '$window', '$timeout', '$uibModal',
    function ($scope, $sce, $location, $http, $window, $timeout, $uibModal) {
        vm = this;
        vm.yearSelectorOptions = {
            start: "decade",
            depth: "decade"
        };

        var getThuocCongBoPagingService = (input, ajaxParams) => {
            return abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/soDangKy/GetAllPublicServerPaging',
                type: 'POST',
                data: JSON.stringify(input)
            }, ajaxParams));
        };
        //var getPermissions = function () {
        //    var isPermission = abp.ajax($.extend({
        //        url: abp.appPath + 'api/services/app/soDangKy/GetPermissionByName',
        //        type: 'POST',
        //        data: "{name:'Pages.VanChuyenHoSoPDK.XuatExcelTraCuuSDK'}"
        //    }, null)).then(function (result) {
        //        vm.excelPermission = result;
        //    });;
        //}
        //getPermissions();

        var getRoleLevel = function () {
            var roleLevel = abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/soDangKy/GetRoleLevel',
                type: 'POST',
                data: ""
            }, null)).then(function (result) {
                vm.roleLevel = result;
            });
        }
        getRoleLevel();
        vm.xuatExel = function () {
            var result = abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/soDangKy/GetAllPublicServerPaging',
                type: 'POST',
                data: JSON.stringify(input)
            }, ajaxParams));
            app.downloadTempFile(result.data);
        }
        //#region Tìm kiếm
        var chucnangTimKiem = () => {
            vm.isNangCaoFilter = false;
            vm.changeNangCaoFilter = ($event) => {
                vm.isNangCaoFilter = !vm.isNangCaoFilter;
                vm.filterAll = "";
                vm.filterCongBo = {};
            };
            $scope.$watch('vm.filterAll', function myfunction() {
                if (vm.filterAll != null && vm.filterAll != "") {
                    vm.isNangCaoFilter = false;
                    vm.filterCongBo = {};
                }
            })
            $scope.totalRow = 0;
            $scope.keyWord = "";
            vm.switchFilter = 0;
            vm.changeSwitchFilter = function ($event, d) {
                $('#search_concept').text($event.currentTarget.firstChild.text);
                vm.switchFilter = d;
            };
            vm.filterCongBo = {};
            vm.refreshFilter = function () {
                vm.filterAll = "";
                vm.filterCongBo = {};
                vm.filterCongBo.tieuChuanId = null;
                vm.filterCongBo.phanLoaiThuocEnum = null;
                vm.filterCongBo.ngayCapSoDangKy = null;
                vm.filterCongBo.thongTinThuocCoBan_LoaiThuocId = null;
                vm.filterCongBo.thongTinThuocCoBan_NhomThuocId = null;
                vm.filterCongBo.isDaRutSoDangKy = null;
                vm.getGridData();
            };
        };
        //#endregion
        //#region Grid Data
        var gridThuocCongBo = () => {
            vm.refreshColumns = function () {
                vm.columns = [];
                var _colSTT = {
                    field: "stt",
                    title: app.localize('STT'),
                    template: `
                                <div class='row-number text-center'
                                     ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}">
                                </div>
                            `,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 50
                };

                var _colTaiLieu = {
                    title: app.localize('HDSD/Mẫu nhãn'),
                    template: `
                                <div align='center'>
                                    <a href="" title=""
                                       style="text-decoration: none;"
                                       ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {'color':'green'}"
                                       ng-if="this.dataItem.thongTinTaiLieu.urlHuongDanSuDung.length>0 ||
                                              this.dataItem.thongTinTaiLieu.urlNhan.length>0 ||
                                              this.dataItem.thongTinTaiLieu.urlNhanVaHDSD.length>0"
                                       ng-click="vm.viewMauNhanVaHDSD(this.dataItem)">
                                        <em class="fa fa-file-pdf-o"></em>
                                    </a><br/>
                                </div>
                            `,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 90
                };

                var _colTenThuoc = {
                    field: "tenThuoc",
                    title: app.localize('Tên thuốc'),
                    template: `
                                <div ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}">
                                    <strong ng-if='this.dataItem.vacXinSinhPham.loaiVacXin != null || this.dataItem.vacXinSinhPham.phongBenh != null'></strong>
                                    {{this.dataItem.tenThuoc}}
                                </div>

                                <div ng-if='this.dataItem.vacXinSinhPham.phongBenh.trim().length>0'
                                     ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {'color':'green'}"
                                     style="font-size: 13px;">
                                    <em>(Phòng bệnh: {{this.dataItem.vacXinSinhPham.phongBenh}})</em>
                                </div>
                            `,
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 240
                };

                var _colSoDK = {
                    field: "soDangKy",
                    title: app.localize('Số GPLH'),
                    template: `
                            <a href="" 
                               ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}"
                               style="text-decoration: none;" 
                               title="Số đăng ký đã công bố" 
                               ng-click="vm.viewNguyenLieu(this.dataItem)">
                                {{this.dataItem.soDangKy}}
                            </a>
                            <br/>

                            <a href="" 
                               ng-if="this.dataItem.isDaRutSoDangKy!=true"
                               style="text-decoration: none; color: green; font-style: italic; font-size: 13px;">
                                (Hiệu lực)
                            </a>

                            <a href="" 
                               ng-if="this.dataItem.isDaRutSoDangKy==true"
                               style="text-decoration: none; color: red; font-style: italic; font-weight: bold; font-size: 13px;">
                                (Đã thu hồi)
                            </a>

                            <br/>
                            <a href="" ng-if="this.dataItem.soDangKyCu && this.dataItem.soDangKy != this.dataItem.soDangKyCu"
                               ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {'color':'green'}"
                               style="text-decoration: none; font-style: italic; font-size: 13px;">
                               (SĐK cũ: {{this.dataItem.soDangKyCu}})
                            </a>
                        `,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 140
                };

                var _colNgayHetHanSDK = {
                    field: "ngayHetHanSoDangKy",
                    title: app.localize('Ngày hết hạn SĐK'),
                    template: `
                                <span ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}">
                                    {{this.dataItem.thongTinDangKyThuoc.ngayHetHanSoDangKy | date:'dd/MM/yyyy'}}
                                </span>
                            `,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 120
                };

                var _colBaoChe = {
                    field: "dangBaoChe",
                    title: app.localize('Dạng bào chế'),
                    template: `
                                <span ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}">
                                    {{this.dataItem.thongTinThuocCoBan.dangBaoChe}}
                                </span>
                            `,
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 300
                };

                var _colHoatChat = {
                    field: "hoatChatChinh",
                    title: app.localize('Hoạt chất'),
                    template: `
                                    <span ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}">
                                        {{this.dataItem.thongTinThuocCoBan.hoatChatChinh}}
                                    </span>
                                `,
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 300
                };

                var _colHamLuong = {
                    field: "hamLuong",
                    title: app.localize('Hàm lượng'),
                    template: `
                            <span ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}">
                                {{this.dataItem.thongTinThuocCoBan.hamLuong}}
                            </span>
                        `,
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 140
                };

                var _colQuyCachDongGoi = {
                    field: "dongGoi",
                    title: app.localize('Quy cách đóng gói'),
                    template: `
                                <span ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}">
                                    {{this.dataItem.thongTinThuocCoBan.dongGoi}}
                                </span>
                            `,
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 270
                };

                var _colNgayCapSoDangKy = {
                    field: "ngayKK_KKL",
                    title: app.localize('Năm cấp'),
                    template: `
                                <div ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}">
                                    {{this.dataItem.thongTinDangKyThuoc.ngayCapSoDangKy | date:'dd/MM/yyyy'}}
                                </div>

                                <a ng-if="this.dataItem.isHetHan!=true"
                                   ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {'color':'green'}"
                                   style="text-decoration: none; font-style: italic; font-size: 13px;">
                                    ({{this.dataItem.thongTinDangKyThuoc.ngayHetHanSoDangKy!=null ? (this.dataItem.thongTinDangKyThuoc.ngayHetHanSoDangKy | date:'dd/MM/yyyy') : 'NA'}})
                                </a>

                                <a ng-if="this.dataItem.isHetHan==true"
                                   style="text-decoration: none; color: red; font-style: italic; font-size: 13px;">
                                    ({{this.dataItem.thongTinDangKyThuoc.ngayHetHanSoDangKy | date:'dd/MM/yyyy'}})
                                </a>
                            `,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 110
                };

                var _colSoQuyetDinh = {
                    field: "soQuyetDinh",
                    title: app.localize('Số quyết định'),
                    template: `
                                <span ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}">
                                    {{this.dataItem.thongTinDangKyThuoc.soQuyetDinh}}
                                </span>
                            `,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 120
                };

                var _colDotCap = {
                    field: "dotCap",
                    title: app.localize('Đợt cấp'),
                    template: `
                                <span ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}">
                                    {{this.dataItem.thongTinDangKyThuoc.dotCap}}
                                </span>
                            `,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 140
                };

                var _colTieuChuanChatLuong = {
                    field: "tieuChuan",
                    title: app.localize('Tiêu chuẩn'),
                    template: `
                                    <span ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}">
                                        {{this.dataItem.thongTinThuocCoBan.tieuChuan}}
                                    </span>
                                `,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 110
                };

                var _colTuoiTho = {
                    field: "tuoiTho",
                    title: app.localize('Tuổi thọ'),
                    template: `
                                <span ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}">
                                    {{this.dataItem.thongTinThuocCoBan.tuoiTho}}
                                </span>
                            `,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 100
                };
                var _colCongTyDangKy = {
                    title: "Thông tin công ty đăng ký",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    columns: [
                        {
                            field: "congTyDangKy.tenCongTyDangKy",
                            title: "Tên công ty",
                            width: "200px",
                            template: `<span ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}">
                                           {{this.dataItem.congTyDangKy.tenCongTyDangKy}}
                                       </span>`
                        },
                        {
                            field: "congTyDangKy.nuocDangKy",
                            title: "Nước",
                            width: "120px",
                            template: `<span ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}">
                                           {{this.dataItem.congTyDangKy.nuocDangKy}}
                                       </span>`
                        },
                        {
                            field: "congTyDangKy.diaChiDangKy",
                            title: "Địa chỉ",
                            width: "200px",
                            template: `<span ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}">
                                           {{this.dataItem.congTyDangKy.diaChiDangKy}}
                                       </span>`
                        }
                    ]
                };

                var _colCongTySanXuat = {
                    title: "Thông tin công ty sản xuất",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    columns: [
                        {
                            field: "congTySanXuat.tenCongTySanXuat",
                            title: "Tên công ty",
                            width: "200px"
                        },
                        {
                            field: "congTySanXuat.nuocSanXuat",
                            title: "Nước",
                            width: "120px"
                        },
                        {
                            field: "congTySanXuat.diaChiSanXuat",
                            title: "Địa chỉ",
                            width: "200px"
                        }
                    ]
                };

                var _colNgayHetHanSoDangKy = {
                    field: "ngayKK_KKL",
                    title: app.localize('Ngày hết hạn'),
                    template: `
                                <span ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}">
                                    {{this.dataItem.thongTinDangKyThuoc.ngayHetHanSoDangKy | date:'dd/MM/yyyy'}}
                                </span>
                            `,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 130
                };

                var _colLichSu = {
                    title: '',
                    template: `
                                <a href="" title="Lịch sử công bố" 
                                   ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}"
                                   ng-click="vm.viewLichSu(this.dataItem)">
                                   Lịch sử
                                </a>
                            `,
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 65
                };

                var _colThongTinGiaHan = {
                    title: "Thông tin hồ sơ gia hạn",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    columns: [
                        {
                            title: "Mã hồ sơ gia hạn",
                            width: "130px",
                            attributes: { class: "text-center" },
                            template: `<a style="text-decoration:none;" title="Xem giấy tiếp nhận">
                                        {{this.dataItem.maSoHoSoGiaHan}}
                                       </a>`,
                        },
                        {
                            title: "Ngày tiếp nhận hồ sơ gia hạn",
                            width: "120px",
                            attributes: { class: "text-center" },
                            template: `{{this.dataItem.ngayTiepNhanHSGiaHan | date:'dd/MM/yyyy'}}`,
                        },
                    ]
                };
                var _colDuocPhep = {
                    title: '',
                    headerTemplate: '<span>Được tiếp tục sử dụng GĐKLH </span><span style="color:red">(*)</span>',
                    template: `<em ng-if="dataItem.isDuocPhep" ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}" class="fa fa-check fa-3 font-green-meadow" aria - hidden="true" ></em >`,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 150
                };
              
                var _colTaiLieuDinhKem = {
                    title: 'Tài liệu công bố thay đổi bổ sung',
                    template: `
                                <a href="/ViewTaiLieu/Index?SoDangKyId={{this.dataItem.id}}"
                                   ng-style="this.dataItem.isDaRutSoDangKy ? {'color':'red'} : {}"
                                   style="text-decoration:none;"
                                   title="Xem tài liệu đính kèm">
                                    Xem chi tiết
                                </a>
                            `,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 270
                };

                var setColForForm = function () {
                    vm.columns = [_colLichSu, _colSTT, _colTaiLieu, _colSoDK, _colNgayHetHanSDK, _colTenThuoc, _colThongTinGiaHan, _colDuocPhep, _colHoatChat, _colHamLuong, _colSoQuyetDinh, _colNgayCapSoDangKy, _colDotCap, _colBaoChe, _colQuyCachDongGoi, _colTieuChuanChatLuong, _colTuoiTho, _colCongTyDangKy, _colCongTySanXuat, _colTaiLieuDinhKem];
                };
                setColForForm();
                vm.columnGiaThuoc = vm.columns;

            };
            vm.refreshColumns();
            vm.requestParams = {
                skipCount: 0,
                maxResultCount: 10,
                sorting: null
            };
            vm.refreshDataSource = function () {

                vm.thuocCongBoDataSoure = [];
                vm.setDataSource = function () {
                    vm.thuocCongBoDataSoure = new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                $scope.totalRow = 0;
                                $scope.keyWord = "";
                                vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                                vm.requestParams.maxResultCount = options.data.pageSize;

                                if (vm.filterCongBo.isDaRutSoDangKy == 1) {
                                    vm.filterCongBo.isDaRutSoDangKy = true;
                                }

                                var _req = {
                                    filterText: vm.filterAll,
                                    SoDangKyThuoc: vm.filterCongBo,
                                    KichHoat: true
                                };
                                switch (vm.switchFilter) {
                                    case 1:
                                        _req.SoDangKyThuoc.SoDangKy = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 2:
                                        _req.SoDangKyThuoc.TenThuoc = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 3:
                                        _req.SoDangKyThuoc.HoatChatChinh = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 4:
                                        _req.SoDangKyThuoc.SoQuyetDinh = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 5:
                                        _req.SoDangKyThuoc.DangBaoChe = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 6:
                                        _req.SoDangKyThuoc.TenCongTyDangKy = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 7:
                                        _req.SoDangKyThuoc.TenCongTySanXuat = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    default:
                                        _req.filterText = vm.filterAll;
                                        break;
                                }
                                getThuocCongBoPagingService($.extend(_req, vm.requestParams))
                                    .then(function (result) {
                                        options.success(result);
                                        $scope.totalRow = result.totalCount;
                                        $scope.keyWord = vm.filterAll;
                                        $scope.$apply();
                                        $scope.filter = {};
                                    });

                            }
                        },
                        pageSize: 10,
                        serverPaging: true,
                        serverSorting: true,
                        sortable: true,
                        schema: {
                            data: "items",
                            total: "totalCount"
                        }
                    });
                };
                vm.setDataSource();
            };
            vm.refreshDataSource();
            vm.thuocCongBoGridOptions = {
                pageable:
                {
                    "refresh": true,
                    "pageSizes": [5, 10, 15, 20],
                    messages: {
                        empty: "Không có dữ liệu",
                        display: "Hiển thị từ {0} đến {1}/{2} bản ghi",
                        itemsPerPage: "Bản ghi mỗi trang"
                    }
                },
                resizable: true,
                height: 800,
                scrollable: true,
                dataBound: function (e) {
                    var grid = this;
                    var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                    grid.tbody.find(".row-number").each(function () {
                        var index = record++;
                        $(this).html(index);
                    });
                    var rows = e.sender.tbody.children();
                    for (var j = 0; j < rows.length; j++) {
                        var row = $(rows[j]);
                        var dataItem = e.sender.dataItem(row);

                        var trangthai = dataItem.get("trangThai");
                        if (trangthai == 91) {
                            row.context.style.color = "red";
                        }

                    }
                },
                columns: vm.columnGiaThuoc
            };
            function isValidDate(s) {
                if (s != null && s.length > 0) {
                    var bits = s.split('/');
                    var d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
                    return !!(d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]));
                } else {
                    return true;
                }
            }
            vm.getGridData = function () {
                var date = vm.filterCongBo.ngayCapSoDangKy;
                if (date != 'undefined' && !isValidDate(date)) {
                    abp.notify.error("Năm cấp không đúng định dạng!");
                    return;
                } else {
                    vm.thuocCongBoDataSoure.read();
                }
            };
            vm.viewGiayTiepNhan = (url, maSo) => {
                app.urlGiayTiepNhan = url;
                app.maHoSo = maSo;
                var modalInstance = $uibModal.open({
                    template: `
                        <div class="modal-header">
                            <span class="caption-subject bold uppercase" style="font-size: 18px;">Phiếu tiếp nhận hồ sơ: {{maHoSo}}</span>
                        </div>
                        <div class="modal-body">
                            <div class="form-group" style="height: 600px">
                                <iframe title="Xem phiếu tiếp nhận" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(urlFile)}}"></iframe>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                    size: 'lg',
                    windowClass: 'my-modal-popup',
                    resolve: {
                        urlFile: { urlTiepNhan: url, maHoSo: maSo }
                    },
                    controller: ['$scope', '$uibModalInstance', 'urlFile', '$sce', function ($scope, $uibModalInstance, urlFile, $sce) {
                        $scope.maHoSo = urlFile.maHoSo;
                        $scope.urlFile = "/File/GoToViewTaiLieu?url=" + urlFile.urlTiepNhan;
                        app.IsNullOrEmpty = function (o) {
                            var f = false;
                            if (typeof (o) === 'undefined') f = true;
                            if (o == null) f = true;
                            o = String(o);
                            if (o == '') f = true;
                            return f;
                        };
                        $scope.isCongVan = !app.IsNullOrEmpty(urlFile.urlTiepNhan);
                        $scope.cancel = function () {
                            $uibModalInstance.close();
                        };
                        $scope.trustSrc = function (src) {
                            return $sce.trustAsResourceUrl(src);
                        };
                    }]
                });
               
            }
        };
        var initDataHistory = () => {
            vm.histories = [];
        };
        //#endregion 
        function init() {
            chucnangTimKiem();
            gridThuocCongBo();
            initDataHistory();
        };
        init();
        vm.viewCongVan = (url) => {
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn kiến nghị</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.sodangky.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
        vm.viewCongVanById = (id) => {
            var _id = parseInt(id);
            var f = vm.getByParentPagingServiceDS.filter(x => x.id == _id);
            var url = "";
            if (f.length > 0) {
                url = f[0].urlCongVanKienNghiDieuChinhGia;
            }
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn kiến nghị</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congbothuoc.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
        vm.viewLichSu = (d) => {
            abp.ui.setBusy();
            app.soDangKyId = d.id;
            app.danhSachLichSu = [];
            var getHistoryService = (soDangKyId, ajaxParams) => {
                return abp.ajax($.extend({
                    url: abp.appPath + 'api/services/app/davSoDangKyHistory/GetHistory' + abp.utils.buildQueryString([{ name: 'soDangKyId', value: soDangKyId }]) + '',
                    type: 'POST',
                    data: JSON.stringify({})
                }, ajaxParams));
            };
            if (app.soDangKyId > 0) {
                getHistoryService(app.soDangKyId)
                    .then(function (result) {
                        app.danhSachLichSu = result;
                        result.forEach((currentValue, index) => {
                            currentValue.ListNoiDungThayDoi = currentValue.contentJsonObj.ListNoiDungThayDoi;
                        });
                        var a = app.danhSachLichSu;
                        var modalInstance = $uibModal.open({
                            template: `
                                <div class="modal-header">
                                <span class="caption-subject bold uppercase">Lịch sử thay đổi thông tin số đăng ký</span>
                                </div>
                                <div class="modal-body">
                                <div frontend.congbothuoc.viewlichsu></div>
                                </div>
                                <div class="modal-footer">
                                <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                                </div>
                                `,
                            size: 'lg',
                            windowClass: 'my-modal-popup',
                            resolve: {
                                thuoc: d
                            },
                            controller: ['$scope', '$uibModalInstance', 'thuoc', function ($scope, $uibModalInstance, thuoc) {
                                $scope.thuoc = thuoc;
                                app.IsNullOrEmpty = function (o) {
                                    f = false;
                                    if (typeof (o) === 'undefined') f = true;
                                    if (o == null) f = true;
                                    o = String(o);
                                    if (o == '') f = true;
                                    return f;
                                };
                                $scope.cancel = function () {
                                    $uibModalInstance.close();
                                };
                            }]
                        });
                        abp.ui.clearBusy();
                    });
            }
        };
        vm.viewNguyenLieu = (d) => {
            app.soDangKyThuoc = d.soDangKy;
            app.danhSachNguyenLieu = [];
            var getNguyenLieuService = (d, ajaxParams) => {
                return abp.ajax($.extend({
                    url: abp.appPath + 'api/services/app/nguyenLieuLamThuoc/GetNguyenLieuTheoSoDangKy' + abp.utils.buildQueryString([{ name: 'soDangKy', value: d.soDangKy }]) + '',
                    type: 'POST',
                    data: JSON.stringify({}),
                }, ajaxParams));
            };
            if (app.soDangKyThuoc.length > 0) {
                getNguyenLieuService(d)
                    .then(function (result) {
                        app.danhSachNguyenLieu = result;
                        var modalInstance = $uibModal.open({
                            template: `
                                <div class="modal-header">
                                <span class="caption-subject bold uppercase">Danh sách nguyên liệu công bố</span>
                                </div>
                                <div class="modal-body">
                                <div frontend.congbothuoc.viewnguyenlieu></div>
                                </div>
                                <div class="modal-footer">
                                <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                                </div>
                                `,
                            size: 'lg',
                            windowClass: 'my-modal-popup',
                            resolve: {
                                thuoc: d
                            },
                            controller: ['$scope', '$uibModalInstance', 'thuoc', function ($scope, $uibModalInstance, thuoc) {
                                $scope.thuoc = thuoc;
                                app.IsNullOrEmpty = function (o) {
                                    var f = false;
                                    if (typeof (o) === 'undefined') f = true;
                                    if (o == null) f = true;
                                    o = String(o);
                                    if (o == '') f = true;
                                    return f;
                                };
                                $scope.cancel = function () {
                                    $uibModalInstance.close();
                                };
                            }]
                        });
                    });
            }
        };
        vm.viewMauNhanVaHDSD = (item) => {
            item.roleLevel = vm.roleLevel;
            var modalInstance = $uibModal.open({
                template: `
                        <style>
                            .tab-content { padding-top: 10px !important; }
                            .modal-content { border-radius: 0px; }
                        </style>
                        <div class="attp-xem-ho-so">
                            <div class="modal-header">
                                <h4 class="modal-title text-center text-uppercase" style = "font-family: 'Roboto Condensed', Arial  !important;" >
                                    Xem chi tiết
                                    <button type="button" class="close" ng-click="cancel()" aria-hidden="true"></button>
                                </h4>
                            </div>
                            <div class="modal-body">
                                <uib-tabset class="tab-container tabbable-line" active="activeIndex">
                                    <uib-tab index="1" heading="Hướng dẫn sử dụng" ng-if="showHuongDan && !isNewData">
                                        <div style="height: 630px">
                                            <iframe title="HƯỚNG DẪN SỬ DỤNG" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(huongDanSuDung)}}"></iframe>
                                        </div>
                                    </uib-tab>
                                    <uib-tab index="1" heading="Hướng dẫn sử dụng" ng-if="showHuongDan && isNewData">
                                        <div class="btn-group" style="margin-bottom: 10px;padding-top: -10px" uib-dropdown auto-close="disabled" is-open="{{vm.openHuongDanSuDung}}">
                                            <button id="button1" type="button" class="btn btn-xs btn-default blue-steel" uib-dropdown-toggle>
                                                Hướng dẫn sử dụng <em class="fa fa-angle-down" style="margin-left: 8px;"></em>
                                            </button>
                                            <div class="dropdown-menu theme-panel pull-left dropdown-custom" uib-dropdown-menu role="menu" aria-labelledby="button1" style="width:800px!important;">
                                                <div class="col-md-12">
                                                    <div class="table-scrollable" style="height:500px; overflow-y:auto; ">
                                                        <table class="table table-striped table-bordered table-hover">
                                                            <thead>
                                                                <tr class="active">
                                                                    <th style="width:100px" class="text-center">Xem tài liệu</th>
                                                                    <th colspan="2" style="width:40px" class="text-center">STT</th>
                                                                    <th class="text-center">Nội dung tệp</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody ng-repeat="taiLieu in huongDanSuDung track by $index">
                                                                <tr>
                                                                    <td class="text-center">
                                                                        <span class="btn btn-sm green fileinput-button" uib-dropdown-toggle ng-click="openViewFile(taiLieu, 'HuongDanSuDung')">
                                                                            <span> Xem </span>
                                                                        </span>
                                                                    </td>
                                                                    <td colspan="2" class="text-center"><h5>{{$index + 1}}</h5></td>
                                                                    <td>
                                                                        <h5><em>{{taiLieu.moTaTep}}</em></h5>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="height: 630px">
                                            <iframe ng-if="urlViewHuongDanSuDung" title="HƯỚNG DẪN SỬ DỤNG" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(urlViewHuongDanSuDung)}}"></iframe>
                                            <div ng-if="!urlViewHuongDanSuDung"
                                                 class="text-center"
                                                 style="padding-top: 260px; color: #999;">
                                                <em class="fa fa-folder-open-o" style="font-size: 40px;"></em>
                                                <p style="margin-top: 10px; font-size: 16px;">Vui lòng chọn tài liệu pdf để xem</p>
                                            </div>
                                        </div>
                                    </uib-tab>

                                    <uib-tab index="2" heading="Mẫu nhãn" ng-if="showNhan && !isNewData">
                                        <div style="height: 630px">
                                            <iframe title="MẪU NHÃN" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(mauNhan)}}"></iframe>
                                        </div>
                                    </uib-tab>
                                    <uib-tab index="2" heading="Mẫu nhãn" ng-if="showNhan && isNewData">
                                        <div class="btn-group" style="padding-bottom: 10px;" uib-dropdown auto-close="disabled" is-open="{{vm.openMauNhan}}">
                                            <button id="button2" type="button" class="btn btn-xs btn-default blue-steel" uib-dropdown-toggle data-toggle="tooltip" title="Nhấn vào đây để xem bảng kê và tệp đính kèm.">
                                                Mẫu nhãn<em class="fa fa-angle-down" style="margin-left: 8px;"></em>
                                            </button>
                                            <div class="dropdown-menu theme-panel pull-left dropdown-custom" uib-dropdown-menu role="menu" aria-labelledby="button2" style="width:800px!important;">
                                                <div class="col-md-12">
                                                    <div class="table-scrollable" style="height:500px; overflow-y:auto; ">
                                                        <table class="table table-striped table-bordered table-hover">
                                                            <thead>
                                                                <tr class="active">
                                                                    <th style="width:100px" class="text-center">Xem tài liệu</th>
                                                                    <th colspan="2" style="width:40px" class="text-center">STT</th>
                                                                    <th class="text-center">Nội dung tệp</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody ng-repeat="taiLieu in mauNhan track by $index">
                                                                <tr>
                                                                    <td class="text-center">
                                                                        <span class="btn btn-sm green fileinput-button" uib-dropdown-toggle ng-click="openViewFile(taiLieu, 'MauNhan')">
                                                                            <span> Xem </span>
                                                                        </span>
                                                                    </td>
                                                                    <td colspan="2" class="text-center"><h5>{{$index + 1}}</h5></td>
                                                                    <td>
                                                                        <h5><em>{{taiLieu.moTaTep}}</em></h5>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="height: 630px">
                                            <iframe ng-if="urlViewMauNhan" title="HƯỚNG DẪN SỬ DỤNG" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(urlViewMauNhan)}}"></iframe>
                                            <div ng-if="!urlViewMauNhan"
                                                 class="text-center"
                                                 style="padding-top: 260px; color: #999;">
                                                <em class="fa fa-folder-open-o" style="font-size: 40px;"></em>
                                                <p style="margin-top: 10px; font-size: 16px;">Vui lòng chọn tài liệu pdf để xem</p>
                                            </div>
                                        </div>
                                    </uib-tab>


                                    <uib-tab index="3" heading="File tổng hợp mẫu nhãn và HDSD" ng-if="sodangky.thongTinTaiLieu.urlNhanVaHDSD.length > 0">
                                        <div style="height: 630px">
                                            <iframe title="MẪU NHÃN VÀ HDSD" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(nhanVahuongDanSuDung)}}"></iframe>
                                        </div>
                                    </uib-tab>
                                    <uib-tab index="4" heading="Tài liệu TCCL" ng-if="sodangky.thongTinTaiLieu.jsonTaiLieuTCCL.length > 0 && roleLevel == 14">
                                        <div class="btn-group" style="padding-top: 10px;" uib-dropdown auto-close="disabled" is-open="{{vm.openTieuChuanChatLuong}}">
                                            <button id="button3" type="button" class="btn btn-xs btn-default blue-steel" uib-dropdown-toggle>
                                                Tiêu chuẩn chất lượng <em class="fa fa-angle-down" style="margin-left: 8px;"></em>
                                            </button>
                                            <div class="dropdown-menu theme-panel pull-left dropdown-custom" uib-dropdown-menu role="menu" aria-labelledby="button3" style="width:800px!important;">
                                                <div class="col-md-12">
                                                    <div class="table-scrollable" style="height:500px; overflow-y:auto; ">
                                                        <table class="table table-striped table-bordered table-hover">
                                                            <thead>
                                                                <tr class="active">
                                                                    <th style="width:100px" class="text-center">Xem tài liệu</th>
                                                                    <th colspan="2" style="width:40px" class="text-center">STT</th>
                                                                    <th class="text-center">Nội dung tệp</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody ng-repeat="taiLieu in taiLieuTccl track by $index">
                                                                <tr>
                                                                    <td class="text-center">
                                                                        <span class="btn btn-sm green fileinput-button" uib-dropdown-toggle ng-click="openViewFile(taiLieu,'TaiLieuTccl')">
                                                                            <span> Xem </span>
                                                                        </span>
                                                                    </td>
                                                                    <td colspan="2" class="text-center"><h5>{{$index + 1}}</h5></td>
                                                                    <td>
                                                                        <h5><em>{{taiLieu.moTaTep}}</em></h5>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="height: 630px">
                                            <iframe ng-if="urlViewTaiLieuTccl" title="TÀI LIỆU TCCL" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(urlViewTaiLieuTccl)}}"></iframe>
                                            <div ng-if="!urlViewTaiLieuTccl"
                                                 class="text-center"
                                                 style="padding-top: 260px; color: #999;">
                                                <em class="fa fa-folder-open-o" style="font-size: 40px;"></em>
                                                <p style="margin-top: 10px; font-size: 16px;">Vui lòng chọn tài liệu pdf để xem</p>
                                            </div>
                                        </div>
                                    </uib-tab>
                                </uib-tabset>
                            </div>
                            <div class="modal-footer">
                                <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                            </div>
                        </div >
                            `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    soDangKy: item
                },
                controller: ['$scope', '$uibModalInstance', '$sce', 'soDangKy', function ($scope, $uibModalInstance, $sce, soDangKy) {
                    $scope.activeIndex = 1;
                    $scope.sodangky = {};
                    $scope.roleLevel = soDangKy.roleLevel;
                    $scope.sodangky = soDangKy;
                    $scope.isNewData = false;
                    $scope.showHuongDan = false;
                    $scope.showNhan = false;
                    if ($scope.sodangky.thongTinTaiLieu.urlHuongDanSuDung) {
                        $scope.isNewData = $scope.sodangky.thongTinTaiLieu.urlHuongDanSuDung.startsWith('[{\"');
                    }
                    if ($scope.sodangky.thongTinTaiLieu.urlNhan && !$scope.isNewData) {
                        $scope.isNewData = $scope.sodangky.thongTinTaiLieu.urlNhan.startsWith('[{\"');
                    }
                    if ($scope.isNewData) {
                        $scope.huongDanSuDung = $scope.sodangky.thongTinTaiLieu.urlHuongDanSuDung ? JSON.parse($scope.sodangky.thongTinTaiLieu.urlHuongDanSuDung) : [];
                        $scope.mauNhan = $scope.sodangky.thongTinTaiLieu.urlNhan ? JSON.parse($scope.sodangky.thongTinTaiLieu.urlNhan) : [];
                        $scope.showHuongDan = $scope.huongDanSuDung.length > 0;
                        $scope.showNhan = $scope.mauNhan.length > 0;

                    } else {
                        $scope.huongDanSuDung = "/File/GoToViewTaiLieu?url=" + $scope.sodangky.thongTinTaiLieu.urlHuongDanSuDung + "#zoom=100";
                        $scope.mauNhan = "/File/GoToViewTaiLieu?url=" + $scope.sodangky.thongTinTaiLieu.urlNhan + "#zoom=100";
                        $scope.showHuongDan = true;
                        $scope.showNhan = true;
                    }
                    $scope.nhanVahuongDanSuDung = "/File/GoToViewTaiLieu?url=" + $scope.sodangky.thongTinTaiLieu.urlNhanVaHDSD + "#zoom=100";
                    $scope.taiLieuTccl = $scope.sodangky.thongTinTaiLieu.jsonTaiLieuTCCL ? JSON.parse($scope.sodangky.thongTinTaiLieu.jsonTaiLieuTCCL) : [];

                    // Auto set first open file each category
                    if ($scope.huongDanSuDung != null && $scope.huongDanSuDung.length > 0 ) {
                        $scope.urlViewHuongDanSuDung = "/File/GoToViewTaiLieu?url=" + $scope.huongDanSuDung[0].duongDanTep + "#zoom=70";
                    }
                    if ($scope.mauNhan != null && $scope.mauNhan.length > 0) {
                        $scope.urlViewMauNhan = "/File/GoToViewTaiLieu?url=" + $scope.mauNhan[0].duongDanTep + "#zoom=70";
                    }
                    if ($scope.taiLieuTccl != null && $scope.taiLieuTccl.length > 0) {
                        $scope.urlViewTaiLieuTccl = "/File/GoToViewTaiLieu?url=" + $scope.taiLieuTccl[0].duongDanTep + "#zoom=70";
                    }


                    //Function
                    {
                        app.IsNullOrEmpty = function (o) {
                            var f = false;
                            if (typeof (o) === 'undefined') f = true;
                            if (o == null) f = true;
                            o = String(o);
                            if (o == '') f = true;
                            return f;
                        };

                        $scope.openViewFile = (item, type) => {
                            if(type == 'HuongDanSuDung') {
                                $scope.urlViewHuongDanSuDung = "/File/GoToViewTaiLieu?url=" + item.duongDanTep + "#zoom=70";
                            } else if(type == 'MauNhan') {
                                $scope.urlViewMauNhan = "/File/GoToViewTaiLieu?url=" + item.duongDanTep + "#zoom=70";
                            } else if(type == 'TaiLieuTccl') {
                                $scope.urlViewTaiLieuTccl = "/File/GoToViewTaiLieu?url=" + item.duongDanTep + "#zoom=70";
                            }
                        }


                        $scope.cancel = function () {
                            $uibModalInstance.close();
                        };
                        var init = function () {
                        }
                        init();
                        $scope.trustSrc = function (src) {
                            return $sce.trustAsResourceUrl(src);
                        };
                    }
                }]
            });
        };
        vm.viewTaiLieu = (url, title) => {
            app.urlTaiLieu = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">{{titleFile}}</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.sodangky.viewtailieu ng-if='isTonTaiFile'></div>
                        <div ng-if='!isTonTaiFile'> Tệp không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileTaiLieu: { urlDuongDanTaiLieu: url, title: title }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileTaiLieu', function ($scope, $uibModalInstance, urlFileTaiLieu) {
                    $scope.urlFileTaiLieu = urlFileTaiLieu.urlDuongDanTaiLieu;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.titleFile = urlFileTaiLieu.title;
                    $scope.isTonTaiFile = !app.IsNullOrEmpty(urlFileTaiLieu.urlDuongDanTaiLieu);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
    }
]);
(function () {
    MyApp.directive('frontend.congbothuoc.viewlichsu', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', '$uibModal', function ($scope, $window, $uibModal) {
                var vm = this;
                vm.lichSuThayDoi = app.danhSachLichSu;
                /*var a = JSON.parse(vm.lichSuThayDoi[0].listTepDinhKem[0].jsonTepDinhKem)[0].duongDanTep;*/
                vm.srcQuyetDinh = function (src) {
                    return "/File/GoToViewTaiLieu?url=" + src + "#zoom=100";
                };
                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
                vm.openViewFile = (item) => {

                    var modalInstance = $uibModal.open({
                        template: `
                            <div class="modal-header">
                            <span class="caption-subject bold uppercase font-white">{{taiLieuSelected.content}}</span>
                            </div>
                            <div class="modal-body">
                            <div class="portlet light bordered" style="height: 650px">
                                <iframe title="title" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(taiLieuUrl)}}"  ></iframe>
                            </div>
                            </div>
                            <div class="modal-footer">
                            <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                            </div>
                            `,
                        size: 'lg',
                        resolve: {
                            taiLieuSelected: item
                        },
                        controller: ['$scope', '$uibModalInstance', '$sce', 'taiLieuSelected', function ($scope, $uibModalInstance, $sce, taiLieuSelected) {
                            $scope.taiLieuSelected = taiLieuSelected;
                            if (taiLieuSelected.duongDanTepKySo != null && taiLieuSelected.duongDanTepKySo != undefined) {
                                $scope.taiLieuUrl = "/File/GoToViewTaiLieu?url=" + taiLieuSelected.duongDanTepKySo + "#zoom=60";
                            }
                            else {
                                $scope.taiLieuUrl = "/File/GoToViewTaiLieu?url=" + taiLieuSelected.duongDanTep + "#zoom=60";
                            }
                            $scope.cancel = function () {
                                $uibModalInstance.close();
                            };
                            $scope.trustSrc = function (src) {
                                return $sce.trustAsResourceUrl(src);
                            };
                        }]
                    });
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="container-fluid">
                        <div class="row form-group">
                            <div class="col-md-12">
                                <div class="timeline">
                                    <div class="timeline-item" ng-repeat="ls in vm.lichSuThayDoi">
                                        <div class="timeline-badge">
                                            <div class="timeline-icon">
                                                <em class="fa fa-history" ng-class="$index==0? 'font-green-haze':'font-red'"></em>
                                            </div>
                                        </div>
                                        <div class="timeline-body">
                                            <div class="timeline-body-arrow"> </div>
                                            <div class="timeline-body-content" style="margin-top: 0px;">
                                            <div class="portlet light" style="margin-bottom: 0px;">
                                            <div class="portlet-title tabbable-line">
                                                <div class="caption" ng-if="ls.thuTucId == 84">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta">Lúc {{ls.ngaySuaDoi | date :'dd/MM/yyyy HH:mm'}} - Đính chính bổ sung thông tin theo quyết định cấp số đăng ký</span>
                                                </div>
                                                <div class="caption" ng-if="ls.thuTucId == 85">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta">Lúc {{ls.ngaySuaDoi | date :'dd/MM/yyyy HH:mm'}} - Rút số đăng ký thuốc</span>
                                                </div>
                                                <div class="caption" ng-if="ls.thuTucId == 88">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta">Lúc {{ls.ngaySuaDoi | date :'dd/MM/yyyy HH:mm'}} - Duy trì hiệu lực 12 tháng số đăng ký lưu hành</span>
                                                </div>
                                                <div class="caption" ng-if="ls.thuTucId == 90">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta">Lúc {{ls.ngaySuaDoi | date :'dd/MM/yyyy HH:mm'}} - Gia hạn số đăng ký thuốc</span>
                                                </div>
                                                <div class="caption" ng-if="ls.thuTucId == 91">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta">Lúc {{ls.ngaySuaDoi | date :'dd/MM/yyyy HH:mm'}} - Đăng ký thay đổi bổ sung thông tin thuốc, nguyên liệu làm thuốc</span>
                                                </div>
                                                <div class="caption" ng-if="ls.thuTucId == null">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta">Lúc {{ls.ngaySuaDoi | date :'dd/MM/yyyy HH:mm'}} Hệ thống thay đổi thông tin - Lý do: {{ls.contentJsonObj.LyDoSuaDoi}}</span>
                                                </div>
                                                <ul class="nav nav-tabs"  ng-if="ls.contentJsonObj.ThongTinDangKyThuoc.SoQuyetDinh.length>0">
                                                    <li class="active">
                                                        <a href="#portlet_taba{{ls.id}}" data-toggle="tab" aria-expanded="true"> SỐ ĐĂNG KÝ </a>
                                                    </li>
                                                    <li class="">
                                                        <a href="#portlet_tabb{{ls.id}}" data-toggle="tab" aria-expanded="false"> QUYẾT ĐỊNH/CÔNG VĂN PHÊ DUYỆT </a>
                                                    </li>
                                                    <li class="">
                                                        <a href="#portlet_tabc{{ls.id}}" ng-if="ls.listTepDinhKem.length > 0" data-toggle="tab" aria-expanded="false"> TÀI LIỆU CÔNG BỐ </a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="portlet-body">
                                                <div class="tab-content" style="padding:0">
                                                    <div class="tab-pane active" id="portlet_taba{{ls.id}}">
                                                    
                                                <table class="table table-bordered table-hover">
                                                    <thead>
                                                        <tr class="bg-blue font-white">
                                                            <th class="text-center">Số GPLH </th>
                                                            <th class="text-center" style="width:200px"> Tên thuốc </th>
                                                            <th class="text-center" style="width:200px"> Hoạt chất</th>
                                                            <th class="text-center" style="width:200px"> Hàm lượng </th>
                                                            <th class="text-center" style="width:200px"> Số quyết định </th>
                                                            <th class="text-center" style="width:200px"> Năm cấp </th>
                                                            <th class="text-center" style="width:200px"> Đợt cấp </th>
                                                            <th class="text-center" style="width:200px"> Dạng bào chế </th>
                                                            <th class="text-center" style="width:200px"> Quy cách đóng gói</th>
                                                            <th class="text-center" style="width:200px"> Tiêu chuẩn </th>
                                                            <th class="text-center"> Tuổi thọ </th>
                                                      
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td class="text-center">
                                                                {{ls.contentJsonObj.SoDangKy}}
                                                            </td>
                                                            <td>
                                                            {{ls.contentJsonObj.TenThuoc}}
                                                            </td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.HoatChatChinh}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.HamLuong}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinDangKyThuoc.SoQuyetDinh}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinDangKyThuoc.NgayCapSoDangKy | date :'dd/MM/yyyy'}}</td>
                                                            <td class="text-center">{{ls.contentJsonObj.ThongTinDangKyThuoc.DotCap}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.DangBaoChe}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.DongGoi}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.TieuChuan}}</td>
                                                            <td class="text-center">{{ls.contentJsonObj.ThongTinThuocCoBan.TuoiTho}}</td>
                                                          
                                                        </tr>
                                                        <tr>
                                                        <td colspan="11">
                                                            <form class="form-horizontal" role="form" ng-if="ls.thuTucId != 91">
                                                            <div class="form-body">
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Công ty đăng ký</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTyDangKy.TenCongTyDangKy}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Địa chỉ  công ty đăng ký, nước đăng ký</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTyDangKy.DiaChiDangKy}}, {{ls.contentJsonObj.CongTyDangKy.NuocDangKy}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Công ty sản xuất</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTySanXuat.TenCongTySanXuat}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Địa chỉ công ty sản xuất, nước sản xuất</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTySanXuat.DiaChiSanXuat}}, {{ls.contentJsonObj.CongTySanXuat.NuocSanXuat}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            </div>
                                                            </form>
                                                            <div>
                                                            <table class="table table-bordered table-hover" ng-if="ls.thuTucId == 91 && ls.contentJsonObj.ListNoiDungThayDoi != null && (ls.contentJsonObj.IsLuongCapNhat == null) " style="margin-bottom: 0px;">
                                                                <thead class="bg-blue-madison font-white">
                                                                    <tr>
                                                                        <th style="vertical-align:middle;width: 160px;" class="text-center" colspan="4">
                                                                            Thông tin thay đổi/bổ sung (Mã hồ sơ: {{ls.maHoSo}} - Ngày tiếp nhận: {{ls.ngayTiepNhan | date:'dd/MM/yyyy'}})
                                                                            <br>
                                                                            Vui lòng xem tài liệu tại tab Tài liệu công bố (nếu có).                                                                      
                                                                        </th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th style="vertical-align:middle;width: 160px;" class="text-center"> Nội dung thay đổi, bổ sung </th>
                                                                        <th style="vertical-align:middle;width: 250px;" class="text-center"> Thông tin đã duyệt </th>
                                                                        <th style="vertical-align:middle;width: 250px;" class="text-center" ng-if="ls.contentJsonObj.IsLuongCapNhat != true"> Thông tin đề nghị thay đổi, bổ sung
                                                                        </th>
                                                                      
                                                                        <th style="vertical-align:middle;width: 250px;" class="text-center" ng-if="ls.contentJsonObj.IsLuongCapNhat == true"> Thông tin để nghị thay đổi, bổ sung đã được phê duyệt </th>
                                                                        <th style="vertical-align:middle;width: 250px;" class="text-center" ng-if="ls.contentJsonObj.IsLuongCapNhat == true"> Công văn phê duyệt của cục quản lý dược </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody ng-repeat="item in ls.contentJsonObj.ListNoiDungThayDoi">
                                                                    <tr>
                                                                       
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.Thuoc.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Tên thuốc
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.Thuoc.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.Thuoc.ThayDoi}}</td>
                                                                                        
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.HoatChat.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Hoạt chất
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.HoatChat.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.HoatChat.ThayDoi}}</td>
                                                                                        
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.HamLuong.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Hàm lượng
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.HamLuong.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.HamLuong.ThayDoi}}</td>
                                                                                        
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.DangBaoChe.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Dạng bào chế
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.DangBaoChe.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.DangBaoChe.ThayDoi}}</td>
                                                                                        
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.DongGoi.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Quy cách đóng gói
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.DongGoi.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.DongGoi.ThayDoi}}</td>
                                                                                       
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.TieuChuan.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Tiêu chuẩn
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.TieuChuan.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.TieuChuan.ThayDoi}}</td>
                                                                                        
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.TuoiTho.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Tuổi thọ
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.TuoiTho.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.TuoiTho.ThayDoi}}</td>
                                                                                       
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.CongTyDangKy.TenCongTy.IsSua">
                                                                                        <td style="vertical-align:middle;width: 100px;">
                                                                                            <span>
                                                                                                Tên công ty đăng ký
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.TenCongTy.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.TenCongTy.ThayDoi}}</td>
                                                                                      
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.CongTyDangKy.Nuoc.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Nước đăng ký
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.Nuoc.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.Nuoc.ThayDoi}}</td>
                                                                                       
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.CongTyDangKy.DiaChi.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Địa chỉ đăng ký
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.DiaChi.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.DiaChi.ThayDoi}}</td>
                                                                                        
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.CongTySanXuat.TenCongTy.IsSua">
                                                                                        <td style="vertical-align:middle;width: 100px;">
                                                                                            <span>
                                                                                                Tên công ty sản xuất
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.TenCongTy.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.TenCongTy.ThayDoi}}</td>
                                                                                        
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.CongTySanXuat.Nuoc.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Nước sản xuất
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.Nuoc.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.Nuoc.ThayDoi}}</td>
                                                                                        
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.CongTySanXuat.DiaChi.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Địa chỉ sản xuất
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.DiaChi.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.DiaChi.ThayDoi}}</td>
                                                                                       
                                                                                    </tr>
                                                                                    <tr ng-repeat="itemTD in item.ListNoiDungThayDoiThongTinKhac track by $index" ng-if="item.IsThayDoiThongTinKhac && item.ListNoiDungThayDoiThongTinKhac && item.ListNoiDungThayDoiThongTinKhac.length > 0">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span> {{itemTD.StrNoiDungThayDoi}}</span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">{{itemTD.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">{{itemTD.ThayDoi}}</td>
                                                                                       
                                                                                    </tr>
                                                                       
                                                                    </tr>
                                                                </tbody>
                                                            </table>                                                      
                                                            </div>
                                                        </td>                                                           
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <span class="font-grey-cascade margin-bottom-15" ng-if="ls.contentJsonObj.LyDoSuaDoi && ls.thuTucId != 91">
                                                    <strong>Lý do sửa: </strong><span>{{ls.contentJsonObj.LyDoSuaDoi}}</span>
                                                </span>
                                            </div>
                                              <div class="tab-pane" id="portlet_tabb{{ls.id}}">
                                                <div ng-if="ls.thuTucId == 88 || ls.thuTucId == 84">
                                                   <iframe ng-if='ls.contentJsonObj.ThongTinDangKyThuoc.UrlSoQuyetDinh.length>0' title="Xem tài liệu" style="width: 100%; height: 600px;border:0" ng-src="{{vm.trustSrc(vm.srcQuyetDinh(ls.contentJsonObj.ThongTinDangKyThuoc.UrlSoQuyetDinh))}}"  ></iframe>
                                                </div>

                                                <div ng-if="ls.thuTucId == 85">
                                                   <iframe ng-if='ls.contentJsonObj.ThongTinRutSoDangKy.UrlCongVanRutSoDangKy' title="Xem tài liệu" style="width: 100%; height: 600px;border:0" ng-src="{{vm.trustSrc(vm.srcQuyetDinh(ls.contentJsonObj.ThongTinRutSoDangKy.UrlCongVanRutSoDangKy))}}"  ></iframe>
                                                </div>
                                            </div>
                                               <div class="tab-pane" ng-if="ls.listTepDinhKem.length > 0" id="portlet_tabc{{ls.id}}">
                                                <div ng-if="ls.thuTucId == 91 ">
                                                       <div class="table-scrollable" style="height:100%; overflow-y:auto">
                                                            <table class="table table-striped table-bordered table-hover">
                                                                <thead style="background-color: rgb(53, 152, 220); color: white">
                                                                    <tr class="thead_blue">
                                                                        
                                                                        <th colspan="1" style="width:60px"> STT </th>
                                                                        <th class="text-center">Tài liệu công bố thay đổi/bổ sung (Mã hồ sơ: {{ls.maHoSo}} - Ngày tiếp nhận: {{ls.ngayTiepNhan | date:'dd/MM/yyyy'}} </th>
                                                                        <th class="text-center" style="width:120px">Xem </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody ng-repeat="item in ls.listTepDinhKem track by $index">
                                                                    <tr>
                                                                        

                                                                        <td colspan="1">{{item.stt}}</td>

                                                                        <td>
                                                                            {{item.moTaTep}}
                                                                        </td>
                                                                        <td class="text-center">
                                                                            <span class="btn green fileinput-button" ng-click="vm.openViewFile(item)">
                                                                                <span> Xem </span>
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                       </div>
                                                </div>
                                            </div>
                                        </div>                                       
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
            };
        }
    ]);
})();
(function () {
    MyApp.directive('frontend.sodangky.viewcongvan', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                if (app.urlCongVanCongBoGiaThuoc != "") {
                    vm.taiLieuDinhKemUrl = "/File/GoToViewTaiLieu?url=" + app.urlCongVanCongBoGiaThuoc + "#zoom=100";
                } else {
                    vm.taiLieuDinhKemUrl = "";
                }
                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="row form-group">
                            <div class="col-md-12">
                                <div class="portlet light bordered" style="height: 630px">
                                        <span ng-if="!vm.taiLieuDinhKemUrl || vm.taiLieuDinhKemUrl == ''">
                                    </span>
                                    <iframe ng-if='vm.taiLieuDinhKemUrl ||vm.taiLieuDinhKemUrl!=""' title="Xem tài liệu" style="width: 100%; height: 100%;border:0" ng-src="{{vm.trustSrc(vm.taiLieuDinhKemUrl)}}"  ></iframe>
                                </div>
                            </div>
                        </div>`,
            };
        }
    ]);
})();
(function () {
    MyApp.directive('frontend.congbothuoc.viewnguyenlieu', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                vm.nguyenLieuCongBo = app.danhSachNguyenLieu;
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="container-fluid">
                            <table class="table table-bordered table-hover">
                                <thead>
                                    <tr class="bg-blue font-white">
                                        <th class="text-center" style="width:40px">STT</th>
                                        <th>Tên nguyên liệu </th>
                                        <th width="100" class="text-center"> Phân loại </th>
                                        <th width="130" class="text-center"> Tiêu chuẩn </th>
                                        <th width="230" class="text-center"> Cơ sở sản xuất </th>
                                        <th class="text-center" style="width:200px"> Nước sản xuất </th>
                                        <th width="240" class="text-center"> Địa chỉ cơ sở sản xuất </th>
                                        <th class="text-center" style="width:200px"> Hoạt chất chuẩn </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr ng-repeat="ls in vm.nguyenLieuCongBo">
                                        <td class="text-center">{{$index + 1}}</td>
                                        <td>{{ls.tenNguyenLieu}}</td>
                                        <td ng-if="ls.phanLoai==0">Dược chất</td>
                                        <td ng-if="ls.phanLoai==1">Tá dược</td>
                                        <td ng-if="ls.phanLoai==2">Vỏ nang</td>
                                        <td class="text-center">{{ls.tieuChuanChatLuongNguyenLieu}}</td>
                                        <td>{{ls.tenCoSoSanXuatNguyenLieu}}</td>
                                        <td>{{ls.nuocSanXuatNguyenLieu}}</td>
                                        <td>{{ls.diaChiCoSoSanXuatNguyenLieu}}</td>
                                        <td>{{ls.tenHoatChatChuan}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>`,
            };
        }
    ]);
})();
(function () {
    MyApp.directive('frontend.sodangky.viewtailieu', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                if (app.urlTaiLieu != "") {
                    vm.taiLieuDinhKemUrl = "/File/GoToViewTaiLieu?url=" + app.urlTaiLieu + "#zoom=100";
                } else {
                    vm.taiLieuDinhKemUrl = "";
                }
                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="row form-group">
                            <div class="col-md-12">
                                <div class="portlet light bordered" style="height: 630px">
                                        <span ng-if="!vm.taiLieuDinhKemUrl || vm.taiLieuDinhKemUrl == ''">
                                    </span>
                                    <iframe ng-if='vm.taiLieuDinhKemUrl ||vm.taiLieuDinhKemUrl!=""' title="Xem tài liệu" style="width: 100%; height: 100%;border:0" ng-src="{{vm.trustSrc(vm.taiLieuDinhKemUrl)}}"  ></iframe>
                                </div>
                            </div>
                        </div>`,
            };
        }
    ]);
})();;
MyApp.controller('frontend.congbothuoccapnhatnhhsdk', [
    '$scope', '$sce', '$location', '$http', '$window', '$timeout', '$uibModal',
    function ($scope, $sce, $location, $http, $window, $timeout, $uibModal) {
        vm = this;
        vm.yearSelectorOptions = {
            start: "decade",
            depth: "decade"
        };

        var getThuocCongBoPagingService = (input, ajaxParams) => {
            return abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/soDangKy/GetAllPublicServerPaging',
                type: 'POST',
                data: JSON.stringify(input)
            }, ajaxParams));
        };
        //#region Tìm kiếm
        var chucnangTimKiem = () => {
            vm.isNangCaoFilter = false;
            vm.changeNangCaoFilter = ($event) => {
                vm.isNangCaoFilter = !vm.isNangCaoFilter;
                vm.filterAll = "";
                vm.filterCongBo = {};
            };
            $scope.$watch('vm.filterAll', function myfunction() {
                if (vm.filterAll != null && vm.filterAll != "") {
                    vm.isNangCaoFilter = false;
                    vm.filterCongBo = {};
                }
            })
            $scope.totalRow = 0;
            $scope.keyWord = "";
            vm.switchFilter = 0;
            vm.changeSwitchFilter = function ($event, d) {
                $('#search_concept').text($event.currentTarget.firstChild.text);
                vm.switchFilter = d;
            };
            vm.filterCongBo = {};
            vm.refreshFilter = function () {
                vm.filterAll = "";
                vm.filterCongBo = {};
                vm.filterCongBo.tieuChuanId = null;
                vm.filterCongBo.phanLoaiThuocEnum = null;
                vm.filterCongBo.ngayCapSoDangKy = null;
                vm.getGridData();
            };
        };
        //#endregion
        //#region Grid Data
        var gridThuocCongBo = () => {
            vm.refreshColumns = function () {
                vm.columns = [];
                var _colSTT = {
                    field: "stt",
                    title: app.localize('STT'),
                    template: "<div class='row-number text-center'></div>",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 50
                };
                var _colTaiLieu = {
                    title: app.localize('HDSD/Mẫu nhãn'),
                    template: `<div align='center'>
                                 <a href="" title="" style=" text-decoration: none;" ng-if='this.dataItem.thongTinTaiLieu.urlHuongDanSuDung.length>0 || this.dataItem.thongTinTaiLieu.urlNhan.length>0 || this.dataItem.thongTinTaiLieu.urlNhanVaHDSD.length>0' ng-click="vm.viewMauNhanVaHDSD(this.dataItem)"> <em class="fa fa-file-pdf-o"></em></a><br/>
                               </div>
                               `,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 90
                };
                var _colTenThuoc = {
                    field: "tenThuoc",
                    title: app.localize('Tên thuốc'),
                    template: `<div><strong ng-if='this.dataItem.vacXinSinhPham.loaiVacXin != null || this.dataItem.vacXinSinhPham.phongBenh != null'></strong>{{this.dataItem.tenThuoc}}</div>
                    <div ng-if='this.dataItem.vacXinSinhPham.phongBenh.trim().length>0' style=" font-size: 13px; color:green;"><em>(Phòng bệnh: {{this.dataItem.vacXinSinhPham.phongBenh}})</em></div>
                    `,
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 240
                };
                var _colSoDK = {
                    field: "soDangKy",
                    title: app.localize('Số GPLH'),
                    template: `<a href="" style="text - decoration: none; " title="Số đăng ký đã công bố" ng-click="vm.viewNguyenLieu(this.dataItem)">{{this.dataItem.soDangKy}}</a>`,
                    // <br/><a href="" ng-if="this.dataItem.isDaRutSoDangKy!=true" style="text-decoration: none; color: green; font-style: italic; font-size: 13px; " title="Số đăng ký còn hiệu lực">(Hiệu lực)</a><a ng-click="vm.viewCongVan(this.dataItem.thongTinRutSoDangKy.urlCongVanRutSoDangKy)" ng-if="this.dataItem.isDaRutSoDangKy==true" style="text-decoration: none; color: red; font-style: italic; font-size: 13px;  " title="Số đăng ký đã bị rút(Không còn hiệu lực)">(Đã rút số)</a>
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 120
                };
                var _colNgayHetHanSDK = {
                    field: "ngayHetHanSoDangKy",
                    title: app.localize('Ngày hết hạn SĐK'),
                    template: "{{this.dataItem.thongTinDangKyThuoc.ngayHetHanSoDangKy | date:'dd/MM/yyyy'}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 120
                };
                var _colBaoChe = {
                    field: "dangBaoChe",
                    title: app.localize('Dạng bào chế'),
                    template: "{{this.dataItem.thongTinThuocCoBan.dangBaoChe}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 300
                };
                var _colHoatChat = {
                    field: "hoatChatChinh",
                    title: app.localize('Hoạt chất'),
                    template: "{{this.dataItem.thongTinThuocCoBan.hoatChatChinh}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 300
                };
                var _colHamLuong = {
                    field: "hamLuong",
                    title: app.localize('Hàm lượng'),
                    template: "{{this.dataItem.thongTinThuocCoBan.hamLuong}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 140
                };
                var _colQuyCachDongGoi = {
                    field: "dongGoi",
                    title: app.localize('Quy cách đóng gói'),
                    template: "{{this.dataItem.thongTinThuocCoBan.dongGoi}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 270
                };
                var _colNgayCapSoDangKy = {
                    field: "ngayKK_KKL",
                    title: app.localize('Năm cấp'),
                    template: `{{this.dataItem.thongTinDangKyThuoc.ngayCapSoDangKy | date:'dd/MM/yyyy'}}<br/><a href="" ng-if="this.dataItem.isHetHan!=true" style="text-decoration: none; color: green; font-style: italic; font-size: 13px; " title="Ngày hết hạn số đăng ký">({{this.dataItem.thongTinDangKyThuoc.ngayHetHanSoDangKy!=null?(this.dataItem.thongTinDangKyThuoc.ngayHetHanSoDangKy | date:'dd/MM/yyyy'):'NA'}})</a><a title="Số đăng ký sắp hết hạn" ng-if="this.dataItem.isHetHan==true" style="text-decoration: none; color: red; font-style: italic; font-size: 13px;">({{this.dataItem.thongTinDangKyThuoc.ngayHetHanSoDangKy | date:'dd/MM/yyyy'}})</a>`,

                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 110
                };

                var _colSoQuyetDinh = {
                    field: "soQuyetDinh",
                    title: app.localize('Số quyết định'),
                    template: "{{this.dataItem.thongTinDangKyThuoc.soQuyetDinh}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 120
                };
                var _colDotCap = {
                    field: "dotCap",
                    title: app.localize('Đợt cấp'),
                    template: "{{this.dataItem.thongTinDangKyThuoc.dotCap}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 140
                };
                var _colTieuChuanChatLuong = {
                    field: "tieuChuan",
                    title: app.localize('Tiêu chuẩn'),
                    template: "{{this.dataItem.thongTinThuocCoBan.tieuChuan}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 110
                };
                var _colTuoiTho = {
                    field: "tuoiTho",
                    title: app.localize('Tuổi thọ'),
                    template: "{{this.dataItem.thongTinThuocCoBan.tuoiTho}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 100
                };
                var _colCongTyDangKy = {
                    title: "Thông tin công ty đăng ký",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    columns: [
                        {
                            field: "congTyDangKy.tenCongTyDangKy",
                            title: "Tên công ty",
                            width: "200px"
                        },
                        {
                            field: "congTyDangKy.nuocDangKy",
                            title: "Nước",
                            width: "120px"
                        },
                        {
                            field: "congTyDangKy.diaChiDangKy",
                            title: "Địa chỉ",
                            width: "200px"
                        }
                    ]
                };
                var _colCongTySanXuat = {
                    title: "Thông tin công ty sản xuất",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    columns: [
                        {
                            field: "congTySanXuat.tenCongTySanXuat",
                            title: "Tên công ty",
                            width: "200px"
                        },
                        {
                            field: "congTySanXuat.nuocSanXuat",
                            title: "Nước",
                            width: "120px"
                        },
                        {
                            field: "congTySanXuat.diaChiSanXuat",
                            title: "Địa chỉ",
                            width: "200px"
                        }
                    ]
                };
                var _colNgayHetHanSoDangKy = {
                    field: "ngayKK_KKL",
                    title: app.localize('Ngày hết hạn'),
                    template: "{{this.dataItem.thongTinDangKyThuoc.ngayHetHanSoDangKy | date:'dd/MM/yyyy'}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 130
                };
                var _colLichSu = {
                    title: '',
                    template: `<a href="" style="text-decoration:none;" title="Lịch sử công bố" ng-click="vm.viewLichSu(this.dataItem)"><em class="fa fa-history"></em></a>`,
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 30
                };
                var setColForForm = function () {
                    vm.columns = [_colLichSu, _colSTT, _colTaiLieu, _colSoDK, _colNgayHetHanSDK, _colTenThuoc, _colHoatChat, _colHamLuong, _colSoQuyetDinh, _colNgayCapSoDangKy, _colDotCap, _colBaoChe, _colQuyCachDongGoi, _colTieuChuanChatLuong, _colTuoiTho, _colCongTyDangKy, _colCongTySanXuat];
                };
                setColForForm();
                vm.columnGiaThuoc = vm.columns;
            };
            vm.refreshColumns();
            vm.requestParams = {
                skipCount: 0,
                maxResultCount: 10,
                sorting: null
            };
            vm.refreshDataSource = function () {
                vm.thuocCongBoDataSoure = [];
                vm.setDataSource = function () {
                    vm.thuocCongBoDataSoure = new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                $scope.totalRow = 0;
                                $scope.keyWord = "";
                                vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                                vm.requestParams.maxResultCount = options.data.pageSize;
                                var _req = {
                                    filterText: vm.filterAll,
                                    SoDangKyThuoc: vm.filterCongBo,
                                    KichHoat: true
                                };
                                switch (vm.switchFilter) {
                                    case 1:
                                        _req.SoDangKyThuoc.SoDangKy = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 2:
                                        _req.SoDangKyThuoc.TenThuoc = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 3:
                                        _req.SoDangKyThuoc.HoatChatChinh = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 4:
                                        _req.SoDangKyThuoc.SoQuyetDinh = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 5:
                                        _req.SoDangKyThuoc.DangBaoChe = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 6:
                                        _req.SoDangKyThuoc.TenCongTyDangKy = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 7:
                                        _req.SoDangKyThuoc.TenCongTySanXuat = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    default:
                                        _req.filterText = vm.filterAll;
                                        break;
                                }
                                _req.SoDangKyThuoc.isCapNhatNHHSDK = true;
                                getThuocCongBoPagingService($.extend(_req, vm.requestParams))
                                    .then(function (result) {
                                        options.success(result);
                                        $scope.totalRow = result.totalCount;
                                        $scope.keyWord = vm.filterAll;
                                        $scope.$apply();
                                        $scope.filter = {};
                                    });

                            }
                        },
                        pageSize: 15,
                        serverPaging: true,
                        serverSorting: true,
                        sortable: true,
                        schema: {
                            data: "items",
                            total: "totalCount"
                        }
                    });
                };
                vm.setDataSource();
            };
            vm.refreshDataSource();
            vm.thuocCongBoGridOptions = {
                pageable:
                {
                    "refresh": true,
                    "pageSizes": [5, 10, 15, 20, 50, 100],
                    messages: {
                        empty: "Không có dữ liệu",
                        display: "Hiển thị từ {0} đến {1}/{2} bản ghi",
                        itemsPerPage: "Bản ghi mỗi trang"
                    }
                },
                resizable: true,
                height: 800,
                scrollable: true,
                dataBound: function (e) {
                    var grid = this;
                    var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                    grid.tbody.find(".row-number").each(function () {
                        var index = record++;
                        $(this).html(index);
                    });
                    var rows = e.sender.tbody.children();
                    for (var j = 0; j < rows.length; j++) {
                        var row = $(rows[j]);
                        var dataItem = e.sender.dataItem(row);

                        var trangthai = dataItem.get("trangThai");
                        if (trangthai == 91) {
                            row.context.style.color = "red";
                        }

                    }
                },
                columns: vm.columnGiaThuoc
            };
            function isValidDate(s) {
                if (s != null && s.length > 0) {
                    var bits = s.split('/');
                    var d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
                    return !!(d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]));
                } else {
                    return true;
                }
            }
            vm.getGridData = function () {
                var date = vm.filterCongBo.ngayCapSoDangKy;
                if (date != 'undefined' && !isValidDate(date)) {
                    abp.notify.error("Năm cấp không đúng định dạng!");
                    return;
                } else {
                    vm.thuocCongBoDataSoure.read();
                }
            };
        };
        var initDataHistory = () => {
            vm.histories = [];
        };
        //#endregion 
        function init() {
            chucnangTimKiem();
            gridThuocCongBo();
            initDataHistory();
        };
        init();
        vm.viewCongVan = (url) => {
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn kiến nghị</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.sodangky.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn red" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
        vm.viewCongVanById = (id) => {
            var _id = parseInt(id);
            var f = vm.getByParentPagingServiceDS.filter(x => x.id == _id);
            var url = "";
            if (f.length > 0) {
                url = f[0].urlCongVanKienNghiDieuChinhGia;
            }
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn kiến nghị</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congbothuoc.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn red" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
        vm.viewLichSu = (d) => {
            abp.ui.setBusy();
            app.soDangKyId = d.id;
            app.danhSachLichSu = [];
            var getHistoryService = (soDangKyId, ajaxParams) => {
                return abp.ajax($.extend({
                    url: abp.appPath + 'api/services/app/davSoDangKyHistory/GetHistory' + abp.utils.buildQueryString([{ name: 'soDangKyId', value: soDangKyId }]) + '',
                    type: 'POST',
                    data: JSON.stringify({})
                }, ajaxParams));
            };
            if (app.soDangKyId > 0) {
                getHistoryService(app.soDangKyId)
                    .then(function (result) {
                        app.danhSachLichSu = result;
                        result.forEach((currentValue, index) => {
                            currentValue.ListNoiDungThayDoi = currentValue.contentJsonObj.ListNoiDungThayDoi;
                        });
                        var a = app.danhSachLichSu;
                        var modalInstance = $uibModal.open({
                            template: `
                                <div class="modal-header">
                                <span class="caption-subject bold uppercase">Lịch sử thay đổi thông tin số đăng ký</span>
                                </div>
                                <div class="modal-body">
                                <div frontend.congbothuoc.viewlichsuNHHSDK></div>
                                </div>
                                <div class="modal-footer">
                                <button class="btn red" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                                </div>
                                `,
                            size: 'lg',
                            windowClass: 'my-modal-popup',
                            resolve: {
                                thuoc: d
                            },
                            controller: ['$scope', '$uibModalInstance', 'thuoc', function ($scope, $uibModalInstance, thuoc) {
                                $scope.thuoc = thuoc;
                                app.IsNullOrEmpty = function (o) {
                                    f = false;
                                    if (typeof (o) === 'undefined') f = true;
                                    if (o == null) f = true;
                                    o = String(o);
                                    if (o == '') f = true;
                                    return f;
                                };
                                $scope.cancel = function () {
                                    $uibModalInstance.close();
                                };
                            }]
                        });
                    });
            }
        };
        vm.viewNguyenLieu = (d) => {
            app.soDangKyThuoc = d.soDangKy;
            app.danhSachNguyenLieu = [];
            var getNguyenLieuService = (d, ajaxParams) => {
                return abp.ajax($.extend({
                    url: abp.appPath + 'api/services/app/nguyenLieuLamThuoc/GetNguyenLieuTheoSoDangKy' + abp.utils.buildQueryString([{ name: 'soDangKy', value: d.soDangKy }]) + '',
                    type: 'POST',
                    data: JSON.stringify({}),
                }, ajaxParams));
            };
            if (app.soDangKyThuoc.length > 0) {
                getNguyenLieuService(d)
                    .then(function (result) {
                        app.danhSachNguyenLieu = result;
                        var modalInstance = $uibModal.open({
                            template: `
                                <div class="modal-header">
                                <span class="caption-subject bold uppercase">Danh sách nguyên liệu công bố</span>
                                </div>
                                <div class="modal-body">
                                <div frontend.congbothuoc.viewnguyenlieuNHHSDK></div>
                                </div>
                                <div class="modal-footer">
                                <button class="btn red" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                                </div>
                                `,
                            size: 'lg',
                            windowClass: 'my-modal-popup',
                            resolve: {
                                thuoc: d
                            },
                            controller: ['$scope', '$uibModalInstance', 'thuoc', function ($scope, $uibModalInstance, thuoc) {
                                $scope.thuoc = thuoc;
                                app.IsNullOrEmpty = function (o) {
                                    var f = false;
                                    if (typeof (o) === 'undefined') f = true;
                                    if (o == null) f = true;
                                    o = String(o);
                                    if (o == '') f = true;
                                    return f;
                                };
                                $scope.cancel = function () {
                                    $uibModalInstance.close();
                                };
                            }]
                        });
                        abp.ui.clearBusy();
                    });
            }
        };
        vm.viewMauNhanVaHDSD = (item) => {
            var modalInstance = $uibModal.open({
                template: `
                        <div class="attp-xem-ho-so">
                            <div class="modal-header">
                                <h4 class="modal-title text-center text-uppercase">
                                    Xem chi tiết
                                </h4>
                            </div>
                            <div class="modal-body">
                                <uib-tabset class="tab-container tabbable-line" active="activeIndex">
                                    <uib-tab index="1" heading="Hướng dẫn sử dụng" ng-if="sodangky.thongTinTaiLieu.urlHuongDanSuDung.length > 0">
                                        <div style="height: 630px">
                                            <iframe title="HƯỚNG DẪN SỬ DỤNG" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(huongDanSuDung)}}"></iframe>
                                        </div>
                                    </uib-tab>
                                    <uib-tab index="2" heading="Mẫu nhãn" ng-if="sodangky.thongTinTaiLieu.urlNhan.length > 0">
                                        <div style="height: 630px">
                                            <iframe title="MẪU NHÃN" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(mauNhan)}}"></iframe>
                                        </div>
                                    </uib-tab>
                                    <uib-tab index="3" heading="File tổng hợp mẫu nhãn và HDSD" ng-if="sodangky.thongTinTaiLieu.urlNhanVaHDSD.length > 0">
                                        <div style="height: 630px">
                                            <iframe title="MẪU NHÃN VÀ HDSD" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(nhanVahuongDanSuDung)}}"></iframe>
                                        </div>
                                    </uib-tab>
                                </uib-tabset>
                            </div>
                            <div class="modal-footer">
                                <button class="btn red" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                            </div>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    soDangKy: item
                },
                controller: ['$scope', '$uibModalInstance', '$sce', 'soDangKy', function ($scope, $uibModalInstance, $sce, soDangKy) {
                    $scope.activeIndex = 1;
                    $scope.sodangky = {};
                    $scope.sodangky = soDangKy;
                    $scope.huongDanSuDung = "/File/GoToViewTaiLieu?url=" + $scope.sodangky.thongTinTaiLieu.urlHuongDanSuDung + "#zoom=100";
                    $scope.mauNhan = "/File/GoToViewTaiLieu?url=" + $scope.sodangky.thongTinTaiLieu.urlNhan + "#zoom=100";
                    $scope.nhanVahuongDanSuDung = "/File/GoToViewTaiLieu?url=" + $scope.sodangky.thongTinTaiLieu.urlNhanVaHDSD + "#zoom=100";

                    //Function
                    {
                        app.IsNullOrEmpty = function (o) {
                            var f = false;
                            if (typeof (o) === 'undefined') f = true;
                            if (o == null) f = true;
                            o = String(o);
                            if (o == '') f = true;
                            return f;
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.close();
                        };
                        var init = function () {
                        }
                        init();
                        $scope.trustSrc = function (src) {
                            return $sce.trustAsResourceUrl(src);
                        };
                    }
                }]
            });
        };
        vm.viewTaiLieu = (url, title) => {
            app.urlTaiLieu = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">{{titleFile}}</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.sodangky.viewtailieu ng-if='isTonTaiFile'></div>
                        <div ng-if='!isTonTaiFile'> Tệp không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn red" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileTaiLieu: { urlDuongDanTaiLieu: url, title: title }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileTaiLieu', function ($scope, $uibModalInstance, urlFileTaiLieu) {
                    $scope.urlFileTaiLieu = urlFileTaiLieu.urlDuongDanTaiLieu;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.titleFile = urlFileTaiLieu.title;
                    $scope.isTonTaiFile = !app.IsNullOrEmpty(urlFileTaiLieu.urlDuongDanTaiLieu);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
    }
]);
(function () {
    MyApp.directive('frontend.congbothuoc.viewlichsuNHHSDK', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                vm.lichSuThayDoi = app.danhSachLichSu;
                vm.srcQuyetDinh = function (src) {
                    return "/File/GoToViewTaiLieu?url=" + src + "#zoom=100";
                };
                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="container-fluid">
                        <div class="row form-group">
                            <div class="col-md-12">
                                <div class="timeline">
                                    <div class="timeline-item" ng-repeat="ls in vm.lichSuThayDoi">
                                        <div class="timeline-badge">
                                            <div class="timeline-icon">
                                                <em class="fa fa-history" ng-class="$index==0? 'font-green-haze':'font-red'"></em>
                                            </div>
                                        </div>
                                        <div class="timeline-body">
                                            <div class="timeline-body-arrow"> </div>
                                            <div class="timeline-body-content" style="margin-top: 0px;">
                                            <div class="portlet light" style="margin-bottom: 0px;">
                                            <div class="portlet-title tabbable-line">
                                                <div class="caption" ng-if="ls.thuTucId == 84">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta">Lúc {{ls.ngaySuaDoi | date :'dd/MM/yyyy HH:mm'}} - Đính chính bổ sung thông tin theo quyết định cấp số đăng ký</span>
                                                </div>
                                                <div class="caption" ng-if="ls.thuTucId == 88">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta">Lúc {{ls.ngaySuaDoi | date :'dd/MM/yyyy HH:mm'}} - Duy trì hiệu lực 12 tháng số đăng ký lưu hành</span>
                                                </div>
                                                <div class="caption" ng-if="ls.thuTucId == 91">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta">Lúc {{ls.ngaySuaDoi | date :'dd/MM/yyyy HH:mm'}} - Đăng ký thay đổi bổ sung thông tin thuốc, nguyên liệu làm thuốc</span>
                                                </div>
                                                <div class="caption" ng-if="ls.thuTucId == null">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta">Lúc {{ls.ngaySuaDoi | date :'dd/MM/yyyy HH:mm'}} Hệ thống thay đổi thông tin - Lý do: {{ls.contentJsonObj.LyDoSuaDoi}}</span>
                                                </div>
                                                <ul class="nav nav-tabs"  ng-if="ls.contentJsonObj.ThongTinDangKyThuoc.SoQuyetDinh.length>0">
                                                    <li class="active">
                                                        <a href="#portlet_taba{{ls.id}}" data-toggle="tab" aria-expanded="true"> SỐ ĐĂNG KÝ </a>
                                                    </li>
                                                    <li class="">
                                                        <a href="#portlet_tabb{{ls.id}}" data-toggle="tab" aria-expanded="false"> QUYẾT ĐỊNH </a>
                                                    </li>                                       
                                                </ul>
                                            </div>
                                            <div class="portlet-body">
                                                <div class="tab-content" style="padding:0">
                                                    <div class="tab-pane active" id="portlet_taba{{ls.id}}">
                                                    
                                                <table class="table table-bordered table-hover">
                                                    <thead>
                                                        <tr class="bg-blue font-white">
                                                            <th class="text-center">Số GPLH </th>
                                                            <th class="text-center" style="width:200px"> Tên thuốc </th>
                                                            <th class="text-center" style="width:200px"> Hoạt chất</th>
                                                            <th class="text-center" style="width:200px"> Hàm lượng </th>
                                                            <th class="text-center" style="width:200px"> Số quyết định </th>
                                                            <th class="text-center" style="width:200px"> Năm cấp </th>
                                                            <th class="text-center" style="width:200px"> Đợt cấp </th>
                                                            <th class="text-center" style="width:200px"> Dạng bào chế </th>
                                                            <th class="text-center" style="width:200px"> Quy cách đóng gói</th>
                                                            <th class="text-center" style="width:200px"> Tiêu chuẩn </th>
                                                            <th class="text-center"> Tuổi thọ </th>
                                                      
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td class="text-center">
                                                                {{ls.contentJsonObj.SoDangKy}}
                                                            </td>
                                                            <td>
                                                            {{ls.contentJsonObj.TenThuoc}}
                                                            </td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.HoatChatChinh}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.HamLuong}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinDangKyThuoc.SoQuyetDinh}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinDangKyThuoc.NgayCapSoDangKy | date :'dd/MM/yyyy'}}</td>
                                                            <td class="text-center">{{ls.contentJsonObj.ThongTinDangKyThuoc.DotCap}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.DangBaoChe}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.DongGoi}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.TieuChuan}}</td>
                                                            <td class="text-center">{{ls.contentJsonObj.ThongTinThuocCoBan.TuoiTho}}</td>
                                                          
                                                        </tr>
                                                        <tr>
                                                        <td colspan="11">
                                                            <form class="form-horizontal" role="form" ng-if="ls.thuTucId != 91">
                                                            <div class="form-body">
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Công ty đăng ký</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTyDangKy.TenCongTyDangKy}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Địa chỉ  công ty đăng ký, nước đăng ký</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTyDangKy.DiaChiDangKy}}, {{ls.contentJsonObj.CongTyDangKy.NuocDangKy}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Công ty sản xuất</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTySanXuat.TenCongTySanXuat}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Địa chỉ công ty sản xuất, nước sản xuất</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTySanXuat.DiaChiSanXuat}}, {{ls.contentJsonObj.CongTySanXuat.NuocSanXuat}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            </div>
                                                            </form>
                                                            <div>
                                                            <table class="table table-bordered table-hover" ng-if="ls.thuTucId == 91 && ls.contentJsonObj.ListNoiDungThayDoi != null && (ls.contentJsonObj.IsLuongCapNhat == null ||(ls.contentJsonObj.IsLuongCapNhat == true && ls.contentJsonObj.KetQua ==201)) " style="margin-bottom: 0px;">
                                                                <thead class="bg-blue-madison font-white">
                                                                      <tr>
                                                                        <th style="vertical-align:middle;width: 160px;" class="text-center" colspan="4"> Thông tin thay đổi/bổ sung </th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th style="vertical-align:middle;width: 160px;" class="text-center"> Nội dung thay đổi, bổ sung </th>
                                                                        <th style="vertical-align:middle;width: 250px;" class="text-center"> Thông tin đã duyệt </th>
                                                                        <th style="vertical-align:middle;width: 250px;" class="text-center" ng-if="ls.contentJsonObj.IsLuongCapNhat != true"> Thông tin đề nghị thay đổi, bổ sung
                                                                        </th>
                                                                         <th style="vertical-align:middle;width: 250px;" class="text-center" ng-if="ls.contentJsonObj.IsLuongCapNhat != true"> Lý do thay đổi </th>
                                                                        <th style="vertical-align:middle;width: 250px;" class="text-center" ng-if="ls.contentJsonObj.IsLuongCapNhat == true"> Thông tin để nghị thay đổi, bổ sung đã được phê duyệt </th>
                                                                        <th style="vertical-align:middle;width: 250px;" class="text-center" ng-if="ls.contentJsonObj.IsLuongCapNhat == true"> Công văn phê duyệt của cục quản lý dược </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody ng-repeat="item in ls.contentJsonObj.ListNoiDungThayDoi">
                                                                    <tr>
                                                                       
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.Thuoc.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Tên thuốc
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.Thuoc.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.Thuoc.ThayDoi}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.Thuoc.LyDoThayDoi}}</td>
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.HoatChat.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Hoạt chất
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.HoatChat.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.HoatChat.ThayDoi}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.HoatChat.LyDoThayDoi}}</td>
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.HamLuong.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Hàm lượng
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.HamLuong.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.HamLuong.ThayDoi}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.HamLuong.LyDoThayDoi}}</td>
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.DangBaoChe.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Dạng bào chế
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.DangBaoChe.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.DangBaoChe.ThayDoi}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.DangBaoChe.LyDoThayDoi}}</td>
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.DongGoi.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Quy cách đóng gói
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.DongGoi.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.DongGoi.ThayDoi}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.DongGoi.LyDoThayDoi}}</td>
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.TieuChuan.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Tiêu chuẩn
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.TieuChuan.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.TieuChuan.ThayDoi}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.TieuChuan.LyDoThayDoi}}</td>
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.TuoiTho.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Tuổi thọ
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.TuoiTho.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.TuoiTho.ThayDoi}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.TuoiTho.LyDoThayDoi}}</td>
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.CongTyDangKy.TenCongTy.IsSua">
                                                                                        <td style="vertical-align:middle;width: 100px;">
                                                                                            <span>
                                                                                                Tên công ty đăng ký
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.TenCongTy.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.TenCongTy.ThayDoi}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.TenCongTy.LyDoThayDoi}}</td>
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.CongTyDangKy.Nuoc.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Nước đăng ký
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.Nuoc.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.Nuoc.ThayDoi}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.Nuoc.LyDoThayDoi}}</td>
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.CongTyDangKy.DiaChi.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Địa chỉ đăng ký
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.DiaChi.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.DiaChi.ThayDoi}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.DiaChi.LyDoThayDoi}}</td>
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.CongTySanXuat.TenCongTy.IsSua">
                                                                                        <td style="vertical-align:middle;width: 100px;">
                                                                                            <span>
                                                                                                Tên công ty sản xuất
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.TenCongTy.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.TenCongTy.ThayDoi}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.TenCongTy.LyDoThayDoi}}</td>
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.CongTySanXuat.Nuoc.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Nước sản xuất
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.Nuoc.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.Nuoc.ThayDoi}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.Nuoc.LyDoThayDoi}}</td>
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.CongTySanXuat.DiaChi.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Địa chỉ sản xuất
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.DiaChi.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.DiaChi.ThayDoi}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.DiaChi.LyDoThayDoi}}</td>
                                                                                    </tr>
                                                                                </tbody>

                                                                                <tbody
                                                                                    ng-if="item.isThayDoiThongTinKhac && item.ListNoiDungThayDoiThongTinKhac && item.ListNoiDungThayDoiThongTinKhac.length > 0">
                                                                                    <tr ng-repeat="itemTD in item.ListNoiDungThayDoiThongTinKhac track by $index">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span> {{itemTD.StrNoiDungThayDoi}}</span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">{{itemTD.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">{{itemTD.ThayDoi}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">{{itemTD.LyDoThayDoi}}</td>
                                                                                    </tr>
                                                                       
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            </div>
                                                        </td>                                                           
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <span class="font-grey-cascade margin-bottom-15" ng-if="ls.contentJsonObj.LyDoSuaDoi && ls.thuTucId != 91">
                                                    <strong>Lý do sửa: </strong><span>{{ls.contentJsonObj.LyDoSuaDoi}}</span>
                                                </span>
                                            </div>
                                            <div class="tab-pane" id="portlet_tabb{{ls.id}}">
                                                <div ng-if="ls.thuTucId == 88 || ls.thuTucId == 84">
                                                   <iframe ng-if='ls.contentJsonObj.ThongTinDangKyThuoc.UrlSoQuyetDinh.length>0' title="Xem tài liệu" style="width: 100%; height: 600px;border:0" ng-src="{{vm.trustSrc(vm.srcQuyetDinh(ls.contentJsonObj.ThongTinDangKyThuoc.UrlSoQuyetDinh))}}"  ></iframe>
                                                </div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
            };
        }
    ]);
})();
(function () {
    MyApp.directive('frontend.sodangky.viewcongvan', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                if (app.urlCongVanCongBoGiaThuoc != "") {
                    vm.taiLieuDinhKemUrl = "/File/GoToViewTaiLieu?url=" + app.urlCongVanCongBoGiaThuoc + "#zoom=100";
                } else {
                    vm.taiLieuDinhKemUrl = "";
                }
                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="row form-group">
                            <div class="col-md-12">
                                <div class="portlet light bordered" style="height: 630px">
                                        <span ng-if="!vm.taiLieuDinhKemUrl || vm.taiLieuDinhKemUrl == ''">
                                    </span>
                                    <iframe ng-if='vm.taiLieuDinhKemUrl ||vm.taiLieuDinhKemUrl!=""' title="Xem tài liệu" style="width: 100%; height: 100%;border:0" ng-src="{{vm.trustSrc(vm.taiLieuDinhKemUrl)}}"  ></iframe>
                                </div>
                            </div>
                        </div>`,
            };
        }
    ]);
})();
(function () {
    MyApp.directive('frontend.congbothuoc.viewnguyenlieuNHHSDK', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                vm.nguyenLieuCongBo = app.danhSachNguyenLieu;
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="container-fluid">
                            <table class="table table-bordered table-hover">
                                <thead>
                                    <tr class="bg-blue font-white">
                                        <th class="text-center" style="width:40px">STT</th>
                                        <th>Tên nguyên liệu </th>
                                        <th width="100" class="text-center"> Phân loại </th>
                                        <th width="130" class="text-center"> Tiêu chuẩn </th>
                                        <th width="230" class="text-center"> Cơ sở sản xuất </th>
                                        <th class="text-center" style="width:200px"> Nước sản xuất </th>
                                        <th width="240" class="text-center"> Địa chỉ cơ sở sản xuất </th>
                                        <th class="text-center" style="width:200px"> Hoạt chất chuẩn </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr ng-repeat="ls in vm.nguyenLieuCongBo">
                                        <td class="text-center">{{$index + 1}}</td>
                                        <td>{{ls.tenNguyenLieu}}</td>
                                        <td ng-if="ls.phanLoai==0">Dược chất</td>
                                        <td ng-if="ls.phanLoai==1">Tá dược</td>
                                        <td ng-if="ls.phanLoai==2">Vỏ nang</td>
                                        <td class="text-center">{{ls.tieuChuanChatLuongNguyenLieu}}</td>
                                        <td>{{ls.tenCoSoSanXuatNguyenLieu}}</td>
                                        <td>{{ls.nuocSanXuatNguyenLieu}}</td>
                                        <td>{{ls.diaChiCoSoSanXuatNguyenLieu}}</td>
                                        <td>{{ls.tenHoatChatChuan}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>`,
            };
        }
    ]);
})();
(function () {
    MyApp.directive('frontend.sodangky.viewtailieu', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                if (app.urlTaiLieu != "") {
                    vm.taiLieuDinhKemUrl = "/File/GoToViewTaiLieu?url=" + app.urlTaiLieu + "#zoom=100";
                } else {
                    vm.taiLieuDinhKemUrl = "";
                }
                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="row form-group">
                            <div class="col-md-12">
                                <div class="portlet light bordered" style="height: 630px">
                                        <span ng-if="!vm.taiLieuDinhKemUrl || vm.taiLieuDinhKemUrl == ''">
                                    </span>
                                    <iframe ng-if='vm.taiLieuDinhKemUrl ||vm.taiLieuDinhKemUrl!=""' title="Xem tài liệu" style="width: 100%; height: 100%;border:0" ng-src="{{vm.trustSrc(vm.taiLieuDinhKemUrl)}}"  ></iframe>
                                </div>
                            </div>
                        </div>`,
            };
        }
    ]);
})();;
MyApp.controller('frontend.congbothuockhongkedon', [
    '$scope', '$sce', '$location', '$http', '$window', '$timeout', '$uibModal',
    function ($scope, $sce, $location, $http, $window, $timeout, $uibModal) {
        vm = this;
        vm.yearSelectorOptions = {
            start: "decade",
            depth: "decade"
        };

        var getThuocCongBoPagingService = (input, ajaxParams) => {
            return abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/soDangKy/GetAllPublicServerPaging',
                type: 'POST',
                data: JSON.stringify(input)
            }, ajaxParams));
        };
        //var getPermissions = function () {
        //    var isPermission = abp.ajax($.extend({
        //        url: abp.appPath + 'api/services/app/soDangKy/GetPermissionByName',
        //        type: 'POST',
        //        data: "{name:'Pages.VanChuyenHoSoPDK.XuatExcelTraCuuSDK'}"
        //    }, null)).then(function (result) {
        //        vm.excelPermission = result;
        //    });;
        //}
        //getPermissions();

        var getRoleLevel = function () {
            var roleLevel = abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/soDangKy/GetRoleLevel',
                type: 'POST',
                data: ""
            }, null)).then(function (result) {
                vm.roleLevel = result;
            });
        }
        getRoleLevel();
        vm.xuatExel = function () {
            var result = abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/soDangKy/GetAllPublicServerPaging',
                type: 'POST',
                data: JSON.stringify(input)
            }, ajaxParams));
            app.downloadTempFile(result.data);
        }
        //#region Tìm kiếm
        var chucnangTimKiem = () => {
            vm.isNangCaoFilter = false;
            vm.changeNangCaoFilter = ($event) => {
                vm.isNangCaoFilter = !vm.isNangCaoFilter;
                vm.filterAll = "";
                vm.filterCongBo = {};
            };
            $scope.$watch('vm.filterAll', function myfunction() {
                if (vm.filterAll != null && vm.filterAll != "") {
                    vm.isNangCaoFilter = false;
                    vm.filterCongBo = {};
                }
            })
            $scope.totalRow = 0;
            $scope.keyWord = "";
            vm.switchFilter = 0;
            vm.changeSwitchFilter = function ($event, d) {
                $('#search_concept').text($event.currentTarget.firstChild.text);
                vm.switchFilter = d;
            };
            vm.filterCongBo = {};
            vm.refreshFilter = function () {
                vm.filterAll = "";
                vm.filterCongBo = {};
                vm.filterCongBo.tieuChuanId = null;
                vm.filterCongBo.phanLoaiThuocEnum = null;
                vm.filterCongBo.ngayCapSoDangKy = null;
                vm.filterCongBo.thongTinThuocCoBan_LoaiThuocId = 1;
                vm.filterCongBo.thongTinThuocCoBan_NhomThuocId = null;
                vm.getGridData();
            };
        };
        //#endregion
        //#region Grid Data
        var gridThuocCongBo = () => {
            vm.refreshColumns = function () {
                vm.columns = [];
                var _colSTT = {
                    field: "stt",
                    title: app.localize('STT'),
                    template: "<div class='row-number text-center'></div>",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 50
                };
                var _colTaiLieu = {
                    title: app.localize('HDSD/Mẫu nhãn'),
                    template: `<div align='center'>
                                 <a href="" title="" style=" text-decoration: none;" ng-if='this.dataItem.thongTinTaiLieu.urlHuongDanSuDung.length>0 || this.dataItem.thongTinTaiLieu.urlNhan.length>0 || this.dataItem.thongTinTaiLieu.urlNhanVaHDSD.length>0 || this.dataItem.thongTinTaiLieu.jsonTaiLieuTCCL.length>0' ng-click="vm.viewMauNhanVaHDSD(this.dataItem)"> <em class="fa fa-file-pdf-o"></em></a><br/>
                               </div>
                               `,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 90
                };
                var _colTenThuoc = {
                    field: "tenThuoc",
                    title: app.localize('Tên thuốc'),
                    template: `<div><strong ng-if='this.dataItem.vacXinSinhPham.loaiVacXin != null || this.dataItem.vacXinSinhPham.phongBenh != null'></strong>{{this.dataItem.tenThuoc}}</div>
                    <div ng-if='this.dataItem.vacXinSinhPham.phongBenh.trim().length>0' style=" font-size: 13px; color:green;"><em>(Phòng bệnh: {{this.dataItem.vacXinSinhPham.phongBenh}})</em></div>
                    `,
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 240
                };
                var _colSoDK = {
                    field: "soDangKy",
                    title: app.localize('Số GPLH'),
                    template: `<a href="" style="text - decoration: none; " title="Số đăng ký đã công bố" ng-click="vm.viewNguyenLieu(this.dataItem)">{{this.dataItem.soDangKy}}</a>
                    <br/>
                    <a href="" ng-if="this.dataItem.isDaRutSoDangKy!=true" style="text-decoration: none; color: green; font-style: italic; font-size: 13px; " title="Số đăng ký còn hiệu lực">(Hiệu lực)</a>
                    <a href="" ng-if="this.dataItem.isDaRutSoDangKy==true" style="text-decoration: none; color: red; font-style: italic; font-weight: bold; font-size: 13px;  " title="Số đăng ký đã bị thu hồi (Không còn hiệu lực)">(Đã thu hồi)</a>
                    <br/><a href="" ng-if="this.dataItem.soDangKyCu && this.dataItem.soDangKy != this.dataItem.soDangKyCu" style="text-decoration: none; color: green; font-style: italic; font-size: 13px; " title="Số đăng ký cũ">(SĐK cũ: {{this.dataItem.soDangKyCu}})</a>`,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 140
                };
                var _colNgayHetHanSDK = {
                    field: "ngayHetHanSoDangKy",
                    title: app.localize('Ngày hết hạn SĐK'),
                    template: "{{this.dataItem.thongTinDangKyThuoc.ngayHetHanSoDangKy | date:'dd/MM/yyyy'}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 120
                };
                var _colBaoChe = {
                    field: "dangBaoChe",
                    title: app.localize('Dạng bào chế'),
                    template: "{{this.dataItem.thongTinThuocCoBan.dangBaoChe}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 300
                };
                var _colHoatChat = {
                    field: "hoatChatChinh",
                    title: app.localize('Hoạt chất'),
                    template: "{{this.dataItem.thongTinThuocCoBan.hoatChatChinh}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 300
                };
                var _colHamLuong = {
                    field: "hamLuong",
                    title: app.localize('Hàm lượng'),
                    template: "{{this.dataItem.thongTinThuocCoBan.hamLuong}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 140
                };
                var _colQuyCachDongGoi = {
                    field: "dongGoi",
                    title: app.localize('Quy cách đóng gói'),
                    template: "{{this.dataItem.thongTinThuocCoBan.dongGoi}}",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 270
                };
                var _colNgayCapSoDangKy = {
                    field: "ngayKK_KKL",
                    title: app.localize('Năm cấp'),
                    template: `{{this.dataItem.thongTinDangKyThuoc.ngayCapSoDangKy | date:'dd/MM/yyyy'}}<br/><a href="" ng-if="this.dataItem.isHetHan!=true" style="text-decoration: none; color: green; font-style: italic; font-size: 13px; " title="Ngày hết hạn số đăng ký">({{this.dataItem.thongTinDangKyThuoc.ngayHetHanSoDangKy!=null?(this.dataItem.thongTinDangKyThuoc.ngayHetHanSoDangKy | date:'dd/MM/yyyy'):'NA'}})</a><a title="Số đăng ký sắp hết hạn" ng-if="this.dataItem.isHetHan==true" style="text-decoration: none; color: red; font-style: italic; font-size: 13px;">({{this.dataItem.thongTinDangKyThuoc.ngayHetHanSoDangKy | date:'dd/MM/yyyy'}})</a>`,

                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 110
                };

                var _colSoQuyetDinh = {
                    field: "soQuyetDinh",
                    title: app.localize('Số quyết định'),
                    template: "{{this.dataItem.thongTinDangKyThuoc.soQuyetDinh}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 120
                };
                var _colDotCap = {
                    field: "dotCap",
                    title: app.localize('Đợt cấp'),
                    template: "{{this.dataItem.thongTinDangKyThuoc.dotCap}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 140
                };
                var _colTieuChuanChatLuong = {
                    field: "tieuChuan",
                    title: app.localize('Tiêu chuẩn'),
                    template: "{{this.dataItem.thongTinThuocCoBan.tieuChuan}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 110
                };
                var _colTuoiTho = {
                    field: "tuoiTho",
                    title: app.localize('Tuổi thọ'),
                    template: "{{this.dataItem.thongTinThuocCoBan.tuoiTho}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 100
                };
                var _colCongTyDangKy = {
                    title: "Thông tin công ty đăng ký",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    columns: [
                        {
                            field: "congTyDangKy.tenCongTyDangKy",
                            title: "Tên công ty",
                            width: "200px"
                        },
                        {
                            field: "congTyDangKy.nuocDangKy",
                            title: "Nước",
                            width: "120px"
                        },
                        {
                            field: "congTyDangKy.diaChiDangKy",
                            title: "Địa chỉ",
                            width: "200px"
                        }
                    ]
                };
                var _colCongTySanXuat = {
                    title: "Thông tin công ty sản xuất",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    columns: [
                        {
                            field: "congTySanXuat.tenCongTySanXuat",
                            title: "Tên công ty",
                            width: "200px"
                        },
                        {
                            field: "congTySanXuat.nuocSanXuat",
                            title: "Nước",
                            width: "120px"
                        },
                        {
                            field: "congTySanXuat.diaChiSanXuat",
                            title: "Địa chỉ",
                            width: "200px"
                        }
                    ]
                };
                var _colNgayHetHanSoDangKy = {
                    field: "ngayKK_KKL",
                    title: app.localize('Ngày hết hạn'),
                    template: "{{this.dataItem.thongTinDangKyThuoc.ngayHetHanSoDangKy | date:'dd/MM/yyyy'}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 130
                };
                var _colLichSu = {
                    title: '',
                    template: `<a href="" title="Lịch sử công bố" ng-click="vm.viewLichSu(this.dataItem)">Lịch sử</a>`,
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 65
                };
                var _colThongTinGiaHan = {
                    title: "Thông tin hồ sơ gia hạn",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    columns: [
                        {
                            title: "Mã hồ sơ gia hạn",
                            width: "130px",
                            attributes: { class: "text-center" },
                            template: `<a style="text-decoration:none;" title="Xem giấy tiếp nhận">
                                        {{this.dataItem.maSoHoSoGiaHan}}
                                       </a>`,
                        },
                        {
                            title: "Ngày tiếp nhận hồ sơ gia hạn",
                            width: "120px",
                            attributes: { class: "text-center" },
                            template: `{{this.dataItem.ngayTiepNhanHSGiaHan | date:'dd/MM/yyyy'}}`,
                        },
                    ]
                };
                var _colDuocPhep = {
                    title: '',
                    headerTemplate: '<span>Được tiếp tục sử dụng GĐKLH </span><span style="color:red">(*)</span>',
                    template: `<em ng-if="dataItem.isDuocPhep" class="fa fa-check fa-3 font-green-meadow" aria - hidden="true" ></em >`,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 150
                };

                var _colTaiLieuDinhKem = {
                    title: 'Tài liệu công bố thay đổi bổ sung',
                    template: `<a href="/ViewTaiLieu/Index?SoDangKyId={{this.dataItem.id}}" style="text-decoration:none;" title="Xem tài liệu đính kèm">Xem chi tiết</a>`,
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 270
                };
                var setColForForm = function () {
                    vm.columns = [_colLichSu, _colSTT, _colTaiLieu, _colSoDK, _colNgayHetHanSDK, _colTenThuoc, _colThongTinGiaHan, _colDuocPhep, _colHoatChat, _colHamLuong, _colSoQuyetDinh, _colNgayCapSoDangKy, _colDotCap, _colBaoChe, _colQuyCachDongGoi, _colTieuChuanChatLuong, _colTuoiTho, _colCongTyDangKy, _colCongTySanXuat, _colTaiLieuDinhKem];
                };
                setColForForm();
                vm.columnGiaThuoc = vm.columns;

            };
            vm.refreshColumns();
            vm.requestParams = {
                skipCount: 0,
                maxResultCount: 10,
                sorting: null
            };
            vm.refreshDataSource = function () {

                vm.thuocCongBoDataSoure = [];
                vm.setDataSource = function () {
                    vm.thuocCongBoDataSoure = new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                $scope.totalRow = 0;
                                $scope.keyWord = "";
                                vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                                vm.requestParams.maxResultCount = options.data.pageSize;
                                vm.filterCongBo.thongTinThuocCoBan_LoaiThuocId = 1;
                                var _req = {
                                    filterText: vm.filterAll,
                                    SoDangKyThuoc: vm.filterCongBo,
                                    KichHoat: true
                                };
                                switch (vm.switchFilter) {
                                    case 1:
                                        _req.SoDangKyThuoc.SoDangKy = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 2:
                                        _req.SoDangKyThuoc.TenThuoc = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 3:
                                        _req.SoDangKyThuoc.HoatChatChinh = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 4:
                                        _req.SoDangKyThuoc.SoQuyetDinh = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 5:
                                        _req.SoDangKyThuoc.DangBaoChe = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 6:
                                        _req.SoDangKyThuoc.TenCongTyDangKy = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 7:
                                        _req.SoDangKyThuoc.TenCongTySanXuat = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    default:
                                        _req.filterText = vm.filterAll;
                                        break;
                                }
                                getThuocCongBoPagingService($.extend(_req, vm.requestParams))
                                    .then(function (result) {
                                        options.success(result);
                                        $scope.totalRow = result.totalCount;
                                        $scope.keyWord = vm.filterAll;
                                        $scope.$apply();
                                        $scope.filter = {};
                                    });

                            }
                        },
                        pageSize: 10,
                        serverPaging: true,
                        serverSorting: true,
                        sortable: true,
                        schema: {
                            data: "items",
                            total: "totalCount"
                        }
                    });
                };
                vm.setDataSource();
            };
            vm.refreshDataSource();
            vm.thuocCongBoGridOptions = {
                pageable:
                {
                    "refresh": true,
                    "pageSizes": [5, 10, 15, 20],
                    messages: {
                        empty: "Không có dữ liệu",
                        display: "Hiển thị từ {0} đến {1}/{2} bản ghi",
                        itemsPerPage: "Bản ghi mỗi trang"
                    }
                },
                resizable: true,
                height: 800,
                scrollable: true,
                dataBound: function (e) {
                    var grid = this;
                    var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                    grid.tbody.find(".row-number").each(function () {
                        var index = record++;
                        $(this).html(index);
                    });
                    var rows = e.sender.tbody.children();
                    for (var j = 0; j < rows.length; j++) {
                        var row = $(rows[j]);
                        var dataItem = e.sender.dataItem(row);

                        var trangthai = dataItem.get("trangThai");
                        if (trangthai == 91) {
                            row.context.style.color = "red";
                        }

                    }
                },
                columns: vm.columnGiaThuoc
            };
            function isValidDate(s) {
                if (s != null && s.length > 0) {
                    var bits = s.split('/');
                    var d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
                    return !!(d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]));
                } else {
                    return true;
                }
            }
            vm.getGridData = function () {
                var date = vm.filterCongBo.ngayCapSoDangKy;
                if (date != 'undefined' && !isValidDate(date)) {
                    abp.notify.error("Năm cấp không đúng định dạng!");
                    return;
                } else {
                    vm.thuocCongBoDataSoure.read();
                }
            };
            vm.viewGiayTiepNhan = (url, maSo) => {
                app.urlGiayTiepNhan = url;
                app.maHoSo = maSo;
                var modalInstance = $uibModal.open({
                    template: `
                        <div class="modal-header">
                            <span class="caption-subject bold uppercase" style="font-size: 18px;">Phiếu tiếp nhận hồ sơ: {{maHoSo}}</span>
                        </div>
                        <div class="modal-body">
                            <div class="form-group" style="height: 600px">
                                <iframe title="Xem phiếu tiếp nhận" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(urlFile)}}"></iframe>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                    size: 'lg',
                    windowClass: 'my-modal-popup',
                    resolve: {
                        urlFile: { urlTiepNhan: url, maHoSo: maSo }
                    },
                    controller: ['$scope', '$uibModalInstance', 'urlFile', '$sce', function ($scope, $uibModalInstance, urlFile, $sce) {
                        $scope.maHoSo = urlFile.maHoSo;
                        $scope.urlFile = "/File/GoToViewTaiLieu?url=" + urlFile.urlTiepNhan;
                        app.IsNullOrEmpty = function (o) {
                            var f = false;
                            if (typeof (o) === 'undefined') f = true;
                            if (o == null) f = true;
                            o = String(o);
                            if (o == '') f = true;
                            return f;
                        };
                        $scope.isCongVan = !app.IsNullOrEmpty(urlFile.urlTiepNhan);
                        $scope.cancel = function () {
                            $uibModalInstance.close();
                        };
                        $scope.trustSrc = function (src) {
                            return $sce.trustAsResourceUrl(src);
                        };
                    }]
                });

            }
        };
        var initDataHistory = () => {
            vm.histories = [];
        };
        //#endregion 
        function init() {
            chucnangTimKiem();
            gridThuocCongBo();
            initDataHistory();
        };
        init();
        vm.viewCongVan = (url) => {
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn kiến nghị</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.sodangky.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
        vm.viewCongVanById = (id) => {
            var _id = parseInt(id);
            var f = vm.getByParentPagingServiceDS.filter(x => x.id == _id);
            var url = "";
            if (f.length > 0) {
                url = f[0].urlCongVanKienNghiDieuChinhGia;
            }
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn kiến nghị</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congbothuockhongkedon.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
        vm.viewLichSu = (d) => {
            abp.ui.setBusy();
            app.soDangKyId = d.id;
            app.danhSachLichSu = [];
            var getHistoryService = (soDangKyId, ajaxParams) => {
                return abp.ajax($.extend({
                    url: abp.appPath + 'api/services/app/davSoDangKyHistory/GetHistory' + abp.utils.buildQueryString([{ name: 'soDangKyId', value: soDangKyId }]) + '',
                    type: 'POST',
                    data: JSON.stringify({})
                }, ajaxParams));
            };
            if (app.soDangKyId > 0) {
                getHistoryService(app.soDangKyId)
                    .then(function (result) {
                        app.danhSachLichSu = result;
                        result.forEach((currentValue, index) => {
                            currentValue.ListNoiDungThayDoi = currentValue.contentJsonObj.ListNoiDungThayDoi;
                        });
                        var a = app.danhSachLichSu;
                        var modalInstance = $uibModal.open({
                            template: `
                                <div class="modal-header">
                                <span class="caption-subject bold uppercase">Lịch sử thay đổi thông tin số đăng ký</span>
                                </div>
                                <div class="modal-body">
                                <div frontend.congbothuockhongkedon.viewlichsu></div>
                                </div>
                                <div class="modal-footer">
                                <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                                </div>
                                `,
                            size: 'lg',
                            windowClass: 'my-modal-popup',
                            resolve: {
                                thuoc: d
                            },
                            controller: ['$scope', '$uibModalInstance', 'thuoc', function ($scope, $uibModalInstance, thuoc) {
                                $scope.thuoc = thuoc;
                                app.IsNullOrEmpty = function (o) {
                                    f = false;
                                    if (typeof (o) === 'undefined') f = true;
                                    if (o == null) f = true;
                                    o = String(o);
                                    if (o == '') f = true;
                                    return f;
                                };
                                $scope.cancel = function () {
                                    $uibModalInstance.close();
                                };
                            }]
                        });
                        abp.ui.clearBusy();
                    });
            }
        };
        vm.viewNguyenLieu = (d) => {
            app.soDangKyThuoc = d.soDangKy;
            app.danhSachNguyenLieu = [];
            var getNguyenLieuService = (d, ajaxParams) => {
                return abp.ajax($.extend({
                    url: abp.appPath + 'api/services/app/nguyenLieuLamThuoc/GetNguyenLieuTheoSoDangKy' + abp.utils.buildQueryString([{ name: 'soDangKy', value: d.soDangKy }]) + '',
                    type: 'POST',
                    data: JSON.stringify({}),
                }, ajaxParams));
            };
            if (app.soDangKyThuoc.length > 0) {
                getNguyenLieuService(d)
                    .then(function (result) {
                        app.danhSachNguyenLieu = result;
                        var modalInstance = $uibModal.open({
                            template: `
                                <div class="modal-header">
                                <span class="caption-subject bold uppercase">Danh sách nguyên liệu công bố</span>
                                </div>
                                <div class="modal-body">
                                <div frontend.congbothuockhongkedon.viewnguyenlieu></div>
                                </div>
                                <div class="modal-footer">
                                <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                                </div>
                                `,
                            size: 'lg',
                            windowClass: 'my-modal-popup',
                            resolve: {
                                thuoc: d
                            },
                            controller: ['$scope', '$uibModalInstance', 'thuoc', function ($scope, $uibModalInstance, thuoc) {
                                $scope.thuoc = thuoc;
                                app.IsNullOrEmpty = function (o) {
                                    var f = false;
                                    if (typeof (o) === 'undefined') f = true;
                                    if (o == null) f = true;
                                    o = String(o);
                                    if (o == '') f = true;
                                    return f;
                                };
                                $scope.cancel = function () {
                                    $uibModalInstance.close();
                                };
                            }]
                        });
                    });
            }
        };
        vm.viewMauNhanVaHDSD = (item) => {
            item.roleLevel = vm.roleLevel;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="attp-xem-ho-so">
                            <div class="modal-header">
                                <h4 class="modal-title text-center text-uppercase">
                                    Xem chi tiết
                                    <button type="button" class="close" ng-click="cancel()" aria-hidden="true"></button>
                                </h4>
                            </div>
                            <div class="modal-body">
                                <uib-tabset class="tab-container tabbable-line" active="activeIndex">
                                    <uib-tab index="1" heading="Hướng dẫn sử dụng" ng-if="showHuongDan && !isNewData">
                                        <div style="height: 630px">
                                            <iframe title="HƯỚNG DẪN SỬ DỤNG" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(huongDanSuDung)}}"></iframe>
                                        </div>
                                    </uib-tab>
                                    <uib-tab index="1" heading="Hướng dẫn sử dụng" ng-if="showHuongDan && isNewData">
                                        <div class="btn-group" style="padding-top: 10px;" uib-dropdown auto-close="disabled" is-open="{{vm.openHuongDanSuDung}}">
                                            <button id="button1" type="button" class="btn btn-xs btn-default blue-steel" uib-dropdown-toggle data-toggle="tooltip" title="Nhấn vào đây để xem bảng kê và tệp đính kèm.">
                                                Hướng dẫn sử dụng<em class="fa fa-angle-down"></em>
                                            </button>
                                            <div class="dropdown-menu theme-panel pull-left dropdown-custom" uib-dropdown-menu role="menu" aria-labelledby="button1" style="width:800px!important;">
                                                <div class="col-md-12">
                                                    <div class="table-scrollable" style="height:500px; overflow-y:auto; ">
                                                        <table class="table table-striped table-bordered table-hover">
                                                            <thead>
                                                                <tr class="active">
                                                                    <th style="width:100px" class="text-center">Xem tài liệu</th>
                                                                    <th colspan="2" style="width:40px" class="text-center">STT</th>
                                                                    <th class="text-center">Nội dung tệp</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody ng-repeat="taiLieu in huongDanSuDung track by $index">
                                                                <tr>
                                                                    <td class="text-center">
                                                                        <span class="btn btn-sm green fileinput-button" uib-dropdown-toggle ng-click="openViewFile(taiLieu)">
                                                                            <span> Xem </span>
                                                                        </span>
                                                                    </td>
                                                                    <td colspan="2" class="text-center"><h5>{{$index + 1}}</h5></td>
                                                                    <td>
                                                                        <h5><em>{{taiLieu.moTaTep}}</em></h5>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="height: 630px">
                                            <iframe title="HƯỚNG DẪN SỬ DỤNG" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(urlView)}}"></iframe>
                                        </div>
                                    </uib-tab>

                                    <uib-tab index="2" heading="Mẫu nhãn" ng-if="showNhan && !isNewData">
                                        <div style="height: 630px">
                                            <iframe title="MẪU NHÃN" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(mauNhan)}}"></iframe>
                                        </div>
                                    </uib-tab>
                                    <uib-tab index="2" heading="Mẫu nhãn" ng-if="showNhan && isNewData">
                                        <div class="btn-group" style="padding-top: 10px;" uib-dropdown auto-close="disabled" is-open="{{vm.openMauNhan}}">
                                            <button id="button2" type="button" class="btn btn-xs btn-default blue-steel" uib-dropdown-toggle data-toggle="tooltip" title="Nhấn vào đây để xem bảng kê và tệp đính kèm.">
                                                Mẫu nhãn<em class="fa fa-angle-down"></em>
                                            </button>
                                            <div class="dropdown-menu theme-panel pull-left dropdown-custom" uib-dropdown-menu role="menu" aria-labelledby="button2" style="width:800px!important;">
                                                <div class="col-md-12">
                                                    <div class="table-scrollable" style="height:500px; overflow-y:auto; ">
                                                        <table class="table table-striped table-bordered table-hover">
                                                            <thead>
                                                                <tr class="active">
                                                                    <th style="width:100px" class="text-center">Xem tài liệu</th>
                                                                    <th colspan="2" style="width:40px" class="text-center">STT</th>
                                                                    <th class="text-center">Nội dung tệp</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody ng-repeat="taiLieu in mauNhan track by $index">
                                                                <tr>
                                                                    <td class="text-center">
                                                                        <span class="btn btn-sm green fileinput-button" uib-dropdown-toggle ng-click="openViewFile(taiLieu)">
                                                                            <span> Xem </span>
                                                                        </span>
                                                                    </td>
                                                                    <td colspan="2" class="text-center"><h5>{{$index + 1}}</h5></td>
                                                                    <td>
                                                                        <h5><em>{{taiLieu.moTaTep}}</em></h5>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="height: 630px">
                                            <iframe title="HƯỚNG DẪN SỬ DỤNG" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(urlView)}}"></iframe>
                                        </div>
                                    </uib-tab>


                                    <uib-tab index="3" heading="File tổng hợp mẫu nhãn và HDSD" ng-if="sodangky.thongTinTaiLieu.urlNhanVaHDSD.length > 0">
                                        <div style="height: 630px">
                                            <iframe title="MẪU NHÃN VÀ HDSD" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(nhanVahuongDanSuDung)}}"></iframe>
                                        </div>
                                    </uib-tab>
                                    <uib-tab index="4" heading="Tài liệu TCCL" ng-if="sodangky.thongTinTaiLieu.jsonTaiLieuTCCL.length > 0 && roleLevel == 14">
                                        <div class="btn-group" style="padding-top: 10px;" uib-dropdown auto-close="disabled" is-open="{{vm.openTieuChuanChatLuong}}">
                                            <button id="button3" type="button" class="btn btn-xs btn-default blue-steel" uib-dropdown-toggle data-toggle="tooltip" title="Nhấn vào đây để xem bảng kê và tệp đính kèm.">Tiêu chuẩn chất lượng<em class="fa fa-angle-down"></em></button>
                                            <div class="dropdown-menu theme-panel pull-left dropdown-custom" uib-dropdown-menu role="menu" aria-labelledby="button3" style="width:800px!important;">
                                                <div class="col-md-12">
                                                    <div class="table-scrollable" style="height:500px; overflow-y:auto; ">
                                                        <table class="table table-striped table-bordered table-hover">
                                                            <thead>
                                                                <tr class="active">
                                                                    <th style="width:100px" class="text-center">Xem tài liệu</th>
                                                                    <th colspan="2" style="width:40px" class="text-center">STT</th>
                                                                    <th class="text-center">Nội dung tệp</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody ng-repeat="taiLieu in taiLieuTccl track by $index">
                                                                <tr>
                                                                    <td class="text-center">
                                                                        <span class="btn btn-sm green fileinput-button" uib-dropdown-toggle ng-click="openViewFile(taiLieu)">
                                                                            <span> Xem </span>
                                                                        </span>
                                                                    </td>
                                                                    <td colspan="2" class="text-center"><h5>{{$index + 1}}</h5></td>
                                                                    <td>
                                                                        <h5><em>{{taiLieu.moTaTep}}</em></h5>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="height: 630px">
                                            <iframe title="Tài liệu TCCL" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(urlView)}}"></iframe>
                                        </div>
                                    </uib-tab>
                                </uib-tabset>
                            </div>
                            <div class="modal-footer">
                                <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                            </div>
                        </div >
                            `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    soDangKy: item
                },
                controller: ['$scope', '$uibModalInstance', '$sce', 'soDangKy', function ($scope, $uibModalInstance, $sce, soDangKy) {
                    $scope.activeIndex = 1;
                    $scope.sodangky = {};
                    $scope.roleLevel = soDangKy.roleLevel;
                    $scope.sodangky = soDangKy;
                    $scope.isNewData = false;
                    $scope.showHuongDan = false;
                    $scope.showNhan = false;
                    if ($scope.sodangky.thongTinTaiLieu.urlHuongDanSuDung) {
                        $scope.isNewData = $scope.sodangky.thongTinTaiLieu.urlHuongDanSuDung.startsWith('[{\"');
                    }
                    if ($scope.sodangky.thongTinTaiLieu.urlNhan && !$scope.isNewData) {
                        $scope.isNewData = $scope.sodangky.thongTinTaiLieu.urlNhan.startsWith('[{\"');
                    }
                    if ($scope.isNewData) {
                        $scope.huongDanSuDung = $scope.sodangky.thongTinTaiLieu.urlHuongDanSuDung ? JSON.parse($scope.sodangky.thongTinTaiLieu.urlHuongDanSuDung) : [];
                        $scope.mauNhan = $scope.sodangky.thongTinTaiLieu.urlNhan ? JSON.parse($scope.sodangky.thongTinTaiLieu.urlNhan) : [];
                        $scope.showHuongDan = $scope.huongDanSuDung.length > 0;
                        $scope.showNhan = $scope.mauNhan.length > 0;

                    } else {
                        $scope.huongDanSuDung = "/File/GoToViewTaiLieu?url=" + $scope.sodangky.thongTinTaiLieu.urlHuongDanSuDung + "#zoom=100";
                        $scope.mauNhan = "/File/GoToViewTaiLieu?url=" + $scope.sodangky.thongTinTaiLieu.urlNhan + "#zoom=100";
                        $scope.showHuongDan = true;
                        $scope.showNhan = true;
                    }
                    $scope.nhanVahuongDanSuDung = "/File/GoToViewTaiLieu?url=" + $scope.sodangky.thongTinTaiLieu.urlNhanVaHDSD + "#zoom=100";
                    $scope.taiLieuTccl = $scope.sodangky.thongTinTaiLieu.jsonTaiLieuTCCL ? JSON.parse($scope.sodangky.thongTinTaiLieu.jsonTaiLieuTCCL) : [];
                    //Function
                    {
                        app.IsNullOrEmpty = function (o) {
                            var f = false;
                            if (typeof (o) === 'undefined') f = true;
                            if (o == null) f = true;
                            o = String(o);
                            if (o == '') f = true;
                            return f;
                        };

                        $scope.openViewFile = (item) => {
                            $scope.urlView = "/File/GoToViewTaiLieu?url=" + item.duongDanTep + "#zoom=70";
                        }


                        $scope.cancel = function () {
                            $uibModalInstance.close();
                        };
                        var init = function () {
                        }
                        init();
                        $scope.trustSrc = function (src) {
                            return $sce.trustAsResourceUrl(src);
                        };
                    }
                }]
            });
        };
        vm.viewTaiLieu = (url, title) => {
            app.urlTaiLieu = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">{{titleFile}}</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.sodangky.viewtailieu ng-if='isTonTaiFile'></div>
                        <div ng-if='!isTonTaiFile'> Tệp không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileTaiLieu: { urlDuongDanTaiLieu: url, title: title }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileTaiLieu', function ($scope, $uibModalInstance, urlFileTaiLieu) {
                    $scope.urlFileTaiLieu = urlFileTaiLieu.urlDuongDanTaiLieu;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.titleFile = urlFileTaiLieu.title;
                    $scope.isTonTaiFile = !app.IsNullOrEmpty(urlFileTaiLieu.urlDuongDanTaiLieu);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
    }
]);
(function () {
    MyApp.directive('frontend.congbothuockhongkedon.viewlichsu', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', '$uibModal', function ($scope, $window, $uibModal) {
                var vm = this;
                vm.lichSuThayDoi = app.danhSachLichSu;
                /*var a = JSON.parse(vm.lichSuThayDoi[0].listTepDinhKem[0].jsonTepDinhKem)[0].duongDanTep;*/
                vm.srcQuyetDinh = function (src) {
                    return "/File/GoToViewTaiLieu?url=" + src + "#zoom=100";
                };
                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
                vm.openViewFile = (item) => {

                    var modalInstance = $uibModal.open({
                        template: `
                            <div class="modal-header">
                            <span class="caption-subject bold uppercase font-white">{{taiLieuSelected.content}}</span>
                            </div>
                            <div class="modal-body">
                            <div class="portlet light bordered" style="height: 650px">
                                <iframe title="title" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(taiLieuUrl)}}"  ></iframe>
                            </div>
                            </div>
                            <div class="modal-footer">
                            <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                            </div>
                            `,
                        size: 'lg',
                        resolve: {
                            taiLieuSelected: item
                        },
                        controller: ['$scope', '$uibModalInstance', '$sce', 'taiLieuSelected', function ($scope, $uibModalInstance, $sce, taiLieuSelected) {
                            $scope.taiLieuSelected = taiLieuSelected;
                            if (taiLieuSelected.duongDanTepKySo != null && taiLieuSelected.duongDanTepKySo != undefined) {
                                $scope.taiLieuUrl = "/File/GoToViewTaiLieu?url=" + taiLieuSelected.duongDanTepKySo + "#zoom=60";
                            }
                            else {
                                $scope.taiLieuUrl = "/File/GoToViewTaiLieu?url=" + taiLieuSelected.duongDanTep + "#zoom=60";
                            }
                            $scope.cancel = function () {
                                $uibModalInstance.close();
                            };
                            $scope.trustSrc = function (src) {
                                return $sce.trustAsResourceUrl(src);
                            };
                        }]
                    });
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="container-fluid">
                        <div class="row form-group">
                            <div class="col-md-12">
                                <div class="timeline">
                                    <div class="timeline-item" ng-repeat="ls in vm.lichSuThayDoi">
                                        <div class="timeline-badge">
                                            <div class="timeline-icon">
                                                <em class="fa fa-history" ng-class="$index==0? 'font-green-haze':'font-red'"></em>
                                            </div>
                                        </div>
                                        <div class="timeline-body">
                                            <div class="timeline-body-arrow"> </div>
                                            <div class="timeline-body-content" style="margin-top: 0px;">
                                            <div class="portlet light" style="margin-bottom: 0px;">
                                            <div class="portlet-title tabbable-line">
                                                <div class="caption" ng-if="ls.thuTucId == 84">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta">Lúc {{ls.ngaySuaDoi | date :'dd/MM/yyyy HH:mm'}} - Đính chính bổ sung thông tin theo quyết định cấp số đăng ký</span>
                                                </div>
                                                <div class="caption" ng-if="ls.thuTucId == 85">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta">Lúc {{ls.ngaySuaDoi | date :'dd/MM/yyyy HH:mm'}} - Rút số đăng ký thuốc</span>
                                                </div>
                                                <div class="caption" ng-if="ls.thuTucId == 88">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta">Lúc {{ls.ngaySuaDoi | date :'dd/MM/yyyy HH:mm'}} - Duy trì hiệu lực 12 tháng số đăng ký lưu hành</span>
                                                </div>
                                                <div class="caption" ng-if="ls.thuTucId == 91">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta">Lúc {{ls.ngaySuaDoi | date :'dd/MM/yyyy HH:mm'}} - Đăng ký thay đổi bổ sung thông tin thuốc, nguyên liệu làm thuốc</span>
                                                </div>
                                                <div class="caption" ng-if="ls.thuTucId == null">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta">Lúc {{ls.ngaySuaDoi | date :'dd/MM/yyyy HH:mm'}} Hệ thống thay đổi thông tin - Lý do: {{ls.contentJsonObj.LyDoSuaDoi}}</span>
                                                </div>
                                                <ul class="nav nav-tabs"  ng-if="ls.contentJsonObj.ThongTinDangKyThuoc.SoQuyetDinh.length>0">
                                                    <li class="active">
                                                        <a href="#portlet_taba{{ls.id}}" data-toggle="tab" aria-expanded="true"> SỐ ĐĂNG KÝ </a>
                                                    </li>
                                                    <li class="">
                                                        <a href="#portlet_tabb{{ls.id}}" data-toggle="tab" aria-expanded="false"> QUYẾT ĐỊNH/CÔNG VĂN PHÊ DUYỆT </a>
                                                    </li>
                                                    <li class="">
                                                        <a href="#portlet_tabc{{ls.id}}" ng-if="ls.listTepDinhKem.length > 0" data-toggle="tab" aria-expanded="false"> TÀI LIỆU CÔNG BỐ </a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="portlet-body">
                                                <div class="tab-content" style="padding:0">
                                                    <div class="tab-pane active" id="portlet_taba{{ls.id}}">
                                                    
                                                <table class="table table-bordered table-hover">
                                                    <thead>
                                                        <tr class="bg-blue font-white">
                                                            <th class="text-center">Số GPLH </th>
                                                            <th class="text-center" style="width:200px"> Tên thuốc </th>
                                                            <th class="text-center" style="width:200px"> Hoạt chất</th>
                                                            <th class="text-center" style="width:200px"> Hàm lượng </th>
                                                            <th class="text-center" style="width:200px"> Số quyết định </th>
                                                            <th class="text-center" style="width:200px"> Năm cấp </th>
                                                            <th class="text-center" style="width:200px"> Đợt cấp </th>
                                                            <th class="text-center" style="width:200px"> Dạng bào chế </th>
                                                            <th class="text-center" style="width:200px"> Quy cách đóng gói</th>
                                                            <th class="text-center" style="width:200px"> Tiêu chuẩn </th>
                                                            <th class="text-center"> Tuổi thọ </th>
                                                      
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td class="text-center">
                                                                {{ls.contentJsonObj.SoDangKy}}
                                                            </td>
                                                            <td>
                                                            {{ls.contentJsonObj.TenThuoc}}
                                                            </td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.HoatChatChinh}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.HamLuong}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinDangKyThuoc.SoQuyetDinh}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinDangKyThuoc.NgayCapSoDangKy | date :'dd/MM/yyyy'}}</td>
                                                            <td class="text-center">{{ls.contentJsonObj.ThongTinDangKyThuoc.DotCap}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.DangBaoChe}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.DongGoi}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.TieuChuan}}</td>
                                                            <td class="text-center">{{ls.contentJsonObj.ThongTinThuocCoBan.TuoiTho}}</td>
                                                          
                                                        </tr>
                                                        <tr>
                                                        <td colspan="11">
                                                            <form class="form-horizontal" role="form" ng-if="ls.thuTucId != 91">
                                                            <div class="form-body">
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Công ty đăng ký</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTyDangKy.TenCongTyDangKy}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Địa chỉ  công ty đăng ký, nước đăng ký</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTyDangKy.DiaChiDangKy}}, {{ls.contentJsonObj.CongTyDangKy.NuocDangKy}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Công ty sản xuất</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTySanXuat.TenCongTySanXuat}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Địa chỉ công ty sản xuất, nước sản xuất</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTySanXuat.DiaChiSanXuat}}, {{ls.contentJsonObj.CongTySanXuat.NuocSanXuat}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            </div>
                                                            </form>
                                                            <div>
                                                            <table class="table table-bordered table-hover" ng-if="ls.thuTucId == 91 && ls.contentJsonObj.ListNoiDungThayDoi != null && (ls.contentJsonObj.IsLuongCapNhat == null) " style="margin-bottom: 0px;">
                                                                <thead class="bg-blue-madison font-white">
                                                                    <tr>
                                                                        <th style="vertical-align:middle;width: 160px;" class="text-center" colspan="4">
                                                                            Thông tin thay đổi/bổ sung (Mã hồ sơ: {{ls.maHoSo}} - Ngày tiếp nhận: {{ls.ngayTiepNhan | date:'dd/MM/yyyy'}})
                                                                            <br>
                                                                            Vui lòng xem tài liệu tại tab Tài liệu công bố (nếu có).                                                                      
                                                                        </th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th style="vertical-align:middle;width: 160px;" class="text-center"> Nội dung thay đổi, bổ sung </th>
                                                                        <th style="vertical-align:middle;width: 250px;" class="text-center"> Thông tin đã duyệt </th>
                                                                        <th style="vertical-align:middle;width: 250px;" class="text-center" ng-if="ls.contentJsonObj.IsLuongCapNhat != true"> Thông tin đề nghị thay đổi, bổ sung
                                                                        </th>
                                                                      
                                                                        <th style="vertical-align:middle;width: 250px;" class="text-center" ng-if="ls.contentJsonObj.IsLuongCapNhat == true"> Thông tin để nghị thay đổi, bổ sung đã được phê duyệt </th>
                                                                        <th style="vertical-align:middle;width: 250px;" class="text-center" ng-if="ls.contentJsonObj.IsLuongCapNhat == true"> Công văn phê duyệt của cục quản lý dược </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody ng-repeat="item in ls.contentJsonObj.ListNoiDungThayDoi">
                                                                    <tr>
                                                                       
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.Thuoc.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Tên thuốc
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.Thuoc.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.Thuoc.ThayDoi}}</td>
                                                                                        
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.HoatChat.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Hoạt chất
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.HoatChat.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.HoatChat.ThayDoi}}</td>
                                                                                        
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.HamLuong.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Hàm lượng
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.HamLuong.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.HamLuong.ThayDoi}}</td>
                                                                                        
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.DangBaoChe.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Dạng bào chế
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.DangBaoChe.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.DangBaoChe.ThayDoi}}</td>
                                                                                        
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.DongGoi.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Quy cách đóng gói
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.DongGoi.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.DongGoi.ThayDoi}}</td>
                                                                                       
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.TieuChuan.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Tiêu chuẩn
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.TieuChuan.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.TieuChuan.ThayDoi}}</td>
                                                                                        
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.TuoiTho.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Tuổi thọ
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.TuoiTho.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.TuoiTho.ThayDoi}}</td>
                                                                                       
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.CongTyDangKy.TenCongTy.IsSua">
                                                                                        <td style="vertical-align:middle;width: 100px;">
                                                                                            <span>
                                                                                                Tên công ty đăng ký
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.TenCongTy.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.TenCongTy.ThayDoi}}</td>
                                                                                      
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.CongTyDangKy.Nuoc.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Nước đăng ký
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.Nuoc.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.Nuoc.ThayDoi}}</td>
                                                                                       
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.CongTyDangKy.DiaChi.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Địa chỉ đăng ký
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.DiaChi.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTyDangKy.DiaChi.ThayDoi}}</td>
                                                                                        
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.CongTySanXuat.TenCongTy.IsSua">
                                                                                        <td style="vertical-align:middle;width: 100px;">
                                                                                            <span>
                                                                                                Tên công ty sản xuất
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.TenCongTy.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.TenCongTy.ThayDoi}}</td>
                                                                                        
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.CongTySanXuat.Nuoc.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Nước sản xuất
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.Nuoc.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.Nuoc.ThayDoi}}</td>
                                                                                        
                                                                                    </tr>
                                                                                    <tr ng-if="item.NoiDungThayDoiThongTinSDK.CongTySanXuat.DiaChi.IsSua">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span>
                                                                                                Địa chỉ sản xuất
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.DiaChi.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">
                                                                                            {{item.NoiDungThayDoiThongTinSDK.CongTySanXuat.DiaChi.ThayDoi}}</td>
                                                                                       
                                                                                    </tr>
                                                                                    <tr ng-repeat="itemTD in item.ListNoiDungThayDoiThongTinKhac track by $index" ng-if="item.IsThayDoiThongTinKhac && item.ListNoiDungThayDoiThongTinKhac && item.ListNoiDungThayDoiThongTinKhac.length > 0">
                                                                                        <td style="vertical-align:middle;width: 160px;">
                                                                                            <span> {{itemTD.StrNoiDungThayDoi}}</span>
                                                                                        </td>
                                                                                        <td style="vertical-align:middle;width: 250px;">{{itemTD.DaDuyet}}</td>
                                                                                        <td style="vertical-align:middle;width: 250px;">{{itemTD.ThayDoi}}</td>
                                                                                       
                                                                                    </tr>
                                                                       
                                                                    </tr>
                                                                </tbody>
                                                            </table>                                                      
                                                            </div>
                                                        </td>                                                           
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <span class="font-grey-cascade margin-bottom-15" ng-if="ls.contentJsonObj.LyDoSuaDoi && ls.thuTucId != 91">
                                                    <strong>Lý do sửa: </strong><span>{{ls.contentJsonObj.LyDoSuaDoi}}</span>
                                                </span>
                                            </div>
                                              <div class="tab-pane" id="portlet_tabb{{ls.id}}">
                                                <div ng-if="ls.thuTucId == 88 || ls.thuTucId == 84 || ls.thuTucId == 85">
                                                   <iframe ng-if='ls.contentJsonObj.ThongTinDangKyThuoc.UrlSoQuyetDinh.length>0' title="Xem tài liệu" style="width: 100%; height: 600px;border:0" ng-src="{{vm.trustSrc(vm.srcQuyetDinh(ls.contentJsonObj.ThongTinDangKyThuoc.UrlSoQuyetDinh))}}"  ></iframe>
                                                </div>                                                
                                            </div>
                                               <div class="tab-pane" ng-if="ls.listTepDinhKem.length > 0" id="portlet_tabc{{ls.id}}">
                                                <div ng-if="ls.thuTucId == 91 ">
                                                       <div class="table-scrollable" style="height:100%; overflow-y:auto">
                                                            <table class="table table-striped table-bordered table-hover">
                                                                <thead style="background-color: rgb(53, 152, 220); color: white">
                                                                    <tr class="thead_blue">
                                                                        
                                                                        <th colspan="1" style="width:60px"> STT </th>
                                                                        <th class="text-center">Tài liệu công bố thay đổi/bổ sung (Mã hồ sơ: {{ls.maHoSo}} - Ngày tiếp nhận: {{ls.ngayTiepNhan | date:'dd/MM/yyyy'}} </th>
                                                                        <th class="text-center" style="width:120px">Xem </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody ng-repeat="item in ls.listTepDinhKem track by $index">
                                                                    <tr>
                                                                        

                                                                        <td colspan="1">{{item.stt}}</td>

                                                                        <td>
                                                                            {{item.moTaTep}}
                                                                        </td>
                                                                        <td class="text-center">
                                                                            <span class="btn green fileinput-button" ng-click="vm.openViewFile(item)">
                                                                                <span> Xem </span>
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                       </div>
                                                </div>
                                            </div>
                                        </div>                                       
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
            };
        }
    ]);
})();
(function () {
    MyApp.directive('frontend.sodangky.viewcongvan', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                if (app.urlCongVanCongBoGiaThuoc != "") {
                    vm.taiLieuDinhKemUrl = "/File/GoToViewTaiLieu?url=" + app.urlCongVanCongBoGiaThuoc + "#zoom=100";
                } else {
                    vm.taiLieuDinhKemUrl = "";
                }
                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="row form-group">
                            <div class="col-md-12">
                                <div class="portlet light bordered" style="height: 630px">
                                        <span ng-if="!vm.taiLieuDinhKemUrl || vm.taiLieuDinhKemUrl == ''">
                                    </span>
                                    <iframe ng-if='vm.taiLieuDinhKemUrl ||vm.taiLieuDinhKemUrl!=""' title="Xem tài liệu" style="width: 100%; height: 100%;border:0" ng-src="{{vm.trustSrc(vm.taiLieuDinhKemUrl)}}"  ></iframe>
                                </div>
                            </div>
                        </div>`,
            };
        }
    ]);
})();
(function () {
    MyApp.directive('frontend.congbothuockhongkedon.viewnguyenlieu', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                vm.nguyenLieuCongBo = app.danhSachNguyenLieu;
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="container-fluid">
                            <table class="table table-bordered table-hover">
                                <thead>
                                    <tr class="bg-blue font-white">
                                        <th class="text-center" style="width:40px">STT</th>
                                        <th>Tên nguyên liệu </th>
                                        <th width="100" class="text-center"> Phân loại </th>
                                        <th width="130" class="text-center"> Tiêu chuẩn </th>
                                        <th width="230" class="text-center"> Cơ sở sản xuất </th>
                                        <th class="text-center" style="width:200px"> Nước sản xuất </th>
                                        <th width="240" class="text-center"> Địa chỉ cơ sở sản xuất </th>
                                        <th class="text-center" style="width:200px"> Hoạt chất chuẩn </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr ng-repeat="ls in vm.nguyenLieuCongBo">
                                        <td class="text-center">{{$index + 1}}</td>
                                        <td>{{ls.tenNguyenLieu}}</td>
                                        <td ng-if="ls.phanLoai==0">Dược chất</td>
                                        <td ng-if="ls.phanLoai==1">Tá dược</td>
                                        <td ng-if="ls.phanLoai==2">Vỏ nang</td>
                                        <td class="text-center">{{ls.tieuChuanChatLuongNguyenLieu}}</td>
                                        <td>{{ls.tenCoSoSanXuatNguyenLieu}}</td>
                                        <td>{{ls.nuocSanXuatNguyenLieu}}</td>
                                        <td>{{ls.diaChiCoSoSanXuatNguyenLieu}}</td>
                                        <td>{{ls.tenHoatChatChuan}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>`,
            };
        }
    ]);
})();
(function () {
    MyApp.directive('frontend.sodangky.viewtailieu', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                if (app.urlTaiLieu != "") {
                    vm.taiLieuDinhKemUrl = "/File/GoToViewTaiLieu?url=" + app.urlTaiLieu + "#zoom=100";
                } else {
                    vm.taiLieuDinhKemUrl = "";
                }
                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="row form-group">
                            <div class="col-md-12">
                                <div class="portlet light bordered" style="height: 630px">
                                        <span ng-if="!vm.taiLieuDinhKemUrl || vm.taiLieuDinhKemUrl == ''">
                                    </span>
                                    <iframe ng-if='vm.taiLieuDinhKemUrl ||vm.taiLieuDinhKemUrl!=""' title="Xem tài liệu" style="width: 100%; height: 100%;border:0" ng-src="{{vm.trustSrc(vm.taiLieuDinhKemUrl)}}"  ></iframe>
                                </div>
                            </div>
                        </div>`,
            };
        }
    ]);
})();;
MyApp.controller('frontend.congbothuocvipham', [
    '$scope', '$sce', '$location', '$http', '$window', '$timeout', '$uibModal',
    function ($scope, $sce, $location, $http, $window, $timeout, $uibModal) {
        vm = this;
        var getThuocCongBoPagingService = (input, ajaxParams) => {
            return abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/thuocViPham/GetAllPublicServerPaging',
                type: 'POST',
                data: JSON.stringify(input)
            }, ajaxParams));
        };

        //#region Tìm kiếm
        var chucnangTimKiem = () => {
            vm.isNangCaoFilter = false;
            vm.changeNangCaoFilter = ($event) => {
                vm.isNangCaoFilter = !vm.isNangCaoFilter;
                vm.filterAll = "";
                vm.filterCongBo = {};
            };
            $scope.$watch('vm.filterAll', function myfunction() {
                if (vm.filterAll != null && vm.filterAll != "") {
                    vm.isNangCaoFilter = false;
                    vm.filterCongBo = {};
                }
            })
            $scope.totalRow = 0;
            $scope.keyWord = "";
            vm.switchFilter = 0;
            vm.changeSwitchFilter = function ($event, d) {
                $('#search_concept').text($event.currentTarget.firstChild.text);
                vm.switchFilter = d;
            };
            vm.filterCongBo = {};
            vm.refreshFilter = function () {
                vm.filterAll = "";
                vm.filterCongBo = {};
                vm.filterCongBo.tieuChuanId = null;
                vm.filterCongBo.phanLoaiThuocEnum = null;
                vm.filterCongBo.ngayCapSoDangKy = null;
                vm.getGridData();
            };
        };
        //#endregion
        //#region Grid Data
        var gridThuocCongBo = () => {
            vm.refreshColumns = function () {
                vm.columns = [];
                var _colNamViPham = {
                    field: "namViPham",
                    title: app.localize('Năm'),
                    template: "{{this.dataItem.namViPham}}",
                    width: 100
                };
                var _colCongVanThuHoi = {
                    field: "congVanThuHoi",
                    title: app.localize('Công văn thu hồi'),
                    template: `<div align='center' ng-show='this.dataItem.thongTinThuHoi.soCongVanThuHoi.length>0'>
                                 <a href="" style=" text-decoration: none;" ng-click="vm.viewCongVan(this.dataItem.thongTinThuHoi.urlCongVanThuHoi)"> {{this.dataItem.thongTinThuHoi.soCongVanThuHoi}}</a>
                                <div align='center'>{{this.dataItem.thongTinThuHoi.ngayCongVanThuHoi | date:'dd/MM/yyyy'}}</div>
                               </div>
                               `,
                    width: 100
                };

                var _colSTT = {
                    field: "stt",
                    title: app.localize('STT'),
                    template: "<div class='row-number text-center'></div>",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 50
                };
               
                var _colThongTinChung = {
                    title: "Thông tin chung",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    columns: [
                        {
                            field: "tenThuoc",
                            title: "Tên thuốc",
                            width: "200px"
                        },
                        {
                            field: "soDangKy",
                            title: "Số GPLH",
                            attributes: { class: "text-center" },
                            width: "200px"
                        },
                        {
                            field: "thongTinThuocViPham.dangBaoChe",
                            title: "Dạng bào chế",
                            width: "200px"
                        },
                        {
                            template: "{{this.dataItem.thongTinThuocViPham.hoatChatChinh}}</br>{{this.dataItem.thongTinThuocViPham.hamLuong}}",
                            title: "Hoạt chất - Hàm lượng",
                            width: "200px"
                        },
                        {
                            field: "thongTinThuocViPham.dongGoi",
                            title: "Quy cách đóng gói",
                            width: "200px"
                        },
                        {
                            field: "thongTinThuocViPham.phanLoaiSanPham",
                            title: "Phân loại sản phẩm",
                            attributes: { class: "text-center" },
                            width: "200px"
                        },
                        {
                            template: "Số lô:{{this.dataItem.thongTinThuocViPham.soLo == null? 'N/A':this.dataItem.thongTinThuocViPham.soLo}}</br> NSX:{{this.dataItem.thongTinThuocViPham.ngaySanXuat == null? 'N/A':this.dataItem.thongTinThuocViPham.ngaySanXuat| date:'dd/MM/yyyy'}}</br> HD:{{this.dataItem.thongTinThuocViPham.hanDung == null? 'N/A':this.dataItem.thongTinThuocViPham.hanDung| date:'dd/MM/yyyy'}}",
                            title: "Số lô - Ngày sản xuất - Hạn dùng",
                            width: "200px"
                        },
                        {
                            field: "thongTinThuocViPham.coSoSanXuat",
                            title: "Nhà sản xuất",
                            width: "200px"
                        },
                        {
                            field: "thongTinThuocViPham.nuocSanXuat",
                            title: "Nước sản xuất",
                            attributes: { class: "text-center" },
                            width: "120px"
                        },
                        {
                            field: "thongTinThuocViPham.coSoNhapKhau",
                            title: 'Nhà nhập khẩu',
                            width: "200px"
                        }
                    ]
                };
                var _colThongTinViPham = {
                    title: "Thông tin vi phạm",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    columns: [
                        {
                            field: "thongTinViPham.chiTieuViPham",
                            title: "Chỉ tiêu vi phạm",
                            width: "200px"
                        },
                        {
                            field: "thongTinViPham.mucDoViPham",
                            title: "Mức độ vi phạm",
                            attributes: { class: "text-center" },
                            width: "120px"
                        },
                        {
                            field: "thongTinViPham.noiLayMau",
                            title: 'Nơi lấy mẫu',
                            width: "200px"
                        }
                    ]
                };
                var setColForForm = function () {
                    vm.columns = [_colSTT, _colNamViPham, _colCongVanThuHoi, _colThongTinChung, _colThongTinViPham];
                };
                setColForForm();
                vm.columnGiaThuoc = vm.columns;
            };
            vm.refreshColumns();
            vm.requestParams = {
                skipCount: 0,
                maxResultCount: 10,
                sorting: null
            };
            vm.refreshDataSource = function () {
                vm.thuocCongBoDataSoure = [];
                vm.setDataSource = function () {
                    vm.thuocCongBoDataSoure = new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                $scope.totalRow = 0;
                                $scope.keyWord = "";
                                vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                                vm.requestParams.maxResultCount = options.data.pageSize;
                                var _req = {
                                    filterText: vm.filterAll,
                                    ThuocViPham: vm.filterCongBo,
                                    KichHoat: true
                                };
                                switch (vm.switchFilter) {
                                    case 1:
                                        _req.ThuocViPham.SoDangKy = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 2:
                                        _req.ThuocViPham.TenThuoc = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 3:
                                        _req.ThuocViPham.HoatChatChinh = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 4:
                                        _req.ThuocViPham.DangBaoChe = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 5:
                                        _req.ThuocViPham.CoSoSanXuat = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    case 6:
                                        _req.ThuocViPham.CoSoNhapKhau = vm.filterAll;
                                        _req.filterText = "";
                                        break;
                                    default:
                                        _req.filterText = vm.filterAll;
                                        break;
                                }
                                getThuocCongBoPagingService($.extend(_req, vm.requestParams))
                                    .then(function (result) {
                                        options.success(result);
                                        $scope.totalRow = result.totalCount;
                                        $scope.keyWord = vm.filterAll;
                                        $scope.$apply();
                                        $scope.filter = {};
                                    });
                            }
                        },
                        pageSize: 15,
                        serverPaging: true,
                        serverSorting: true,
                        sortable: true,
                        schema: {
                            data: "items",
                            total: "totalCount"
                        }
                    });
                };
                vm.setDataSource();
            };
            vm.refreshDataSource();
            vm.thuocCongBoGridOptions = {
                pageable:
                {
                    "refresh": true,
                    "pageSizes": [5, 10, 15, 20, 50, 100],
                    messages: {
                        empty: "Không có dữ liệu",
                        display: "Hiển thị từ {0} đến {1}/{2} bản ghi",
                        itemsPerPage: "Bản ghi mỗi trang"
                    }
                },
                resizable: true,
                height: 800,
                scrollable: true,
                dataBound: function (e) {
                    var grid = this;
                    var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                    grid.tbody.find(".row-number").each(function () {
                        var index = record++;
                        $(this).html(index);
                    });
                },
                columns: vm.columnGiaThuoc
            };
            function isValidDate(s) {
                if (s != null && s.length > 0) {
                    var bits = s.split('/');
                    var d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
                    return !!(d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]));
                } else {
                    return true;
                }
            }
            vm.getGridData = function () {
                var date = vm.filterCongBo.ngayCapSoDangKy;
                if (date != 'undefined' && !isValidDate(date)) {
                    abp.notify.error("Năm cấp không đúng định dạng!");
                    return;
                } else {
                    vm.thuocCongBoDataSoure.read();
                }
            };
        };
        var initDataHistory = () => {
            vm.histories = [];
        };
        //#endregion 
        function init() {
            chucnangTimKiem();
            gridThuocCongBo();
            initDataHistory();
        };
        init();
        vm.viewCongVan = (url) => {
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn kiến nghị</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congbothuocvipham.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
        vm.viewCongVanById = (id) => {
            var _id = parseInt(id);
            var f = vm.getByParentPagingServiceDS.filter(x => x.id == _id);
            var url = "";
            if (f.length > 0) {
                url = f[0].urlCongVanKienNghiDieuChinhGia;
            }
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn kiến nghị</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congbothuocvipham.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
        vm.viewLichSu = (d) => {
            app.soDangKyId = d.id;
            app.danhSachLichSu = [];
            var getHistoryService = (soDangKyId, ajaxParams) => {
                return abp.ajax($.extend({
                    url: abp.appPath + 'api/services/app/davSoDangKyHistory/GetHistory' + abp.utils.buildQueryString([{ name: 'soDangKyId', value: soDangKyId }]) + '',
                    type: 'POST',
                    data: JSON.stringify({})
                }, ajaxParams));
            };
            if (app.soDangKyId > 0) {
                getHistoryService(app.soDangKyId)
                    .then(function (result) {
                        app.danhSachLichSu = result;
                        var modalInstance = $uibModal.open({
                            template: `
                                <div class="modal-header">
                                <span class="caption-subject bold uppercase">Lịch sử thay đổi thông tin số đăng ký</span>
                                </div>
                                <div class="modal-body">
                                <div frontend.congbothuocvipham.viewlichsu></div>
                                </div>
                                <div class="modal-footer">
                                <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                                </div>
                                `,
                            size: 'lg',
                            windowClass: 'my-modal-popup',
                            resolve: {
                                thuoc: d
                            },
                            controller: ['$scope', '$uibModalInstance', 'thuoc', function ($scope, $uibModalInstance, thuoc) {
                                $scope.thuoc = thuoc;
                                app.IsNullOrEmpty = function (o) {
                                    f = false;
                                    if (typeof (o) === 'undefined') f = true;
                                    if (o == null) f = true;
                                    o = String(o);
                                    if (o == '') f = true;
                                    return f;
                                };
                                $scope.cancel = function () {
                                    $uibModalInstance.close();
                                };
                            }]
                        });
                    });
            }
        };
        vm.viewNguyenLieu = (d) => {
            app.soDangKyThuoc = d.soDangKy;
            app.danhSachNguyenLieu = [];
            var getNguyenLieuService = (soDangKy, ajaxParams) => {
                return abp.ajax($.extend({
                    url: abp.appPath + 'api/services/app/nguyenLieuLamThuoc/GetNguyenLieuTheoSoDangKy' + abp.utils.buildQueryString([{ name: 'soDangKy', value: soDangKy }]) + '',
                    type: 'POST',
                    data: JSON.stringify({})
                }, ajaxParams));
            };
            if (app.soDangKyThuoc.length > 0) {
                getNguyenLieuService(app.soDangKyThuoc)
                    .then(function (result) {
                        app.danhSachNguyenLieu = result;
                        var modalInstance = $uibModal.open({
                            template: `
                                <div class="modal-header">
                                <span class="caption-subject bold uppercase">Danh sách nguyên liệu công bố</span>
                                </div>
                                <div class="modal-body">
                                <div frontend.congbothuocvipham.viewnguyenlieu></div>
                                </div>
                                <div class="modal-footer">
                                <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                                </div>
                                `,
                            size: 'lg',
                            windowClass: 'my-modal-popup',
                            resolve: {
                                thuoc: d
                            },
                            controller: ['$scope', '$uibModalInstance', 'thuoc', function ($scope, $uibModalInstance, thuoc) {
                                $scope.thuoc = thuoc;
                                app.IsNullOrEmpty = function (o) {
                                    var f = false;
                                    if (typeof (o) === 'undefined') f = true;
                                    if (o == null) f = true;
                                    o = String(o);
                                    if (o == '') f = true;
                                    return f;
                                };
                                $scope.cancel = function () {
                                    $uibModalInstance.close();
                                };
                            }]
                        });
                    });
            }
        };
    }
]);
(function () {
    MyApp.directive('frontend.congbothuocvipham.viewlichsu', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                vm.lichSuThayDoi = app.danhSachLichSu;
                vm.srcQuyetDinh = function (src) {
                    return "/File/GoToViewTaiLieu?url=" + src + "#zoom=100";
                };
                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
                vm.viewCongVan = (url) => {
                    app.urlCongVanCongBoGiaThuoc = url;
                    var modalInstance = $uibModal.open({
                        template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn thu hồi</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congbogiathuoc.viewcongvancongbogia ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                        size: 'lg',
                        windowClass: 'my-modal-popup',
                        resolve: {
                            urlFileCV: { urlDuongDanCV: url }
                        },
                        controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                            $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                            app.IsNullOrEmpty = function (o) {
                                var f = false;
                                if (typeof (o) === 'undefined') f = true;
                                if (o == null) f = true;
                                o = String(o);
                                if (o == '') f = true;
                                return f;
                            };
                            $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                            $scope.cancel = function () {
                                $uibModalInstance.close();
                            };
                        }]
                    });
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="container-fluid">
                        <div class="row form-group">
                            <div class="col-md-12">
                                <div class="timeline">
                                    <div class="timeline-item" ng-repeat="ls in vm.lichSuThayDoi">
                                        <div class="timeline-badge">
                                            <div class="timeline-icon">
                                                <em class="fa fa-history" ng-class="$index==0? 'font-green-haze':'font-red'"></em>
                                            </div>
                                        </div>
                                        <div class="timeline-body">
                                            <div class="timeline-body-arrow"> </div>
                                            <div class="timeline-body-content" style="margin-top: 0px;">
                                            <div class="portlet light" style="margin-bottom: 0px;">
                                            <div class="portlet-title tabbable-line">
                                                <div class="caption">
                                                    <em class="glyphicon glyphicon-time font-yellow-crusta"></em>
                                                    <span class="caption-subject bold font-yellow-crusta">Lúc {{ls.ngaySuaDoi | date :'dd/MM/yyyy HH:mm'}}</span>
                                                </div>
                                                <ul class="nav nav-tabs"  ng-if="ls.contentJsonObj.ThongTinDangKyThuoc.SoQuyetDinh.length>0">
                                                    <li class="active">
                                                        <a href="#portlet_taba{{ls.id}}" data-toggle="tab" aria-expanded="true"> SỐ ĐĂNG KÝ </a>
                                                    </li>
                                                    <li class="">
                                                        <a href="#portlet_tabb{{ls.id}}" data-toggle="tab" aria-expanded="false"> QUYẾT ĐỊNH </a>
                                                    </li>                                       
                                                </ul>
                                            </div>
                                            <div class="portlet-body">
                                                <div class="tab-content" style="padding:0">
                                                    <div class="tab-pane active" id="portlet_taba{{ls.id}}">
                                                    
                                                <table class="table table-bordered table-hover">
                                                    <thead>
                                                        <tr class="bg-blue font-white">
                                                            <th class="text-center">Số GPLH </th>
                                                            <th class="text-center" style="width:200px"> Tên thuốc </th>
                                                            <th class="text-center" style="width:200px"> Hoạt chất</th>
                                                            <th class="text-center" style="width:200px"> Hàm lượng </th>
                                                            <th class="text-center" style="width:200px"> Số quyết định </th>
                                                            <th class="text-center" style="width:200px"> Năm cấp </th>
                                                            <th class="text-center" style="width:200px"> Đợt cấp </th>
                                                            <th class="text-center" style="width:200px"> Dạng bào chế </th>
                                                            <th class="text-center" style="width:200px"> Quy cách đóng gói</th>
                                                            <th class="text-center" style="width:200px"> Tiêu chuẩn </th>
                                                            <th class="text-center"> Tuổi thọ </th>
                                                      
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td class="text-center">
                                                                {{ls.contentJsonObj.SoDangKy}}
                                                            </td>
                                                            <td>
                                                            {{ls.contentJsonObj.TenThuoc}}
                                                            </td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.HoatChatChinh}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.HamLuong}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinDangKyThuoc.SoQuyetDinh}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinDangKyThuoc.NgayCapSoDangKy | date :'dd/MM/yyyy'}}</td>
                                                            <td class="text-center">{{ls.contentJsonObj.ThongTinDangKyThuoc.DotCap}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.DangBaoChe}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.DongGoi}}</td>
                                                            <td>{{ls.contentJsonObj.ThongTinThuocCoBan.TieuChuan}}</td>
                                                            <td class="text-center">{{ls.contentJsonObj.ThongTinThuocCoBan.TuoiTho}}</td>
                                                          
                                                        </tr>
                                                        <tr>
                                                        <td colspan="11">
                                                            <form class="form-horizontal" role="form">
                                                            <div class="form-body">
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Công ty đăng ký</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTyDangKy.TenCongTyDangKy}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Địa chỉ  công ty đăng ký, nước đăng ký</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTyDangKy.DiaChiDangKy}}, {{ls.contentJsonObj.CongTyDangKy.NuocDangKy}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Công ty sản xuất</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTySanXuat.TenCongTySanXuat}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <label class="col-md-3 control-label">Địa chỉ công ty sản xuất, nước sản xuất</label>
                                                                <div class="col-md-9">
                                                                    <input type="text"  value= "{{ls.contentJsonObj.CongTySanXuat.DiaChiSanXuat}}, {{ls.contentJsonObj.CongTySanXuat.NuocSanXuat}}" class="form-control" placeholder="Readonly" readonly=""> </div>
                                                            </div>
                                                            </div>
                                                            </form>
                                                        </td>                                                           
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="tab-pane" id="portlet_tabb{{ls.id}}">
                                             <iframe ng-if='ls.contentJsonObj.ThongTinDangKyThuoc.UrlSoQuyetDinh.length>0' title="Xem tài liệu" style="width: 100%; height: 600px;border:0" ng-src="{{vm.trustSrc(vm.srcQuyetDinh(ls.contentJsonObj.ThongTinDangKyThuoc.UrlSoQuyetDinh))}}"  ></iframe>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
            };
        }
    ]);
})();
(function () {
    MyApp.directive('frontend.congbothuocvipham.viewcongvan', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                if (app.urlCongVanCongBoGiaThuoc != "") {
                    vm.taiLieuDinhKemUrl = "/File/GoToViewTaiLieu?url=" + app.urlCongVanCongBoGiaThuoc + "#zoom=100";
                } else {
                    vm.taiLieuDinhKemUrl = "";
                }
                vm.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="row form-group">
                            <div class="col-md-12">
                                <div class="portlet light bordered" style="height: 630px">
                                        <span ng-if="!vm.taiLieuDinhKemUrl || vm.taiLieuDinhKemUrl == ''">
                                    </span>
                                    <iframe ng-if='vm.taiLieuDinhKemUrl ||vm.taiLieuDinhKemUrl!=""' title="Xem tài liệu" style="width: 100%; height: 100%;border:0" ng-src="{{vm.trustSrc(vm.taiLieuDinhKemUrl)}}"  ></iframe>
                                </div>
                            </div>
                        </div>`,
            };
        }
    ]);
})();
(function () {
    MyApp.directive('frontend.congbothuocvipham.viewnguyenlieu', ['$compile', '$sce', '$templateRequest',
        function ($compile, $sce, $templateRequest) {
            var controller = ['$scope', '$window', function ($scope, $window) {
                var vm = this;
                vm.nguyenLieuCongBo = app.danhSachNguyenLieu;
            }];
            return {
                restrict: 'EA',
                scope: {
                },
                controller: controller,
                controllerAs: 'vm',
                bindToController: false,
                template: `<div class="container-fluid">
                            <table class="table table-bordered table-hover">
                                <thead>
                                    <tr class="bg-blue font-white">
                                        <th class="text-center" style="width:40px">STT</th>
                                        <th>Tên nguyên liệu </th>
                                        <th width="130" class="text-center"> Tiêu chuẩn </th>
                                        <th width="230" class="text-center"> Cơ sở sản xuất </th>
                                        <th class="text-center" style="width:200px"> Nước sản xuất </th>
                                        <th width="240" class="text-center"> Địa chỉ cơ sở sản xuất </th>
                                        <th class="text-center" style="width:200px"> Hoạt chất chuẩn </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr ng-repeat="ls in vm.nguyenLieuCongBo">
                                        <td class="text-center">{{$index + 1}}</td>
                                        <td>{{ls.tenNguyenLieu}}</td>
                                        <td class="text-center">{{ls.tieuChuanChatLuongNguyenLieu}}</td>
                                        <td>{{ls.tenCoSoSanXuatNguyenLieu}}</td>
                                        <td>{{ls.nuocSanXuatNguyenLieu}}</td>
                                        <td>{{ls.diaChiCoSoSanXuatNguyenLieu}}</td>
                                        <td>{{ls.tenHoatChatChuan}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>`,
            };
        }
    ]);
})();
;
MyApp.controller('frontend.congbotrungthauthuoc', [
    '$scope', '$sce', '$location', '$http', '$window', '$timeout', '$uibModal',
    function ($scope, $sce, $location, $http, $window, $timeout, $uibModal) {
        vm = this;
        vm.yearSelectorOptions = {
            start: "decade",
            depth: "decade"
        };
        vm.filterResetDto = {
            ngayQDTrungThau: null,
            thoiGianThucHien: null,
            donViTinhId: null,
            tenDonviTinh: null,
            nuocSanXuat: null,
        }
        var getThuocCongBoPagingService = (input, ajaxParams) => {
            return abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/davCongBoTrungThauThuoc/frontEnd_GetAllServerPaging',
                type: 'POST',
                data: JSON.stringify(input)
            }, ajaxParams));
        };

        //#region Tìm kiếm
        var chucnangTimKiem = () => {
            vm.isNangCaoFilter = false;
            vm.changeNangCaoFilter = ($event) => {
                vm.isNangCaoFilter = !vm.isNangCaoFilter;
                vm.filterCongBo = {};
            };

            $scope.totalRow = 0;
            $scope.keyWord = "";
            vm.switchFilter = 0;
            vm.changeSwitchFilter = function ($event, d) {
                $('#search_concept').text($event.currentTarget.firstChild.text);
                vm.switchFilter = d;
            };
            vm.filterCongBo = {};

        };
        //#endregion
        //#region Grid Data
        var gridThuocCongBo = () => {
            vm.refreshColumns = function () {
                vm.columns = [];
                var _colSTT = {
                    //field: "STT",
                    title: app.localize('STT'),
                    width: "45px",
                    headerAttributes: { style: "vertical-align: middle; text-align: center;" },
                    template: "<div class='row-number text-center'></div>"
                };
                var _colThaoTac = {
                    title: "Thao tác",
                    headerAttributes: { style: "vertical-align: middle; text-align: center;" },
                    width: "150px",
                    template: `<div class="ui-grid-cell-contents text-center">
                                                <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>
                                                    <button class="btn btn-xs blue-soft" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><em class="fa fa-cog"></em>Thao Tác<span class="caret"></span></button>
                                                    <ul uib-dropdown-menu>
                                                        <li><a ng-click="vm.createOrUpdate(this.dataItem)"><em class="fa fa-edit"></em>Sửa bản ghi </a></li>
                                                    </ul>
                                                </div>
                                            </div>`
                };
                var _colSoDangKy = {
                    field: "soDangKy",
                    title: "SĐK/GPNK",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "vertical-align: middle; text-align: center;" },
                    width: "200px"
                };
                var _colTenThuoc = {
                    field: "tenThuoc",
                    title: "Tên thuốc",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "vertical-align: middle; text-align: center;" },
                    width: "200px",
                    template: ""
                };
                var _colTenHoatChat = {
                    field: "hoatChat",
                    title: "Tên hoạt chất/ thành phần dược liệu",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "text-align: center; vertical-align: middle;" },
                    width: "200px"
                };
                var _colNongDoHamLuong = {
                    field: "hamLuong",
                    title: "Nồng độ hàm lượng",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "vertical-align: middle; text-align: center;" },
                    width: "200px"
                };

                var _colDuongDung = {
                    field: "duongDung",
                    title: "Đường dùng",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "vertical-align: middle; text-align: center;" },
                    width: 200
                };
                var _colDangBaoChe = {
                    field: "dangBaoChe",
                    title: "Dạng bào chế",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "vertical-align: middle; text-align: center;" },
                    width: "200px"
                };
                var _colCoSoSanXuat = {
                    field: "coSoSanXuat",
                    title: "Tên cơ sở sản xuất",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "vertical-align: right; text-align: center;" },
                    width: "200px"
                };
                var _colNuocSanXuat = {
                    field: "nuocSanXuat",
                    title: "Nước sản xuất",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "vertical-align: right; text-align: center;" },
                    width: "200px"
                };

                var _colQuyCachDongGoi = {
                    field: "quyCachDongGoi",
                    title: "Quy cách đóng gói",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "vertical-align: right; text-align: center;" },
                    width: "200px"
                };


                var _colDonViTinh = {
                    field: "tenDonViTinh",
                    title: "Đơn vị tính",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "vertical-align: right; text-align: center;" },
                    width: "200px"
                };

                var _colDonGia = {
                    field: "donGia",
                    title: "Đơn giá",
                    attributes: { class: "text-right", style: "font-weight: 600;color:green;" },
                    headerAttributes: { style: "vertical-align: right; text-align: center;" },
                    width: "200px",
                    template: `<div>{{this.dataItem.donGia | number}} VNĐ</div>`
                };
                var _colSoLuong = {
                    field: "soLuong",
                    title: "Số lượng",
                    attributes: { class: "text-right" },
                    headerAttributes: { style: "vertical-align: right;" },
                    width: "200px",
                    template: `<div>{{this.dataItem.soLuong | number}}</div>`

                };

                var _colThanhTien = {
                    field: "thanhTien",
                    title: "Thành tiền",
                    attributes: { class: "text-right", style: "font-weight: 600;color:green;" },
                    headerAttributes: { style: "vertical-align: right;" },
                    width: "200px",
                    template: `<div>{{this.dataItem.thanhTien | number}} VNĐ</div>`

                };


                var _colNhaThau = {
                    field: "tenNhaThau",
                    title: "Nhà thầu trúng thuốc",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "vertical-align: right; text-align: center;" },
                    width: "200px"
                };
                var _colGoiThuoc = {
                    field: "tenGoiThuoc",
                    title: "Gói thuốc",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "vertical-align: right; text-align: center;" },
                    width: "200px"
                };
                var _colThoiGianThucHien = {
                    title: "Thời gian thực hiện",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "vertical-align: right; text-align: center;" },
                    width: "200px",
                    template: "<div>{{this.dataItem.thoiGianThucHien | date:'dd/MM/yyyy'}}</div>"
                };
                var _colSoQDTrungThau = {
                    field: "soQDTrungThau",
                    title: "Số QĐ trúng thầu",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "vertical-align: right; text-align: center;" },
                    width: "200px",
                };
                var _colNgayQDTrungThau = {
                    title: "Ngày QĐ trúng thầu",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "vertical-align: right; text-align: center;" },
                    width: "200px",
                    template: "<div>{{this.dataItem.ngayQDTrungThau | date:'dd/MM/yyyy'}}</div>"
                };
                var _colTenBenhVienSoYTe = {
                    field: "tenBenhVien_SoYTe",
                    title: "Tên Bệnh viện/ Sở y tế",
                    attributes: { class: "text-left" },
                    headerAttributes: { style: "vertical-align: right; text-align: center;" },
                    width: "200px",
                };
                var setColForForm = function () {
                    vm.columns = [_colSTT, _colSoDangKy, _colTenThuoc, _colTenHoatChat, _colNongDoHamLuong, _colDuongDung, _colDangBaoChe,
                        _colCoSoSanXuat, _colNuocSanXuat, _colQuyCachDongGoi, _colDonViTinh, _colSoLuong, _colDonGia, _colThanhTien, _colNhaThau,
                        _colGoiThuoc, _colThoiGianThucHien, _colSoQDTrungThau, _colNgayQDTrungThau, _colTenBenhVienSoYTe];
                };
                setColForForm();
                vm.columnGrid = vm.columns;
            };
            vm.refreshColumns();
            vm.requestParams = {
                skipCount: 0,
                maxResultCount: 10,
                sorting: null
            };
            vm.refreshDataSource = function () {
                vm.setDataSource = function () {
                    vm.dataGrid = new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                $scope.totalRow = 0;
                                $scope.keyWord = "";
                                vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                                vm.requestParams.maxResultCount = options.data.pageSize;
                                var _req = {
                                    ...vm.filterCongBo,
                                    keyWord: vm.filterAll,
                                    loaiTimKiem: vm.switchFilter,

                                };
                                abp.ui.setBusy();
                                getThuocCongBoPagingService($.extend(_req, vm.requestParams))
                                    .then(function (result) {
                                        options.success(result);
                                        $scope.totalRow = result.totalCount;
                                        $scope.keyWord = vm.filterAll;
                                        $scope.$apply();
                                        $scope.filter = {};
                                        abp.ui.clearBusy();

                                    });

                            }
                        },
                        pageSize: 15,
                        serverPaging: true,
                        serverSorting: true,
                        sortable: true,
                        schema: {
                            data: "items",
                            total: "totalCount"
                        }
                    });
                };
                vm.setDataSource();
            };
            vm.refreshDataSource();
            vm.gridOptions = {
                pageable:
                {
                    "refresh": true,
                    "pageSizes": [5, 10, 15, 20, 50, 100],
                    messages: {
                        empty: "Không có dữ liệu",
                        display: "Hiển thị từ {0} đến {1}/{2} bản ghi",
                        itemsPerPage: "Bản ghi mỗi trang"
                    }
                },
                resizable: true,
                height: 800,
                scrollable: true,
                dataBound: function (e) {
                    var grid = this;
                    var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                    grid.tbody.find(".row-number").each(function () {
                        var index = record++;
                        $(this).html(index);
                    });
                    var rows = e.sender.tbody.children();
                    for (var j = 0; j < rows.length; j++) {
                        var row = $(rows[j]);
                        var dataItem = e.sender.dataItem(row);



                    }
                },
                columns: vm.columnGrid
            };
            function isValidDate(s) {
                if (s != null && s.length > 0) {
                    var bits = s.split('/');
                    var d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
                    return !!(d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]));
                } else {
                    return true;
                }
            }
            vm.search = function () {
                vm.dataGrid.read();
            }
            vm.refresh = function () {
                vm.filterAll = "";
                vm.textLocTheo = "Lọc theo";
                $('#search_concept').text(vm.textLocTheo);
                vm.filterCongBo = angular.copy(vm.filterResetDto);
                vm.switchFilter = 0;
                vm.search();
            }
        };

        //#endregion 
        function init() {
            chucnangTimKiem();
            gridThuocCongBo();
        };
        init();

    }
]);
;
MyApp.controller('ctrl.dangky', [
    '$scope', '$uibModal', '$location', '$sce', '$filter', '$http', '$window', 'FileUploader',
    function ($scope, $uibModal, $location, $sce, $filter, $http, $window, fileUploader) {
        var vm = this;
        vm.saving = false;
        vm.LOAI_HINH_DOANH_NGHIEP = [{
            id: 1,
            name: "DN/Cơ sở đăng ký trong nước"
        },
        {
            id: 2,
            name: "Doanh nghiệp nước ngoài"
        }];
        vm.dataFormInit = {
            MaSoThue: "",
            TenDoanhNghiep: "",
            TenTiengAnh: "",
            TenVietTat: "",
            DiaChi: "",
            LoaiHinhDoanhNghiepId: 1,
            SoDienThoai: "",
            Fax: "",
            Website: "",
            TinhId: null,
            HuyenId: null,
            XaId: null,
            EmailDoanhNghiep: "",
            TenDangNhap: "",
            EmailXacNhan: "",
            TenNguoiDaiDien: "",
            ChucVuNguoiDaiDienId: "",
            DienThoaiNguoiDaiDien: "",
            IsActive: true,
            Name: "",
            SurName: "",
            nguoiLienHes: [{ hoTen: '', chucVuId: '', dienThoai: '', email: '' }],
            checkNoMST: false,
            thoiGianHieuLucGiayPhep: null,
        };
        vm.dataForm = angular.copy(vm.dataFormInit);
        $scope.$watch('vm.dataForm.PhamViEnum', function (newval, oldval) {
            if (newval == 2) {
                vm.dataForm.checkNoMST = false;
                vm.dataForm.TinhId = null;
                vm.dataForm.HuyenId = null;
                vm.dataForm.XaId = null;
                vm.dataForm.SoGiayPhepChungNhan = null;
                vm.dataForm.SoGiayChungNhanDangKy = null;
            };
        });
        $scope.$watch('vm.dataForm.checkNoMST', function (newval, oldval) {
            if (newval) {
                vm.dataForm.MaSoThue = null;
                vm.dataForm.TenDangNhap = null;
                vm.dataForm.thoiGianHieuLucGiayPhep = null;
            }
        });
        vm.list = {
            Tinh: [],
            Huyen: [],
            Xa: [],
            LoaiHinhDoanhNghiep: [],
            ChucVu: []
        };
        vm.taiLieu = [];
        vm.loaiHinhOption = {
            dataSource: {
                transport: {
                    read: function (options1) {
                        $http.post('/api/services/app/loaihinhdoanhnghiep/getAllToDDL').then(function (response) {
                            vm.list.LoaiHinhDoanhNghiep = response.data.result;
                            options1.success(vm.list.LoaiHinhDoanhNghiep);
                        });
                    }
                }
            },
            dataValueField: "id",
            dataTextField: "name",
            optionLabel: app.localize('Chọn ...'),
            filter: "contains"
        };
        vm.chucVuOption = {
            dataSource: {
                transport: {
                    read: function (options1) {
                        $http.post('/api/services/app/chucvu/getAllToDDL').then(function (response) {
                            vm.list.ChucVu = response.data.result;
                            options1.success(vm.list.ChucVu);
                        });
                    }
                }
            },
            dataValueField: "id",
            dataTextField: "name",
            optionLabel: app.localize('Chọn ...'),
            filter: "contains"
        };
        vm.ddlTinhOptions = {
            dataSource: {
                transport: {
                    read: function (options) {
                        $http.post('/api/services/app/tinh/getAllToDDL').then(function (response) {
                            vm.list.Tinh = response.data.result;
                            options.success(vm.list.Tinh);
                        });
                    }
                }
            },
            dataValueField: "id",
            dataTextField: "name",
            optionLabel: "Chọn Tỉnh",
            filter: "contains"
        };
        //vm.ddlHuyenOptions = {
        //    dataSource: {
        //        transport: {
        //            read: function (options) {
        //                vm.huyenCallBack = options;
        //                $http.post('/api/services/app/huyen/getAllToDDL?tinhId=' + vm.dataForm.TinhId).then(function (response) {
        //                    vm.list.Huyen = response.data.result;
        //                    options.success(vm.list.Huyen);
        //                });
        //            }
        //        }
        //    },
        //    dataValueField: "id",
        //    dataTextField: "name",
        //    optionLabel: "Chọn Huyện",
        //    filter: "contains"
        //};
        vm.ddlXaOptions = {
            dataSource: {
                transport: {
                    read: function (options) {
                        vm.xaCallBack = options;
                        $http.post('/api/services/app/xa/getAllToDDL?tinhId=' + vm.dataForm.TinhId).then(function (response) {
                            vm.list.Xa = response.data.result;
                            options.success(vm.list.Xa);
                        });
                    }
                }
            },
            dataValueField: "id",
            dataTextField: "name",
            optionLabel: "Chọn Xã",
            filter: "contains"
        };

        vm.changeTinh = function () {
            vm.ddlXaOptions.dataSource.transport.read(vm.xaCallBack);
        }

        //vm.changeHuyen = function () {
        //    vm.ddlXaOptions.dataSource.transport.read(vm.xaCallBack);
        //}

        vm.changeXa = function () {
        }

        vm.SubmitForm = function () {
            if (validForm() == false) {
                return;
            }
            vm.changeMaSoThue();
            vm.taiLieuInput = angular.copy(vm.taiLieu);
            if (vm.taiLieuInput.length > 0) {
                if (vm.dataForm.PhamViEnum == 1) {
                    vm.taiLieuInput = vm.taiLieuInput.filter(function (item) {
                        return item.index == 0 || item.index == 3;
                    });
                }
                else {
                    vm.taiLieuInput = vm.taiLieuInput.filter(function (item) {
                        return item.index != 0 && item.index != 3;
                    });
                }
                if (vm.dataForm.PhamViEnum == 1) {
                    var tep1 = vm.taiLieuInput.filter(function (item) {
                        return item.tenTep != '' && item.tenTep != null && (item.loaiTepDinhKem == 0 || item.index == 0 || item.loaiTepDinhKem == 3 || item.index == 3);
                    });

                    if (tep1.length > 0) {
                        if (vm.dataForm.IsTonTaiGiayChungNhanDDKKDThuoc == true) {
                            var item = tep1.filter(x => x.index == 3);
                            if (!item){
                                abp.notify.error('', 'Giấy chứng nhận đăng ký doanh nghiệp đang thiếu');
                                return;
                            }
                        }
                        else {
                            if (tep1.length != 2) {
                                abp.notify.error('', 'Hồ sơ pháp lý thiếu dữ liệu. Xin vui lòng nhập thêm');
                                return;
                            }
                        }
                    }
                    else {
                        abp.notify.error('', 'Hồ sơ pháp lý thiếu dữ liệu. Xin vui lòng nhập thêm');
                        return;
                    }
                }
                else {
                    var tep1 = vm.taiLieuInput.filter(function (item) {
                        return item.tenTep != '' && item.tenTep != null && (item.loaiTepDinhKem == 1 || item.index == 1 || item.loaiTepDinhKem == 4 || item.index == 4);
                    });
                    if ((tep1.length != 2 && vm.dataForm.checkNoMST != true) || (tep1.length != 1 && vm.dataForm.checkNoMST == true)) {
                        abp.notify.error('', 'Hồ sơ pháp lý thiếu dữ liệu. Xin vui lòng nhập thêm');
                        return;
                    }
                }
            }
            vm.saving = true;
            vm.dataForm.SurName = angular.copy(vm.dataForm.TenNguoiDaiDien).split(" ").slice(0, -1).join(' ');
            vm.dataForm.Name = angular.copy(vm.dataForm.TenNguoiDaiDien).split(" ").slice(-1).join(' ');
            vm.dataForm.giayPhepPhapLys = vm.taiLieuInput;
            if (vm.dataForm.SurName != "" && vm.dataForm.SurName != null && vm.dataForm.SurName != undefined && vm.dataForm.Name != "" && vm.dataForm.Name != null && vm.dataForm.Name != undefined) {
                var input = {
                    DoanhNghiep: vm.dataForm
                };
                $http.post('/api/services/app/doanhnghiep/taoTaiKhoanDoanhNghiep', input)
                    .then(function (response) {
                        mess = response.data.result;
                        switch (mess) {
                            case "ok":
                                swal({
                                    title: "Bạn đã đăng ký thành công!",
                                    text: "Vui lòng kiểm tra email để xác nhận thông tin đăng ký của bạn!",
                                    icon: "success"
                                })
                                    .then(() => {
                                        window.location.href = "/";
                                    });
                                break;
                            case "email_da_co":
                                vm.saving = false;
                                abp.notify.error('', 'Email xác nhận đã được dùng để đăng ký trên hệ thống!');
                                break;
                            case "email_khong_ton_tai":
                                vm.saving = false;
                                abp.notify.error('', 'Email xác nhận không tồn tại!');
                                break;
                            case "ten_dang_nhap_khong_hop_le":
                                vm.saving = false;
                                abp.notify.error('', 'Tên đăng nhập không hợp lệ!');
                                break;
                            case "ten_dang_nhap_da_co":
                                vm.saving = false;
                                abp.notify.error('Hãy liên hệ với quản trị viên để xác minh', 'Mã số thuế đã được đăng ký!');
                                break;
                            case "so_giay_phep_thanh_lap_da_co":
                                vm.saving = false;
                                abp.notify.error('Hãy liên hệ với quản trị viên để xác minh', 'Số giấy phép thành lập đã được đăng ký!');
                                break;
                            case "vai_tro_doanh_nghiep_khong_ton_tai":
                                vm.saving = false;
                                abp.notify.error('Chức năng cần liên hệ với quản trị viên để xử lý', 'Vai trò doanh nghiệp không tồn tại!');
                                break;
                            case "userId_doanhNghiepId_IsNull":
                                vm.saving = false;
                                abp.notify.error('', 'Mời bạn nhấn lại nút Đăng ký!');
                                break;
                            case "co_loi_xay_ra":
                                vm.saving = false;
                                abp.notify.error('Hãy thử lại hoặc liên hệ với quản trị viên', 'Đã có lỗi xảy ra!');
                                break;
                        }
                    });
            }
            else {
                vm.saving = false;
                abp.notify.error('', 'Hãy nhập cả họ và tên người đại diện!');
            }
        };
        vm.ResetForm = function () {
            vm.dataForm = angular.copy(vm.dataFormInit);
        };
        vm.checkExistEmail = function () {
            if (vm.dataForm.EmailXacNhan != null && vm.dataForm.EmailXacNhan != "" && vm.dataForm.EmailXacNhan != undefined) {
                $http.post('/api/services/app/doanhnghiep/checkExistEmail?email=' + vm.dataForm.EmailXacNhan).then(function (response) {
                    if (response.data.result == true) {
                        abp.notify.error('', 'Email xác nhận đã tồn tại trên hệ thống!');
                    }
                });
            }
        };
        vm.checkExistEmailDoanhNghiep = function () {
            if (vm.dataForm.EmailDoanhNghiep != null && vm.dataForm.EmailDoanhNghiep != "" && vm.dataForm.EmailDoanhNghiep != undefined) {
                $http.post('/api/services/app/doanhnghiep/checkExistEmail?email=' + vm.dataForm.EmailDoanhNghiep)
                    .then(function (response) {
                        if (response.data.result == true) {
                            abp.notify.error('', 'Email doanh nghiệp đã tồn tại trên hệ thống!');
                        }
                    });
            }
        };
        vm.checkExistSoGiayPhepThanhLap = function () {
            if (vm.dataForm.SoGiayPhepThanhLap != null && vm.dataForm.SoGiayPhepThanhLap != "" && vm.dataForm.SoGiayPhepThanhLap != undefined) {
                //$http.post('/api/services/app/doanhnghiep/checkExistSoGiayPhepThanhLap?soGiayPhepThanhLap=' + vm.dataForm.SoGiayPhepThanhLap).then(function (response) {
                //    if (response.data.result == true) {
                //        abp.notify.error('', 'Số giấy phép thành lập Văn phòng đại diện tại VN đã được sử dụng!');
                //    }
                //});
            }
            if (vm.dataForm.SoGiayPhepThanhLap == null || vm.dataForm.SoGiayPhepThanhLap == "" || vm.dataForm.SoGiayPhepThanhLap == undefined) {
                abp.notify.error('', 'Số giấy phép thành lập Văn phòng đại diện tại VN không hợp lệ!');
            }
        };
        vm.checkExistTenDangNhap = function () {
            if (vm.dataForm.TenDangNhap != null && vm.dataForm.TenDangNhap != "" && vm.dataForm.TenDangNhap != undefined) {
                $http.post('/api/services/app/doanhnghiep/checkExistTenDangNhap?tenDangNhap=' + vm.dataForm.TenDangNhap).then(function (response) {
                    if (response.data.result == true) {
                        abp.notify.error('', 'Tên đăng nhập đã được sử dụng!');
                    }
                });
            }
        };
        vm.checkValidURL = function () {
            if (vm.dataForm.Website != null && vm.dataForm.Website != "" && vm.dataForm.Website != undefined) {
                if (ValidURL(vm.dataForm.Website) == false) {
                    abp.notify.error('', 'Tên website không hợp lệ');
                }
            }
        };

        // Check năm thành lập
        function yearValidation(year) {
            var current_year = new Date().getFullYear();
            if (year > current_year) {
                return false;
            }
        }

        // Check số điện thoại
        function isValidSDT(sdt) {
            var regex = /^[0-9]{10,11}$/;
            return regex.test(sdt)
        };

        function newValidSDT(sdt) {
            var n = sdt.length;
            if (n > 8 && n < 19) {
                var regex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
                return regex.test(sdt)
            }
        };

        //check định dạng email
        function isValidEmail(email) {
            var regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return regex.test(email)
        };

        function validForm() {
            var valid = true;
            //var PHONE_REGEXP = /^[0-9]{9,11}*$/;
            if ((vm.dataForm.SoGiayPhepChungNhan == null || vm.dataForm.SoGiayPhepChungNhan == '') && vm.dataForm.PhamViEnum == 1 && vm.dataForm.IsTonTaiGiayChungNhanDDKKDThuoc != true) {
                abp.notify.error('', 'Số giấy chứng nhận điều kiện kinh doanh không được để trống'); valid = false;
            }
            if ((vm.dataForm.SoGiayChungNhanDangKy == null || vm.dataForm.SoGiayChungNhanDangKy == '') && vm.dataForm.PhamViEnum == 1) {
                abp.notify.error('', 'Số giấy chứng nhận đăng ký doanh nghiệp không được để trống'); valid = false;
            }
            if ((vm.dataForm.SoGiayPhepThanhLap == null || vm.dataForm.SoGiayPhepThanhLap == '') && vm.dataForm.PhamViEnum == 2) {
                abp.notify.error('', 'Số giấy phép thành lập Văn phòng đại diện không được để trống'); valid = false;
            }
            if ((vm.dataForm.GiayThongBaoMaSoThue == null || vm.dataForm.GiayThongBaoMaSoThue == '') && vm.dataForm.PhamViEnum == 2 && vm.dataForm.checkNoMST == false) {
                abp.notify.error('', 'Giấy thông báo mã số thuế không được để trống'); valid = false;
            }
            if (vm.dataForm.PhamViEnum == null || vm.dataForm.PhamViEnum == '') {
                abp.notify.error('', 'Loại hình không được để trống'); valid = false;
            }
            else if ((vm.dataForm.MaSoThue == null || vm.dataForm.MaSoThue == '') && vm.dataForm.checkNoMST != true) {
                abp.notify.error('', 'Mã số thuế doanh nghiệp không được để trống'); valid = false;
            }
            else if ((vm.dataForm.TenDoanhNghiep == null || vm.dataForm.TenDoanhNghiep == '') && vm.dataForm.PhamViEnum == 1) {
                abp.notify.error('', 'Tên doanh nghiệp không được để trống'); valid = false;
            }
            else if (vm.dataForm.PhamViEnum == 2 && (vm.dataForm.TenTiengAnh == '' || vm.dataForm.DiaChiTiengAnh == '')) {
                abp.notify.error('', 'Tên tiếng Anh và Địa chỉ tiếng Anh không được để trống'); valid = false;
            }
            else if (vm.dataForm.NamThanhLap != null && vm.dataForm.NamThanhLap != '' && vm.dataForm.NamThanhLap.length != 4 && angular.isNumber(vm.dataForm.NamThanhLap) == false) {
                abp.notify.error('', 'Năm thành lập doanh nghiệp phải là kiểu số và có 4 ký tự'); valid = false;
            }
            else if (yearValidation(vm.dataForm.NamThanhLap) == false) {
                abp.notify.error('', 'Năm thành lập doanh nghiệp phải nhỏ hơn năm hiện tại'); valid = false;
            }
            else if ((vm.dataForm.DiaChi == null || vm.dataForm.DiaChi == '') && vm.dataForm.PhamViEnum == 1) {
                abp.notify.error('', 'Địa chỉ chi tiết không được để trống'); valid = false;
            }
            else if ((vm.dataForm.TinhId == null || vm.dataForm.TinhId == '') && vm.dataForm.PhamViEnum == 1) {
                abp.notify.error('', 'Tỉnh/Thành phố không được để trống'); valid = false;
            }
            //else if ((vm.dataForm.HuyenId == null || vm.dataForm.HuyenId == '') && vm.dataForm.PhamViEnum == 1) {
            //    abp.notify.error('', 'Huyện không được để trống'); valid = false;
            //}
            else if ((vm.dataForm.XaId == null || vm.dataForm.XaId == '') && vm.dataForm.PhamViEnum == 1) {
                abp.notify.error('', 'Xã không được để trống'); valid = false;
            }
            else if (vm.dataForm.SoDienThoai == null || vm.dataForm.SoDienThoai == '' || !newValidSDT(vm.dataForm.SoDienThoai)) {
                abp.notify.error('', 'Số điện thoại trong mục địa chỉ đang để trống hoặc sai định dạng'); valid = false;
            }

            else if (vm.dataForm.EmailDoanhNghiep == null || vm.dataForm.EmailDoanhNghiep == '' || !isValidEmail(vm.dataForm.EmailDoanhNghiep)) {
                abp.notify.error('', 'Email doanh nghiệp trống hoặc không đúng định dạng'); valid = false;
            }
            else if ((vm.dataForm.TenDangNhap == null || vm.dataForm.TenDangNhap == '') && vm.dataForm.checkNoMST != true) {
                abp.notify.error('', 'Tài khoản đăng nhập không được để trống'); valid = false;
            }
            else if (vm.dataForm.EmailXacNhan == null || vm.dataForm.EmailXacNhan == '' || !isValidEmail(vm.dataForm.EmailXacNhan)) {
                abp.notify.error('', 'Email người đại diện trống hoặc không đúng định dạng'); valid = false;
            }
            else if (vm.dataForm.TenNguoiDaiDien == null || vm.dataForm.TenNguoiDaiDien == '') {
                abp.notify.error('', 'Họ và tên người đại diện không được để trống'); valid = false;
            }
            else if (vm.dataForm.DienThoaiNguoiDaiDien && !newValidSDT(vm.dataForm.DienThoaiNguoiDaiDien)) {
                abp.notify.error('', 'Số điện thoại người đại diện không đúng định dạng '); valid = false;
            }
            else if (vm.dataForm.PhamViEnum == 2 && ((vm.dataForm.TenVanPhong == null || vm.dataForm.TenVanPhong == '') || (vm.dataForm.DienThoaiVanPhong == null || vm.dataForm.DienThoaiVanPhong == '') || (vm.dataForm.DiaChiVanPhong == null || vm.dataForm.DiaChiVanPhong == ''))) {
                abp.notify.error('', 'Thông tin văn phòng đại diện không được để trống'); valid = false;
            }
            else if (vm.dataForm.DienThoaiVanPhong && !newValidSDT(vm.dataForm.DienThoaiVanPhong)) {
                abp.notify.error('', 'Điện thoại văn phòng đại diện không đúng định dạng'); valid = false;
            }
            if (valid == true) {
                for (var i = 0; i < vm.dataForm.nguoiLienHes.length; i++) {
                    if (vm.dataForm.nguoiLienHes[i].hoTen == null || vm.dataForm.nguoiLienHes[i].hoTen == '') {
                        valid = false; abp.notify.error("Họ và tên người liên hệ không được để trống.");
                        return valid;
                    }
                    if (!newValidSDT(vm.dataForm.nguoiLienHes[i].dienThoai)) {
                        valid = false; abp.notify.error("Điện thoại người liên hệ không đúng định dạng");
                        return valid;
                    }

                }
            }
            return valid;
        };
        vm.changeMaSoThue = function () {
            if (vm.dataForm.MaSoThue != null && vm.dataForm.MaSoThue != "" && vm.dataForm.MaSoThue != undefined) {
                vm.dataForm.TenDangNhap = locdau(vm.dataForm.MaSoThue);
            }
        };
        vm.layEmailDoanhNghiep = function () {
            vm.dataForm.EmailXacNhan = angular.copy(vm.dataForm.EmailDoanhNghiep);
            vm.checkExistEmail();
        };
        vm.xemHuongDan = function () {
            vm.modalInstanceInfo = $uibModal.open({
                animation: true,
                templateUrl: 'frmHuongDanModal.html',
                size: 'lg',
                keyboard: false,
                scope: $scope
            });
            vm.closeModal = function () {
                vm.modalInstanceInfo.dismiss('cancel');
            };
        };
        function locdau(str) {
            str = str.toLowerCase();
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g, "_");
            str = str.replace(/-+-/g, "_");
            str = str.replace(/-/g, "_");
            str = str.replace(/^\-+|\-+$/g, "");
            return str;
        }
        vm.addNewNguoiLienHe = function () {
            vm.dataForm.nguoiLienHes.push({ hoTen: '', chucVuId: '', dienThoai: '', email: '' });
        };
        vm.removeNguoiLienHe = function (i) {
            vm.dataForm.nguoiLienHes.splice(i, 1);
        };
        vm.xemFilePDF = function (pathPDF, title) {
            vm.pathPDF = "/File/GoToViewTaiLieu?url=" + pathPDF;
            vm.modalInstanceInfo = $uibModal.open({
                animation: true,
                templateUrl: 'frmViewTaiLieu.html',
                size: 'lg',
                keyboard: false,
                scope: $scope
            });
            vm.closeModal = function () {
                vm.modalInstanceInfo.dismiss('cancel');
            };
        };
        //Function
        vm.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }
        //Form chi tiet
        {
            vm.createGUID = function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }
            vm.nameFolder = vm.createGUID();
            vm.uploader = function (tepItem) {
                var uploader = new fileUploader({
                    url: abp.appPath + 'File/UploadTempFile?maSoThue=' + vm.nameFolder,
                    headers: {
                        "X-XSRF-TOKEN": abp.security.antiForgery.getToken()
                    },
                    queueLimit: 1,
                    autoUpload: true,
                    removeAfterUpload: true,
                    filters: [{
                        name: 'excelFilter',
                        fn: function (item, options) {
                            var _extension = "." + item.name.split('.').pop().toLowerCase();
                            if (['.pdf'].indexOf(_extension) === -1) {
                                abp.message.error(app.localize('Không đúng định dạng tập tin cho phép (.pdf)'));
                                $("#tailieu_" + tepItem.index).val('');
                                return false;
                            }
                            else {
                                if (item.size > 15145728) {
                                    abp.message.error(app.localize('Dung lượng tập tin đính kèm vượt quá giới hạn cho phép (15MB)'));
                                    return false;
                                }
                                return true;
                            }
                        }
                    }]
                });
                uploader.onSuccessItem = function (item, ajaxResponse, status) {
                    if (ajaxResponse.success) {
                        var objTailieuItem = $filter('filter')(vm.taiLieu, { index: tepItem.index }, true);
                        if (objTailieuItem && objTailieuItem[0]) {
                            objTailieuItem[0].loaiTepDinhKem = tepItem.index;
                            objTailieuItem[0].tenTep = ajaxResponse.result.fileName;
                            objTailieuItem[0].duongDanTep = ajaxResponse.result.pathName;
                            objTailieuItem[0].IsNew = true;
                        }
                        abp.notify.info('Upload thành công');
                    } else {
                        abp.message.error(ajaxResponse.error.message);
                    }
                };
                return uploader;
            };
            vm.themUploadFile = function () {
                vm.taiLieu.push({
                    index: vm.taiLieu.length + 1,
                    loaiTepDinhKem: 1,
                    tenTep: '',
                    duongDanTep: ''
                });
            };
            vm.xoaUploadFile = function (item) {
                if (vm.taiLieu.length > 0) {
                    var index = vm.taiLieu.indexOf(item);
                    vm.taiLieu.splice(index, 1);
                }
                var idx = 0;
                angular.forEach(vm.taiLieu, function (value, key) {
                    value.index = (++idx);
                });
            };
            vm.copyEmail = function () {
                vm.dataForm.EmailXacNhan = vm.dataForm.EmailDoanhNghiep;
            };
        }
    }
]);;

MyApp.controller('frontend.danhsachcosochuangxp', [
    '$scope', '$sce', '$location', '$http', '$window', '$timeout', '$uibModal',
    function ($scope, $sce, $location, $http, $window, $timeout, $uibModal) {
        vm = this;
        var getDanhSachCongBoCSSXChuanGxP = (input, ajaxParams) => {
            return abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/danhMucCoSoDatChuanGxP/GetAllPublicServerPaging',
                type: 'POST',
                data: JSON.stringify(input)
            }, ajaxParams));
        };
        
        //#region Tìm kiếm
        {
            var chucnangTimKiem = () => {
                vm.isNangCaoFilter = false;
                vm.changeNangCaoFilter = ($event) => {
                    vm.isNangCaoFilter = !vm.isNangCaoFilter;
                    vm.filterAll = "";
                    vm.traCuuNangCao = {};
                };
                $scope.$watch('vm.filterAll', function myfunction() {
                    if (vm.filterAll != null && vm.filterAll != "") {
                        vm.isNangCaoFilter = false;
                        vm.traCuuNangCao = {};
                    }
                })
                $scope.totalRow = 0;
                $scope.keyWord = "";
                vm.switchFilter = 0;
                vm.changeSwitchFilter = function ($event, d) {
                    $('#search_concept').text($event.currentTarget.firstChild.text);
                    vm.switchFilter = d;
                };
                vm.traCuuNangCao = {};
                vm.refreshFilter = function () {
                    vm.filterAll = "";
                    vm.traCuuNangCao = {};
                    vm.getGridData();
                };
            };
        }
        //#endregion


        //#region Grid Data
        var gridThuocCongBo = () => {
            vm.refreshColumns = function () {
                vm.columns = [];
                var _colSTT = {
                    field: "stt",
                    title: app.localize('STT'),
                    template: "<div class='row-number text-center'></div>",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 40
                };

                var _colTenCoSo = {
                    field: "tenCoSo",
                    title: app.localize('Tên cơ sở'),
                    template: "{{this.dataItem.tenCoSo}}",
                    width: 220
                };

                var _colDiaChiCoSo = {
                    field: "diaChiCoSo",
                    title: app.localize('Địa chỉ cơ sở'),
                    template: "{{this.dataItem.diaChiCoSo}}",
                    width: 220
                };

                var _colPhamViChungNhan = {
                    field: "phamViChungNhan",
                    title: app.localize('Phạm vi chứng nhận'),
                    //template: "{{this.dataItem.phamViChungNhan}}",
                    template: `<div ng-repeat="item in this.dataItem.phamViChungNhanGxP">
                             <div class="text-bold" ng-if="item.level == 1">
                                * {{item.content}}
                            </div>
                            <div ng-if="item.level == 2 && (item.noiDungChiTiet == null || item.noiDungChiTiet == '')">
                                &emsp;+ {{item.content}}
                            </div>
                            <div ng-if="item.level == 2 && item.noiDungChiTiet != null && item.noiDungChiTiet != ''">
                                &emsp;+ {{item.content}} ({{item.noiDungChiTiet}})
                            </div>
                            <div ng-if="item.level == 3">
                                <em>
                                    &emsp;&emsp;- {{item.content}} ({{item.noiDungChiTiet}})
                                </em>
                            </div>
                    </div>`,
                    width: 250
                };

                var _colGhiChu = {
                    field: "ghiChu",
                    title: app.localize('Nội dung hạn chế hoặc làm liên quan đến phạm vi chứng nhận'),
                    template: `
                        <div>
                            <div ng-if="this.dataItem.ghiChu">
                                * {{this.dataItem.ghiChu}}
                            </div>
                            <div ng-if="this.dataItem.ghiChu_TiengAnh">
                                * {{this.dataItem.ghiChu_TiengAnh}}
                            </div>
                        </div>
                    `,
                    width: 250
                };


                var _colTieuChuan = {
                    field: "tieuChuan",
                    title: app.localize('Tiêu chuẩn'),
                    template: "{{this.dataItem.tieuChuan}}",
                    width: 100
                };

                var _colGiayChungNhan = {
                    title: "Giấy chứng nhận",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    columns: [
                        {
                            field: "maSo",
                            title: "Mã số",
                            width: "90px"
                        },
                        {
                            field: "ngayCap",
                            title: "Ngày cấp",
                            attributes: { class: "text-center" },
                            width: "90px"
                        },
                        {
                            field: "ngayHetHan",
                            title: 'Ngày hết hạn',
                            width: "90px"
                        }
                    ]
                };
                var setColForForm = function () {
                    vm.columns = [_colSTT, _colTenCoSo, _colDiaChiCoSo, _colPhamViChungNhan, _colGhiChu, _colTieuChuan, _colGiayChungNhan];
                };
                setColForForm();
                vm.columnGiaThuoc = vm.columns;
            };
            vm.refreshColumns();
            vm.requestParams = {
                skipCount: 0,
                maxResultCount: 10,
                sorting: null
            };

            vm.traCuuNangCao = {};

            vm.refreshDataSource = function () {
                vm.danhSachCoSoSanXuatChuanGxP = [];
                vm.setDataSource = function () {
                    vm.danhSachCoSoSanXuatChuanGxP = new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                $scope.totalRow = 0;
                                $scope.keyWord = "";
                                vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                                vm.requestParams.maxResultCount = options.data.pageSize;
                                var _req = {
                                    filter: vm.filterAll,
                                    thongTinCoSoDatChuanGxP: vm.traCuuNangCao
                                };
                                if (!vm.isNangCaoFilter) {
                                    switch (vm.switchFilter) {
                                        case 1:
                                            _req.thongTinCoSoDatChuanGxP.tieuChuan = vm.filterAll;
                                            _req.filter = "";
                                            break;
                                        case 2:
                                            _req.thongTinCoSoDatChuanGxP.maSo = vm.filterAll;
                                            _req.filter = "";
                                            break;
                                        default:
                                            _req.filter = vm.filterAll;
                                            break;
                                    }
                                }
                                getDanhSachCongBoCSSXChuanGxP($.extend(_req, vm.requestParams))
                                    .then(function (result) {
                                        options.success(result);
                                        $scope.totalRow = result.totalCount;
                                        $scope.keyWord = vm.filterAll;
                                        $scope.$apply();
                                        $scope.filter = {};
                                    });
                            }
                        },
                        pageSize: 15,
                        serverPaging: true,
                        serverSorting: true,
                        sortable: true,
                        schema: {
                            data: "items",
                            total: "totalCount"
                        }
                    });
                };
                vm.setDataSource();
            };
            vm.refreshDataSource();
            vm.thuocCongBoGridOptions = {
                pageable:
                {
                    "refresh": true,
                    "pageSizes": [5, 10, 15, 20, 50, 100],
                    messages: {
                        empty: "Không có dữ liệu",
                        display: "Hiển thị từ {0} đến {1}/{2} bản ghi",
                        itemsPerPage: "Bản ghi mỗi trang"
                    }
                },
                resizable: true,
                height: 800,
                scrollable: true,
                dataBound: function (e) {
                    var grid = this;
                    var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                    grid.tbody.find(".row-number").each(function () {
                        var index = record++;
                        $(this).html(index);
                    });
                },
                columns: vm.columnGiaThuoc
            };
            function isValidDate(s) {
                if (s != null && s.length > 0) {
                    var bits = s.split('/');
                    var d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
                    return !!(d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]));
                } else {
                    return true;
                }
            }
            vm.getGridData = function () {
                var ngayCap = vm.traCuuNangCao.ngayCap;
                var ngayHetHan = vm.traCuuNangCao.ngayHetHan;
                if ((ngayCap != 'undefined' && !isValidDate(ngayCap)) || (ngayHetHan != 'undefined' && !isValidDate(ngayHetHan))) {
                    abp.notify.error("Ngày cấp hoặc ngày hết hạn không đúng định dạng!");
                    return;
                }
                else {
                    vm.danhSachCoSoSanXuatChuanGxP.read();
                }
            };
        };
        var initDataHistory = () => {
            vm.histories = [];
        };
        //#endregion 
        function init() {
            chucnangTimKiem();
            gridThuocCongBo();
            initDataHistory();
        };
        init();
        vm.viewCongVan = (url) => {
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn kiến nghị</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congbothuocvipham.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
        vm.viewCongVanById = (id) => {
            var _id = parseInt(id);
            var f = vm.getByParentPagingServiceDS.filter(x => x.id == _id);
            var url = "";
            if (f.length > 0) {
                url = f[0].urlCongVanKienNghiDieuChinhGia;
            }
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn kiến nghị</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congbothuocvipham.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
        vm.viewLichSu = (d) => {
            app.soDangKyId = d.id;
            app.danhSachLichSu = [];
            var getHistoryService = (soDangKyId, ajaxParams) => {
                return abp.ajax($.extend({
                    url: abp.appPath + 'api/services/app/davSoDangKyHistory/GetHistory' + abp.utils.buildQueryString([{ name: 'soDangKyId', value: soDangKyId }]) + '',
                    type: 'POST',
                    data: JSON.stringify({})
                }, ajaxParams));
            };
            if (app.soDangKyId > 0) {
                getHistoryService(app.soDangKyId)
                    .then(function (result) {
                        app.danhSachLichSu = result;
                        var modalInstance = $uibModal.open({
                            template: `
                                <div class="modal-header">
                                <span class="caption-subject bold uppercase">Lịch sử thay đổi thông tin số đăng ký</span>
                                </div>
                                <div class="modal-body">
                                <div frontend.congbothuocvipham.viewlichsu></div>
                                </div>
                                <div class="modal-footer">
                                <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                                </div>
                                `,
                            size: 'lg',
                            windowClass: 'my-modal-popup',
                            resolve: {
                                thuoc: d
                            },
                            controller: ['$scope', '$uibModalInstance', 'thuoc', function ($scope, $uibModalInstance, thuoc) {
                                $scope.thuoc = thuoc;
                                app.IsNullOrEmpty = function (o) {
                                    f = false;
                                    if (typeof (o) === 'undefined') f = true;
                                    if (o == null) f = true;
                                    o = String(o);
                                    if (o == '') f = true;
                                    return f;
                                };
                                $scope.cancel = function () {
                                    $uibModalInstance.close();
                                };
                            }]
                        });
                    });
            }
        };
        vm.viewNguyenLieu = (d) => {
            app.soDangKyThuoc = d.soDangKy;
            app.danhSachNguyenLieu = [];
            var getNguyenLieuService = (soDangKy, ajaxParams) => {
                return abp.ajax($.extend({
                    url: abp.appPath + 'api/services/app/nguyenLieuLamThuoc/GetNguyenLieuTheoSoDangKy' + abp.utils.buildQueryString([{ name: 'soDangKy', value: soDangKy }]) + '',
                    type: 'POST',
                    data: JSON.stringify({})
                }, ajaxParams));
            };
            if (app.soDangKyThuoc.length > 0) {
                getNguyenLieuService(app.soDangKyThuoc)
                    .then(function (result) {
                        app.danhSachNguyenLieu = result;
                        var modalInstance = $uibModal.open({
                            template: `
                                <div class="modal-header">
                                <span class="caption-subject bold uppercase">Danh sách nguyên liệu công bố</span>
                                </div>
                                <div class="modal-body">
                                <div frontend.congbothuocvipham.viewnguyenlieu></div>
                                </div>
                                <div class="modal-footer">
                                <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                                </div>
                                `,
                            size: 'lg',
                            windowClass: 'my-modal-popup',
                            resolve: {
                                thuoc: d
                            },
                            controller: ['$scope', '$uibModalInstance', 'thuoc', function ($scope, $uibModalInstance, thuoc) {
                                $scope.thuoc = thuoc;
                                app.IsNullOrEmpty = function (o) {
                                    var f = false;
                                    if (typeof (o) === 'undefined') f = true;
                                    if (o == null) f = true;
                                    o = String(o);
                                    if (o == '') f = true;
                                    return f;
                                };
                                $scope.cancel = function () {
                                    $uibModalInstance.close();
                                };
                            }]
                        });
                    });
            }
        };
    }
]);
;

MyApp.controller('frontend.danhsachcososanxuatnuocngoaidapunggmp', [
    '$scope', '$sce', '$location', '$http', '$window', '$timeout', '$uibModal',
    function ($scope, $sce, $location, $http, $window, $timeout, $uibModal) {
        vm = this;
        var getDanhSachCoSoDuocChungNhanGMPNuocNgoai = (input, ajaxParams) => {
            return abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/danhSachCoSoDuocChungNhanGMPNuocNgoai/getAllPublicServerPaging',
                type: 'POST',
                data: JSON.stringify(input)
            }, ajaxParams));
        };
        
        //#region Tìm kiếm
        {
            var chucnangTimKiem = () => {
                vm.isNangCaoFilter = false;
                vm.changeNangCaoFilter = ($event) => {
                    vm.isNangCaoFilter = !vm.isNangCaoFilter;
                    vm.filterAll = "";
                    vm.traCuuNangCao = {};
                };
                $scope.$watch('vm.filterAll', function myfunction() {
                    if (vm.filterAll != null && vm.filterAll != "") {
                        vm.isNangCaoFilter = false;
                        vm.traCuuNangCao = {};
                    }
                })
                $scope.totalRow = 0;
                $scope.keyWord = "";
                vm.switchFilter = 0;
                vm.changeSwitchFilter = function ($event, d) {
                    $('#search_concept').text($event.currentTarget.firstChild.text);
                    vm.switchFilter = d;
                };
                vm.traCuuNangCao = {};
                vm.refreshFilter = function () {
                    vm.filterAll = "";
                    vm.traCuuNangCao = {};
                    vm.getGridData();
                };
            };
        }
        //#endregion


        //#region Grid Data
        var gridThuocCongBo = () => {
            vm.refreshColumns = function () {
                vm.columns = [];
                var _colSTT = {
                    field: "stt",
                    title: app.localize('STT'),
                    template: "<div class='row-number text-center'></div>",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    headerAttributes: { style: "text-align: top;" },
                    width: 40
                };

                var _colIDCC = {
                    field: "idCC",
                    title: app.localize('IDCC'),
                    template: "{{this.dataItem.idCC}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    headerAttributes: { style: "text-align: top;" },
                    width: 60
                };

                var _colIDCT = {
                    field: "idCongTy",
                    title: app.localize('ID Công ty'),
                    template: "{{this.dataItem.idCongTy}}",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    headerAttributes: { style: "text-align: top;" },
                    width: 60
                };

                var _colTenCoSo = {
                    field: "tenCoSo",
                    title: app.localize('Tên cơ sở sản xuất'),
                    template: "{{this.dataItem.tenCoSo}}",
                    headerAttributes: { style: "text-align: top;" },
                    width: 220
                };

                var _colDiaChiCoSo = {
                    field: "diaChiCoSo",
                    title: app.localize('Địa chỉ cơ sở sản xuất'),
                    template: "{{this.dataItem.diaChiCoSo}}",
                    headerAttributes: { style: "text-align: top;" },
                    width: 220
                };

                var _colPhamViChungNhan = {
                    field: "phamViChungNhan",
                    title: app.localize('Phạm vi chứng nhận'),
                    template: `<span align='center' style="white-space: pre-line;">{{this.dataItem.phamViChungNhan}}</span>`,
                    headerAttributes: { style: "text-align: top;" },
                    width: 400
                };

                var _colNguyenTacGMP = {
                    field: "nguyenTacGMP",
                    title: app.localize('Nguyên tắc GMP'),
                    template: "{{this.dataItem.nguyenTacGMP}}",
                    headerAttributes: { style: "text-align: top;" },
                    width: 60
                };
                var _colCoQuanCap = {
                    field: "coQuanCap",
                    title: app.localize('Cơ quan cấp'),
                    template: "{{this.dataItem.coQuanCap}}",
                    headerAttributes: { style: "text-align: top;" },
                    width: 100
                };
                var _colDotCongBo = {
                    field: "dotCongBo",
                    title: app.localize('Đợt công bố'),
                    template: "{{this.dataItem.dotCongBo}}",
                    headerAttributes: { style: "text-align: top;" },
                    width: 40
                };

                var _colGiayChungNhan = {
                    title: "Giấy chứng nhận",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: top;" },
                    columns: [
                        {
                            field: "giayChungNhan",
                            title: "Mã số",
                            width: "80px",
                            attributes: { style: "overflow-wrap: break-word;" },
                            template: "{{this.dataItem.giayChungNhan}}",
                        },
                        {
                            field: "ngayCap",
                            title: "Ngày cấp",
                            attributes: { class: "text-center" },
                            template: "{{this.dataItem.ngayCap | date:'dd/MM/yyyy'}}",
                            width: "80px"
                        },
                        {
                            field: "ngayHetHan",
                            title: 'Ngày hết hạn',
                            template: "{{this.dataItem.ngayHetHan | date:'dd/MM/yyyy'}}",
                            width: "80px"
                        },
                    ]
                };
                var setColForForm = function () {
                    vm.columns = [_colSTT, _colIDCC, _colIDCT, _colTenCoSo, _colDiaChiCoSo, _colPhamViChungNhan, _colNguyenTacGMP, _colGiayChungNhan, _colCoQuanCap, _colDotCongBo];
                };
                setColForForm();
                vm.columnCoSo = vm.columns;
            };
            vm.refreshColumns();
            vm.requestParams = {
                skipCount: 0,
                maxResultCount: 10,
                sorting: null
            };

            vm.traCuuNangCao = {};

            vm.refreshDataSource = function () {
                vm.danhSachCoSoSanXuatNuocNgoaiDapUngGMP = [];
                vm.setDataSource = function () {
                    vm.danhSachCoSoSanXuatNuocNgoaiDapUngGMP = new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                $scope.totalRow = 0;
                                $scope.keyWord = "";
                                vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                                vm.requestParams.maxResultCount = options.data.pageSize;
                                var _req = {
                                    filter: vm.filterAll,
                                    thongTinCoSoGMPNuocNgoai: vm.traCuuNangCao
                                };
                                if (!vm.isNangCaoFilter) {
                                    switch (vm.switchFilter) {
                                        case 1:
                                            _req.thongTinCoSoGMPNuocNgoai.tieuChuan = vm.filterAll;
                                            _req.filter = "";
                                            break;
                                        case 2:
                                            _req.thongTinCoSoGMPNuocNgoai.maSo = vm.filterAll;
                                            _req.filter = "";
                                            break;
                                        default:
                                            _req.filter = vm.filterAll;
                                            break;
                                    }
                                }
                                getDanhSachCoSoDuocChungNhanGMPNuocNgoai($.extend(_req, vm.requestParams))
                                    .then(function (result) {
                                        options.success(result);
                                        $scope.totalRow = result.totalCount;
                                        $scope.keyWord = vm.filterAll;
                                        $scope.$apply();
                                        $scope.filter = {};
                                    });
                            }
                        },
                        pageSize: 15,
                        serverPaging: true,
                        serverSorting: true,
                        sortable: true,
                        schema: {
                            data: "items",
                            total: "totalCount"
                        }
                    });
                };
                vm.setDataSource();
            };
            vm.refreshDataSource();
            vm.thuocCongBoGridOptions = {
                pageable:
                {
                    "refresh": true,
                    "pageSizes": [5, 10, 15, 20, 50, 100],
                    messages: {
                        empty: "Không có dữ liệu",
                        display: "Hiển thị từ {0} đến {1}/{2} bản ghi",
                        itemsPerPage: "Bản ghi mỗi trang"
                    }
                },
                resizable: true,
                height: 800,
                scrollable: true,
                dataBound: function (e) {
                    var grid = this;
                    var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                    grid.tbody.find(".row-number").each(function () {
                        var index = record++;
                        $(this).html(index);
                    });
                },
                columns: vm.columnCoSo
            };
            function isValidDate(s) {
                if (s != null && s.length > 0) {
                    var bits = s.split('/');
                    var d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
                    return !!(d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]));
                } else {
                    return true;
                }
            }
            vm.getGridData = function () {
                var ngayCap = vm.traCuuNangCao.ngayCap;
                var ngayHetHan = vm.traCuuNangCao.ngayHetHan;
                if ((ngayCap != 'undefined' && !isValidDate(ngayCap)) || (ngayHetHan != 'undefined' && !isValidDate(ngayHetHan))) {
                    abp.notify.error("Ngày cấp hoặc ngày hết hạn không đúng định dạng!");
                    return;
                }
                else {
                    vm.danhSachCoSoSanXuatNuocNgoaiDapUngGMP.read();
                }
            };
        };
        var initDataHistory = () => {
            vm.histories = [];
        };
        //#endregion 
        function init() {
            chucnangTimKiem();
            gridThuocCongBo();
            initDataHistory();
        };
        init();
    }
]);
;

MyApp.controller('frontend.danhsachdanhgiagxp', [
    '$scope', '$sce', '$location', '$http', '$window', '$timeout', '$uibModal',
    function ($scope, $sce, $location, $http, $window, $timeout, $uibModal) {
        vm = this;
        vm.phamViDanhGiaObj = {
            Id: null,
            Level: null,
            Stt: null,
            Content: null,
            Content_english: null,
            ParentId: null,
            IsShow: null,
            CheckValue: null,
            NoiDungChiTiet: null,
            NoiDungChiTiet_TiengAnh: null,
        }
        var getDanhSachCongBoCSSXChuanGxP = (input, ajaxParams) => {
            return abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/danhSachDanhGiaGxP/GetAllPublicServerPaging',
                type: 'POST',
                data: JSON.stringify(input)
            }, ajaxParams));
        };

        //#region Tìm kiếm
        {
            var chucnangTimKiem = () => {
                vm.isNangCaoFilter = false;
                vm.changeNangCaoFilter = ($event) => {
                    vm.isNangCaoFilter = !vm.isNangCaoFilter;
                    vm.filterAll = "";
                    vm.traCuuNangCao = {};
                };
                $scope.$watch('vm.filterAll', function myfunction() {
                    if (vm.filterAll != null && vm.filterAll != "") {
                        vm.isNangCaoFilter = false;
                        vm.traCuuNangCao = {};
                    }
                })
                $scope.totalRow = 0;
                $scope.keyWord = "";
                vm.switchFilter = 0;
                vm.changeSwitchFilter = function ($event, d) {
                    $('#search_concept').text($event.currentTarget.firstChild.text);
                    vm.switchFilter = d;
                };
                vm.traCuuNangCao = {};
                vm.refreshFilter = function () {
                    vm.filterAll = "";
                    vm.traCuuNangCao = {};
                    vm.traCuuNangCao.ngayBatDau = null;
                    vm.traCuuNangCao.ngayKetThuc = null;
                    vm.getGridData();
                };
            };
        }
        //#endregion


        //#region Grid Data
        var gridThuocCongBo = () => {
            vm.refreshColumns = function () {
                vm.columns = [];
                var _colSTT = {
                    field: "stt",
                    title: app.localize('STT'),
                    template: "<div class='row-number text-center'></div>",
                    attributes: { class: "text-center" },
                    headerAttributes: { style: "text-align: center;" },
                    width: 40
                };

                var _colTenCoSo = {
                    field: "tenCoSo",
                    title: app.localize('Tên cơ sở'),
                    template: "{{this.dataItem.tenCoSo}}",
                    width: 220
                };

                var _colDiaChiCoSo = {
                    field: "diaChiCoSo",
                    title: app.localize('Địa chỉ cơ sở'),
                    template: "{{this.dataItem.diaChiCoSo}}",
                    width: 220
                };

                var _colPhamViDanhGia = {
                    field: "phamViDanhGiaGxP",
                    title: app.localize('Phạm vi đánh giá'),
                    template: `<div ng-repeat="item in this.dataItem.phamViDanhGiaGxP">
                             <div class="text-bold" ng-if="item.level == 1">
                                * {{item.content}}
                            </div>
                            <div ng-if="item.level == 2 && (item.noiDungChiTiet == null || item.noiDungChiTiet == '')">
                                &emsp;+ {{item.content}}
                            </div>
                            <div ng-if="item.level == 2 && item.noiDungChiTiet != null && item.noiDungChiTiet != ''">
                                &emsp;+ {{item.content}} ({{item.noiDungChiTiet}})
                            </div>
                            <div ng-if="item.level == 3">
                                <em>
                                    &emsp;&emsp;- {{item.content}} ({{item.noiDungChiTiet}})
                                </em>
                            </div>
                    </div>`,
                    width: 250
                };

                var _colTieuChuan = {
                    field: "tieuChuan",
                    title: app.localize('Tiêu chuẩn'),
                    template: "{{this.dataItem.tieuChuan}}",
                    width: 100
                };

                var _colThoiGianDanhGia = {
                    field: "thoiGianDanhGia",
                    title: app.localize('Thời gian đánh giá'),
                    template: "{{this.dataItem.ngayBatDau}} - {{this.dataItem.ngayKetThuc}}",
                    width: 150
                };

                var setColForForm = function () {
                    vm.columns = [_colSTT, _colTenCoSo, _colDiaChiCoSo, _colPhamViDanhGia, _colTieuChuan, _colThoiGianDanhGia];
                };
                setColForForm();
                vm.columnGiaThuoc = vm.columns;
            };
            vm.refreshColumns();
            vm.requestParams = {
                skipCount: 0,
                maxResultCount: 10,
                sorting: null
            };

            vm.traCuuNangCao = {};

            vm.refreshDataSource = function () {
                vm.danhSachCacDotDanhGiaGxP = [];
                vm.setDataSource = function () {
                    vm.danhSachCacDotDanhGiaGxP = new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                $scope.totalRow = 0;
                                $scope.keyWord = "";
                                vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                                vm.requestParams.maxResultCount = options.data.pageSize;
                                var _req = {
                                    filter: vm.filterAll,
                                    danhSachDanhGiaGxp: vm.traCuuNangCao
                                };
                                if (!vm.isNangCaoFilter) {
                                    switch (vm.switchFilter) {
                                        case 1:
                                            _req.danhSachDanhGiaGxp.tieuChuan = vm.filterAll;
                                            _req.filter = "";
                                            break;
                                        case 2:
                                            _req.danhSachDanhGiaGxp.maSo = vm.filterAll;
                                            _req.filter = "";
                                            break;
                                        default:
                                            _req.filter = vm.filterAll;
                                            break;
                                    }
                                }
                                getDanhSachCongBoCSSXChuanGxP($.extend(_req, vm.requestParams))
                                    .then(function (result) {
                                        options.success(result);
                                        $scope.totalRow = result.totalCount;
                                        $scope.keyWord = vm.filterAll;
                                        $scope.$apply();
                                        $scope.filter = {};
                                    });
                            }
                        },
                        pageSize: 15,
                        serverPaging: true,
                        serverSorting: true,
                        sortable: true,
                        schema: {
                            data: "items",
                            total: "totalCount"
                        }
                    });
                };
                vm.setDataSource();
            };
            vm.refreshDataSource();
            vm.thuocCongBoGridOptions = {
                pageable:
                {
                    "refresh": true,
                    "pageSizes": [5, 10, 15, 20, 50, 100],
                    messages: {
                        empty: "Không có dữ liệu",
                        display: "Hiển thị từ {0} đến {1}/{2} bản ghi",
                        itemsPerPage: "Bản ghi mỗi trang"
                    }
                },
                resizable: true,
                height: 800,
                scrollable: true,
                dataBound: function (e) {
                    var grid = this;
                    var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                    grid.tbody.find(".row-number").each(function () {
                        var index = record++;
                        $(this).html(index);
                    });
                },
                columns: vm.columnGiaThuoc
            };
            function isValidDate(s) {
                if (s != null && s.length > 0) {
                    var bits = s.split('/');
                    var d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
                    return !!(d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]));
                } else {
                    return true;
                }
            }
            vm.getGridData = function () {
                var ngayBatDau = vm.traCuuNangCao.ngayBatDau;
                var ngayKetThuc = vm.traCuuNangCao.ngayKetThuc;
                if ((ngayBatDau != 'undefined' && !isValidDate(ngayBatDau)) || (ngayKetThuc != 'undefined' && !isValidDate(ngayKetThuc))) {
                    abp.notify.error("Ngày cấp hoặc ngày hết hạn không đúng định dạng!");
                    return;
                } else {
                    vm.danhSachCacDotDanhGiaGxP.read();
                }
            };
        };
        var initDataHistory = () => {
            vm.histories = [];
        };
        //#endregion 
        function init() {
            chucnangTimKiem();
            gridThuocCongBo();
            initDataHistory();
        };
        init();
        vm.viewCongVan = (url) => {
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn kiến nghị</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congbothuocvipham.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
        vm.viewCongVanById = (id) => {
            var _id = parseInt(id);
            var f = vm.getByParentPagingServiceDS.filter(x => x.id == _id);
            var url = "";
            if (f.length > 0) {
                url = f[0].urlCongVanKienNghiDieuChinhGia;
            }
            app.urlCongVanCongBoGiaThuoc = url;
            var modalInstance = $uibModal.open({
                template: `
                        <div class="modal-header">
                        <span class="caption-subject bold uppercase">Công văn kiến nghị</span>
                        </div>
                        <div class="modal-body">
                        <div frontend.congbothuocvipham.viewcongvan ng-if='isCongVan'></div>
                        <div ng-if='!isCongVan'> Công văn không tồn tại</div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                        </div>
                        `,
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    urlFileCV: { urlDuongDanCV: url }
                },
                controller: ['$scope', '$uibModalInstance', 'urlFileCV', function ($scope, $uibModalInstance, urlFileCV) {
                    $scope.urlFileCV = urlFileCV.urlDuongDanCV;
                    app.IsNullOrEmpty = function (o) {
                        var f = false;
                        if (typeof (o) === 'undefined') f = true;
                        if (o == null) f = true;
                        o = String(o);
                        if (o == '') f = true;
                        return f;
                    };
                    $scope.isCongVan = !app.IsNullOrEmpty(urlFileCV.urlDuongDanCV);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
        vm.viewLichSu = (d) => {
            app.soDangKyId = d.id;
            app.danhSachLichSu = [];
            var getHistoryService = (soDangKyId, ajaxParams) => {
                return abp.ajax($.extend({
                    url: abp.appPath + 'api/services/app/davSoDangKyHistory/GetHistory' + abp.utils.buildQueryString([{ name: 'soDangKyId', value: soDangKyId }]) + '',
                    type: 'POST',
                    data: JSON.stringify({})
                }, ajaxParams));
            };
            if (app.soDangKyId > 0) {
                getHistoryService(app.soDangKyId)
                    .then(function (result) {
                        app.danhSachLichSu = result;
                        var modalInstance = $uibModal.open({
                            template: `
                                <div class="modal-header">
                                <span class="caption-subject bold uppercase">Lịch sử thay đổi thông tin số đăng ký</span>
                                </div>
                                <div class="modal-body">
                                <div frontend.congbothuocvipham.viewlichsu></div>
                                </div>
                                <div class="modal-footer">
                                <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                                </div>
                                `,
                            size: 'lg',
                            windowClass: 'my-modal-popup',
                            resolve: {
                                thuoc: d
                            },
                            controller: ['$scope', '$uibModalInstance', 'thuoc', function ($scope, $uibModalInstance, thuoc) {
                                $scope.thuoc = thuoc;
                                app.IsNullOrEmpty = function (o) {
                                    f = false;
                                    if (typeof (o) === 'undefined') f = true;
                                    if (o == null) f = true;
                                    o = String(o);
                                    if (o == '') f = true;
                                    return f;
                                };
                                $scope.cancel = function () {
                                    $uibModalInstance.close();
                                };
                            }]
                        });
                    });
            }
        };
        vm.viewNguyenLieu = (d) => {
            app.soDangKyThuoc = d.soDangKy;
            app.danhSachNguyenLieu = [];
            var getNguyenLieuService = (soDangKy, ajaxParams) => {
                return abp.ajax($.extend({
                    url: abp.appPath + 'api/services/app/nguyenLieuLamThuoc/GetNguyenLieuTheoSoDangKy' + abp.utils.buildQueryString([{ name: 'soDangKy', value: soDangKy }]) + '',
                    type: 'POST',
                    data: JSON.stringify({})
                }, ajaxParams));
            };
            if (app.soDangKyThuoc.length > 0) {
                getNguyenLieuService(app.soDangKyThuoc)
                    .then(function (result) {
                        app.danhSachNguyenLieu = result;
                        var modalInstance = $uibModal.open({
                            template: `
                                <div class="modal-header">
                                <span class="caption-subject bold uppercase">Danh sách nguyên liệu công bố</span>
                                </div>
                                <div class="modal-body">
                                <div frontend.congbothuocvipham.viewnguyenlieu></div>
                                </div>
                                <div class="modal-footer">
                                <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                                </div>
                                `,
                            size: 'lg',
                            windowClass: 'my-modal-popup',
                            resolve: {
                                thuoc: d
                            },
                            controller: ['$scope', '$uibModalInstance', 'thuoc', function ($scope, $uibModalInstance, thuoc) {
                                $scope.thuoc = thuoc;
                                app.IsNullOrEmpty = function (o) {
                                    var f = false;
                                    if (typeof (o) === 'undefined') f = true;
                                    if (o == null) f = true;
                                    o = String(o);
                                    if (o == '') f = true;
                                    return f;
                                };
                                $scope.cancel = function () {
                                    $uibModalInstance.close();
                                };
                            }]
                        });
                    });
            }
        };
    }
]);

;

MyApp.controller('frontend.danhsachgiaychungnhandudieukienkd', [
    '$scope', '$sce', '$location', '$http', '$window', '$timeout', '$uibModal',
    function ($scope, $sce, $location, $http, $window, $timeout, $uibModal) {
        vm = this;
        var getDanhSachGiayChungNhan = (input, ajaxParams) => {
            return abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/danhSachDuDieuKienKD/GetAllServerPublicPaging',
                type: 'POST',
                data: JSON.stringify(input)
            }, ajaxParams));
        };
        
        //#region Tìm kiếm
        {
            var chucnangTimKiem = () => {
                vm.isNangCaoFilter = false;
                vm.changeNangCaoFilter = ($event) => {
                    vm.isNangCaoFilter = !vm.isNangCaoFilter;
                    vm.filterAll = "";
                    vm.traCuuNangCao = {};
                };
                $scope.$watch('vm.filterAll', function myfunction() {
                    if (vm.filterAll != null && vm.filterAll != "") {
                        vm.isNangCaoFilter = false;
                        vm.traCuuNangCao = {};
                    }
                })
                $scope.totalRow = 0;
                $scope.keyWord = "";
                vm.switchFilter = 0;
                vm.changeSwitchFilter = function ($event, d) {
                    $('#search_concept').text($event.currentTarget.firstChild.text);
                    vm.switchFilter = d;
                };
                vm.traCuuNangCao = {};
                vm.refreshFilter = function () {
                    vm.filterAll = "";
                    vm.traCuuNangCao = {};
                    vm.getGridData();
                };
            };
        }
        //#endregion


        //#region Grid Data
        var gridThuocCongBo = () => {
            vm.refreshColumns = () => {
                vm.thuocColumns = [
                    {
                        title: "STT",
                        width: "50px",
                        template: "<div class='row-number text-center'></div>",
                    },
                    {
                        title: "Giấy chứng nhận",
                        attributes: { class: "text-center" },
                        headerAttributes: { style: "text-align: center;" },
                        columns: [
                            { field: "soGiayChungNhan", title: "Số giấy chứng nhận", width: "200px" },
                            { field: "ngayCap", title: "Ngày cấp", width: "200px", template: "#= kendo.toString(kendo.parseDate(ngayCap), 'dd/MM/yyyy') #" },
                            { field: "dotCap", title: "Đợt cấp", width: "200px" },
                            { field: "coQuanCap", title: "Cơ quan cấp", width: "200px" }
                        ]
                    },
                    { field: "tenCoSo", title: "Tên cơ sở", width: "300px" },
                    { field: "diaChiCoSo", title: "Địa chỉ", width: "350px" },
                    { field: "tenDiaDiemKinhDoanh", title: "Tên địa điểm kinh doanh", width: "300px" },
                    { field: "diaDiemKinhDoanh", title: "Địa điểm kinh doanh", width: "300px" },
                    {
                        field: "phamViChungNhan",
                        title: "Phạm vi chứng nhận",
                        template: `
                            <div ng-if="this.dataItem.phamViChungNhan && this.dataItem.phamViChungNhan.length">
                                <div ng-repeat="item in this.dataItem.phamViChungNhan | filter:{checkValue:true}">
                                    <div class="text-bold" ng-if="item.level == 1">• {{item.content}}</div>
                                    <div ng-if="item.level == 2">&emsp;+ {{item.content}}
                                        <span ng-if="item.noiDungChiTiet">({{item.noiDungChiTiet}})</span>
                                    </div>
                                    <div ng-if="item.level == 3"><em>&emsp;&emsp;- {{item.content}}
                                        <span ng-if="item.noiDungChiTiet">({{item.noiDungChiTiet}})</span>
                                    </em></div>
                                </div>
                            </div>
                            <div ng-if="!this.dataItem.phamViChungNhan || this.dataItem.phamViChungNhan.length == 0"><i>Không có dữ liệu</i></div>
                        `,
                        width: "300px"
                    },
                    {
                        field: "lichSuCapJson",
                        title: "Đợt cấp trước",
                        width: "300px",
                        template: `
                            <div ng-if="dataItem.lichSuCapJson && dataItem.lichSuCapJson.length">
                                <div ng-repeat="item in dataItem.lichSuCapJson track by $index">
                                    - {{item.tenDotCap}}: {{item.soHieu}} ngày {{item.ngayCap}}
                                </div>
                            </div>
                            <div ng-if="!dataItem.lichSuCapJson || dataItem.lichSuCapJson.length == 0">
                                <i>Không có dữ liệu</i>
                            </div>
                        `
                    },
                    {
                        title: "Người chịu trách nhiệm chuyên môn",
                        attributes: { class: "text-center" },
                        headerAttributes: { style: "text-align: center;" },
                        columns: [
                            { field: "hoTenCM", title: "Họ và tên", width: "200px" },
                            { field: "trinhDoCM", title: "Trình độ chuyên môn", attributes: { class: "text-center" }, width: "200px" },
                            { field: "donViCapCM", title: "Đơn vị cấp", width: "200px" },
                            { field: "soCCHNCM", title: "Số chứng chỉ hành nghề", width: "200px" }
                        ]
                    },
                    {
                        title: "Người chịu trách nhiệm đảm bảo chất lượng",
                        attributes: { class: "text-center" },
                        headerAttributes: { style: "text-align: center;" },
                        columns: [
                            { field: "hoTenCL", title: "Họ và tên", width: "200px" },
                            { field: "trinhDoCL", title: "Trình độ chuyên môn", attributes: { class: "text-center" }, width: "200px" },
                            { field: "donViCapCL", title: "Đơn vị cấp", width: "200px" },
                            { field: "soCCHNCL", title: "Số chứng chỉ hành nghề", width: "200px" }
                        ]
                    }
                ];
                vm.columnGiaThuoc = vm.thuocColumns;
            };
            vm.refreshColumns();
            vm.requestParams = {
                skipCount: 0,
                maxResultCount: 10,
                sorting: null
            };

            vm.traCuuNangCao = {};

            vm.refreshDataSource = function () {
                vm.danhSachGiayChungNhanDuDieuKienKD = [];
                vm.setDataSource = function () {
                    vm.danhSachGiayChungNhanDuDieuKienKD = new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                $scope.totalRow = 0;
                                $scope.keyWord = "";
                                vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                                vm.requestParams.maxResultCount = options.data.pageSize;
                                var _req = {
                                    filter: vm.filterAll,
                                    thongTinCoSoDatChuanGxP: vm.traCuuNangCao
                                };
                                if (!vm.isNangCaoFilter) {
                                    switch (vm.switchFilter) {
                                        case 1:
                                            _req.thongTinCoSoDatChuanGxP.tieuChuan = vm.filterAll;
                                            _req.filter = "";
                                            break;
                                        case 2:
                                            _req.thongTinCoSoDatChuanGxP.maSo = vm.filterAll;
                                            _req.filter = "";
                                            break;
                                        default:
                                            _req.filter = vm.filterAll;
                                            break;
                                    }
                                }
                                getDanhSachGiayChungNhan($.extend(_req, vm.requestParams))
                                    .then(function (result) {
                                        result.items.forEach(function (item) {
                                            if (item.phamViChungNhan && typeof item.phamViChungNhan === 'string') {
                                                try {
                                                    item.phamViChungNhan = JSON.parse(item.phamViChungNhan);
                                                } catch (e) {
                                                    item.phamViChungNhan = [];
                                                }
                                            }
                                            if (item.lichSuCapJson && typeof item.lichSuCapJson === 'string') {
                                                try {
                                                    item.lichSuCapJson = JSON.parse(item.lichSuCapJson);
                                                } catch (e) {
                                                    item.lichSuCapJson = [];
                                                }
                                            }
                                        });
                                        options.success(result);
                                        $scope.totalRow = result.totalCount;
                                        $scope.keyWord = vm.filterAll;
                                        $scope.$apply();
                                        $scope.filter = {};
                                    });
                            }
                        },
                        pageSize: 15,
                        serverPaging: true,
                        serverSorting: true,
                        sortable: true,
                        schema: {
                            data: "items",
                            total: "totalCount"
                        }
                    });
                };
                vm.setDataSource();
            };
            vm.refreshDataSource();
            vm.thuocCongBoGridOptions = {
                pageable:
                {
                    "refresh": true,
                    "pageSizes": [5, 10, 15, 20, 50, 100],
                    messages: {
                        empty: "Không có dữ liệu",
                        display: "Hiển thị từ {0} đến {1}/{2} bản ghi",
                        itemsPerPage: "Bản ghi mỗi trang"
                    }
                },
                resizable: true,
                height: 800,
                scrollable: true,
                dataBound: function (e) {
                    var grid = this;
                    var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                    grid.tbody.find(".row-number").each(function () {
                        var index = record++;
                        $(this).html(index);
                    });
                },
                columns: vm.columnGiaThuoc
            };
            function isValidDate(s) {
                if (s != null && s.length > 0) {
                    var bits = s.split('/');
                    var d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
                    return !!(d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]));
                } else {
                    return true;
                }
            }
            vm.getGridData = function () {
                var ngayCap = vm.traCuuNangCao.ngayCap;
                var ngayHetHan = vm.traCuuNangCao.ngayHetHan;
                if ((ngayCap != 'undefined' && !isValidDate(ngayCap)) || (ngayHetHan != 'undefined' && !isValidDate(ngayHetHan))) {
                    abp.notify.error("Ngày cấp hoặc ngày hết hạn không đúng định dạng!");
                    return;
                }
                else {
                    vm.danhSachGiayChungNhanDuDieuKienKD.read();
                }
            };
        };
        var initDataHistory = () => {
            vm.histories = [];
        };
        //#endregion 
        function init() {
            chucnangTimKiem();
            gridThuocCongBo();
            initDataHistory();
        };
        init();
    }
]);
;
MyApp.controller('ctrl.khieunaivacxin', [
    '$scope', '$location', '$http', '$window', 'FileUploader', '$sce', 
    function ($scope, $location, $http, $window, fileUploader, $sce) {
        var vm = this;
        vm.khieuNaiVacXin = {
            listEnumLinhVucKhieuNai: [],
            loaiXuLy: null // set default hien thi khieu nai view 
        };
        vm.arrLinhVucKhieuNai = [
            {
                id: 1,
                name: "Chất lượng"
            },
            {
                id: 2,
                name: "An toàn"
            },
            {
                id: 3,
                name: "Hiệu quả"
            },
            {
                id: 4,
                name: "Thông tin, quảng cáo"
            },
            {
                id: 5,
                name: "Hành chính"
            },
            {
                id: 6,
                name: "Khác"
            }
        ];
        vm.lisImage = [];
        vm.isLoading = false;
        $scope.uploader = function (file, files) {
            var uploader = new fileUploader({
                url: abp.appPath + 'File/UploadFileKhieuNaiVacXin',
                headers: {
                    "X-XSRF-TOKEN": abp.security.antiForgery.getToken()
                },
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'attachmentFilter',
                    fn: function (item, options) {
                        vm.isLoading = true;
                        var isValidate = false;
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|png|'.indexOf(type) > -1 || '|jpg|'.indexOf(type) > -1 || '|jpeg|'.indexOf(type) > -1) {
                            isValidate = true;
                        }
                        else {
                            isValidate = false;
                            vm.isLoading = false;
                            $('#image').val(null);
                        }
                        if (!isValidate) {
                            abp.message.warn("File không đúng định dạng, chỉ chấp nhận đuôi png,jpg,jpeg", app.localize("Notifications"));
                            vm.isLoading = false;
                            $('#image').val(null);
                            return false;
                        }
                        if (item.size > 25*1024*1024) {
                            abp.message.warn(app.localize('Ảnh đạt quá dung lượng cho phép', 100));
                            vm.isLoading = false;
                            $('#image').val(null);
                            return false;
                        }
                        if (item) {
                            var item = vm.lisImage.find(x => x.moTaTep == item.name);
                            if (item) {
                                abp.notify.error(('Đã tồn tại ảnh này'));
                                vm.isLoading = false;
                                $('#image').val(null);
                                return false;
                            }
                        }
                        return true;
                    }
                }]
            });
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                if (response.success) {
                    vm.lisImage.push({ tentep: response.result.tenTepMaHoa, moTaTep: response.result.tenTep, duongdantep: response.result.duongDanTep, duongDanTepBase64: response.result.duongDanBase64 })
                }
                else {
                    abp.message.error(response.error.message);
                }
                $('#image').val(null);
                vm.isLoading = false;
            };
            return uploader;
        }

        //Function
        vm.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }
        function newValidSDT(sdt) {
            var n = sdt.length;
            if (n > 8 && n < 19) {
                var regex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
                return regex.test(sdt)
            }
        };
        function isValidEmail(email) {
            var regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return regex.test(email)
        };
        function validForm() {
            var valid = true;
            
            //if (vm.khieuNaiVacXin.hoTen == null || vm.khieuNaiVacXin.hoTen == '') {
            //    abp.notify.error('', 'Họ và tên người khiếu nại đang bị trống'); valid = false;
            //}
            //else if (vm.khieuNaiVacXin.soDienThoai == null || vm.khieuNaiVacXin.soDienThoai == '' || !newValidSDT(vm.khieuNaiVacXin.soDienThoai)) {
            //    abp.notify.error('', 'Số điện thoại người khiếu nại đang không đúng hoặc bị trống'); valid = false;
            //}
            //else if (vm.khieuNaiVacXin.email == null || vm.khieuNaiVacXin.email == '' || !isValidEmail(vm.khieuNaiVacXin.email)) {
            //    abp.notify.error('', 'Email người khiếu nại đang không đúng hoặc bị trống'); valid = false;
            //}
            //else if (vm.khieuNaiVacXin.tenDonVi == null || vm.khieuNaiVacXin.tenDonVi == '') {
            //    abp.notify.error('', 'Tên đơn vị người khiếu nại đang bị trống'); valid = false;
            //}
            //else if (vm.khieuNaiVacXin.diaChi == null || vm.khieuNaiVacXin.diaChi == '') {
            //    abp.notify.error('', 'Địa người khiếu nại đang bị trống'); valid = false;
            //}
            if (vm.khieuNaiVacXin.soDienThoai != null && vm.khieuNaiVacXin.soDienThoai != '' && !newValidSDT(vm.khieuNaiVacXin.soDienThoai)) {
                abp.notify.error('', 'Số điện thoại người khiếu nại đang không đúng '); valid = false;
            }
            if (vm.khieuNaiVacXin.email != null && vm.khieuNaiVacXin.email != '' && !isValidEmail(vm.khieuNaiVacXin.email)) {
                abp.notify.error('', 'Email người khiếu nại đang không đúng '); valid = false;
            }
            else if (vm.khieuNaiVacXin.tenSanPham == null || vm.khieuNaiVacXin.tenSanPham == '') {
                abp.notify.error('', 'Tên sản phẩm vắc xin khiếu nại đang bị trống'); valid = false;
            }
            else if (vm.khieuNaiVacXin.soDangKy == null || vm.khieuNaiVacXin.soDangKy == '') {
                abp.notify.error('', 'Số đăng ký sản phẩm vắc xin khiếu nại đang bị trống'); valid = false;
            }
            else if (vm.khieuNaiVacXin.coSoSanXuat == null || vm.khieuNaiVacXin.coSoSanXuat == '') {
                abp.notify.error('', 'Cơ sở sản xuất sản phẩm vắc xin khiếu nại đang bị trống'); valid = false;
            }
            else if (vm.khieuNaiVacXin.coSoNhapKhau == null || vm.khieuNaiVacXin.coSoNhapKhau == '') {
                abp.notify.error('', 'Cơ sở nhập khẩu sản phẩm vắc xin khiếu nại đang bị trống'); valid = false;
            }
            else if (vm.khieuNaiVacXin.coSoPhanPhoi == null || vm.khieuNaiVacXin.coSoPhanPhoi == '') {
                abp.notify.error('', 'Cơ sở phân phối sản phẩm vắc xin khiếu nại đang bị trống'); valid = false;
            }
            else if (vm.khieuNaiVacXin.noiDungKhieuNai == null || vm.khieuNaiVacXin.noiDungKhieuNai == '') {
                abp.notify.error('', 'Nội dung khiếu nại đang bị thiếu'); valid = false;
            }
            else if (vm.showmode == true && (vm.khieuNaiVacXin.noiDungKhieuNaiLinhVucKhac == null || vm.khieuNaiVacXin.noiDungKhieuNaiLinhVucKhac == "")) {
                abp.notify.error('', 'Nội dung khiếu nại lĩnh vực khác đang thiếu'); valid = false;
            }
            else if (vm.khieuNaiVacXin.captchaText == null || vm.khieuNaiVacXin.captchaText == '') {
                abp.notify.error('', 'Mã bảo vệ đang bị thiếu'); valid = false;
            }
            
            return valid;
        };



        vm.save = function () {
            if (validForm() == false) {
                return;
            }
            
            vm.isLoading = true;
            vm.khieuNaiVacXin.teps = vm.lisImage;

            var lt = /</g,
                gt = />/g,
                ap = /'/g,
                ic = /"/g;
            if (vm.showmode == true) {
                vm.khieuNaiVacXin.noiDungKhieuNaiLinhVucKhac = vm.khieuNaiVacXin.noiDungKhieuNaiLinhVucKhac.toString().replace(lt, "&lt;").replace(gt, "&gt;").replace(ap, "&#39;").replace(ic, "&#34;");
            }
            

            var _checkItem = vm.arrLinhVucKhieuNai.find(x => x.checked == true);
            if (_checkItem == null) {
                abp.notify.error('', 'Lĩnh vực khiếu nại đang chưa được chọn');
                vm.isLoading = false;
                return;
            }
            else {
                for (var i = 0; i < vm.arrLinhVucKhieuNai.length; i++) {

                    if (vm.arrLinhVucKhieuNai[i].checked != null && vm.arrLinhVucKhieuNai[i].checked == true) {
                        if (vm.khieuNaiVacXin.listEnumLinhVucKhieuNai.length > 0) {
                            var item = vm.khieuNaiVacXin.listEnumLinhVucKhieuNai.find(x => x.id == vm.arrLinhVucKhieuNai[i].id);
                            if (item == null) {
                                vm.khieuNaiVacXin.listEnumLinhVucKhieuNai.push(
                                    { id: vm.arrLinhVucKhieuNai[i].id, name: vm.arrLinhVucKhieuNai[i].name }
                                );
                            }
                        }
                        else {
                            vm.khieuNaiVacXin.listEnumLinhVucKhieuNai.push(
                                { id: vm.arrLinhVucKhieuNai[i].id, name: vm.arrLinhVucKhieuNai[i].name }
                            );
                        }

                    }
                }
            }
            
            if (vm.showmode != true) {
                vm.khieuNaiVacXin.noiDungKhieuNaiLinhVucKhac = null;
            }

            $http.post('/KhieuNaiVacXin/CreateOrUpdate', vm.khieuNaiVacXin)
                .then(function (response) {
                    if (response) {
                        if (response.data != 0) {
                            abp.notify.success('', 'Gửi khiếu nại thành công!');
                            vm.khieuNaiVacXin = {};
                            setTimeout(function () { window.location.href = "/Khieunaivacxin"; }, 2000);
                        }
                        else {
                            vm.isLoading = false;                          
                            abp.notify.error('', 'Gửi khiếu nại không thành công kiểm tra capcha!');
                            vm.refreshCaptcha();
                        }
                    }
                });
        };
        vm.refreshCaptcha = function () {
            $('.testCapcha').remove();
            $('#captcha').append('<img id="theImg" class="testCapcha" src="Captcha/RefreshCaptCha" />')
        }
        vm.showmode = false;
        vm.checkBoxFuntion = function (item) {
            if (item.id == 6) {
                if (item.checked == null) {
                    vm.showmode = true;
                }
                else {
                    if (item.checked == true) {
                        vm.showmode = false;
                    }
                    else {
                        vm.showmode = true;
                    }
                }
            }
           
        }
        vm.deleteImage = function (item) {
            if (vm.lisImage.length > 0) {
                var index = vm.lisImage.indexOf(item);
                vm.lisImage.splice(index, 1);
            }
        }

    }
]);;
MyApp.controller('ctrl.tracuu.viphamattp', [
    '$scope', '$location', '$http', '$window','$timeout',
    function ($scope, $location, $http, $window, $timeout) {
        var vm = this;
        vm.saving = false;
        vm.requestParams = {
            skipCount: 0,
            maxResultCount: 10,
            sorting: null
        };
        vm.initFilter = function () {
            vm.filter = {
                tinhId: null,
                tenDoanhNghiep: "",
                tenSanPham: "",
                diaChi: "",
            };
        }
        vm.initFilter();
        vm.auto_complete_doanh_nghiep_options = {
            dataTextField: "tenDoanhNghiep",
            headerTemplate: "",
            template: `<div>
                        <h5 class ='bold font-blue'>#:data.tenDoanhNghiep #</h5>
                        <span>Địa chỉ: #: data.diaChi #</span>`,
            minLength: 3,
            dataSource: {
                serverFiltering: true,
                serverPaging: true,
                transport: {
                    read: function (options) {
                       var _request = {
                            skipCount: 0,
                            maxResultCount: 20,
                            filter: vm.filter.tenDoanhNghiep,
                        }
                        $http.post('/api/services/app/doanhNgiepPublish/getAllDoanhNghiepServerPaging', _request).then(function (ret) {
                            options.success(ret.data.result);
                        });
                    }
                },
                sortable: true,
                selectable: false,
                schema: {
                    data: "items",
                    total: "totalCount"
                },
            }
        }
        vm.auto_complete_ten_san_pham_options = {
            dataTextField: "tenSanPham",
            headerTemplate: "",
            template: `<div>
                        <h5 class ='bold font-blue'>#:data.tenSanPham #</h5>
                        <span>#: data.doanhNghiep #</span>`,
            minLength: 3,
            dataSource: {
                serverFiltering: true,
                serverPaging: true,
                transport: {
                    read: function (options) {
                       var _request = {
                            Filter: vm.filter.tenSanPham
                        }
                        $http.post('/api/services/app/keHoachThanhTra/sanPhamAutoCompleteDataSource', _request).then(function (ret) {
                            options.success(ret.data.result);
                        });
                    }
                },
                sortable: true,
                selectable: false,
            }
        }
        vm.tinhOptions = {
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        $http.post('/api/services/app/tinh/getAllTinh').then(function (response) {
                            $timeout(function () {
                                options.success(response.data.result);
                            });

                        });
                    }
                },
            }),
            dataValueField: "id",
            dataTextField: "ten",
            optionLabel: app.localize('Chọn ...'),
            filter: "contains",
        }
        
        vm.gv_vi_pham_attp_options = {
            autoBind: false,
            pageable:
            {
                "refresh": true,
                "pageSizes": true,
                messages: {
                    empty: "Không có dữ liệu",
                    display: "Tổng {2} hồ sơ",
                    itemsPerPage: "Hồ sơ mỗi trang"
                }
            },
            resizable: true,
            scrollable: true,
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                       var _request = vm.filter;
                        _request.skipCount = (options.data.page - 1) * options.data.pageSize;
                        _request.maxResultCount = options.data.pageSize;
                        $http.post('/api/services/app/keHoachThanhTra/traCuuViPhamAnToanThucPham', _request).then(function (response) {
                            options.success(response.data.result);
                        });

                    }
                },
                pageSize: 10,
                serverPaging: true,
                serverSorting: true,
                scrollable: true,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: 10,
                    buttonCount: [5, 10, 20, 50, 100]
                },
                schema: {
                    data: "items",
                    total: "totalCount"
                }
            }),
            columns: [
                {
                    title: "STT",
                    template: "<div style='text-align: center;' class='row-number'></div>",
                    width: 50,
                },
                {
                    title: 'Tên Doanh Nghiệp',
                    template: `<div class='bold font-blue'>{{dataItem.tenDoanhNghiep}}</div>
                               <div>{{dataItem.diaChi}}</div>`
                },
                {
                    title: 'Tên Sản Phẩm',
                    template: `<div class='bold'>{{dataItem.tenSanPham}}</div>`
                },
                {
                    title: 'Ngày kiểm tra',
                    template: `<div>{{dataItem.chiTietViPham.ngayThanhTra | date :'dd/MM/yyyy'}}</div>`
                },
                {
                    template: "{{dataItem.chiTietViPham.ketQua}}",
                    title: 'Nội dung vi phạm',
                },
                {
                    template: "{{dataItem.chiTietViPham.mucDoViPham}}",
                    title: 'Mức độ vi phạm',
                },
                {
                    template: "{{dataItem.chiTietViPham.cachKhacPhuc}}",
                    title: "Biện pháp khắc phục",
                }
            ],
            dataBound: function (e) {
                var grid = this;
                var record = (e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize() + 1;
                grid.tbody.find(".row-number").each(function () {
                    var index = record++;
                    $(this).html(index);
                });
            },
        }
        vm.search = function () {
            vm.showResultSearch = true;
            vm.gv_vi_pham_attp_options.dataSource.page(1);
        }

        function init() {
            vm.search();
        }
        init();        
    }
]);;
MyApp.controller('ctrl.tracuu', [
    '$scope', '$location', '$http', '$window',
    function ($scope, $location, $http, $window) {
        var vm = this;
        vm.dataForm = {};
        vm.list = {
            HoSo: [],
        };
        var today = new Date();
        vm.saving = false;
        vm.requestParams = {
            skipCount: 0,
            maxResultCount: 10,
            sorting: null
        };
        vm.filter = {
            tenDoanhNghiep: "",
            tenSanPham: "",
            diaChi: "",
            soCongBo: "",
            tinhId: null,
            nhomSanPhamId: null,
            trangThai: 6, //da hoan tat
            ngayCapTu: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
            ngayCapToi: new Date(),
        }
        if (app.localStorage.get("fillterVar") != null)
        {
            vm.filter = app.localStorage.get("fillterVar");
            vm.showResultSearch = true;
        }
        vm.filterInit = angular.copy(vm.filter);

        vm.ngayCapOptions = app.createDateRangePickerOptions();
        vm.ngayCapOptions.locale.format = "DD/MM/YYYY";
        vm.ngayCapModel = {
            startDate: vm.filter.ngayCapTu,
            endDate: vm.filter.ngayCapToi,
        };
       

        vm.hoSoGridOptions = {
            pageable:
                {
                    "refresh": true,
                    "pageSizes": true,
                    messages: {
                        empty: "Không có dữ liệu",
                        display: "Tổng {2} hồ sơ",
                        itemsPerPage: "Hồ sơ mỗi trang"
                    }
                },
            resizable: true,
            scrollable: true,
        }

        vm.columnGridHoSo = [
            {
                field: "STT",
                title: app.localize('STT'),
                width: "50px",
                template: "<div align='center'>{{this.dataItem.STT}}</div>"
            },
            {
                field: "tenDoanhNghiep",
                title: app.localize('Tên doanh nghiệp'),
            },
            {
                field: "strTinh",
                title: app.localize('Tỉnh'),
            },
            {
                field: "diaChi",
                title: app.localize('Địa chỉ'),
            },
            {
                field: "tenSanPhamDangKy",
                title: app.localize('Tên sản phẩm'),
            }
            ,
            {
                field: "soDangKyCongBo",
                title: app.localize('Số đăng ký'),
            }
            ,
            {
                field: "nhomSanPham",
                title: app.localize('Nhóm sản phẩm')
            },
            
            {
                field: "ngayTraKetQua",
                title: app.localize('Ngày cấp'),
                template: "{{dataItem.ngayTraKetQua | date:'dd/MM/yyyy'}}",
                width: 100
            },
            
            {
                field: "",
                title: "Bản công bố",
                template: "<div  class='text-center'><a href='javascript:void(0)' ng-click='vm.banCongBo(dataItem)' title='Xem bản công bố'><img  style='margin: auto' width=40 src='/Common/Images/certificate.png'/></a></div>",
                width: 120
            }

        ];
        
        vm.nhomSanPhamOptions = {
            dataSource: {
                transport: {
                    read: function (options) {
                        $http.post('/api/services/app/nhomSanPham/getAllNhomSanPhamToDDL').then(function (response) {
                            options.success(response.data.result);
                        });
                    }
                }
            },
            dataValueField: "id",
            dataTextField: "name",
            optionLabel: app.localize('Chọn nhóm sản phẩm ...'),
            filter: "contains",
        }

        vm.tinhOptions = {
            dataSource: {
                transport: {
                    read: function (options) {
                        $http.post('/api/services/app/tinh/getAllTinhToDDL').then(function (response) {
                            options.success(response.data.result);
                        });
                    }
                }
            },
            dataValueField: "value",
            dataTextField: "displayText",
            optionLabel: app.localize('Chọn tỉnh ...'),
            filter: "contains",
        }

        vm.gridHoSoDataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                    vm.requestParams.maxResultCount = options.data.pageSize;
                    vm.filter.ngayCapTu = vm.ngayCapModel.startDate;
                    vm.filter.ngayCapToi = vm.ngayCapModel.endDate;
                    $http.post('/api/services/app/xuLyHoSoTraCuu/getListHoSoTraCuuPaging', $.extend(vm.filter, vm.requestParams)).then(function (result) {
                        var i = 1;
                        if (result) {
                            result.data.result.items.forEach(function (item) {
                                item.STT = i;
                                i++;
                            });
                            options.success(result.data.result);
                        }
                    });
                    
                }
            },
            pageSize: 10,
            serverPaging: true,
            serverSorting: true,
            scrollable: true,
            sortable: true,
            pageable: {
                refresh: true,
                pageSizes: 10,
                buttonCount: 5
            },
            schema: {
                data: "items",
                total: "totalCount"
            }
        });

        vm.refreshGridHS = function () {
            vm.gridHoSoDataSource.read();
            vm.showResultSearch = true;
        }

        vm.refreshControll = function () {
            vm.filter = angular.copy(vm.filterInit);
            vm.refreshGridHS();
        }

        vm.banCongBo = function (item) {

            var printInfo = {
                HoSoId: item.id
            };
            window.open(
                abp.appPath + 'Report/gotoGiayTiepNhan?jsonParams=' + JSON.stringify(printInfo),
                '_blank'
            );
        }
        vm.auto_complete_doanh_nghiep_options = {
            dataTextField: "tenDoanhNghiep",
            headerTemplate: "",
            template: `<div>
                        <h5 class ='bold font-blue'>#:data.tenDoanhNghiep #</h5>
                        <span>Địa chỉ: #: data.diaChi #</span>`,
            minLength: 3,
            dataSource: {
                serverFiltering: true,
                serverPaging: true,
                transport: {
                    read: function (options) {
                       var _request = {
                            skipCount: 0,
                            maxResultCount: 20,
                            filter: vm.filter.tenDoanhNghiep,
                        }
                        $http.post('/api/services/app/doanhNgiepPublish/getAllDoanhNghiepServerPaging', _request).then(function (ret) {
                            console.log(ret);
                            options.success(ret.data.result);
                        });
                    }
                },
                sortable: true,
                selectable: false,
                schema: {
                    data: "items",
                    total: "totalCount"
                },
            }
        }
        vm.auto_complete_ten_san_pham_options = {
            dataTextField: "tenSanPham",
            headerTemplate: "",
            template: `<div>
                        <h5 class ='bold font-blue'>#:data.tenSanPham #</h5>
                        <span>#: data.doanhNghiep #</span>`,
            minLength: 3,
            dataSource: {
                serverFiltering: true,
                serverPaging: true,
                transport: {
                    read: function (options) {
                       var _request = {
                            Filter: vm.filter.tenSanPham
                        }
                        $http.post('/api/services/app/xuLyHoSoTraCuu/getTenSanPhamCongBo', _request).then(function (ret) {
                            console.log(ret, "san pham tu cb");
                            options.success(ret.data.result);
                        });
                    }
                },
                sortable: true,
                selectable: false,
            }
        }

        if (app.localStorage.get("fillterVar") != null) {
            vm.refreshGridHS();
            localStorage.removeItem('fillterVar');
        }
    }
]);;
MyApp.controller('tracuuhosocongbo', [
    '$scope', '$location', '$http', '$window',
    function ($scope, $location, $http, $window) {
        var vm = this;
        vm.dataForm = {};
        vm.list = {
            HoSo: [],
        };
        var today = new Date();
        vm.saving = false;
        vm.requestParams = {
            skipCount: 0,
            maxResultCount: 10,
            sorting: null
        };
        vm.filter = {
            tenDoanhNghiep: "",
            tenSanPham: "",
            diaChi: "",
            soCongBo: "",
            nhomSanPhamId: null,
            trangThai: 6, //da hoan tat
            ngayCapTu: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
            ngayCapToi: new Date(),
        }
        vm.filterInit = angular.copy(vm.filter);
        vm.nhomSanPhamOptions = {
            dataSource: {
                transport: {
                    read: function (options) {
                        $http.post('/api/services/app/nhomSanPham/getAllNhomSanPhamToDDL').then(function (response) {
                            options.success(response.data.result);
                        });
                    }
                }
            },
            dataValueField: "id",
            dataTextField: "name",
            optionLabel: app.localize('Chọn nhóm sản phẩm ...'),
            filter: "contains",
        }
        vm.ngayCapOptions = app.createDateRangePickerOptions();
        vm.ngayCapOptions.locale.format = "DD/MM/YYYY";
        vm.ngayCapModel = {
            startDate: vm.filter.ngayCapTu,
            endDate: vm.filter.ngayCapToi,
        };

        vm.search = function ()
        {
            app.localStorage.set("fillterVar", vm.filter);
            $window.location.pathname = '/Tracuu';
        }
        vm.refreshControll = function () {
            vm.filter = angular.copy(vm.filterInit);

        }
        vm.auto_complete_doanh_nghiep_options = {
            dataTextField: "tenDoanhNghiep",
            headerTemplate: "",
            template: `<div>
                        <h5 class ='bold font-blue'>#:data.tenDoanhNghiep #</h5>
                        <span>Địa chỉ: #: data.diaChi #</span>`,
            minLength: 3,
            dataSource: {
                serverFiltering: true,
                serverPaging: true,
                transport: {
                    read: function (options) {
                       var _request = {
                            skipCount: 0,
                            maxResultCount: 20,
                            filter: vm.filter.tenDoanhNghiep.trim(),
                        }
                        $http.post('/api/services/app/doanhNgiepPublish/getAllDoanhNghiepServerPaging', _request).then(function (ret) {
                            console.log(ret);
                            options.success(ret.data.result.items);
                        });
                    }
                },
                sortable: true,
                selectable: false,
            }
        }
        vm.auto_complete_ten_san_pham_options = {
            dataTextField: "tenSanPham",
            headerTemplate: "",
            template: `<div>
                        <h5 class ='bold font-blue'>#:data.tenSanPham #</h5>
                        <span>#: data.doanhNghiep #</span>`,
            minLength: 3,
            dataSource: {
                serverFiltering: true,
                serverPaging: true,
                transport: {
                    read: function (options) {
                       var _request = {
                            Filter: vm.filter.tenSanPham.trim()
                        }
                        $http.post('/api/services/app/xuLyHoSoTraCuu/getTenSanPhamCongBo', _request).then(function (ret) {
                            console.log(ret, "san pham tu cb");
                            options.success(ret.data.result);
                        });
                    }
                },
                sortable: true,
                selectable: false,
            }
        }
    }
]);;
MyApp.controller('ctrl.tracuutucongbo', [
    '$scope', '$location', '$http', '$window',
    function ($scope, $location, $http, $window) {
        var vm = this;
        vm.dataForm = {};
        vm.list = {
            HoSo: [],
        };
        var today = new Date();
        vm.saving = false;
        vm.requestParams = {
            skipCount: 0,
            maxResultCount: 10,
            sorting: null
        };
        vm.filter = {
            tenDoanhNghiep: "",
            tenSanPham: "",
            diaChi: "",
            soCongBo: "",
            tinhId: null,
            nhomSanPhamId: null,
            trangThai: 1,
            ngayTuCongBoTu: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
            ngayTuCongBoToi: new Date(),
        }
        vm.filterInit = angular.copy(vm.filter);

        vm.ngayTuCongBoOptions = app.createDateRangePickerOptions();
        vm.ngayTuCongBoOptions.locale.format = "DD/MM/YYYY";
        vm.ngayTuCongBoModel = {
            startDate: vm.filter.ngayTuCongBoTu,
            endDate: vm.filter.ngayTuCongBoToi,
        };
       

        vm.hoSoGridOptions = {
            pageable:
                {
                    "refresh": true,
                    "pageSizes": true,
                    messages: {
                        empty: "Không có dữ liệu",
                        display: "Tổng {2} hồ sơ",
                        itemsPerPage: "Hồ sơ mỗi trang"
                    }
                },
            resizable: true,
            scrollable: true,
        }

        vm.columnGridHoSo = [
            {
                field: "STT",
                title: app.localize('STT'),
                width: "50px",
                template: "<div align='center'>{{this.dataItem.STT}}</div>"
            },
            {
                field: "tenDoanhNghiep",
                title: app.localize('Tên doanh nghiệp'),
            },
            {
                field: "strTinh",
                title: app.localize('Tỉnh'),
            },
            {
                field: "diaChi",
                title: app.localize('Địa chỉ'),
            },
            {
                field: "tenSanPhamDangKy",
                title: app.localize('Tên sản phẩm'),
            }
            ,
            {
                field: "soDangKyCongBo",
                title: app.localize('Số tự công bố'),
            }
            ,
            {
                field: "nhomSanPham",
                title: app.localize('Nhóm sản phẩm')
            },
            
            {
                field: "ngayTuCongBo",
                title: app.localize('Ngày tự công bố'),
                template: "{{dataItem.ngayTuCongBo | date:'dd/MM/yyyy'}}",
                width: 150
            },
            
            {
                field: "",
                title: "Bản công bố",
                template: "<div  class='text-center'><a href='javascript:void(0)' ng-click='vm.banTuCongBo(dataItem)' title='Xem bản tự công bố'><img  style='margin: auto' width=40 src='/Common/Images/certificate.png'/></a></div>",
                width: 120
            }

        ];
        
        vm.nhomSanPhamOptions = {
            dataSource: {
                transport: {
                    read: function (options) {
                        $http.post('/api/services/app/nhomSanPham/getAllNhomTuCongBoToDDL').then(function (response) {
                            console.log(response, "response");
                            options.success(response.data.result);
                        });
                    }
                }
            },
            dataValueField: "id",
            dataTextField: "name",
            optionLabel: app.localize('Chọn nhóm sản phẩm ...'),
            filter: "contains",
        }

        vm.tinhOptions = {
            dataSource: {
                transport: {
                    read: function (options) {
                        $http.post('/api/services/app/tinh/getAllTinhToDDL').then(function (response) {
                            console.log(response, "response");
                            options.success(response.data.result);
                        });
                    }
                }
            },
            dataValueField: "value",
            dataTextField: "displayText",
            optionLabel: app.localize('Chọn tỉnh ...'),
            filter: "contains",
        }

        vm.gridHoSoDataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    vm.requestParams.skipCount = (options.data.page - 1) * options.data.pageSize;
                    vm.requestParams.maxResultCount = options.data.pageSize;
                    vm.filter.ngayTuCongBoTu = vm.ngayTuCongBoModel.startDate;
                    vm.filter.ngayTuCongBoToi = vm.ngayTuCongBoModel.endDate;
                    $http.post('/api/services/app/xuLyHoSoTraCuu/getListHoSoTuCongBoTraCuuPaging', $.extend(vm.filter, vm.requestParams)).then(function (result) {
                        var i = 1;
                        if (result) {
                            result.data.result.items.forEach(function (item) {
                                item.STT = i;
                                i++;
                            });
                            options.success(result.data.result);
                        }
                    });
                    
                }
            },
            pageSize: 10,
            serverPaging: true,
            serverSorting: true,
            scrollable: true,
            sortable: true,
            pageable: {
                refresh: true,
                pageSizes: 10,
                buttonCount: 5
            },
            schema: {
                data: "items",
                total: "totalCount"
            }
        });

        vm.refreshGridHS = function () {
            vm.showResultSearch = true;
            vm.gridHoSoDataSource.read();
        }

        vm.refreshControll = function () {
            vm.filter = angular.copy(vm.filterInit);
            vm.refreshGridHS();
        }

        vm.banTuCongBo = function (item) {

            var printInfo = {
                HoSoId: item.id
            };
            window.open(
                abp.appPath + 'Report/gotoViewTuCongBoSanPham?jsonParams=' + JSON.stringify(printInfo),
                '_blank'
            );
        }
        vm.auto_complete_doanh_nghiep_options = {
            dataTextField: "tenDoanhNghiep",
            headerTemplate: "",
            template: `<div>
                        <h5 class ='bold font-blue'>#:data.tenDoanhNghiep #</h5>
                        <span>Địa chỉ: #: data.diaChi #</span>`,
            minLength: 3,
            dataSource: {
                serverFiltering: true,
                serverPaging: true,
                transport: {
                    read: function (options) {
                       var _request = {
                            skipCount : 0,
                            maxResultCount: 20,
                            filter: vm.filter.tenDoanhNghiep,
                        }
                        $http.post('/api/services/app/doanhNgiepPublish/getAllDoanhNghiepServerPaging',_request).then(function (ret) {
                            console.log(ret);
                            options.success(ret.data.result);
                        });
                    }
                },
                sortable: true,
                selectable: false,
                schema: {
                    data: "items",
                    total: "totalCount"
                },
            }
        }
        vm.auto_complete_ten_san_pham_options = {
            dataTextField: "tenSanPhamDangKy",
            headerTemplate: "",
            template: `<div>
                        <h5 class ='bold font-blue'>#:data.tenSanPhamDangKy #</h5>
                        <span>#: data.tenDoanhNghiep #</span>`,
            minLength: 3,
            dataSource: {
                serverFiltering: true,
                serverPaging: true,
                transport: {
                    read: function (options) {
                       var _request = {
                            Filter: vm.filter.tenSanPham
                        }
                        $http.post('/api/services/app/TCBDoanhNghiepPublish/getTenSanPhamTuCongBo', _request).then(function (ret) {
                            console.log(ret,"san pham tu cb");
                            options.success(ret.data.result);
                        });
                    }
                },
                sortable: true,
                selectable: false
            }
        }
    }
]);;
MyApp.controller('ctrl.home', [
    '$scope', '$location', '$http', '$window',
    function ($scope, $location, $http, $window) {
        var vm = this;
        vm.commonFilter = '';
        vm.total = {
            dangKyCongBo: 0,
            tuCongBo: 0,
            doanhNghiep: 0,
            dangKyCongBoCuc: 0,
            dangKyCongBoCucDaTraGTN: 0
        };
        vm.top10 = {
            dangKyCongBo: [],
            tuCongBo: [],
            doanhNghiep: []
        }


        //vm.init = function () {
        //    $http.post('/api/services/app/thongKeChung/thongKeTrangChu').then(function (result) {
        //        var i = 1;
        //        var j = 1;
        //        var k = 1;
        //        if (result) {
        //            if (result.data.result.top10DangKyCongBo && result.data.result.top10dangkyhoso.length > 0) {
        //                result.data.result.top10dangkyhoso.forEach(function (item) {
        //                    item.STT = i;
        //                    i++;
        //                });
        //                vm.top10.dangKyCongBo = result.data.result.top10DangKyCongBo;
        //            }
        //            if (result.data.result.top10DoanhNghiep && result.data.result.top10DoanhNghiep.length > 0) {
        //                result.data.result.top10DoanhNghiep.forEach(function (item) {
        //                    item.STT = j;
        //                    j++;
        //                });
        //                vm.top10.doanhNghiep = result.data.result.top10DoanhNghiep;
        //            }
        //            if (result.data.result.top10TuCongBo && result.data.result.top10TuCongBo.length > 0) {
        //                result.data.result.top10TuCongBo.forEach(function (item) {
        //                    item.STT = k;
        //                    k++;
        //                });
        //                vm.top10.tuCongBo = result.data.result.top10TuCongBo;
        //            }

        //            if (result.data.result.totalDangKyCongBo) {
        //                vm.total.dangKyCongBo = result.data.result.totalDangKyCongBo;
        //                console.log(vm.total.dangKyCongBo, "vm.total.dangKyCongBo");
        //            }
        //            if (result.data.result.totalTuCongBo) {
        //                vm.total.tuCongBo = result.data.result.totalTuCongBo;
        //            }
        //            if (result.data.result.totalDoanhNghiep) {
        //                vm.total.doanhNghiep = result.data.result.totalDoanhNghiep;
        //            }

        //            if (result.data.result.totalDangKyCongBoCuc) {
        //                vm.total.dangKyCongBoCuc = result.data.result.totalDangKyCongBoCuc;
        //            }
        //            if (result.data.result.totalDangKyCongBoCuc) {
        //                vm.total.dangKyCongBoCucDaTraGTN = result.data.result.totalDangKyCongBoCucDaTraGTN;
        //            }
        //        }
               
        //    });
        //}
        vm.init();

        vm.banCongBo = function (item) {

            var printInfo = {
                HoSoId: item.id
            };
            window.open(
                abp.appPath + 'Report/gotoGiayTiepNhan?jsonParams=' + JSON.stringify(printInfo),
                '_blank'
            );
        }

        vm.banTuCongBo = function (item) {

            var printInfo = {
                HoSoId: item.id
            };
            window.open(
                abp.appPath + 'Report/gotoViewTuCongBoSanPham?jsonParams=' + JSON.stringify(printInfo),
                '_blank'
            );
        }
        vm.commonSearch = function () {
            vm.commonFilter = vm.commonFilter.trim();
            if (vm.commonFilter == '' || vm.commonFilter == null) {
                toastr["error"]("Vui lòng nhập từ khóa để tìm kiếm");
                return false;
            }
            else {
                sessionStorage.setItem("home_key_common_search", vm.commonFilter);
                $window.location.href = "/search";
            }
        }
        vm.changeSwitchFilter = function (d) {
            vm.switchFilter = {
                caseDoanhNghiep: true,
                caseSanPham: true,
            };
            if (d == 1) {
                vm.switchFilter = {
                    caseDoanhNghiep: true,
                    caseSanPham: false,
                };
            }
            if (d == 2) {
                vm.switchFilter = {
                    caseDoanhNghiep: false,
                    caseSanPham: true,
                };
            }

        }

        
    }
]);;

MyApp.controller('frontend.viewtailieu', [
    '$scope', '$sce', '$location', '$http', '$window', '$timeout', '$uibModal',
    function ($scope, $sce, $location, $http, $window, $timeout, $uibModal) {
        var vm = this;
        vm.yearSelectorOptions = {
            start: "decade",
            depth: "decade"
        };
        vm.arrTaiLieu = [];
        vm.show = false;
        var getTaiLieuDinhKemService = () => {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const soDangKyId = urlParams.get('SoDangKyId');
            var param = JSON.stringify({ soDangKyId: soDangKyId });
            if (soDangKyId != null) {
                $http.post('/api/services/app/soDangKy/GetAllHoSoTepDinhKem91', param).then(function (ret) {
                    vm.arrTaiLieu = ret.data.result.listTepDinhKem;
                });
            } else {
                vm.arrTaiLieu = null;
            }

        };
        vm.openViewFile = (item) => {
            var jsonTep = item;
            var modalInstance = $uibModal.open({
                template: `
                            <div class="modal-header">
                            <span class="caption-subject bold uppercase font-white">{{taiLieuSelected.content}}</span>
                            </div>
                            <div class="modal-body">
                            <div class="portlet light bordered" style="height: 650px">
                                <iframe title="title" style="width: 100%; height: 100%;border:0" ng-src="{{trustSrc(taiLieuUrl)}}"  ></iframe>
                            </div>
                            </div>
                            <div class="modal-footer">
                            <button class="btn default" ng-click="cancel()"><em class="glyphicon glyphicon-remove"></em> Đóng</button>
                            </div>
                            `,
                size: 'lg',
                resolve: {
                    taiLieuSelected: jsonTep
                },
                controller: ['$scope', '$uibModalInstance', '$sce', 'taiLieuSelected', function ($scope, $uibModalInstance, $sce, taiLieuSelected) {
                    $scope.taiLieuSelected = taiLieuSelected;
                    if (taiLieuSelected && taiLieuSelected.duongDanTepKySo != null && taiLieuSelected.duongDanTepKySo != undefined) {
                        $scope.taiLieuUrl = "/File/GoToViewTaiLieu?url=" + taiLieuSelected.duongDanTepKySo + "#zoom=60";
                         }
                    else {
                        $scope.taiLieuUrl = "/File/GoToViewTaiLieu?url=" + taiLieuSelected.duongDanTep + "#zoom=60";
                    }
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                    $scope.trustSrc = function (src) {
                        return $sce.trustAsResourceUrl(src);
                    };
                }]
            });
        };

        getTaiLieuDinhKemService();
    }
]);


;
(function () {
    MyApp.controller('frontend.modal.lichSuThayDoiNL', [
        '$scope', '$uibModalInstance', 'dataItemId','$rootScope', '$timeout',
        function ($scope, $uibModalInstance, dataItemId, $rootScope, $timeout) {
            var vm = this;
            vm.lichSuThayDoi = [];
            vm.cancel = function () {
                $uibModalInstance.close();
            };

            vm.dataItemId = dataItemId ? dataItemId:0;
            if (vm.dataItemId!=0) {
                abp.services.app.dAVCongBoNguyenLieuHistory.getHistory(vm.dataItemId).then(function (ret) {
                    if (ret) {
                        vm.lichSuThayDoi = ret;
                        $.each(vm.lichSuThayDoi, function (index, value) {
                            value.contentJsonObj = JSON.parse(value.contentJson);
                            value.congVan = {
                                isKhongCongVan: value.contentJsonObj.IsKhongCongVan,
                                soCongVan: value.contentJsonObj.SoCongVan,
                                tieuDeCongVan: value.contentJsonObj.TieuDeCongVan,
                                ngayKyCongVan: value.contentJsonObj.NgayKyCongVan,
                                urlCongVan: value.contentJsonObj.UrlCongVan,
                                lyDoKhongCongVan: value.contentJsonObj.LyDoKhongCongVan,
                            };
                        });
                    }
                });
            }
            var init = function () {
                abp.ui.clearBusy();
            };
            init();
        }
    ]);
})();;
(function () {
    MyApp.controller('frontend.modal.viewFilePDFModal', [
        '$scope', '$sce', '$uibModalInstance', 'modalData',
        function ($scope, $sce, $uibModalInstance, modalData) {
            var vm = this;
            
            //vm.title = modalData.title;
            //vm.pathPDF = "/File/GoToViewTaiLieu?url=" + modalData.pathPDF;

            //vm.init = function () {
            //    console.log(modalData, 'modalData', vm.pathPDF, 'vm.pathPDF');
            //}
            //vm.init();

            //vm.cancel = function () {
            //    $uibModalInstance.dismiss();
            //};

            ////Function
            //vm.trustSrc = function (src) {
            //    return $sce.trustAsResourceUrl(src);
            //}
        }
    ]);
})();;
(function () {
    var serviceNamespace = abp.utils.createNamespace(abp, 'services.app.nguyenLieuLamThuoc');
    serviceNamespace.getAllServerPaging = function (input, ajaxParams) {
        return abp.ajax($.extend({
            url: abp.appPath + 'api/services/app/nguyenLieuLamThuoc/GetAllServerPaging',
            type: 'POST',
            data: JSON.stringify(input)
        }, ajaxParams));
    };

    serviceNamespace.getById = function (id, ajaxParams) {
        return abp.ajax($.extend({
            url: abp.appPath + 'api/services/app/nguyenLieuLamThuoc/GetById' + abp.utils.buildQueryString([{ name: 'id', value: id }]) + '',
            type: 'POST',
            data: JSON.stringify({})
        }, ajaxParams));
    };

    serviceNamespace.filterThuocForNguyenLieuLamThuoc = function (input, ajaxParams) {
        return abp.ajax($.extend({
            url: abp.appPath + 'api/services/app/nguyenLieuLamThuoc/FilterThuocForNguyenLieuLamThuoc',
            type: 'POST',
            data: JSON.stringify(input)
        }, ajaxParams));
    };

    serviceNamespace.filterCoSoSanXuatThuoc = function (input, ajaxParams) {
        return abp.ajax($.extend({
            url: abp.appPath + 'api/services/app/nguyenLieuLamThuoc/FilterCoSoSanXuatThuoc',
            type: 'POST',
            data: JSON.stringify(input)
        }, ajaxParams));
    };

    serviceNamespace.filterCoSoSanXuatNguyenLieu = function (input, ajaxParams) {
        return abp.ajax($.extend({
            url: abp.appPath + 'api/services/app/nguyenLieuLamThuoc/FilterCoSoSanXuatNguyenLieu',
            type: 'POST',
            data: JSON.stringify(input)
        }, ajaxParams));
    };


    serviceNamespace.getNuocSanXuat = function (ajaxParams) {
        return abp.ajax($.extend({
            url: abp.appPath + 'api/services/app/nguyenLieuLamThuoc/GetNuocSanXuat',
            type: 'POST',
            data: JSON.stringify({})
        }, ajaxParams));
    };

    serviceNamespace.getTieuChuanChatLuong = function (ajaxParams) {
        return abp.ajax($.extend({
            url: abp.appPath + 'api/services/app/nguyenLieuLamThuoc/GetTieuChuanChatLuong',
            type: 'POST',
            data: JSON.stringify({})
        }, ajaxParams));
    };

    serviceNamespace.getHoatChatChuan = function (ajaxParams) {
        return abp.ajax($.extend({
            url: abp.appPath + 'api/services/app/nguyenLieuLamThuoc/GetHoatChatChuan',
            type: 'POST',
            data: JSON.stringify({})
        }, ajaxParams));
    };

    serviceNamespace.getHoatChatChuanById = function (id, ajaxParams) {
        return abp.ajax($.extend({
            url: abp.appPath + 'api/services/app/nguyenLieuLamThuoc/GetHoatChatChuanById' + abp.utils.buildQueryString([{ name: 'id', value: id }]) + '',
            type: 'POST',
            data: JSON.stringify({})
        }, ajaxParams));
    };
})();

(function () {

    var serviceNamespace = abp.utils.createNamespace(abp, 'services.app.dAVCongBoNguyenLieuHistory');

    serviceNamespace.getHistory = function (congBoId, ajaxParams) {
        return abp.ajax($.extend({
            url: abp.appPath + 'api/services/app/dAVCongBoNguyenLieuHistory/GetHistory' + abp.utils.buildQueryString([{ name: 'congBoId', value: congBoId }]) + '',
            type: 'POST',
            data: JSON.stringify({})
        }, ajaxParams));
    };


})();

(function () {

    var serviceNamespace = abp.utils.createNamespace(abp, 'services.app.commonPublishData');

    serviceNamespace.getAllEnumGoiThuocPublish = function (ajaxParams) {
        return abp.ajax($.extend({
            url: abp.appPath + 'api/services/app/commonPublishData/GetAllEnumGoiThuocPublish',
            type: 'POST',
            data: JSON.stringify({})
        }, ajaxParams));
    };


    serviceNamespace.getDonViTinh = function (ajaxParams) {
        return abp.ajax($.extend({
            url: abp.appPath + 'api/services/app/commonPublishData/GetDonViTinh',
            type: 'POST',
            data: JSON.stringify({})
        }, ajaxParams));
    };


})();
;
/// <reference path="../../angular.js" />
var shareModule = angular.module('shareModule', [])
    .controller('shareController', function ($scope) {


    });
shareModule.directive('share.loaigiakekhai', [
    function () {
        let data = [
            {
                id: 1,
                name: 'CIF hải quan'
            },
            {
                id: 2,
                name: 'CIF kê khai'
            },
            {
                id: 3,
                name: 'Giá trúng thầu'
            },
            {
                id: 4,
                name: 'CB trong nước'
            },
            {
                id: 5,
                name: 'CBL trong nước'
            },
            {
                id: 6,
                name: 'CB nhập khẩu'
            },
            {
                id: 7,
                name: 'CBL nhập khẩu'
            },
            {
                id: 8,
                name: 'Đính chính/bổ sung thông tin'
            }
        ];
        return {
            restrict: 'EA',
            replace: true,
            template: `<select style="width:100%;"
                        placeholder="Loại giá kê khai"
                        data-fv-notempty="isempty?isempty:true"
                        data-fv-trigger="blur"
                        data-fv-notempty-message="Không được để trống trường này"
                        kendo-drop-down-list
                        ng-model="ngmodel"
                        k-options="options"
                        class="form-control"></select>`,
            scope: {
                ngmodel: '=?',
                dataid: '=?',
                isempty: '=?',
            },
            link: function ($scope, element, attrs) {

                $scope.options = {
                    dataSource: data,
                    dataValueField: "name",
                    dataTextField: "name",
                    optionLabel: app.localize('Chọn ...'),
                    filter: "contains",
                    change: function (e) {
                        var dataItem = e.sender.dataItem();
                        $scope.dataid = (dataItem.id);
                    },
                };
                function init() {
                }
                init();
            }
        }
    }
]);
shareModule.directive('share.loaigia', [
    function () {
        let data = [
            {
                id: 1,
                name: 'CIF hải quan'
            },
            {
                id: 2,
                name: 'CIF kê khai'
            },
            {
                id: 3,
                name: 'Giá trúng thầu'
            },
            {
                id: 4,
                name: 'KK/KKL trong nước'
            },
            {
                id: 5,
                name: 'KK/KKL nhập khẩu'
            },
        ];
        return {
            restrict: 'EA',
            replace: true,
            template: `<select style="width:100%;"
                        placeholder="Loại giá kê khai"
                        data-fv-notempty="isempty?isempty:true"
                        data-fv-trigger="blur"
                        data-fv-notempty-message="Không được để trống trường này"
                        kendo-drop-down-list
                        ng-model="ngmodel"
                        k-options="options"
                        class="form-control"></select>`,
            scope: {
                ngmodel: '=?',
                dataid: '=?',
                isempty: '=?',
            },
            link: function ($scope, element, attrs) {

                $scope.options = {
                    dataSource: data,
                    dataValueField: "id",
                    dataTextField: "name",
                    optionLabel: app.localize('Chọn ...'),
                    filter: "contains",
                    change: function (e) {
                        var dataItem = e.sender.dataItem();
                        $scope.dataid = (dataItem.id);
                    },
                };
                function init() {
                }
                init();
            }
        }
    }
]);
shareModule.directive('share.loaigiacongbo', [
    function () {
        let data = [
            //{
            //    id: 1,
            //    name: 'CIF hải quan'
            //},
            //{
            //    id: 2,
            //    name: 'CIF kê khai'
            //},
            {
                id: 3,
                name: 'Giá trúng thầu'
            },
            {
                id: 4,
                name: 'KK/KKL trong nước'
            },
            {
                id: 5,
                name: 'KK/KKL nhập khẩu'
            }
        ];
        return {
            restrict: 'EA',
            replace: true,
            template: `<select style="width:100%;"
                        placeholder="Loại giá kê khai"
                        data-fv-notempty="isempty?isempty:true"
                        data-fv-trigger="blur"
                        data-fv-notempty-message="Không được để trống trường này"
                        kendo-drop-down-list
                        ng-model="ngmodel"
                        k-options="options"
                        class="form-control"></select>`,
            scope: {
                ngmodel: '=?',
                dataid: '=?',
                isempty: '=?',
            },
            link: function ($scope, element, attrs) {

                $scope.options = {
                    dataSource: data,
                    dataValueField: "id",
                    dataTextField: "name",
                    optionLabel: app.localize('Chọn ...'),
                    filter: "contains",
                    change: function (e) {
                        var dataItem = e.sender.dataItem();
                        $scope.dataid = (dataItem.id);
                    },
                };
                function init() {
                }
                init();
            }
        }
    }
]);
shareModule.directive('share.trangthaicongbo', [
    function () {
        let data = [
            {
                id: 1,
                name: 'Đã rà soát, không có văn bản'
            },
            {
                id: 2,
                name: 'Có văn bản kiến nghị'
            },
            {
                id: 3,
                name: 'Đã công bố, chưa rà soát'
            },
            {
                id: 0,
                name: 'Hồ sơ đang xem xét'
            }
        ];
        return {
            restrict: 'EA',
            replace: true,
            template: `<select style="width:100%;"
                        placeholder="Trạng thái công bố"
                        data-fv-notempty="isempty?isempty:true"
                        data-fv-trigger="blur"
                        data-fv-notempty-message="Không được để trống trường này"
                        kendo-drop-down-list
                        ng-model="ngmodel"
                        k-options="options"
                        style="border-bottom-left-radius: 0;border-top-left-radius: 0;"
                        class="form-control"></select>`,
            scope: {
                ngmodel: '=?',
                dataid: '=?',
                isempty: '=?',
            },
            link: function ($scope, element, attrs) {
                $scope.options = {
                    dataSource: data,
                    dataValueField: "id",
                    dataTextField: "name",
                    optionLabel: app.localize('Chọn ...'),
                    filter: "contains",
                    change: function (e) {
                        var dataItem = e.sender.dataItem();
                        $scope.dataid = (dataItem.id);
                    },
                };
                function init() {
                }
                init();
            }
        }
    }
]);


///Dùng cho phòng đăng ký thuôc
shareModule.directive('share.phanloaithuoc', [
    function () {
        let data = [
            {
                id: 1,
                name: 'Thuốc trong nước'
            },
            {
                id: 2,
                name: 'Thuốc nước ngoài'
            },
            {
                id: 3,
                name: 'Vắc xin'
            },
            {
                id: 4,
                name: 'Sinh phẩm'
            },
            {
                id: 5,
                name: 'Phóng xạ'
            },
            {
                id: 6,
                name: 'Nguyên liệu làm thuốc'
            }
        ];
        return {
            restrict: 'EA',
            replace: true,
            template: `<select style="width:100%;"
                        placeholder="Loại thuốc"
                        data-fv-notempty="isempty?isempty:true"
                        data-fv-trigger="blur"
                        data-fv-notempty-message="Không được để trống trường này"
                        kendo-drop-down-list
                        ng-disabled="readonly"
                        ng-model="ngmodel"
                        k-options="options"
                        class="form-control"></select>`,
            scope: {
                ngmodel: '=?',
                dataid: '=?',
                isempty: '=?',
                readonly: '=?'
            },
            link: function ($scope, element, attrs) {

                $scope.options = {
                    dataSource: data,
                    dataValueField: "id",
                    dataTextField: "name",
                    optionLabel: app.localize('Chọn ...'),
                    filter: "contains",
                    change: function (e) {
                        var dataItem = e.sender.dataItem();
                        $scope.dataid = (dataItem.id);
                    },
                };
                function init() {
                }
                init();
            }
        };
    }
]);

shareModule.directive('share.phanloaidanhmucthuoc', [
    function () {
        let data = [           
            {
                id: 1,
                name: 'Thuốc không kê đơn'
            },           
        ];
        return {
            restrict: 'EA',
            replace: true,
            template: `<select style="width:100%;"
                        placeholder="Loại danh mục thuốc"
                        data-fv-notempty="isempty?isempty:true"
                        data-fv-trigger="blur"
                        data-fv-notempty-message="Không được để trống trường này"
                        kendo-drop-down-list
                        ng-disabled="readonly"
                        ng-model="ngmodel"
                        k-options="options"
                        class="form-control"></select>`,
            scope: {
                ngmodel: '=?',
                dataid: '=?',
                isempty: '=?',
                readonly: '=?'
            },
            link: function ($scope, element, attrs) {

                $scope.options = {
                    dataSource: data,
                    dataValueField: "id",
                    dataTextField: "name",
                    optionLabel: app.localize('Chọn ...'),
                    filter: "contains",
                    change: function (e) {
                        var dataItem = e.sender.dataItem();
                        $scope.dataid = (dataItem.id);
                    },
                };
                function init() {
                }
                init();
            }
        };
    }
]);

shareModule.directive('share.phanloaihoso', [
    function () {
        let data = [
            {
                id: 1,
                name: 'Thuốc biệt dược gốc'
            },
            {
                id: 2,
                name: 'Thuốc Tương đương sinh học'
            },
        ];
        return {
            restrict: 'EA',
            replace: true,
            template: `<select style="width:100%;"
                        placeholder="Loại nhóm thuốc"
                        data-fv-notempty="isempty?isempty:true"
                        data-fv-trigger="blur"
                        data-fv-notempty-message="Không được để trống trường này"
                        kendo-drop-down-list
                        ng-disabled="readonly"
                        ng-model="ngmodel"
                        k-options="options"
                        class="form-control"></select>`,
            scope: {
                ngmodel: '=?',
                dataid: '=?',
                isempty: '=?',
                readonly: '=?'
            },
            link: function ($scope, element, attrs) {

                $scope.options = {
                    dataSource: data,
                    dataValueField: "id",
                    dataTextField: "name",
                    optionLabel: app.localize('Chọn ...'),
                    filter: "contains",
                    change: function (e) {
                        var dataItem = e.sender.dataItem();
                        $scope.dataid = (dataItem.id);
                    },
                };
                function init() {
                }
                init();
            }
        };
    }
]);

shareModule.directive('share.phanloaithuocthuhoi', [
    function () {
        let data = [
            {
                id: 1,
                name: 'Thuốc đã thu hồi'
            },
        ];
        return {
            restrict: 'EA',
            replace: true,
            template: `<select style="width:100%;"
                        placeholder="Loại thuốc"
                        data-fv-notempty="isempty?isempty:true"
                        data-fv-trigger="blur"
                        data-fv-notempty-message="Không được để trống trường này"
                        kendo-drop-down-list
                        ng-disabled="readonly"
                        ng-model="ngmodel"
                        k-options="options"
                        class="form-control"></select>`,
            scope: {
                ngmodel: '=?',
                dataid: '=?',
                isempty: '=?',
                readonly: '=?'
            },
            link: function ($scope, element, attrs) {

                $scope.options = {
                    dataSource: data,
                    dataValueField: "id",
                    dataTextField: "name",
                    optionLabel: app.localize('Chọn ...'),
                    filter: "contains",
                    change: function (e) {
                        var dataItem = e.sender.dataItem();
                        $scope.dataid = (dataItem.id);
                    },
                };
                function init() {
                }
                init();
            }
        };
    }
]);

shareModule.directive('share.tieuchuanthuoc', ['$timeout',
    function ($timeout) {
        var getTieuChuanService = (input, ajaxParams) => {
            return abp.ajax($.extend({
                url: abp.appPath + 'api/services/app/tieuChuan/getAllTieuChuan',
                type: 'POST',
                data: JSON.stringify(input)
            }, ajaxParams));
        };
        return {
            restrict: 'EA',
            replace: true,
            template: `<input kendo-drop-down-list
                                ng-model="selected"
                                class="form-control"
                                ng-disabled="readonly"
                                k-options="options"
                                style="width: 100%;" />`,
            scope: {
                selected: '=?',
                tenTieuChuan: '=?',
                readonly: '=?'
            },
            link: function ($scope, element, attrs) {
                $scope.dataSource = new kendo.data.DataSource({
                    transport: {
                        read: function (options) {
                            var _req = {};
                            getTieuChuanService($.extend(_req, null))
                                .then(function (result) {
                                    options.success(result);
                                });
                        }
                    }
                });
                $scope.options = {
                    dataSource: $scope.dataSource,
                    dataValueField: "id",
                    dataTextField: "tenTieuChuan",
                    optionLabel: 'Chọn ...',
                    filter: "contains",
                    dataBound: function () {

                    },
                    filtering: function (ev) {
                        var filterValue = ev.filter != undefined ? ev.filter.value : "";
                        ev.preventDefault();
                        this.dataSource.filter({
                            logic: "or",
                            filters: [
                                {
                                    field: "tenTieuChuan",
                                    operator: "contains",
                                    value: filterValue
                                },
                                {
                                    field: "tenKhongDau",
                                    operator: "contains",
                                    value: filterValue
                                }
                            ]
                        });
                    },
                    noDataTemplate: '',
                    select: function (e) {
                        var dataItem = this.dataItem(e.item);
                        $timeout(function () {
                            $scope.tenTieuChuan = dataItem.tenTieuChuan;
                        });
                    },
                };
            }
        };
    }
]);

///ShareModule cho thủ tục (83,84,85) - ThietLapPhanCongPhongDangKy
shareModule.directive('share.thutucphongdangky', [
    function () {
        let data = [
            {
                id: 83,
                name: 'TT - 83'
            },
            //{
            //    id: 84,
            //    name: 'TT - 84'
            //},
            //{
            //    id: 85,
            //    name: 'TT - 85'
            //},
            //{
            //    id: 87,
            //    name: 'TT - 87'
            //},
            {
                id: 88,
                name: "TT - 88"
            },
        ];
        return {
            restrict: 'EA',
            replace: true,
            template: `<select style="width:100%;"
                        placeholder="Loại thủ tục"
                        data-fv-notempty="isempty?isempty:true"
                        data-fv-trigger="blur"
                        data-fv-notempty-message="Không được để trống trường này"
                        kendo-drop-down-list
                        ng-model="ngmodel"
                        k-options="options"
                        class="form-control"></select>`,
            scope: {
                ngmodel: '=?',
                dataid: '=?',
                isempty: '=?',
            },
            link: function ($scope, element, attrs) {

                $scope.options = {
                    dataSource: data,
                    dataValueField: "name",
                    dataTextField: "name",
                    optionLabel: app.localize('Chọn ...'),
                    filter: "contains",
                    change: function (e) {
                        var dataItem = e.sender.dataItem();
                        $scope.dataid = dataItem.id;
                    },
                };
                function init() {
                }
                init();
            }
        }
    }
]);;

(function () {
    MyApp.directive('frontend.dirfilter.filtercososanxuatnguyenlieu', ['$timeout',
        function ($timeout) {
            return {
                restrict: 'EA',
                replace: true,
                template:`<input kendo-auto-complete
                            class="form-control attp-filter-dn"
                            style="width:100%;"
                            ng-model="selectedItem"
                            ng-readonly="isReadonly"
                            enter-key="filterData()"
                            k-options="options" />`,
                scope: {
                    selectedItem: '=?',
                    selectedobj: '=?',
                    isReadonly: '=?',
                },
                link: function ($scope, element, attrs) {
                    $scope.options = {
                        dataSource: new kendo.data.DataSource({
                            serverFiltering: true,
                            transport: {
                                read: function (options) {
                                    var _req = {
                                        filterText: $scope.selectedItem,
                                    };
                                    abp.services.app.nguyenLieuLamThuoc.filterCoSoSanXuatNguyenLieu(_req).then(function (result) {
                                        $timeout(function () {
                                            options.success(result);
                                        });
                                    });
                                }
                            },
                            serverPaging: true,
                            sortable: true,
                            selectable: false,
                        }),
                        height: 300,
                        template: `  <span class='bold'>{{dataItem.tenCoSo}}</span><br/>
                                     <span>{{dataItem.tenNuoc}}</span>`,
                        noDataTemplate: ``,
                        select: function (e) {
                            e.preventDefault();
                            var item = e.item;
                            var dataItem = this.dataItem(e.item.index());
                            $scope.selectItem(dataItem);
                            this.close();
                        },
                        filtering: function (e) {
                        },
                        close: function (e) {
                        },
                    };
                    $scope.filterData = function () {
                        $scope.options.dataSource.read();
                    };
                    $scope.selectItem = function (dataItem) {
                        $timeout(function () {
                            $scope.selectedItem = dataItem.tenCoSo;
                            $scope.selectedobj = dataItem;
                        });                       
                    }
                    function init() {
                       
                    }
                    init();
                }
            };
        }
    ]);
})();
;

(function () {
    MyApp.directive('frontend.dirfilter.filtercososanxuatthuoc', ['$timeout', 
        function ($timeout) {
            return {
                restrict: 'EA',
                replace: true,
                template: `<input kendo-auto-complete
                            class="form-control attp-filter-dn"
                            style="width:100%;"
                            ng-model="selectedItem"
                            ng-readonly="readonly"
                            enter-key="filterData()"
                            k-options="options" />`,
                scope: {
                    selectedItem: '=?',
                    readonly: '=?',
                },
                link: function ($scope, element, attrs) {
                    $scope.options = {
                        dataSource: new kendo.data.DataSource({
                            serverFiltering: true,
                            transport: {
                                read: function (options) {
                                    var _req = {
                                        filterText: $scope.selectedItem,
                                    };
                                    abp.services.app.nguyenLieuLamThuoc.filterCoSoSanXuatThuoc(_req).then(function (result) {
                                        $timeout(function () {
                                            options.success(result);
                                        });

                                    });

                                }
                            },
                            serverPaging: true,
                            sortable: true,
                            selectable: false,
                        }),
                        height: 300,
                        template: `  <span class='bold'>{{dataItem.tenCoSo}}</span>`,
                        noDataTemplate: ``,
                        select: function (e) {
                            e.preventDefault();
                            var item = e.item;
                            var dataItem = this.dataItem(e.item.index());
                            $scope.selectItem(dataItem);
                            this.close();
                        },
                        filtering: function (e) {
                        },
                        close: function (e) {
                        },
                    };
                    $scope.filterData = function () {
                        $scope.options.dataSource.read();
                    };
                    $scope.selectItem = function (dataItem) {
                        $timeout(function () {
                            $scope.selectedItem = dataItem.tenCoSo;
                        });

                    }
                    function init() {

                    }
                    init();
                }
            };
        }
    ]);
})();
;

(function () {
    MyApp.directive('frontend.dirfilter.filterdonvitinh', ['$timeout',
        function ($timeout) {
            return {
                restrict: 'EA',
                replace: true,
                template: `<input kendo-drop-down-list
                                ng-model="selected"
                                k-options="options"
                                style="width: 100%;" />`,
                scope: {
                    selected: '=?',
                    idSelected: '=?',
                },
                link: function ($scope, element, attrs) {
                    $scope.dataSource = new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                abp.services.app.commonPublishData.getDonViTinh().done(function (result) {
                                    options.success(result);
                                });
                            }
                        }
                    });
                    $scope.options = {
                        dataSource: $scope.dataSource,
                        dataValueField: "tenDonVi",
                        dataTextField: "tenDonVi",
                        optionLabel: 'Chọn ...',
                        filter: "contains",
                        dataBound: function () {
                        },
                        select: function (e) {
                            var dataItem = this.dataItem(e.item);
                            $scope.selected = (dataItem.tenDonVi);
                            $scope.idSelected = (dataItem.id);
                        },
                        filtering: function (ev) {
                            var filterValue = ev.filter != undefined ? ev.filter.value : "";
                            ev.preventDefault();
                            this.dataSource.filter({
                                logic: "or",
                                filters: [
                                    {
                                        field: "tenDonVi",
                                        operator: "contains",
                                        value: filterValue
                                    },
                                    {
                                        field: "tenKhongDau",
                                        operator: "contains",
                                        value: filterValue
                                    }
                                ]
                            });
                        },
                        noDataTemplate: ''
                    };
                }
            };
        }
    ]);
})();
;
(function () {
    MyApp.directive('frontend.dirfilter.filtergoithuoc', ['$timeout',
        function ($timeout) {
            return {
                restrict: 'EA',
                replace: true,
                template: `1<input kendo-drop-down-list
                                k-options="options"
                                ng-model="selectedValue"
                                class="form-control"
                                style="width: 100%"></input>`,
                scope: {
                    selectedValue: '=?',
                    selectedText: '=?',
                },
                link: function ($scope, element, attrs) {
                    $scope.dataSource = new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                abp.services.app.commonPublishData.getAllEnumGoiThuocPublish().done(function (result) {
                                    options.success(result);
                                });
                            }
                        }
                    });

                    $scope.options = {
                        dataSource: $scope.dataSource,
                        dataValueField: "enumId",
                        dataTextField: "enumVal",
                        optionLabel: 'Chọn ...',
                        filter: "contains",
                        dataBound: function () {

                        },
                        filtering: function (ev) {
                            var filterValue = ev.filter != undefined ? ev.filter.value : "";
                            ev.preventDefault();
                            //get filter descriptor
                            this.dataSource.filter({
                                logic: "or",
                                filters: [
                                    {
                                        field: "enumVal",
                                        operator: "contains",
                                        value: filterValue
                                    }
                                ]
                            });
                            // handle the event
                        },
                        change: function (e) {
                            var dataItem = e.sender.dataItem();
                            $scope.selectedValue = (dataItem.enumId);
                            $scope.selectedText = (dataItem.enumVal);
                        },
                        noDataTemplate: 'Không có dữ liệu'
                    };
                }
            };
        }
    ]);
})();;


(function () {
    MyApp.directive('frontend.dirfilter.filterhoatchatchuan', ['$timeout',
        function ($timeout) {
            return {
                restrict: 'EA',
                replace: true,
                template: `<input kendo-drop-down-list
                                ng-model="selected"
                                 ng-readonly="isReadonly"
                                k-options="options"
                                style="width: 100%;" />`,
                scope: {
                    selected: '=?',
                    isReadonly: '=?',
                    selectedObj: '=',
                },
                link: function ($scope, element, attrs) {
                    $scope.dataSource = new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                var _hoatChatChuanData = app.sessionStorage.get("hhc_duoc_hoat_chat_chuan");
                                if (_hoatChatChuanData == null) {
                                    abp.services.app.nguyenLieuLamThuoc.getHoatChatChuan().done(function (result) {
                                        $scope.dataSourceData = result;
                                        options.success(result);
                                        app.sessionStorage.set("hhc_duoc_hoat_chat_chuan", result);
                                    });
                                }
                                else {
                                    $scope.dataSourceData = _hoatChatChuanData;
                                    options.success(_hoatChatChuanData);
                                }
                            }
                        }
                    });
                    $scope.change = function () {
                        $scope.returnobj()();
                    }
                    $scope.options = {
                        dataSource: $scope.dataSource,
                        dataValueField: "id",
                        dataTextField: "tenHoatChat",
                        optionLabel: 'Chọn ...',
                        filter: "contains",
                        virtual: {
                            //itemHeight: 100,
                            valueMapper: function (options) {
                                var values = convertValues(options.value);
                                var indices = [];
                                if (values && values.length > 0) {
                                    for (var j = 0; j < $scope.dataSource.length; j++) {
                                        var coso = $scope.dataSource[j];
                                        if (values.indexOf(coso.id) > -1) {
                                            indices.push(j);
                                        }
                                    }
                                }
                                options.success(indices);
                            }
                        },
                        dataBound: function () {
                            if ($scope.selectedObj)
                                $scope.selectedObj = this.dataItem();//Cần trong trường hợp Edit
                        },
                        change: function (e) {
                            if ($scope.selectedObj)
                                $scope.selectedObj = this.dataItem();
                        },
                        filtering: function (ev) {
                            var filterValue = ev.filter != undefined ? ev.filter.value : "";
                            ev.preventDefault();
                            //get filter descriptor
                            this.dataSource.filter({
                                logic: "or",
                                filters: [
                                    {
                                        field: "tenHoatChat",
                                        operator: "contains",
                                        value: filterValue
                                    }
                                ]
                            });
                            // handle the event
                        },
                        noDataTemplate: '',
                    };
                    function convertValues(value) {
                        var data = [];
                        value = $.isArray(value) ? value : [value];
                        for (var idx = 0; idx < value.length; idx++) {
                            data.push(value[idx]);
                        }
                        return data;
                    }
                }
            };
        }
    ]);
})();
//(function () {
//    MyApp.directive('frontend.dirfilter.filterhoatchatchuan', ['$compile', '$timeout', '$templateRequest',
//        function ($compile, $timeout, $templateRequest) {

//            var controller = ['$scope', 'appSession',
//                function ($scope, appSession) {
//                    var vm = this;

//                    vm.dataSource = [];
//                    vm.cosoOptions = {
                       
//                        dataSource: new kendo.data.DataSource({
//                            transport: {
//                                read: function (options) {
//                                    abp.services.app.nguyenLieuLamThuoc.getHoatChatChuan().done(function (result) {
//                                        vm.dataSource = result;
//                                        options.success(vm.dataSource);
//                                    });
//                                }
//                            }
//                        }),
//                        virtual: {
//                            //itemHeight: 100,
//                            valueMapper: function (options) {
//                                var values = convertValues(options.value);
//                                var indices = [];
//                                if (values && values.length > 0) {
//                                    for (var j = 0; j < vm.dataSource.length; j++) {
//                                        var coso = vm.dataSource[j];
//                                        if (values.indexOf(coso.id) > -1) {
//                                            indices.push(j);
//                                        }
//                                    }
//                                }
//                                options.success(indices);
//                            }
//                        },
//                        dataValueField: "id",
//                        dataTextField: "tenHoatChat",
//                        optionLabel: 'Chọn ...',
//                        filter: "contains",
//                        dataBound: function () {

//                        },
//                        filtering: function (ev) {
//                            var filterValue = ev.filter != undefined ? ev.filter.value : "";
//                            ev.preventDefault();
//                            //get filter descriptor
//                            this.dataSource.filter({
//                                logic: "or",
//                                filters: [
//                                    {
//                                        field: "tenHoatChat",
//                                        operator: "contains",
//                                        value: filterValue
//                                    }
//                                ]
//                            });
//                            // handle the event
//                        },
//                        noDataTemplate: 'Không có dữ liệu',
//                        height: 350,
//                    }
//                    function convertValues(value) {
//                        var data = [];
//                        value = $.isArray(value) ? value : [value];
//                        for (var idx = 0; idx < value.length; idx++) {
//                            data.push(value[idx]);
//                        }
//                        return data;
//                    }

//                }]

//            return {
//                restrict: 'EA',
//                template: `<input kendo-drop-down-list
//                                ng-model="selected"
//                                k-options="vm.cosoOptions"
//                                style="width: 100%;" />`,
//                scope: {
//                    selected: '=?',
//                },
//                controller: controller,
//                controllerAs: 'vm',
//                bindToController: false,

//                link: function (scope, elem, attr, ctrl) {
                   
//                }
//            };
//        }
//    ]);
//})();
;

(function () {
    MyApp.directive('frontend.dirfilter.nuocsanxuat', ['$timeout',
        function ($timeout) {
            return {
                restrict: 'EA',
                replace: true,
                template: `<input kendo-drop-down-list
                                ng-model="selected"
                                k-options="options"
                                 ng-readonly="isReadonly"
                                style="width: 100%;" />`,
                scope: {
                    selected: '=?',
                    isReadonly: '=?',
                },
                link: function ($scope, element, attrs) {
                    $scope.dataSource = new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                abp.services.app.nguyenLieuLamThuoc.getNuocSanXuat().done(function (result) {
                                    console.log(result, 'result');
                                    options.success(result);
                                });
                            }
                        }
                    });

                    $scope.options = {
                        dataSource: $scope.dataSource,
                        dataValueField: "tenQuocGia",
                        dataTextField: "tenQuocGia",
                        optionLabel: 'Chọn ...',
                        filter: "contains",
                        dataBound: function () {

                        },
                        filtering: function (ev) {
                            var filterValue = ev.filter != undefined ? ev.filter.value : "";
                            ev.preventDefault();
                            //get filter descriptor
                            this.dataSource.filter({
                                logic: "or",
                                filters: [
                                    {
                                        field: "tenQuocGia",
                                        operator: "contains",
                                        value: filterValue
                                    },
                                    {
                                        field: "tenKhongDau",
                                        operator: "contains",
                                        value: filterValue
                                    }
                                ]
                            });
                            // handle the event
                        },
                        noDataTemplate: ''
                    };
                }
            };
        }
    ]);
})();
;
(function () {
    MyApp.directive('frontend.dirfilter.filtersocongvan', ['$timeout',
        function ($timeout) {
            return {
                restrict: 'EA',
                replace: true,
                template: `<input kendo-auto-complete
                            class="form-control attp-filter-dn"
                            style="width:60%;"
                             ng-readonly="isReadonly"
                            ng-model="txtItem"
                            enter-key="filterData()"
                            k-options="options" />`,
                scope: {
                    selectedItem: '=?',
                    isReadonly: '=?',
                    txtItem:'=?'
                },
                link: function ($scope, element, attrs) {
                    $scope.options = {
                        dataSource: new kendo.data.DataSource({
                            serverFiltering: true,
                            transport: {
                                read: function (options) {
                                    var _req = {
                                        filterText: $scope.txtItem,
                                    };
                                    abp.services.app.nguyenLieuLamThuoc.filterSoCongVan(_req).then(function (result) {
                                        $timeout(function () {
                                            options.success(result);
                                        });

                                    });

                                }
                            },
                            serverPaging: true,
                            sortable: true,
                            selectable: false,
                        }),
                        height: 300,
                        template: `  <span class='bold'>{{dataItem.soCongVan}}/QLD-DK</span>`,
                        noDataTemplate: ``,
                        select: function (e) {
                            e.preventDefault();
                            var item = e.item;
                            var dataItem = this.dataItem(e.item.index());
                            $scope.selectItem(dataItem);
                            this.close();
                        },
                        filtering: function (e) {
                        },
                        close: function (e) {
                        },
                    };
                    $scope.filterData = function () {
                        $scope.options.dataSource.read();
                    };
                    $scope.selectItem = function (dataItem) {
                        $timeout(function () {
                            $scope.selectedItem = dataItem;
                            $scope.txtItem = dataItem.soCongVan;
                        });

                    }
                    function init() {

                    }
                    init();
                }
            };
        }
    ]);
})();

;

(function () {
    MyApp.directive('frontend.dirfilter.filterthuoc', ['$timeout', 
        function ($timeout) {
            return {
                restrict: 'EA',
                replace: true,
                //templateUrl: '/App/common/filters/thuoc-by-so-dang-ky/filter-thuoc.cshtml',
                template:`<input kendo-auto-complete
                            class="form-control"
                             ng-readonly="isReadonly"
                            style="width:100%;"
                            ng-model="selectedItem"
                            enter-key="searchThuoc()"
                            k-options="thuocSearchOptions" />`,
                scope: {
                    selectedItem: '=?',
                    isReadonly: '=?',
                    thuocselected: '=?',
                    inputform: '=?',
                },
                link: function ($scope, element, attrs) {
                    $scope.thuocSearchOptions = {
                        dataSource: new kendo.data.DataSource({
                            serverFiltering: true,
                            transport: {
                                read: function (options) {
                                    var _req = {
                                        filterText: $scope.selectedItem,
                                    };
                                    abp.services.app.nguyenLieuLamThuoc.filterThuocForNguyenLieuLamThuoc(_req).then(function (result) {
                                        $timeout(function () {
                                            options.success(result);
                                        });

                                    });

                                }
                            },
                            serverPaging: true,
                            sortable: true,
                            selectable: false,
                        }),
                        height: 300,
                        headerTemplate: "",
                        template: `<div >
                                    <div class="attp-filter-media">
                                        <div class="media-left">
                                            <img src="../Common/Images/medicine-default.jpg" class="media-object"  />                                            
                                        </div>
                                        <div class="media-body">                                          
                                            <p><strong>SĐK :</strong> {{dataItem.soDangKy}} </p>
                                            <p><strong>Tên thuốc :</strong>{{dataItem.tenThuoc}}</p>
                                        </div>
                                    </div>
                                </div>
                                    `,
                        noDataTemplate: ``,
                        select: function (e) {
                            e.preventDefault();
                            var item = e.item;
                            var dataItem = this.dataItem(e.item.index());
                            $scope.selectThuoc(dataItem);
                            this.close();
                        },
                        filtering: function (e) {
                        },
                        close: function (e) {
                        },
                    };
                    $scope.searchThuoc = function () {
                        $scope.thuocSearchOptions.dataSource.read();
                    };
                    $scope.selectThuoc = function (dataItem) {
                        $timeout(function () {
                            if ($scope.inputform == 'sdk') {
                                $scope.selectedItem = dataItem.soDangKy;
                            }
                            else {
                                $scope.selectedItem = dataItem.tenThuoc;
                            }
                            $scope.thuocselected = dataItem;
                        });
                       
                    }
                    function init() {
                       
                    }
                    init();
                }
            };
        }
    ]);
})();
;

(function () {
    MyApp.directive('frontend.dirfilter.filtertieuchuanchatluong', ['$timeout',
        function ($timeout) {
            return {
                restrict: 'EA',
                replace: true,
                template: `<input kendo-drop-down-list
                                ng-model="selected"
                                ng-readonly="isReadonly"
                                k-options="options"
                                style="width: 100%;" />`,
                scope: {
                    selected: '=?',
                    isReadonly: '=?',
                },
                link: function ($scope, element, attrs) {
                    $scope.dataSource = new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                abp.services.app.nguyenLieuLamThuoc.getTieuChuanChatLuong().done(function (result) {
                                    options.success(result);
                                });
                            }
                        }
                    });

                    $scope.options = {
                        dataSource: $scope.dataSource,
                        dataValueField: "tenTieuChuan",
                        dataTextField: "tenTieuChuan",
                        optionLabel: 'Chọn ...',
                        filter: "contains",
                        dataBound: function () {

                        },
                        filtering: function (ev) {
                            var filterValue = ev.filter != undefined ? ev.filter.value : "";
                            ev.preventDefault();
                            //get filter descriptor
                            this.dataSource.filter({
                                logic: "or",
                                filters: [
                                    {
                                        field: "tenTieuChuan",
                                        operator: "contains",
                                        value: filterValue
                                    },
                                    {
                                        field: "tenKhongDau",
                                        operator: "contains",
                                        value: filterValue
                                    }
                                ]
                            });
                            // handle the event
                        },
                        noDataTemplate: ''
                    };
                }
            };
        }
    ]);
})();;
