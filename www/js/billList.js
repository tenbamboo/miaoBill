var BillList={
		pageNum:1,
		isLoading:true,
		billTypeSelect:{},
		initHeader:function(){
			$('header h3').html('我的账单<i style="padding-left: 5px;" class="fa fa-pencil"></i>');
			$('header .rightBtn').html('<i class="fa fa-plus"></i>');
		},
		initEvent:function(){
			// $(window).scroll(function(){
		 //    
		 //    });
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
			$("#searchBillTypeSelect").change(function(event) {
				BillList.changeBillType(this);
			});
			$("#searchTimeBtn").click(function(){
				BillList.changeBillTime("interval");
			});
			$(".monthTimeBtn").click(function(){
				BillList.changeBillTime("fixed",$(this).html());
			});

			$(".rightBtn").unbind('click').bind('click',function(){
				BillList.resetForm();
				Index.showCustomDialog('billDetail');
				
			});
			$("#closeDialog").click(function(){
				Index.hideCustomDialog('billDetail');
			});

			$("#submitDialog").click(function(){
				BillList.saveOrUpdateBill();
			});
			$("#billList ").delegate('li .delBill', 'click', function(event) {	
				BillList.showDelBill($(this).parent().attr('data-uuid'));
				return false;
			});
			$("#billList ").delegate('li ', 'click', function(event) {	
				BillList.showEditBill($(this).attr('data-uuid'));
			});
			
			$("#deleteOper").click(function(){
				BillList.delBill($(this).attr('data-uuid'));
			});
			$("header .fa-pencil").click(function(){
				if($(".billList li.showDelBtn").length !=0){
					$(".billList li").removeClass("showDelBtn");
				}else{
					$(".billList li").addClass("showDelBtn");
				}
				
			})
		},
		initTool:function(){
			$(".datetimepicker").remove();
			$('#startDate').datetimepicker({
		        language:  'zh-CN',
		        todayBtn:  1,
				todayHighlight: 1,
				startView: 2,
				minView:2,
				autoclose:true,
				format:'yyyy/mm/dd'
		    });
		    $('#endDate').datetimepicker({
		        language:  'zh-CN',
		        todayBtn:  1,
				todayHighlight: 1,
				startView: 2,
				minView:2,
				autoclose:true,
				format:'yyyy/mm/dd'
		    });
		    $('#billTime').datetimepicker({
		        language:  'zh-CN',
		        todayBtn:  1,
				todayHighlight: 1,
				startView: 2,
				minView:2,
				autoclose:true,
				format:'yyyy/mm/dd',
				initialDate:new Date(),
		    });

		    

		     myScroll = new IScroll('.billListDiv', {
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,
				shrinkScrollbars: 'scale',
				fadeScrollbars: true,
				click: true,

			});
		    myScroll.on('scrollEnd', function(){
		    	if(this.y==this.maxScrollY){
		    		BillList.scrollLoader();
		    	}
		    });
		    
		},
		initDOM:function(){
			BillList.getBillType();
			BillList.getBillList(true,true);
			
		},
		getBillType:function(){
			dao.getBillTypeList().then(function(rows){
				BillList.billTypeSelect=rows;
				var html=template('billTypeSelect_template',{list:rows});
				$("#billType").html(html);
				$("#searchBillTypeSelect").html(html);

			});
		},
		showEditBill:function(uuid){

			dao.getBill(uuid).then(function(d){
				BillList.resetForm();
				$("#billType").val(d[0].billType);
				$("#billFlow").val(d[0].billFlow);
				$("#billMoney").val(d[0].billMoney);
				$("#billName").val(d[0].billName);
				$("#billTime").val(Index.formatDate(d[0].billTime,'yyyy/MM/dd'));
				$("#uuid").val(d[0].uuid);
				Index.showCustomDialog('billDetail');
			});

		},
		showDelBill:function(uuid){
			$("#confirmDialog").modal('show');
			$("#deleteOper").attr("data-uuid",uuid);
		},
		delBill:function(id){
			dao.deleteBill(id).then(function(){
				$("#confirmDialog").modal('hide');
				Index.showGreenMsg();
				if($(".showDelBtn").length>1){
					$("#billList li[data-uuid='"+id+"']").remove();
				}else{
					BillList.getBillList(true);
				}
			});
		},
		getCondition:function(){
			return condition={
				startDate:$('#searchBillTime').attr("data-startDate"),
				endDate:$('#searchBillTime').attr("data-endDate"),
				billType:$("#searchBillTypeSelect").attr("data-billType"),
			}
		},
		changeBillType:function(that){


			if($(that).val()=='addOne'){
				$("#searchBillTypeModal").modal('hide');
				$.pjax('load','billTypeList',true);
			}else{
				$("#searchBillTypeSelect").attr("data-billType",$(that).val());
				BillList.getBillList(true,true);
				$("#searchBillTypeModal").modal('hide');
				$("#searchBillType").html($(that).val()?$(that).find('option[value="'+$(that).val()+'"]').html():'账单类型');
			}


			
		},
		changeBillTime:function(flag,val){
			if(flag=='interval'){  //date interval
				if($("#startDate").val()==''){
					$("#searchBillTime").attr("data-startDate","");
				}else{
					var sd=	new Date($("#startDate").val()+" 00:00:00");
					$("#searchBillTime").attr("data-startDate",sd.getTime());
				}
				if($("#endDate").val()==''){
					$("#searchBillTime").attr("data-endDate","");
				}else{
					var ed=	new Date($("#endDate").val()+" 23:59:59");
					$("#searchBillTime").attr("data-endDate",ed.getTime());
				}

				if($("#startDate").val()==''&&$("#endDate").val()==''){
					$("#searchBillTime").html('账单时间');
				}else{
					$("#searchBillTime").html($("#startDate").val()+"~"+$("#endDate").val());
				}

				

			}else if(flag=='fixed'){
				console.log(111)
				var ed=new Date();
				ed.setHours(23);
				ed.setMinutes(59);
				ed.setSeconds(59);
				var sd;
				if(val=='一个月'){
					sd=BillList.addMonth(ed,1);
				}else if(val=='三个月'){
					sd=BillList.addMonth(ed,3);
				}else if(val=='六个月'){
					sd=BillList.addMonth(ed,6);
				}
				$("#searchBillTime").attr("data-startDate",sd.getTime());
				$("#searchBillTime").attr("data-endDate",ed.getTime());
				$("#searchBillTime").html(val);
			}

			BillList.getBillList(true,true);

			
			$("#searchBillTimeModal").modal('hide');
			
		},
		addMonth:function(st,m){

			var d=new Date();
			d.setMonth(d.getMonth()-m);
			d.setFullYear(d.getFullYear());
			d.setHours(0);
			d.setMinutes(0);
			d.setSeconds(0);
			return d;

			// var year=st.getFullYear();
			// var month=st.getMonth();
			// if(month+m>11){
			// 		year++;
			// 		month=(month+m)%11;
			// }else{
			// 	month=month+m
			// }
			// return  new Date(year+"/"+(month)+"/"+st.getDate()+" 23:59:59"); 
		},
		getBillList:function(clean,reload){
			if(clean){
				BillList.pageNum=1;
			}
			dao.getBillList(BillList.pageNum,BillList.getCondition()).then(function(rows){
				if(clean){
					$(".loading").show();
					$("#billList li").remove();
					BillList.isLoading=true;
				}

				if(rows.length==0){
					if(reload){
						$("#billList li").remove();
						myScroll.refresh();
					}
					Index.showRedMsg();
					BillList.isLoading=false;
					$(".loading").hide();
					return;
				}
				else if(rows.length < 20){
					$(".loading").hide();
				}
				
				$("#billList").append(template('billList_template',{list:rows}));
				myScroll.refresh();
				if(clean){
					myScroll.scrollTo(0, 0);
				}
				$(".billList li").removeClass("showDelBtn");

				$(".billList li").hammer().bind("swipeleft", function (e) {
					$(".billList li.showDelBtn").removeClass("showDelBtn");
					$(this).addClass("showDelBtn");
					return false;
				}).bind("swiperight", function (e) {
					$(this).removeClass("showDelBtn");
				});
			})
		},
		checkForm:function(){

			if($("#billType").val()==''){
				Index.showRedMsg('请填写账单类型');
				return true;
			}else if($("#billFlow").val()==''){
				Index.showRedMsg('请填写账单流向');
				return true;
			}else if($("#billName").val()==''){
				Index.showRedMsg('请填写账单内容');
				return true;
			}else if($("#billMoney").val()==''){
				Index.showRedMsg('请填写账单金额');
				return true;
			}else if($("#billMoney").val()=='' || !/^(\d+(\.\d{1,2})?)$/g.test($("#billMoney").val())){
				Index.showRedMsg('请填写正确的账单金额');
				return true;
			}
			return false;
		},
		saveOrUpdateBill:function(){
			if(BillList.checkForm()){
				return ;
			}
			if($("#billDetailForm #uuid").val()==''){
				BillList.saveBill();
			}else{
				BillList.updateBill();
			}
		},
		saveBill:function(){
			var data=$("#billDetailForm").serializeJson();
			data.billMoney=parseFloat(data.billMoney);
			data.billTime=new Date(data.billTime);

			dao.insertBill(data)
			.then(function(){
				BillList.getBillList(true);
				Index.hideCustomDialog('billDetail');
				Index.showGreenMsg();
			}).catch(function(e){
				alert('add fail:'+e);
			});
		},
		updateBill:function(){
			var data=$("#billDetailForm").serializeJson();
			data.billMoney=parseFloat(data.billMoney);
			data.billTime=new Date(data.billTime);
			dao.updateBill(data)
			.then(function(){
				BillList.getBillList(true);
				Index.hideCustomDialog('billDetail');
				Index.showGreenMsg();
			}).catch(function(){
				alert('add fail');
			});
		},
		resetForm:function(){
			$("#billDetailForm")[0].reset();
			$("#billDetailForm #uuid").val('');
			$("#billTime").val(Index.formatDate(new Date(),'yyyy/MM/dd'));
		},
		scrollLoader:function(that){
			if(BillList.isLoading){
				$(".loading").show();
				BillList.pageNum++;
				BillList.getBillList();
			}
		},

	}
	jQuery(document).ready(function($) {
		BillList.initHeader();
		BillList.initDOM();
		BillList.initTool();
		BillList.initEvent();
		console.log("BillList is init done");
	});