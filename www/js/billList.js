var BillList={
		initHeader:function(){
			$('header h3').html('我的账单');
			$('header .rightBtn').html('<i class="fa fa-plus"></i>');
		},
		initEvent:function(){
			// document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
			$("#billType").change(function(event) {
				BillList.changeBillType(this);
			});
			$("#searchTimeBtn").click(function(){
				BillList.changeBillTime($("#startDate").val()+"~"+$("#endDate").val())
			});
			$(".monthTimeBtn").click(function(){
				BillList.changeBillTime($(this).html())
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
				startView: 3,
				minView:3,
				autoclose:true,
				format:'yyyy-mm'
		    });
		    $('#endDate').datetimepicker({
		        language:  'zh-CN',
		        todayBtn:  1,
				todayHighlight: 1,
				startView: 3,
				minView:3,
				autoclose:true,
				format:'yyyy-mm'
		    });

		 //    myScroll = new IScroll('.billListDiv', {
			// 	scrollbars: true,
			// 	mouseWheel: true,
			// 	interactiveScrollbars: true,
			// 	shrinkScrollbars: 'scale',
			// 	fadeScrollbars: true
			// });
		    
		},
		initDOM:function(){
			BillList.getBillList();
		},
		changeBillType:function(that){
			$("#searchBillTypeModal").modal('hide');
			$("#searchBillType").html($(that).val());
		},
		changeBillTime:function(val){
			$("#searchBillTimeModal").modal('hide');
			$("#searchBillTime").html(val);
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
		getBillList:function(){
			dao.getBillList().then(function(rows){
				$("#billList").html(template('billList_template',{list:rows}));
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
				BillList.hideCustomDialog();
				alert("add success");
			}).catch(function(e){
				alert('add fail:'+e);
			});
		},
		updateBill:function(){
			var data=$("#billDetailForm").serializeJson();
			dao.updateBill(data)
			.then(function(){
				BillList.hideCustomDialog();
				alert("add success");
			}).catch(function(){
				alert('add fail');
			});
		},
		resetForm:function(){
			$("#billDetailForm")[0].reset();
			$("#billDetailForm #uuid").val('');
		}
	}
	jQuery(document).ready(function($) {
		BillList.initHeader();
		BillList.initDOM();
		BillList.initTool();
		BillList.initEvent();
	});