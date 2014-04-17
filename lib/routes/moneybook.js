var logAndRespond = function logAndRespond(err,res,status){
  console.error(err);
  res.statusCode = ('undefined' === typeof status ? 500 : status);
  res.send({
    result: 'error',
    err: err.code
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
  var sort_type = ('undefined' === typeof req.query.sort_type) ? 'DATE': req.query.sort_type;
  var sort_order = ('undefined' === typeof req.query.sort_order) ? 'DESC': req.query.sort_order;

  // database query
  /*
  var query_str = 'SELECT * FROM moneybook';
  if (q !== '') query_str += ' WHERE item LIKE \'%'+q+'%\'';
  query_str += ' ORDER BY '+sort_type+' '+sort_order+' LIMIT '+(page_no-1)+','+page_size;
  */
  var query_str = 'SELECT * FROM moneybook';
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
      message: '',
      total_count: rows.length,
      page_count: parseInt(rows.length / page_size),
      page_size : page_size,
      data: rows
    });
    connection.release();
  });
}
function handlePost(connection,req,res) {
  res.send({ status:'ok' });  
}
function handlePut(connection,req,res) {
  res.send({ status:'ok', id:req.params.id });  
}
function handleDelete(connection,req,res) {
  res.send({ status:'ok', id:req.params.id });  
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