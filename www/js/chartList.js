	var ChartList={
		billType:null,
		initHeader:function(){
			$('header h3').html('我的图表');
			$('header .rightBtn').html('');
		},
		initEvent:function(){
			$("#billTypePieBtn").click(function(){
				Index.showCustomDialog('pieContainerDiv');
				ChartList.initPieChart();
			});
			$("#billTimeColumnBtn").click(function(){
				Index.showCustomDialog('columnContainerDiv');
				ChartList.initColumnChart();
			});
			$("#timeStep").change(function(){
				ChartList.initColumnChart();
			});

			
			$(".closeDialog").click(function(event) {
					Index.hideCustomDialog();
			});
		},
		initTool:function(){
			ChartList.getBillType();
		},
		getBillType:function(){
			dao.getBillTypeList().then(function(rows){
				ChartList.billType=rows;
			});
		},
		getPieAnalyzeProx:function(){
			var deferred = Q.defer();
			ChartList.getPieAnalyze().then(function(data){
				console.log(data);
				var sum=data.sum;
				var array=data.list;
				var result=[];
				var obj={};
				for(var i=0,l=array.length;i<l;i++){
					obj={};
					if(array[i].sumRow!=null){
						obj.y=parseInt((((array[i].sumRow/sum)*100).toFixed(2)));
						obj.name=array[i].billType;
						obj.bill=array[i];
						result.push(obj);
					}
					if(i+1==l){
						deferred.resolve(result);
					}
				}
 				// 
			});
			return deferred.promise;
			
		},
		getPieAnalyze:function(){
			var sum=0;
			var deferred = Q.defer();
			var j=0;
			var list=[];
			for(var  i=0,l=ChartList.billType.length;i<l;i++){
				dao.getBillAnalyzeByPie(ChartList.billType[i].billValue,'cost').then(function(rows){
					rows=rows[0];
					sum+=rows.sumRow;
					rows.billType=ChartList.billType[j].billKey;
					j++;
					list.push(rows);
					if(j+1==l){
						deferred.resolve({list:list,sum:sum});
					}
				});
			}
			return deferred.promise;
		},
		initPieChart:function(){
			ChartList.getPieAnalyzeProx().then(function(data){
				$('#pieContainer').highcharts({
			        chart: {
			            plotShadow: true,
			            type: 'pie'
			        },
			        title: {
			            text: '账单类型饼状图'
			        },
			        tooltip: {
				 		formatter: function() {
				 			console.log(111)
				 			var html='账单类型:'+this.point.bill.billType+'<br>'+
				 			         '账单金额:'+this.point.bill.sumRow+'元<br>'+
				 			         '占百分比:'+this.y+'%';
							return html;	
				 		},
			        },
			        plotOptions: {
			            pie: {
			                allowPointSelect: true,
			                cursor: 'pointer',
			                dataLabels: {
			                    enabled: false,
			                }
			            }
			        },
			        series: [{
			            colorByPoint: true,
			            data: data
			        }]
			    });
			});
		},
		getColumnAnalyzeProx:function(){
			var deferred = Q.defer();
			ChartList.getColumnAnalyze().then(function(data){
				console.log(data);
			});
			return deferred.promise;
		},
		getColumnAnalyze:function(array){
			var deferred = Q.defer();
			var j=0;
			var date={};
			var list=[];

			console.log("")
			var sDate=new Date();
			sDate.setHours(0);
			sDate.setMinutes(0);
			sDate.setSeconds(0);
			var eDate=new Date();
			eDate.setHours(23);
			eDate.setMinutes(59);
			eDate.setSeconds(59);
			var dateVal=$("#timeStep").val();
			var end=dateVal.substring(0,dateVal.indexOf(","));
			var step=dateVal.substring(dateVal.indexOf(",")+1,dateVal.length);
			step=parseInt(step);
			end=parseInt(end);
			sDate.setMonth(sDate.getMonth()-step);
			var date={};
			for(var i=0;i<end;i+=step){
				date.startDate=sDate ;
				date.endDate=eDate;

				console.log(Index.formatDate(date.startDate,"yyyy-MM-dd"));
				console.log(Index.formatDate(date.endDate,"yyyy-MM-dd"));

				dao.getBillAnalyzeByColumn(date,'cost').then(function(data){
					j+=step;
					console.log("s:"+data)
					list.push(data);
					if(j+step==end){
						deferred.resolve(list);
					}

				});

				eDate.setMonth(sDate.getMonth());
				sDate.setMonth(sDate.getMonth()-step);

			}


			// for(var i=0,l=array.length;i<l;i++){
			// 	date.startDate=array[i].startDate;
			// 	date.endDate=array[i].endDate;

			// }
			return deferred.promise;
		},
		initColumnChart:function(){

			ChartList.getColumnAnalyzeProx();
			 $('#columnContainer').highcharts({
		        chart: {
		            type: 'column'
		        },
		        title: {
		            text: '账单时间柱状图'
		        },
		        xAxis: {
		            type: 'category',
		            labels: {
		                rotation: -45,
		                style: {
		                    fontSize: '13px',
		                    fontFamily: 'Verdana, sans-serif'
		                }
		            }
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: '金额'
		            }
		        },
		        legend: {
		            enabled: false
		        },
		        tooltip: {
		            pointFormat: 'Population in 2008: <b>{point.y:.1f} millions</b>'
		        },
		        series: [{
		            name: 'Population',
		            data: [
		                ['Shanghai', 23.7],
		                ['Lagos', 16.1],
		                ['Instanbul', 14.2],
		                ['Karachi', 14.0],
		                ['Mumbai', 12.5],
		                ['Moscow', 12.1],
		                ['São Paulo', 11.8],
		                ['Beijing', 11.7],
		                ['Guangzhou', 11.1],
		                ['Lima', 8.9]
		            ],
		            dataLabels: {
		                enabled: true,
		                rotation: -90,
		                color: '#FFFFFF',
		                align: 'right',
		                format: '{point.y:.1f}', // one decimal
		                y: 10, // 10 pixels down from the top
		                style: {
		                    fontSize: '13px',
		                    fontFamily: 'Verdana, sans-serif'
		                }
		            }
		        }]
		    });
		},
	}
	jQuery(document).ready(function($) {
		ChartList.initHeader();
		ChartList.initTool();
		ChartList.initEvent();

	});