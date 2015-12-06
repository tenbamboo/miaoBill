var BillTypeList={
		initHeader:function(){
			$('header h3').html('我的账单类型');
			$('header .rightBtn').html('<i class="fa fa-plus"></i>');
		},
		initEvent:function(){
			$(".rightBtn").unbind('click').bind('click',function(){
				BillTypeList.resetForm();
				Index.showCustomDialog('billTypeDetail');
			});
			$("#closeDialog").click(function(){
				Index.hideCustomDialog('billTypeDetail');
			});

			$("#submitDialog").click(function(){
				BillTypeList.saveOrUpdateBillType();
			});
			$(".typeTag").delegate('li ', 'click', function(event) {	
				BillTypeList.showEditBillType($(this).attr('data-billValue'));
			});
			$("#delBillType").click(function(){
				BillTypeList.showDelBillType($(this).attr('data-billValue'));
			});
			$("#deleteOper").click(function(){
				BillTypeList.delBillType($(this).attr('data-billValue'));
			});
		},
		initTool:function(){

		    
		},
		initDOM:function(){
			BillTypeList.getBillTypeList();
		},
		showEditBillType:function(billValue){
			dao.getBillType(billValue).then(function(d){
				BillTypeList.resetForm();
				$("#billKey").val(d[0].billKey);
				$("#billValue").val(d[0].billValue);
				$("#delBillType").attr("data-billValue",d[0].billValue).show();
				Index.showCustomDialog('billTypeDetail');
			});
		},
		getBillTypeList:function(){
			dao.getBillTypeList().then(function(rows){
				$(".typeTag").html(template('billTypeList_template',{list:rows}));
			})
		},
		saveOrUpdateBillType:function(){
			if($("#billTypeDetail #billValue").val()==''){
				BillTypeList.saveBillType();
			}else{
				BillTypeList.updateBillType();
			}
		},
		saveBillType:function(){
			var data=$("#billTypeDetailForm").serializeJson();
			dao.insertBillType(data)
			.then(function(){
				BillTypeList.getBillTypeList();
				Index.hideCustomDialog('billTypeDetail');
				Index.showGreenMsg();
			}).catch(function(e){
				alert('add fail:'+e);
			});
		},
		updateBillType:function(){
			var data=$("#billTypeDetailForm").serializeJson();
			dao.updateBillType(data)
			.then(function(){
				BillTypeList.getBillTypeList();
				Index.hideCustomDialog('billTypeDetail');
				Index.showGreenMsg();
			}).catch(function(){
				alert('add fail:'+e);
			});
		},
		showDelBillType:function(billValue){
			$("#confirmDialog").modal('show');
			$("#deleteOper").attr("data-billValue",billValue);
		},
		delBillType:function(billValue){
			dao.deleteBillType(billValue).then(function(){
				Index.showGreenMsg();
				$("#confirmDialog").modal('hide');
				Index.hideCustomDialog('billTypeDetail');
				BillTypeList.getBillTypeList();
			});
		},
		resetForm:function(){
			$("#delBillType").hide();
			$("#billTypeDetailForm")[0].reset();
			$("#billValue").val("");
		},
		
	}
	jQuery(document).ready(function($) {
		BillTypeList.initHeader();
		BillTypeList.initTool();
		BillTypeList.initEvent();
		BillTypeList.initDOM();
	});