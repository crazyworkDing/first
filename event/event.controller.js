(function () {
    'use strict';

    angular.module('OpenApiPlat.modules.behavior').controller('EventController', EventController);

    /** @ngInject */
    function EventController($scope, Constant, $compile, DTOptionsBuilder, DTColumnBuilder,
        $location, $state, Toastr, Alert, EventService, $timeout, $filter, $q) {

        var eventCharts, vm = this;

        function _initEventHeader(){
            $scope.title = "事件分析";
            $scope.isTotalDispaly = false;
            $scope.isPercentageVisible = true;

            $scope.slider = {
                value: '全量',
                options: {
                    // step:1,
                    // floor:0,
                    // ceil: 6,
                    showTicks: false,
                    hideLimitLabels: true,
                    hidePointerLabels: true,
                    stepsArray: ['1/64', '1/32', '1/16', '1/8', '1/4', '1/2', '全量']
                }
            }; 

            $scope.sessions = [ {'id': 0, 'label': '事件'}, {'id': 1, 'label': 'Session'} ];
            $scope.calculations = [ {'id': 0, 'label': '精确计算'}, {'id': 1, 'label': '近似计算'} ];
            $scope.customSession = 0, $scope.customCalculation = 0;                       
        }

        function _initEventOptions(){
            $scope.opsContainerData = { 'active': true };
            _initMeasureItems();
            _initSegmentationItems();
            _initFilterItems();
        }

        function _getEventLfilters(){
            return [ {'id': 0, 'label': 'IP', 'group': '事件属性'}, {'id': 1, 'label': '国家', 'group': '事件属性'} ];
        }

        function _getSessionLfilters(){
            return [ {'id': 0, 'label': 'Session初始事件', 'group': 'Session属性'}, {'id': 1, 'label': 'Session时长', 'group': 'Session属性'} ];
        }

        function _initFilterItems(){
            $scope.lfilters = $scope.customSession ? _getSessionLfilters() : _getEventLfilters();
            $scope.mfilters = [ {'id': 0, 'label': '等于'}, {'id': 1, 'label': '不等于'}, 
                                {'id': 2, 'label': '包含'}, {'id': 3, 'label': '不包含'},
                                {'id': 4, 'label': '有值'}, {'id': 5, 'label': '没值'},
                                {'id': 6, 'label': '为空'}, {'id': 7, 'label': '不为空'} ];
            $scope.filterItems = [];     
        }

        function _initSegmentationItems(){
            $scope.segs = $scope.customSession ? EventService.getSessionSegs() : EventService.getEventSegs();
            $scope.segmentationItems = $scope.customSession ? EventService.getSessionSegmentationItems() : EventService.getEventSegmentationItems();          
        }      

        function _initMeasureItems(){
            $scope.sessionMeasures = EventService.getSessionMeasures(); // session时
            $scope.indicators = $scope.customSession ? EventService.getSessionIndicators() : EventService.getEventIndicators();
            $scope.calculators = $scope.customSession ? EventService.getSessionCalculators() : EventService.getEventCalculators();
            $scope.measureItems = $scope.customSession ? EventService.getSessionMeasureItems() : EventService.getEventMeasureItems();

            vm.menuItems = [
                { display: '总次数', href: '#', children: [] },
                { display: '屏幕宽度', href: '#', children: [ { display: '总和', href: '#', children: [] } ] }
            ];
        }

        function _initChartTimeRange(){
        //日期控件
            var DATE_RANGES_TIMES = {
                "locale": {
                    applyClass: 'btn-green',
                    applyLabel: "确定",
                    cancelLabel: '取消',
                    fromLabel: "开始",
                    format: "YYYY-MM-DD",
                    toLabel: "到",
                    customRangeLabel: '自定义时间',
                    daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                    firstDay: 1,
                    monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                },
                "maxDate": moment(), //最大值今天
                "minDate": moment().subtract(999990, 'days'), //最长允许选择90天
                "ranges": {
                    '昨日': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '今日': [moment(), moment()],
                    '上周': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
                    '本周': [moment().startOf('week'), moment().endOf('week')],
                    '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    '本月': [moment().startOf('month'), moment().endOf('month')],
                    '去年': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
                    '本年': [moment().startOf('year'), moment().endOf('year')],
                    '过去7天': [moment().subtract(6, 'days'), moment()],
                    '过去30天': [moment().subtract(29, 'days'), moment()],
                    '上线至今': [moment().subtract(60, 'days'), moment()]
                },
                "alwaysShowCalendars": true,
                "showCustomRangeLabel": false,
            }
            $scope.dateRangOptions = DATE_RANGES_TIMES;
            $scope.datePicker = {
                date: { startDate: moment().subtract(7, 'days'), endDate: moment().subtract(1, 'days') }
            };
        }

        function _initChartTools(){
            $scope.granularities = [ {'id': 0, 'label': '按分钟'}, {'id': 1, 'label': '按小时'}, 
                                    {'id': 2, 'label': '按天'}, {'id': 3, 'label': '按周'}, {'id': 4, 'label': '按月'} ];
            $scope.chartTypes = [ {'id': 0, 'label': '线图'}, {'id': 1, 'label': '柱图'}, 
                                    {'id': 2, 'label': '饼图'}, {'id': 3, 'label': '累积'} ];
            $scope.customChartType = 0, $scope.customGranularity = 0;
        }

        function _getDisplay(nameArr){
            var itemArr = [], idArr = [];
            for(var i=0; i<nameArr.length; i++){
                itemArr.push({ 'id': i, 'label': nameArr[i] });
                idArr.push(i);
            }
            return { 'ids': idArr, 'items': itemArr }
        }

        function _setChartDisplayData(data){
            $scope.isIndicatorChecked = true;
            $scope.isGroupChecked = true;

            $scope.displayItems = _getDisplay(data.indicator).items;
            $scope.selectedIndicators = _getDisplay(data.indicator).ids;

            $scope.groupItems = _getDisplay(data.group).items;
            $scope.selectedGroups = _getDisplay(data.group).ids;
        }

        function _queryEventOptions(conditions){
            /*  一套数据多个用，线/柱/累积/饼
                组织查询条件： 
                [Web]新用户访问  的  总次数 measureItems
                按 IP 查看 segmentationItems
                IP 过滤条件 filterItems
                时间段 dateRange
                按分钟 小时 granularity

                查询上报数据格式：
                data: {
                indicator: ['任意事件的总次数', 'Web浏览界面的总次数'],
                group: ['北京','南京'], //需要后端告诉我们，前端组合时有id

                title: '任意事件的总次数, Web浏览界面的总次数',
                header:  ['周一','周二','周三','周四','周五','周六','周日'],
                field: ['北京-任意事件的总次数', '北京-Web浏览界面的总次数', '南京-任意事件的总次数', '南京-Web浏览界面的总次数'], 
                data: [ [11, 11, 15, 13, 12, 13, 10], [9, 9, 4, 5, 7, 9, 2], [1, -2, 2, 5, 3, 2, 0], [1, 2, 1, 0, 4, 4, 1] ]
                }

            */
            EventService.queryEventData(conditions).then(function(data){
                _cachedQueryResult(data);
                _refreshEventChart(data); //根据当前显示数据刷图
                _refreshEventTable(data); 
            }, function(err){
                Toastr.error('提示', '查询chart数据异常');
            })    
        }

        function _cachedQueryResult(data){
            $scope.resultData = jQuery.extend(true, {}, data); //当前数据
            _setChartDisplayData(data); //查询后根据原始数据重置tools 全选中
        }

        function _initEventCharts(){
            _initChartTimeRange();
            _initChartTools();
            var conditions = {};
            _queryEventOptions(conditions);
        }

        function sum(arr) {
            return eval(arr.join('+'));
        };

        function _getTableData(data){
            var orgArr = [], retArr = [];
            $scope.sumArr = [];
            /*把图例 field 拆开成 indicator group table中分出两列，做成 field 级别更简单*/
            for(var i=0; i<data.group.length; i++){
                for(var j=0; j<data.indicator.length; j++){
                    var arr = [data.group[i], data.indicator[j]];
                    orgArr.push(arr);
                }
            }
            /*后端上报合计没必要，会污染图例的纯粹性*/
            for(var i=0; i<data.field.length; i++){
                var sumStr = sum(data.data[i]);
                var arr = orgArr[i].concat([sumStr]).concat(data.data[i]);
                retArr.push(arr);
                $scope.sumArr.push(sumStr);
            }
            return retArr;
        }

        function _refreshEventTable(data){
            var headers = ['组名', '指标', '合计'].concat(data.header);
            var tableData = _getTableData(data);
            $scope.eventHeaders = headers.concat();
            $scope.tableData = tableData.concat();   
        }

        function _initOpsContainer(){
            _initEventOptions();
            _initEventCharts();
        }

        function _change2Alphabet(index){
            return String.fromCharCode(64 + parseInt(index));
        }

        function _getLineOptionTemplate(data){
             return {
                title: {
                    text: data.title,
                    subtext: '纯属虚构',
                    x: 'center',
                    y: 'top',
                    // textAlign: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid: {  
                    x: 250
                },
                legend: {
                    data: data.field,
                    orient: 'vertical',
                    left: 'left'
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    data: data.header
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} °C'
                    }
                },
                series: _getLineSeries(data)
            };
        }

        function _getLineSeries(data){
            var arr = [];
            for(var i=0; i<data.field.length; i++){
                var series = {
                    name: data.field[i],
                    type:'line',
                    data: data.data[i],
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }  
                }
                arr.push(series);
            }
            return arr;
        }

        function _getBarOptionTemplate(data){
            return {
                title : {
                    text: data.title,
                    subtext: '纯属虚构',
                    x: 'center',
                    y: 'top',
                    // textAlign: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                grid: {  
                    x: 250
                },
                legend: {
                    data: data.field,
                    orient: 'vertical',
                    left: 'left'
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        data : data.header
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : _getBarSeries(data)
            }
        }

        function _getBarSeries(data){
            var arr = [];
            for(var i=0; i<data.field.length; i++){
                var series = {
                    name: data.field[i],
                    type: 'bar',
                    data: data.data[i],
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name: '平均值'}
                        ]
                    }
                }
                arr.push(series);
            }
            return arr;
        }

        function _getPieOptionTemplate(data){
            return {
                title : {
                    text: data.title,
                    subtext: '纯属虚构',
                    x: 'center',
                    y: 'top',
                    // textAlign: 'center'
                },
                grid: {  
                    x: 250
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: data.field
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data: _getPieData(data),
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }
        }

        function _getPieData(data){
            var pieArr = [];
            for(var i=0; i<data.data.length; i++){
                pieArr.push(sum(data.data[i]));
            }
            var retArr = [];
            for(var i=0; i<data.field.length; i++){
                retArr.push({
                    'value': pieArr[i],
                    'name': data.field[i]
                })
            }
            return retArr;
        }

        function _getStackOptionTemplate(data){
            return  {
                title : {
                    text: data.title,
                    subtext: '纯属虚构',
                    x: 'center',
                    y: 'top',
                    // textAlign: 'center'
                },
                grid: {  
                    x: 250
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data: data.field,
                    orient: 'vertical',
                    left: 'left'
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : data.header
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : _getStackSeries(data)
            };
        }

        function _getStackSeries(data){
            var arr = [];
            for(var i=0; i<data.field.length; i++){
                var series = {
                    name: data.field[i],
                    type:'line',
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data: data.data[i]
                }
                arr.push(series);
            }
            return arr;
        }

        function _getLabel(id, arr){
            for(var i=0; i<arr.length; i++){
                if(id == arr[i].id){
                    return arr[i].label;
                }
            }
            return '';
        }

        function _getFilteredLegends(selectedGroups, selectedIndicators){
            /*对组来说，groupid*indicators.length ~ (groupid+1)*indicators.length-1 -> 对一个组id 抽一维度数据，组成二维数组
            对指标来说，从arr中抽第id列 -> 从二维数组中抽数据组成 一维数组
            根据一维数组抽图例*/
            var retArr = [];
            var inLen = $scope.displayItems.length;
            for(var i=0; i<selectedGroups.length; i++){
                var arr = [];
                var groupid = selectedGroups[i];
                var min = groupid * inLen, max = (groupid+1)*inLen-1;
                for(var num=min; num<=max; num++){
                    arr.push(num);
                }
                retArr.push(arr);
            }
            var legendArr = [];
            for(var i=0; i<retArr.length; i++){
                for(var j=0; j<selectedIndicators.length; j++){
                    var col = selectedIndicators[j];
                    legendArr.push(retArr[i][col]);
                }
            }
            return legendArr;
        }

        function _getInitialDisplayData(){
            return {
                title: '', //为变化的 chart 的 title
                indicator: [], //  为变化的 图例， table中拆解出 indicator
                group: [], //为变化的 图例，table中拆解出 group
                header: $scope.resultData.header,
                field: [ ], // 图例变化
                data: [ ]
            }
        }

        function _getDisplayedData(checked_id, isChecked, isGroup){
            /*以下预留过滤处理*/
            var selectedGroups = $scope.selectedGroups.concat();
            var selectedIndicators = $scope.selectedIndicators.concat();
            var legendArr = _getFilteredLegends(selectedGroups, selectedIndicators);
            var displayData = _getInitialDisplayData();
            for(var i=0; i<selectedIndicators.length; i++){
                displayData.indicator.push(_getLabel(selectedIndicators[i], $scope.displayItems));
            }
            for(var i=0; i<selectedGroups.length; i++){
                displayData.group.push(_getLabel(selectedGroups[i], $scope.groupItems));
            }
            displayData.title = displayData.indicator.join(', '); //纯指标建构
            for(var j=0; j<legendArr.length; j++){
                displayData.field.push($scope.resultData.field[legendArr[j]]);
                displayData.data.push($scope.resultData.data[legendArr[j]]);
            }
            return displayData;
        }

        function _refreshChart(){
            eventCharts = echarts.init($('.event-chart')[0]);
            eventCharts.clear();
            switch($scope.customChartType){
                case 0:
                    var option = _getLineOptionTemplate($scope.chartData);
                    eventCharts.setOption(option); 
                    break;
                case 1:
                    var option = _getBarOptionTemplate($scope.chartData);
                    eventCharts.setOption(option);
                    break;
                case 2:
                    var option = _getPieOptionTemplate($scope.chartData);
                    eventCharts.setOption(option);
                    break;
                case 3:
                    var option = _getStackOptionTemplate($scope.chartData);
                    eventCharts.setOption(option);
                    break; 
                default:
                    break;                                       
            }
        }

        function _refreshEventChart(displayedData){
            $scope.chartData = jQuery.extend(true, {}, displayedData); //当前数据
            _refreshChart();
        }

        function _isEqual(nv, ov){
            if(!!!nv) return true;
            nv = JSON.parse(nv), ov = JSON.parse(ov);
            for(var i=0; i<nv.length; i++){
                delete nv[i].clsVisible;
            }
            for(var i=0; i<ov.length; i++){
                delete ov[i].clsVisible;
            }
            var nvStr = JSON.stringify(nv);
            var ovStr = JSON.stringify(ov);
            if(nvStr == ovStr) return true;
            return false;
        }

        function _refreshSelectedIndicators(checked_id, isChecked){
            var idx = $scope.selectedIndicators.indexOf(checked_id);
            if((isChecked)&&(idx==-1)) $scope.selectedIndicators.push(checked_id);
            if((!isChecked)&&(idx!=-1)) $scope.selectedIndicators.splice(idx, 1);
        }

        function _refreshSelectedGroups(checked_id, isChecked){
            var idx = $scope.selectedGroups.indexOf(checked_id);
            if((isChecked)&&(idx==-1)) $scope.selectedGroups.push(checked_id);
            if((!isChecked)&&(idx!=-1)) $scope.selectedGroups.splice(idx, 1);       
        }

        $scope.stringyfy = function(items){
            if(!!!items) return null;
            return JSON.stringify(items);
        }

        $scope.$watch('stringyfy(measureItems)', function(newVal, oldVal){
            /*根据 measureItems 重构查询条件，发起查询*/
            if(_isEqual(newVal, oldVal)) return;
            var conditions = {};
            _queryEventOptions(conditions);
        }, true);

        $scope.$watch('stringyfy(segmentationItems)', function(newVal, oldVal){
            /*根据 segmentationItems 重构查询条件，发起查询*/
            if(_isEqual(newVal, oldVal)) return;
            var conditions = {};
            _queryEventOptions(conditions); 
        }, true);

        $scope.$watch('stringyfy(filterItems)', function(newVal, oldVal){
            /*根据 filterItems 重构查询条件，发起查询*/
            if(_isEqual(newVal, oldVal)) return;
            var conditions = {};
            _queryEventOptions(conditions); 
        }, true);

        $scope.$watch('dateRange', function(newVal, oldVal){
            /*根据 date 重构查询条件，发起查询*/
            if(!!!newVal||(newVal==oldVal)) return;
            var conditions = {};
            _queryEventOptions(conditions); 
        });

        $scope.$watch('slider.value', function(newVal, oldVal){
            /*根据 $scope.slider.value 重构查询条件，发起查询*/
            var conditions = {};
            _queryEventOptions(conditions); 
        });

        $scope.$watch('customSession', function(newVal, oldVal){
            _initEventOptions();
        });

        $scope.refreshEventData = function(){
            /*强制刷新数据*/
            var conditions = {};
            _queryEventOptions(conditions);        
        }

        $scope.initializeEventContainer = function(){
            _initEventHeader();
            _initOpsContainer();
        }

        $scope.checkItems= function(checked_id, isChecked, isGroup) {
            /*过滤出展示的数据，根据展示的数据刷图表*/
            isGroup ? _refreshSelectedGroups(checked_id, isChecked) : _refreshSelectedIndicators(checked_id, isChecked); //更新选中
            var displayedData = _getDisplayedData(checked_id, isChecked, isGroup);
            _refreshEventChart(displayedData); //根据当前数据刷图
            _refreshEventTable(displayedData);            
        };

        $scope.changeGranularity = function(){
            var conditions = {}; //根据 customGranularity 重构查询条件，重新发起查询
            _queryEventOptions(conditions);       
        } 

        $scope.changeChartType = function(){
            _refreshChart();
        }

        $scope.opsClickHandler = function(event){
            event.stopPropagation();
            $scope.opsContainerData.active = !$scope.opsContainerData.active; 
        }

        $scope.addMeasureItem = function(){
            var arr = $scope.measureItems.concat();
            var customObj = $scope.customSession ? EventService.getCustomSessionMeasureObj() : EventService.getCustomEventMeasureObj();
            arr.push(customObj);
            for(var i=0; i<arr.length; i++){
                arr[i].customAlphabet = _change2Alphabet(i+1);
            }
            $scope.measureItems = arr.concat();
        }

        $scope.removeMeasureItem = function(event, index){
            var arr = $scope.measureItems.concat();
            arr.splice(index, 1);
            for(var i=0; i<arr.length; i++){
                arr[i].customAlphabet = _change2Alphabet(i+1);
            }
            $scope.measureItems = arr.concat();
        }

        $scope.addSegmentationItem = function(){
            var customObj = $scope.customSession ? EventService.getCustomSessionSegmentationObj() : EventService.getCustomEventSegmentationObj();
            $scope.segmentationItems.push(customObj);
        }

        $scope.removeSegmentationItem = function(event, index){
            $scope.segmentationItems.splice(index, 1);
        }

        $scope.addFilterItem = function(){
            var customObj = $scope.customSession ? EventService.getCustomSessionFilterItems() : EventService.getCustomEventFilterItems();
            $scope.filterItems.push(customObj);
        }

        $scope.removeFilterItem = function(event, index){
            $scope.filterItems.splice(index, 1);
        }

        $scope.loadTags = function(query) {
           return $http.get('/tags?query=' + query);
        };

        $scope.downloadCsv = function(){
            var exportData = []
            var data = JSON.stringify(exportData);
            var blob = new Blob([data], {type: "application/octet-stream"});
            var url  = URL.createObjectURL(blob);
            var a = document.createElement("a");
            var fileName = $filter('date')(new Date(), "yyyyMMddhhmmss");   
            a.download = fileName+'.json';  
            a.href = url; 
            $(a).click(function(){
                window.open(url, '_self');
            });
            $(a).click();
        }

        $scope.getPercentage = function(num, row){
            var sum = $scope.sumArr[row];
            return Math.round(num/sum*10000)/100.00 + '%';
        }
    }
})();    