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
					    addColumn('uuid', lf.Type.STRING).
					    addColumn('billValue', lf.Type.STRING).
					    addColumn('billKey', lf.Type.STRING).
					    addPrimaryKey(['uuid']);
		this.schemaBuilder.createTable('tBill').
					    addColumn('uuid', lf.Type.STRING).
					    addColumn('billType', lf.Type.STRING).
					    addColumn('billName', lf.Type.STRING).
					    addColumn('billTime', lf.Type.DATE_TIME).
					    addPrimaryKey(['id']);
		var $this=this;
		$this.schemaBuilder.connect().then(function(database) {
			$this.table.tBillType = database.getSchema().table('tBillType');
			$this.table.tBill = database.getSchema().table('tBill');
			$this.db=database;
			data.callDone();
    	});
	},
	// getAll:function(){ //test pass
	// 	return this.db.select().from(this.table.student).exec();
	// },
	// getOne:function(id){ //test pass
	// 	return this.db.select().from(this.table.student).where(this.table.student.id.eq(id)).exec();
	// },
	// insert:function(data){ //test pass
	// 	var row = this.table.student.createRow(data);
	// 	return this.db.insert().into(this.table.student).values([row]).exec();
		
	// },
	// update:function(data){
	// 	var t=this.table.student;
	// 	return this.db.update(t)
	// 	.set(t.name,data.name)
	// 	.set(t.sex,data.sex)
	// 	.set(t.hobby,data.hobby)
	// 	.where(t.id.eq(data.id)).exec();
	// },
	// delete:function(id){ //test pass
	// 	return this.db.delete().from(this.table.student).where(this.table.student.id.eq(id)).exec();
	// }
}