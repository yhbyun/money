var logAndRespond = function logAndRespond(err,res,status){
  console.error(err);
  res.statusCode = ('undefined' === typeof status ? 500 : status);
  res.send({
    status: 'fail',
    msg: 'error',
    results: err.code
  });
};
var handleConnection = function handleConnection(callback,req,res){
  req.mysql.getConnection(function(err,connection){
    if (err){ logAndRespond(err,res); return; }
    callback(connection,req,res);
  });
};
function handleGet(connection,req,res) {
  // search condition
  var q = ('undefined' === typeof req.query.q) ? '': req.query.q;
  var page_size = ('undefined' === typeof req.query.page_size) ? 10: req.query.page_size;
  var page_no = ('undefined' === typeof req.query.page_no) ? 1: req.query.page_no;
  var sort_type = ('undefined' === typeof req.query.sort_type) ? 'outlay_at': req.query.sort_type;
  var sort_order = ('undefined' === typeof req.query.sort_order) ? 'DESC': req.query.sort_order;

  // database query
  /*
  var query_str = 'SELECT * FROM moneybook';
  if (q !== '') query_str += ' WHERE item LIKE \'%'+q+'%\'';
  query_str += ' ORDER BY '+sort_type+' '+sort_order+' LIMIT '+(page_no-1)+','+page_size;
  */
  var query_str = 'SELECT item, amount, DATE_FORMAT(outlay_at, "%Y-%m-%d") as date FROM moneybooks';
  if (q !== '') query_str += ' WHERE item LIKE ?';
  query_str += ' ORDER BY ? ? LIMIT ?,?';
  console.log('[moneybook] handleGet() query_str='+query_str);

  var query_param = [sort_type, sort_order, (page_no-1), page_size];
  if (q !== '') query_param.unshift('%'+q+'%');
  console.log('[moneybook] handleGet() query_param='+query_param+' ['+query_param.length+']');

  connection.query(query_str, query_param, function handleSql(err, rows) {
    if (err){ logAndRespond(err,res); return; }
    //if (rows.length === 0){ res.send(204); return; }
    res.send({
      status: 'ok',
      msg: '',
      results: {
        total_count: rows.length,
        page_count: parseInt(rows.length / page_size),
        page_size : page_size,
        data: rows
      }
    });
    connection.release();
  });
}
function handlePost(connection,req,res) {
  var param = {
    member_id: '1', // TODO : session 에서 member_id 얻기
    item: req.body.item,
    amount: req.body.amount,
    outlay_at: req.body.date
  };
  connection.query('INSERT INTO moneybooks SET ?', param, function handleSql(err, result) {
    if (err){ logAndRespond(err,res); return; }
    res.statusCode = 201;
    res.send({
      status: 'ok',
      msg: '',
      results: {
        id: result.insertId, // auto_increment 자동생성된 id
        item: param.item,
        amount: param.amount,
        date: param.date
      }
    });  
    connection.release();
  });
}
function handlePut(connection,req,res) {
  console.log('[moneybook] handlePut() req.params.id='+req.params.id);
  var param = {
    id: req.body.id,
    member_id: '1', // TODO : session 에서 member_id 얻기
    item: req.body.item,
    amount: req.body.amount,
    outlay_at: req.body.date,
    updated_at: new Date()
  };
  connection.query('UPDATE moneybooks SET ? WHERE id='+req.params.id, param, function handleSql(err) {
    if (err){ logAndRespond(err,res); return; }
    res.send({
      status: 'ok',
      msg: '',
      results: {
        id: param.id,
        item: param.item,
        amount: param.amount,
        date: param.date
      }
    });  
    connection.release();
  });
}
function handleDelete(connection,req,res) {
  console.log('[moneybook] handleDelete() start...');
  connection.query('DELETE FROM moneybooks WHERE id='+req.params.id,function handleSql(err) {
    if (err){ logAndRespond(err,res); return; }
    res.send({
      status: 'ok',
      msg: '',
      results: {
        id: req.params.id
      }
    });  
    connection.release();
  });
}
function handleAutoItems(connection,req,res) {
  // search condition
  var q = ('undefined' === typeof req.query.q) ? '': req.query.q;
  if (q === '') {
    res.send({
      status: 'fail',
      msg: 'q is required'
    });
    connection.release();
    return;
  }

  // database query
  var query_str = 'SELECT item FROM moneybooks';
  query_str += ' WHERE item LIKE ?';
  query_str += ' ORDER BY item ASC';
  console.log('[moneybook] handleAutoItems() query_str='+query_str);

  var query_param = [q+'%'];
  console.log('[moneybook] handleAutoItems() query_param='+query_param+' ['+query_param.length+']');

  connection.query(query_str, query_param, function handleSql(err, rows) {
    if (err){ logAndRespond(err,res); return; }
    res.send({
      status: 'ok',
      msg: '',
      results: rows
    });
    connection.release();
  });
}
function handleStateMonths(connection,req,res) {
  // search condition
  var q = ('undefined' === typeof req.query.q) ? '': req.query.q;
  var page_size = ('undefined' === typeof req.query.page_size) ? 10: req.query.page_size;
  var page_no = ('undefined' === typeof req.query.page_no) ? 1: req.query.page_no;
  var sort_type = ('undefined' === typeof req.query.sort_type) ? 'outlay_at': req.query.sort_type;
  var sort_order = ('undefined' === typeof req.query.sort_order) ? 'DESC': req.query.sort_order;

  var query_str = 'SELECT item, sum(amount) amount, DATE_FORMAT(outlay_at, "%Y-%m") date FROM moneybooks';
  if (q !== '') query_str += ' WHERE item LIKE ?';
  query_str += ' GROUP BY item, date';
  query_str += ' ORDER BY ? ? LIMIT ?,?';
  console.log('[moneybook] handleStateMonths() query_str='+query_str);

  var query_param = [sort_type, sort_order, (page_no-1), page_size];
  if (q !== '') query_param.unshift('%'+q+'%');
  console.log('[moneybook] handleStateMonths() query_param='+query_param+' ['+query_param.length+']');

  connection.query(query_str, query_param, function handleSql(err, rows) {
    if (err){ logAndRespond(err,res); return; }
    //if (rows.length === 0){ res.send(204); return; }
    res.send({
      status: 'ok',
      msg: '',
      results: {
        total_count: rows.length,
        page_count: parseInt(rows.length / page_size),
        page_size : page_size,
        data: rows
      }
    });
    connection.release();
  });
}
exports.get = function(req,res){
    handleConnection(handleGet,req,res);
};
exports.post = function(req,res){
    handleConnection(handlePost,req,res);
};
exports.put = function(req,res){
    handleConnection(handlePut,req,res);
};
exports.delete = function(req,res){
    handleConnection(handleDelete,req,res);
};
exports.getAutoItems = function(req,res){
    handleConnection(handleAutoItems,req,res);
};
exports.getStateMonths = function(req,res){
    handleConnection(handleStateMonths,req,res);
};
