function Dao(data){
	//public
	data.callDone= data.callDone || function(){ console.log("init is Done!!!!!")};
	data.schema= data.schema || 'crud';

	//private
	this.schemaBuilder=null;
	this.db=null;
	this.table={};


	this._init(data);

}

Dao.prototype={
	constructor: Dao,
	_init:function(data){ //test pass
		var deferred = Q.defer();
		this.schemaBuilder=lf.schema.create(data.schema, 1);
		//建立表
		this.schemaBuilder.createTable('tBillType').
					    addColumn('billValue', lf.Type.STRING).
					    addColumn('billKey', lf.Type.STRING).
					    addPrimaryKey(['billValue']);
		this.schemaBuilder.createTable('tBill').
					    addColumn('uuid', lf.Type.STRING).
					    addColumn('billType', lf.Type.STRING).
					    addColumn('billName', lf.Type.STRING).
					    addColumn('billFlow', lf.Type.STRING).
					    addColumn('billTime', lf.Type.DATE_TIME).
					    addColumn('billMoney', lf.Type.NUMBER).
					    addPrimaryKey(['uuid']);
		var $this=this;
		$this.schemaBuilder.connect().then(function(database) {
			$this.table.tBillType = database.getSchema().table('tBillType');
			$this.table.tBill = database.getSchema().table('tBill');
			$this.db=database;
			data.callDone();
    	});
	},
	insertBill:function(data){
		data.uuid=this.getUUID();
		// data.billTime=new Date();
		var row = this.table.tBill.createRow(data);
		return this.db.insert().into(this.table.tBill).values([row]).exec();
	},
	updateBill:function(data){
		var t=this.table.tBill;
		return this.db.update(t)
		.set(t.billType,data.billType)
		.set(t.billFlow,data.billFlow)
		.set(t.billName,data.billName)
		.set(t.billMoney,data.billMoney)
		.set(t.billTime,data.billTime)
		.where(t.uuid.eq(data.uuid)).exec();
	},
	deleteBill:function(uuid){ 
		return this.db.delete().from(this.table.tBill).where(this.table.tBill.uuid.eq(uuid)).exec();
	},
	getBill:function(uuid){ 
		return this.db.select().from(this.table.tBill).where(this.table.tBill.uuid.eq(uuid)).exec();
	},
	getBillList:function(pageNumber,condition){ 
		var pageSize=20;
		pageNumber=(pageNumber-1) * pageSize;

		console.log("getBillList is start pageNumber="+pageNumber);
		var table=this.table.tBill;
		var select=this.db.select().from(table); //from table

		if(condition){
			var s="select=select.where(lf.op.and(";
			if(condition.startDate){
				s+="table.billTime.gte( new Date(parseInt(condition.startDate)))";
			}else{
				s+="table.billTime.gte( new Date('2015-01-01 00:00:00'))";
			}
			if(condition.endDate){
				s+=",table.billTime.lte( new Date(parseInt(condition.endDate)))";
			}
			if(condition.billType){
				s+=",table.billType.eq(condition.billType)";
			}
			// "table.billTime.gte( condition.startDate?new Date(condition.startDate+' 00:00:00'):new Date('2015-01-01 00:00:00')),"+
			// "table.billTime.lte( condition.endDate?new Date(condition.endDate+' 23:59:59'):new Date('2015-01-01 23:59:59')),"+
			s+="))";
			eval(s);
		}
		select=select.limit(pageSize).skip(pageNumber).orderBy(table.billTime, lf.Order.DESC); //page and order by
		return select.exec();
	},
	getAllBill:function(){
		var table=this.table.tBill;
		return this.db.select().from(table).exec();
	},
	getBillAnalyzeByColumn:function(date,flow){
		var tBill=this.table.tBill;
		return this.db.select(lf.fn.sum(tBill.billMoney).as('sumRow'))
		      .from(tBill)
		      .where(lf.op.and(
		      	tBill.billTime.gte(new Date(date.startDate))
		       ,tBill.billTime.lte(new Date(date.endDate))
		      	,tBill.billFlow.eq(flow)
		      ))
		      .exec();
		       
	},
	getBillAnalyzeByPie:function(type,flow){
		var tBill=this.table.tBill;
		return this.db.select(lf.fn.sum(tBill.billMoney).as('sumRow'))
		      .from(tBill)
		      .where(lf.op.and(
		      	tBill.billType.eq(type)
		      	,tBill.billFlow.eq(flow)
		      ))
		      .exec();
	},
	insertBillType:function(data){
		data.billValue=this.getUUID();
		var row = this.table.tBillType.createRow(data);
		return this.db.insert().into(this.table.tBillType).values([row]).exec();
	},
	updateBillType:function(data){
		var t=this.table.tBillType;
		return this.db.update(t)
		.set(t.billKey,data.billKey)
		.where(t.billValue.eq(data.billValue)).exec();
	},
	deleteBillType:function(billValue){ 
		return this.db.delete().from(this.table.tBillType).where(this.table.tBillType.billValue.eq(billValue)).exec();
	},
	getBillType:function(billValue){ 
		return this.db.select().from(this.table.tBillType).where(this.table.tBillType.billValue.eq(billValue)).exec();
	},
	getBillTypeList:function(){ 
		var table=this.table.tBillType;
		// select=select.limit(pageSize).skip(pageNumber).orderBy(table.billTime, lf.Order.DESC); //page and order by
		return this.db.select().from(table).exec();
	},


	getUUID : function() {
		this.getUUID.random4 = function() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		};
		return (this.getUUID.random4() + this.getUUID.random4() + "-" + this.getUUID.random4() + "-" +this.getUUID.random4() + "-" + this.getUUID.random4() + "-" + this.getUUID.random4() + this.getUUID.random4() + this.getUUID.random4());
	},
	dropDatabase:function(name){
		var deleteDbRequest = window.indexedDB.deleteDatabase(name);
	   deleteDbRequest.onsuccess = function (event) {
	      console("数据库删除成功");
	   };
	   deleteDbRequest.onerror = function (e) {
	      console("数据库错误： " + e.target.errorCode);
	   };
	},
}