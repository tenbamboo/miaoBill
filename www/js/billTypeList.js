var BillTypeList={
		initHeader:function(){
			$('header h3').html('我的账单类型');
			$('header .rightBtn').html('');
		},
		initEvent:function(){
			
		},
		initTool:function(){

		 //    myScroll = new IScroll('.billListDiv', {
			// 	scrollbars: true,
			// 	mouseWheel: true,
			// 	interactiveScrollbars: true,
			// 	shrinkScrollbars: 'scale',
			// 	fadeScrollbars: true
			// });
		    
		},
	}
	jQuery(document).ready(function($) {
		BillTypeList.initHeader();
		BillTypeList.initTool();
		BillTypeList.initEvent();
	});