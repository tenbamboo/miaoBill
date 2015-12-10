	var SyncData={
		initHeader:function(){
			$('header h3').html('同步数据');
			$('header .rightBtn').html('');
		},
		initEvent:function(){
			$("#importBtn").click(function(){
				Index.showCustomDialog('importContainerDiv');
			});
			$("#exportBtn").click(function(){
				$("#exportArea").val('');
				Index.showCustomDialog('exportContainerDiv');
			});
			$("#exportDataBtn").click(function(){
				SyncData.exportData();
			});
			$("#importDataBtn").click(function(event) {
				SyncData.importData();
			});
			
			$(".closeDialog").click(function(event) {
					Index.hideCustomDialog();
			});
		},
		initTool:function(){
		},
		importData:function(){
			console.log(11)
			var json=$("#importArea").val();
			if(json){
				json=JSON.parse(json);
				for(var i=0,l=json.billType.length;i<l;i++){
					dao.insertBillType(json.billType[i]);
				}

				for(var i=0,l=json.bill.length;i<l;i++){
					json.bill[i].billTime=new Date(json.bill[i].billTime);
					dao.insertBill(json.bill[i]);
				}
				Index.showGreenMsg('导入成功');
			}else{
				Index.showRedMsg('请输入正确信息');
			}
			
		},
		exportData:function(){
			Q.fcall(function(){
				var deferred = Q.defer();
				dao.getAllBill().then(function(bill){
					deferred.resolve(bill);
				});
				return deferred.promise;			
			}).then(function(bill){
				var deferred = Q.defer();
				dao.getBillTypeList().then(function(billType){
					deferred.resolve({bill:bill,billType:billType});
				});
				return deferred.promise;
			}).then(function(data){
				dao.getAnalyze().then(function(analyze){
					data.analyze=analyze;
					$("#exportArea").val(JSON.stringify(data));
					console.log("aaa")
	                Index.showGreenMsg('生成成功，请手动复制',4000);
				});
			});

		},

	}
	jQuery(document).ready(function($) {
		SyncData.initHeader();
		SyncData.initTool();
		SyncData.initEvent();

	});