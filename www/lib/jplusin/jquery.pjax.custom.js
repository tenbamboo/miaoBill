/**
 * @todo pjax  ajax返回上一步
 * @namespace pjax
 * @author haze.liu
 * @since 2015年8月20日 下午2:34:22
 */
(function($) {
	/**
	 * 方法说明<BR>
	 * load :加载指定页面 当第二个参数为true是代码可以回退  $.pjax('load','demo1',true)  or $.pjax('load','demo1');
	 * back :返回上一个页面
	 */

	/**
	 * dom说明<BR>
	 * 1.带pa-href 属性的映射为单页跳转
	 * <a pa-href="demo2"  class="btn btn-primary">点我跳demo2</a>
	 * 2.带pa-back ，可以返回到上一页的，如果没有则反之
	 * <a pa-href="demo1" pa-back class="btn btn-primary">点我跳demo1(可以返回)</a>
	 */
	/**
	 * 参数说明<BR>
	 * mainContainer : 主容器(默认为mainContainer)
	 * suffix :后缀名(默认为html)
	 * defaultLoad:默认加载(默认为index)
	 * 
	 */



	 var defaults = {
		mainContainer:"mainContainer",
		suffix:"html",
		defaultLoad:"index",
	};
	var methods = null;
	var _methods = null;


	methods = {
		init : function(options) {
			defaults = $.extend(defaults, options);
			_methods._initEvent();
			_methods._load(defaults.defaultLoad);
		},
		load :function(url,isBack){
			_methods._load(url,isBack);
		},
		back :function(){
			_methods._back();
		}

	};
	_methods ={
		_initEvent:function(){
			// $('*[pa-href]').on('click', function(event) {
			$('body').delegate('*[pa-href]', 'click', function(event) {
				var $this=$(this)
				var href = $this.attr("pa-href");
				if($this.attr("pa-back")!=undefined && $this.attr("pa-back") ==''){
					_methods._load(href,true);
				}else{
					_methods._load(href);
				}
				
			});
			if (history.pushState) {
				window.addEventListener("popstate", function(e){
					_methods._changeHistory();
				});
			}
		},
		_changeHistory:function(){
			var href=_methods._getParam('paHref');
			var isBack=_methods._getParam('isBack');
			if(href){

				// if(isBack=="true"){
					_methods._load(href);
					//custom
					$("header .leftBtn .fa-bars").removeClass('fa-bars').addClass('fa-arrow-left');
				// }else{
				// 	history.replaceState(null, document.title, location.href.split("?")[0] + "?paHref=" + _methods._getParam('paHref')+"&isBack=false");
				// }
			}else{
				_methods._load(defaults.defaultLoad);
			}
		},
		_getParam:function(name){
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null)
				return unescape(r[2]);
			return null;
		},
		_load:function(url,isBack){

			Q.fcall(function(){
				$("#"+defaults.mainContainer).hide();
			}).then(function(s){
				$("#"+defaults.mainContainer).load(url+"."+defaults.suffix).show();
				if(isBack){
					// history.replaceState(null, document.title, location.href.split("?")[0] + "?paHref=" + _methods._getParam('paHref')+"&isBack=true");
					// history.pushState({},document.title, location.href.split("?")[0] + "?paHref=" + url);
					history.pushState({},document.title, location.href.split("?")[0] + "?paHref=" + url);
					//custom
					$("header .leftBtn .fa-bars").removeClass('fa-bars').addClass('fa-arrow-left');
				}else{
					//custom
					$("header .leftBtn .fa-arrow-left").removeClass('fa-arrow-left').addClass('fa-bars');
					history.pushState({},document.title, location.href.split("?")[0] + "?paHref=" + url);
				}
			})
			
			
		},
		_back:function(){
			history.back();
		}
			
	}
	$.pjax = function() {
		var method = arguments[0];
		if (methods[method]) {
			method = methods[method];
			arguments = Array.prototype.slice.call(arguments, 1);
		} else if (typeof (method) == 'object' || !method) {
			method = methods.init;
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.pjax');
			return this;
		}
		return method.apply(this, arguments);
	};
	// $.pajax.defaults = {};
})(jQuery);