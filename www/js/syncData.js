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
			
			$(".closeDialog").click(function(event) {
					Index.hideCustomDialog();
			});
		},
		initTool:function(){
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