var Q = require('q');
var Logger = require(base_dir + '/lib/logger');
var log = new Logger();

// error 처리
var logAndRespond = function logAndRespond(err,res,status){
  log.error('[logAndRespond] err='+err);
  res.statusCode = ('undefined' === typeof status ? 500 : status);
  res.send({
    status: 'fail',
    msg: 'error',
    results: err.code
  });
};

// mysql connection 얻기
var handleConnection = function handleConnection(req,res){
  // 로그인 여부 체크 - TODO: 로그인 화면 만든 후 주석 해제하기 !!
  if (parseCookies(req)['auth'] == undefined) {
    res.statusCode = (401);
    res.send({
      status: 'fail',
      msg: '로그인 후 이용 가능합니다.'
    });
  }

  var deferred = Q.defer();
  req.mysql.getConnection(function(err,connection){
    if (err){ logAndRespond(err,res); return; }
    //callback(connection,req,res);
    deferred.resolve(connection);
  });
  return deferred.promise;
};

// cookie 파싱
function parseCookies(req) {
  var list = {}, rc = req.headers.cookie;

  rc && rc.split(';').forEach(function( cookie ) {
    log.debug('[moneybook] parseCookies() cookie=>'+cookie);
    var parts = cookie.split('=');
    list[parts.shift().trim()] = unescape(parts.join('='));
  });

  return list;
}

// moneybook 목록 count 조회 (mysql)
function selectListCount(connection, search_param) {
  var deferred = Q.defer();
  var query_str = 'SELECT COUNT(id) count FROM moneybooks WHERE 1 = 1';
   if (search_param.member_id !== '') query_str += ' AND member_id = ?';
 if (search_param.q !== '') query_str += ' AND item LIKE ?';

  var query_param = [];
  if (search_param.member_id !== '') query_param.unshift(search_param.member_id);
  if (search_param.q !== '') query_param.unshift('%'+search_param.q+'%');
  log.info('[moneybook] selectListCount() query_param='+query_param+' ['+query_param.length+']');

  var count = 0;
  connection.query(query_str, query_param, function handleSql(err, row){
    log.info('[moneybook] selectListCount() select count... row='+JSON.stringify(row));
    deferred.resolve(row[0].count);
  });
  return deferred.promise;
}

// moneybook 목록 조회 (mysql)
function selectList(connection, search_param) {
  var deferred = Q.defer();

  var query_str = 'SELECT id, item, amount, DATE_FORMAT(outlay_at, "%Y-%m-%d") as date FROM moneybooks WHERE 1 = 1';
  if (search_param.member_id !== '') query_str += ' AND member_id = ?';
  if (search_param.q !== '') query_str += ' AND item LIKE ?';
  query_str += ' ORDER BY '+search_param.sort_type+' '+search_param.sort_order+' LIMIT '+search_param.start_index+','+search_param.page_size;
  log.info('[moneybook] selectList() query_str='+query_str);

  var query_param = [];
  if (search_param.member_id !== '') query_param.unshift(search_param.member_id);
  if (search_param.q !== '') query_param.unshift('%'+search_param.q+'%');
  log.info('[moneybook] selectList() query_param='+query_param+' ['+query_param.length+']');

  connection.query(query_str, query_param, function handleSql(err, rows) {
    if (err){ logAndRespond(err,rows); return; }
    log.info('[moneybook] selectList() rows='+rows);
    deferred.resolve(rows);
  });
  return deferred.promise;
}

// request 에서 검색조건 꺼내어 json 형태로 반환
function getSearchCondition(req) {
  // search condition
  var q = ('undefined' === typeof req.query.q || '' === req.query.q) ? '': req.query.q;
  var page_size = ('undefined' === typeof req.query.page_size || '' === req.query.page_size) ? 10: req.query.page_size;
  var page_no = ('undefined' === typeof req.query.page_no || '' === req.query.page_no) ? 1: req.query.page_no;
  var sort_type = ('undefined' === typeof req.query.sort_type || '' === req.query.sort_type) ? 'outlay_at': req.query.sort_type;
  var sort_order = ('undefined' === typeof req.query.sort_order || '' === req.query.sort_order) ? 'DESC': req.query.sort_order;
  var start_index = (page_no-1) * page_size;

  var param = {
    q:q, 
    page_size:page_size, 
    page_no:page_no, 
    sort_type:sort_type, 
    sort_order:sort_order,
    start_index:start_index,
    total_count:0,
  };
  
  if (parseCookies(req)['auth'] != undefined) {
    param.member_id = parseCookies(req)['auth'];
  }
  log.info('[moneybook] getSearchCondition() param='+JSON.stringify(param));

  return param;
}

// page_count(검색 결과의 전체 페이지 수) 구하기
function getPageCount(total_count, page_size) {
  var page_count = parseInt(total_count / page_size);
  if (total_count % page_size > 0) page_count++;
  return page_count;
}

// get 요청 처리 (목록)
function handleGet(connection,req,res) {
  var search_param = getSearchCondition(req);
  selectListCount(connection, search_param).then(function(count) {
    log.debug('after selectCount() count='+count+', search_param='+JSON.stringify(search_param));
    search_param.total_count = count; // total_count 세팅
    selectList(connection, search_param).then(function(rows){
      res.send({
        status: 'ok',
        msg: '',
        results: {
          total_count: search_param.total_count,
          page_count: getPageCount(search_param.total_count, search_param.page_size),
          page_size : search_param.page_size,
          data: rows
        }
      });
      connection.release();
    });
  });
}

// post 요청 처리 (등록)
function handlePost(connection,req,res) {
  var param = {
    member_id: parseCookies(req)['auth'] == undefined ? 1 : parseCookies(req)['auth'] , // cookie 에서 member_id 얻기 - TODO: 로그인 화면 만든 후 기본값 '1' 세팅 부분 제거하기!!
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

// put 요청 처리 (수정)
function handlePut(connection,req,res) {
  log.debug('[moneybook] handlePut() req.params.id='+req.params.id);
  var param = {
    id: req.body.id,
    member_id: parseCookies(req)['auth'] == undefined ? 1 : parseCookies(req)['auth'], // cookie 에서 member_id 얻기 - TODO: 로그인 화면 만든 후 기본값 '1' 세팅 부분 제거하기!!
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

// delete 요청 처리 (삭제)
function handleDelete(connection,req,res) {
  log.debug('[moneybook] handleDelete() start...');
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

// get 요청 처리 (item 자동완성)
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
  log.debug('[moneybook] handleAutoItems() query_str='+query_str);

  var query_param = [q+'%'];
  log.debug('[moneybook] handleAutoItems() query_param='+query_param+' ['+query_param.length+']');

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

// moneybook 월별 목록 count 조회 (mysql)
function selectListCountByMonths(connection, search_param) {
  var deferred = Q.defer();
  var query_str = 'SELECT COUNT(item) count FROM (';
  query_str += 'SELECT item, DATE_FORMAT(outlay_at, "%Y-%m") date FROM moneybooks WHERE 1 = 1';
  if (search_param.member_id !== '') query_str += ' AND member_id = ?';
  if (search_param.q !== '') query_str += ' AND item LIKE ?';
  query_str += ' GROUP BY item, date) tmp';

  var query_param = [];
  if (search_param.q !== '') query_param.unshift('%'+search_param.q+'%');
  if (search_param.member_id !== '') query_param.unshift(search_param.member_id);
  log.info('[moneybook] selectListCountByMonths() query_param='+query_param+' ['+query_param.length+']');

  var count = 0;
  connection.query(query_str, query_param, function handleSql(err, row){
    log.info('[moneybook] selectListCountByMonths() select count... row='+JSON.stringify(row));
    deferred.resolve(row[0].count);
  });
  return deferred.promise;
}

// moneybook 월별 목록 조회 (mysql)
function selectListByMonths(connection, search_param) {
  var deferred = Q.defer();

  var query_str = 'SELECT item, sum(amount) amount, DATE_FORMAT(outlay_at, "%Y-%m") date FROM moneybooks WHERE 1 = 1';
  if (search_param.member_id !== '') query_str += ' AND member_id = ?';
  if (search_param.q !== '') query_str += ' AND item LIKE ?';
  query_str += ' GROUP BY item, date';
  query_str += ' ORDER BY '+search_param.sort_type+' '+search_param.sort_order+' LIMIT '+search_param.start_index+','+search_param.page_size;
  log.info('[moneybook] selectListByMonths() query_str='+query_str);

  var query_param = [];
  if (search_param.q !== '') query_param.unshift('%'+search_param.q+'%');
  if (search_param.member_id !== '') query_param.unshift(search_param.member_id);
  log.info('[moneybook] selectListByMonths() query_param='+query_param+' ['+query_param.length+']');

  connection.query(query_str, query_param, function handleSql(err, rows) {
    if (err){ logAndRespond(err,rows); return; }
    log.info('[moneybook] selectListByMonths() rows='+rows);
    deferred.resolve(rows);
  });
  return deferred.promise;
}

// get 요청 처리 (월별 목록)
function handleStateMonths(connection,req,res) {
  var search_param = getSearchCondition(req);
  selectListCountByMonths(connection, search_param).then(function(count) {
    //log.debug('after selectCount() count='+count+', search_param='+JSON.stringify(search_param));
    search_param.total_count = count; // total_count 세팅
    selectListByMonths(connection, search_param).then(function(rows){
      res.send({
        status: 'ok',
        msg: '',
        results: {
          total_count: search_param.total_count,
          page_count: getPageCount(search_param.total_count, search_param.page_size),
          page_size : search_param.page_size,
          data: rows
        }
      });
      connection.release();
    });
  });
}
exports.get = function(req,res){
  //handleConnection(handleGet,req,res);
  handleConnection(req,res).then(function(connection){
    handleGet(connection,req,res);
  }).fail(function(err){
    logAndRespond(err,res);
  });
};
exports.post = function(req,res){
  //handleConnection(handlePost,req,res);
  handleConnection(req,res).then(function(connection){
    handlePost(connection,req,res);
  }).fail(function(err){
    logAndRespond(err,res);
  });
};
exports.put = function(req,res){
  //handleConnection(handlePut,req,res);
  handleConnection(req,res).then(function(connection){
    handlePut(connection,req,res);
  }).fail(function(err){
    logAndRespond(err,res);
  });
};
exports.delete = function(req,res){
  //handleConnection(handleDelete,req,res);
  handleConnection(req,res).then(function(connection){
    handleDelete(connection,req,res);
  }).fail(function(err){
    logAndRespond(err,res);
  });
};
exports.getAutoItems = function(req,res){
  //handleConnection(handleAutoItems,req,res);
  handleConnection(req,res).then(function(connection){
    handleAutoItems(connection,req,res);
  }).fail(function(err){
    logAndRespond(err,res);
  });
};
exports.getStateMonths = function(req,res){
  //handleConnection(handleStateMonths,req,res);
  handleConnection(req,res).then(function(connection){
    handleStateMonths(connection,req,res);
  }).fail(function(err){
    logAndRespond(err,res);
  });
};
