var dao;
			dao=new Dao({
				schema:'miaoBill',
				callDone:function(){Index.initPajax()},
			});
			jQuery(document).ready(function($) {
				Index.initTool();
				Index.initEvent();
			});
			var Index={
				initEvent:function(){
					$("header").delegate('.fa-bars', 'click', function(){
						Index.showOverlay(false);
						$(".slideBar").css({'top':document.body.scrollTop}).show().removeClass('slideOutLeft').addClass('slideInLeft');
					});
					$("header").delegate('.fa-arrow-left', 'click', function(){
						$.pjax('back');
					});
					$(".slideBar a").click(function(){
						Index.hideOverlay();
					});
					$("#exitApp").click(function(){
						app.exitApp();
					})
				},
				initPajax:function(){
					$.pjax({
						defaultLoad:'syncData'
					});
				},
				initTool:function(){
					app.initialize();
				},
				showOverlay:function(spinnerFlag){
					if(spinnerFlag){
						$(".spinner").show();
					}
					$(".overlay").height(document.body.scrollHeight).show();
					$('body').css({'overflow':'hidden'});
					$(".overlay").one('click',function(){
							Index.hideOverlay();
					});
				},
				hideOverlay:function(){
					$('body').css({'overflow':''})
					$(".overlay").hide();
					$(".spinner").hide();

					Q.fcall(function(){
						$(".slideBar").removeClass('slideInLeft').addClass('slideOutLeft')
						var deferred = Q.defer();
					    setTimeout(deferred.resolve, 500);
					    return deferred.promise;	
					}).then(function(s){
						$(".slideBar").hide();
					})
				},
				showRedMsg:function(html,tiemout){
					 html=html?html:'没有更多账单啦!';
					 tiemout=tiemout?tiemout:1500;
					Q.fcall(function(){
						$(".redMsg").html(html).show().removeClass("fadeOutUp").addClass("fadeInUp");
						var deferred = Q.defer();
						setTimeout(deferred.resolve, tiemout);
						return deferred.promise;	
					}).then(function(){
						$(".redMsg").removeClass("fadeInUp").addClass("fadeOutUp");
						var deferred = Q.defer();
						setTimeout(deferred.resolve, 500);
						return deferred.promise;
					}).then(function(){
						$(".redMsg").hide();
					});
				},
				showGreenMsg:function(html,tiemout){
					html=html?html:'操作成功';
					tiemout=tiemout?tiemout:1500;
					Q.fcall(function(){
						$(".greenMsg").html(html).show().removeClass("fadeOutUp").addClass("fadeInUp");
						var deferred = Q.defer();
						setTimeout(deferred.resolve, tiemout);
						return deferred.promise;	
					}).then(function(){
						$(".greenMsg").removeClass("fadeInUp").addClass("fadeOutUp");
						var deferred = Q.defer();
						setTimeout(deferred.resolve, 500);
						return deferred.promise;
					}).then(function(){
						$(".greenMsg").hide();
					});
				},
				showCustomDialog:function(id){
					$("#"+id).css({'top':document.body.scrollTop}).show().removeClass('slideOutDown').addClass('slideInUp'); 
					$('body').css({'overflow':'hidden'});
				},
				hideCustomDialog:function(id){
					id=id?"#"+id:".customDialog"
					Q.fcall(function(){
						$(id).removeClass('slideInUp').addClass('slideOutDown');
						var deferred = Q.defer();
					    setTimeout(deferred.resolve, 500);
					    return deferred.promise;	
					}).then(function(s){
						$(id).hide();
						$('body').css({'overflow':''});
					})
				},
				/** 
				 * 对日期进行格式化， 
				 * @param date 要格式化的日期 
				 * @param format 进行格式化的模式字符串
				 *     支持的模式字母有： 
				 *     y:年, 
				 *     M:年中的月份(1-12), 
				 *     d:月份中的天(1-31), 
				 *     h:小时(0-23), 
				 *     m:分(0-59), 
				 *     s:秒(0-59), 
				 *     S:毫秒(0-999),
				 *     q:季度(1-4)
				 * @return String
				 */
				formatDate:function(date, format){
					 date = new Date(date);
				    var map = {
				        "M": date.getMonth() + 1, //月份 
				        "d": date.getDate(), //日 
				        "h": date.getHours(), //小时 
				        "m": date.getMinutes(), //分 
				        "s": date.getSeconds(), //秒 
				        "q": Math.floor((date.getMonth() + 3) / 3), //季度 
				        "S": date.getMilliseconds() //毫秒 
				    };
				    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
				        var v = map[t];
				        if(v !== undefined){
				            if(all.length > 1){
				                v = '0' + v;
				                v = v.substr(v.length-2);
				            }
				            return v;
				        }else if(t === 'y'){
				            return (date.getFullYear() + '').substr(4 - all.length);
				        }
				        return all;
				    });
				    return format;
				},
				exitApp:function(){
					// app.exitApp();
					navigator.app.exitApp();
				},

				}


			
			template.helper('dateFormat', function (date, format) {
				return Index.formatDate(date, format);
			});
			/** 
			 * 对账单类型进行格式化， 
			 * @param val 账单uuid 
			 * @return String
			 */
			template.helper('billTypeFormat', function (val) {
				
				for(var t in BillList.billTypeSelect){
					if(BillList.billTypeSelect[t].billValue==val){
						return BillList.billTypeSelect[t].billKey;
					}
				}
			    return '';
			});

