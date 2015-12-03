var BillList={
		pageNum:1,
		isLoading:true,
		initHeader:function(){
			$('header h3').html('我的账单');
			$('header .rightBtn').html('<i class="fa fa-plus"></i>');
		},
		initEvent:function(){
			// $(window).scroll(function(){
		 //    
		 //    });
			// document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
			$("#searchBillTypeSelect").change(function(event) {
				BillList.changeBillType(this);
			});
			$("#searchTimeBtn").click(function(){
				BillList.changeBillTime("interval");
			});
			$(".monthTimeBtn").click(function(){
				BillList.changeBillTime("fixed",$(this).html());
			});
			$(".billList li").hammer().bind("swipeleft", function (e) {
				$(".billList li.showDelBtn").removeClass("showDelBtn");
				$(this).addClass("showDelBtn");
			}).bind("swiperight", function (e) {
				$(this).removeClass("showDelBtn");
			});
			$(".rightBtn").click(function(){
				BillList.showCustomDialog();
				
			});
			$("#closeDialog").click(function(){
				BillList.hideCustomDialog();
			});

			$("#submitDialog").click(function(){
				BillList.saveOrUpdateBill();
			});
			
		},
		initTool:function(){
			$('#startDate').datetimepicker({
		        language:  'zh-CN',
		        todayBtn:  1,
				todayHighlight: 1,
				startView: 2,
				minView:2,
				autoclose:true,
				format:'yyyy-mm-dd'
		    });
		    $('#endDate').datetimepicker({
		        language:  'zh-CN',
		        todayBtn:  1,
				todayHighlight: 1,
				startView: 2,
				minView:2,
				autoclose:true,
				format:'yyyy-mm-dd'
		    });

		     myScroll = new IScroll('.billListDiv', {
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,
				shrinkScrollbars: 'scale',
				fadeScrollbars: true,
			});
		    myScroll.on('scrollEnd', function(){
		    	if(this.y==this.maxScrollY){
		    		BillList.scrollLoader();
		    	}
		    });
		    
		},
		initDOM:function(){
			BillList.getBillList();
		},
		getCondition:function(){
			return condition={
				startDate:$('#searchBillTime').attr("data-startDate"),
				endDate:$('#searchBillTime').attr("data-endDate"),
				billType:$("#searchBillTypeSelect").attr("data-billType"),
			}
		},
		changeBillType:function(that){
			$("#searchBillTypeSelect").attr("data-billType",$(that).val());
			BillList.getBillList(true,true);
			$("#searchBillTypeModal").modal('hide');
			$("#searchBillType").html($(that).val()?$(that).val():'账单类型');
		},
		changeBillTime:function(flag,val){
			if(flag=='interval'){  //date interval
				var sd= new Date(($("#startDate").val()?$("#startDate").val():"2015-01-01")+" 00:00:00"); 
				var ed=	new Date(($("#endDate").val()?$("#endDate").val():"2015-01-01")+" 23:59:59"); 
				$("#searchBillTime").attr("data-startDate",sd.getTime());
				$("#searchBillTime").attr("data-endDate",ed.getTime());
			}else if(flag=='fixed'){
				var d=new Date();
				var sd=new Date(d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+" 00:00:00"); // today
				var ed;
				if(val=='一个月'){
					ed=BillList.addMonth(sd,0);
				}else if(val=='三个月'){
					ed=BillList.addMonth(sd,2);
				}else if(val=='六个月'){
					ed=BillList.addMonth(sd,5);
				}
				$("#searchBillTime").attr("data-startDate",sd.getTime());
				$("#searchBillTime").attr("data-endDate",ed.getTime());
			}

			BillList.getBillList(true,true);

			$("#searchBillTime").html(val);
			$("#searchBillTimeModal").modal('hide');
			
		},
		addMonth:function(st,m){
			var year=st.getFullYear();
			var month=st.getMonth();
			if(month+m>11){
					year++;
					month=month%11;
			}
			return  new Date(year+"-"+(month+1)+"-"+st.getDate()+" 23:59:59"); 
		},
		showCustomDialog:function(){
			$(".customDialog").css({'top':document.body.scrollTop}).show().removeClass('slideOutDown').addClass('slideInUp'); 
			$('body').css({'overflow':'hidden'});
		},
		hideCustomDialog:function(){
			Q.fcall(function(){
				$(".customDialog").removeClass('slideInUp').addClass('slideOutDown');
				var deferred = Q.defer();
			    setTimeout(deferred.resolve, 500);
			    return deferred.promise;	
			}).then(function(s){
				$(".customDialog").hide();
				$('body').css({'overflow':''});
			})
		},
		getBillList:function(clean,reload){
			if(clean){
				BillList.pageNum=1;
			}
			dao.getBillList(BillList.pageNum,BillList.getCondition()).then(function(rows){
				if(rows.length==0){
					if(reload){
						$("#billList li").remove();
						myScroll.refresh();
					}
					BillList.showNoMoreData();
					BillList.isLoading=false;
					$(".loading").hide();
					return;
				}else if(rows.length < 20){
					BillList.showNoMoreData();
					BillList.isLoading=false;
					$(".loading").hide();
				}
				if(clean){
					$(".loading").show();
					$("#billList li").remove();
					BillList.isLoading=true;
				}
				$("#billList").append(template('billList_template',{list:rows}));
				myScroll.refresh();
				if(clean){
					myScroll.scrollTo(0, 0);
				}
			})
		},
		saveOrUpdateBill:function(){
			if($("#billDetailForm #uuid").val()==''){
				BillList.saveBill();
			}else{
				BillList.updateBill();
			}
		},
		saveBill:function(){
			var data=$("#billDetailForm").serializeJson();
			dao.insertBill(data)
			.then(function(){
				BillList.getBillList(true);
				BillList.hideCustomDialog();
				BillList.showOperSuccess();
			}).catch(function(e){
				alert('add fail:'+e);
			});
		},
		updateBill:function(){
			var data=$("#billDetailForm").serializeJson();
			dao.updateBill(data)
			.then(function(){
				BillList.getBillList(true);
				BillList.hideCustomDialog();
				BillList.showOperSuccess();
			}).catch(function(){
				alert('add fail');
			});
		},
		resetForm:function(){
			$("#billDetailForm")[0].reset();
			$("#billDetailForm #uuid").val('');
		},
		scrollLoader:function(that){
			if(BillList.isLoading){
				$(".loading").show();
				BillList.pageNum++;
				BillList.getBillList();
			}
		},
		showNoMoreData:function(){
			Q.fcall(function(){
				$(".noMoreData").show().removeClass("fadeOutUp").addClass("fadeInUp");
				var deferred = Q.defer();
				setTimeout(deferred.resolve, 1500);
				return deferred.promise;	
			}).then(function(){
				$(".noMoreData").removeClass("fadeInUp").addClass("fadeOutUp");
				var deferred = Q.defer();
				setTimeout(deferred.resolve, 500);
				return deferred.promise;
			}).then(function(){
				$(".noMoreData").hide();
			});
		},
		showOperSuccess:function(){
			Q.fcall(function(){
				$(".operSuccess").show().removeClass("fadeOutUp").addClass("fadeInUp");
				var deferred = Q.defer();
				setTimeout(deferred.resolve, 1500);
				return deferred.promise;	
			}).then(function(){
				$(".operSuccess").removeClass("fadeInUp").addClass("fadeOutUp");
				var deferred = Q.defer();
				setTimeout(deferred.resolve, 500);
				return deferred.promise;
			}).then(function(){
				$(".operSuccess").hide();
			});
		}


	}
	jQuery(document).ready(function($) {
		BillList.initHeader();
		BillList.initDOM();
		BillList.initTool();
		BillList.initEvent();
		console.log("BillList is init done");
	});