var Logger = require(base_dir + '/lib/logger');
var log = new Logger();

var logAndRespond = function logAndRespond(err,res,status){
  console.error(err);
  res.statusCode = ('undefined' === typeof status ? 500 : status);
  res.send({
    status: 'fail',
    msg: err.msg,
    results: err.code
  });
};
var handleConnection = function handleConnection(callback,req,res){
  req.mysql.getConnection(function(err,connection){
    if (err){ logAndRespond(err,res); return; }
    callback(connection,req,res);
  });
};

function handlePost(connection,req,res) {
  var param = {
    //member_id: '1', // TODO : session 에서 member_id 얻기
    //item: req.body.item,
    //amount: req.body.amount,
    //outlay_at: req.body.date
	email: req.body.email,
	password: req.body.password
  };
  connection.query('INSERT INTO members SET ?', param, function handleSql(err, result) {
    if (err){ logAndRespond(err,res); return; }
    res.statusCode = 201;
    res.send({
      status: 'ok',
      msg: '',
      results: 'true'
    });  
    connection.release();
  });
}
exports.post = function(req,res){
    handleConnection(handlePost,req,res);
};
