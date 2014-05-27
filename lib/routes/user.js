var Logger = require(base_dir + '/lib/logger');
var log = new Logger();

var nodemailer = require("nodemailer");
var randomstring = require("randomstring");

nodemailer.SMTP = {
    host: "mail.ecplaza.net",
    port: 25,
    ssl: false,
    use_authentication: false,
    user: "yslee",
    pass: ""
};

var logAndRespond = function logAndRespond(err,res,status){
  console.error(err);
  res.statusCode = ('undefined' == typeof status ? 500 : status);
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
/*
var loginCheck = function(req, res, next) {
    if(req.session.user){
      next();
    }else{
      res.redirect('/api/v1/user-login');
    }
};
*/

function handlePost(connection,req,res) {
  var param = {
        //member_id: '1', // TODO : session 에서 member_id 얻기
    email: req.body.email,
    password: req.body.password
  };
  log.debug('param.email:' + param.email);
  log.debug('param.password:' + param.password);
  log.debug('cer:' + ('undefined' == typeof param.password));
  if ('undefined' == typeof param.email || param.email == '' || 'undefined' == typeof param.password || param.password == '') {
    log.error('필수값 오류');
    res.statusCode = 201;
    res.send({
    status: 'fail',
    msg: '이메일과 비밀번호는 필수입니다.',
    results: 'false'
  });  
  }
  var query_str = 'SELECT COUNT(email) count FROM members WHERE email = ?';
  var query_param = [];
  query_param.unshift(param.email);
  var count = 0;
  connection.query(query_str, query_param, function handleSql(err, row){
    log.info('[user] handlePost() select count... row='+JSON.stringify(row));
    //deferred.resolve(row[0].count);
  count = row[0].count;
    log.info('[user] handlePost() select count... count='+count);
  if (count < 1) {
    connection.query('INSERT INTO members SET ?', param, function handleSql(err, result) {
      if (err){ logAndRespond(err,res); return; }
      res.statusCode = 201;
      res.send({
        status: 'ok',
        msg: '',
        results: 'true'
      });  
    });
  } else {
    res.statusCode = 201;
    res.send({
      status: 'fail',
      msg: '이미 사용중인 이메일이 있습니다.',
      results: 'false'
    });  
  }
  connection.release();
  });
  log.info('[user] count='+count);
}

function handlePut(connection,req,res) {
  var param = {
    email: req.body.email,
    password: req.body.password
  };
  log.info('***********************************');
  log.info(res.cookie('auth'));
  log.info('***********************************');
  connection.query('UPDATE members SET ? WHERE email=\''+param.email+'\'', param, function handleSql(err) {
    if (err){ logAndRespond(err,res); return; }
    res.send({
      status: 'ok',
      msg: '',
      results: 'true'
    });  
    connection.release();
  });
}

function handlePostLogin(connection,req,res) {
  var param = {
        //member_id: '1', // TODO : session 에서 member_id 얻기
    email: req.body.email,
    password: req.body.password
  };
  log.debug('param.email:' + param.email);
  log.debug('param.password:' + param.password);
  log.debug('cer:' + ('undefined' == typeof param.password));
  if ('undefined' == typeof param.email || param.email == '' || 'undefined' == typeof param.password || param.password == '') {
    log.error('필수값 오류');
    res.statusCode = 201;
    res.send({
      status: 'fail',
      msg: '이메일과 비밀번호는 필수입니다.',
      results: 'false'
    });
  }
//  var query_str = 'SELECT COUNT(email) count FROM members WHERE email = ? and password = ?';
  var query_str = 'SELECT id FROM members WHERE email = ? and password = ?'; // count 대신 id 조회하여 사용하도록 수정 by jhong (2014.05.22)
  var query_param = [];
  query_param.unshift(param.password);
  query_param.unshift(param.email);
  var count;
  connection.query(query_str, query_param, function handleSql(err, row){
    log.info('[user] handlePostLogin() select count... row='+JSON.stringify(row));
    log.info('[user] handlePostLogin() select count... row.length='+row.length);
    //deferred.resolve(row[0].count);
    if (row.length == 0) {
      res.statusCode = 201;
      res.send({
        status: 'fail',
        msg: '잘못된 사용자 ID 또는 패스워드입니다.',
        results: 'false'
      });  
    } else {
      count = row[0].id;
      log.info('[user] handlePostLogin() select count... count ='+count);
      if (count != undefined) {
        res.cookie('auth', count); // member_id
  //      res.cookie('auth', true);
  //      res.redirect('/');
        res.statusCode = 201;
        res.send({
          status: 'ok',
          msg: '',
          results: 'true'
        });
      } else {
        res.statusCode = 201;
        res.send({
          status: 'fail',
          msg: '잘못된 사용자 ID 또는 패스워드입니다.',
          results: 'false'
        });  
      }
    }
    connection.release();
  });
//  log.info('[user] handlePostLogin count='+count);
}

function handlePostReset(connection,req,res) {
  var param = {
    email: req.body.email
  };
  log.debug('req.email:'+req.body.email);
  if ('undefined' == typeof param.email || param.email == '') {
    log.error('필수값 오류');
    res.statusCode = 201;
    res.send({
      status: 'fail',
      msg: '이메일은 필수입니다.',
      results: 'false'
    });
  }
  var query_str = 'SELECT COUNT(email) count FROM members WHERE email = ?';
  var query_param = [];
  query_param.unshift(param.email);
  var count = 0;
  connection.query(query_str, query_param, function handleSql(err, row){
    log.info('[user] handlePostReset() select count... row='+JSON.stringify(row));
    //deferred.resolve(row[0].count);
    count = row[0].count;
    log.info('[user] handlePostReset() select count... count='+count);
    if (count < 1) {
      res.statusCode = 201;
      res.send({
        status: 'fail',
        msg: '이메일이 존재하지 않습니다.',
        results: 'false'
      });  
    } else {
      var mail;
      //var cid = Date.now()+".image.png";
      var rmdstr = randomstring.generate(7);
      var message = {
          sender: 'Moneybook <yslee@ecplaza.net>',
          to: '"Receiver Name" <'+param.email+'>',
          subject: "Moneybook Password Reset",
          body: "Hello!",
          //html:"<p><b>Hello</b> to myself <img src=\"cid:"+cid+"\"/></p>",
          html:"<p><b>Hello!</b><br/>New Password: "+rmdstr,

          debug: true 
          /*,
          attachments:[
              {
                  filename: "notes.txt",
                  contents: "Some notes about this e-mail"
              },
              {
                  filename: "image.png",
                  contents: new Buffer("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/"+
                                       "//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U"+
                                       "g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC", "base64"),
                  cid: cid
              }
          ]
          */
      };

      try{
          connection.query('UPDATE members SET password=\''+rmdstr+'\' WHERE email=\''+param.email+'\'', param, function handleSql(err) {
            if (err){ logAndRespond(err,res); return; }
            connection.release();
          });

          mail = nodemailer.send_mail(message, callback);
      }catch(e) {
          console.log("Caught Exception",e);
      }

      res.statusCode = 201;
      res.send({
        status: 'ok',
        msg: '',
        results: 'true'
      });  
    }
    connection.release();
  });
}

var callback = function(error, success){
    if(error){
        console.log("Error occured");
        console.log(error.message);
        return;
    }
    if(success){
        console.log("Message sent successfully!");
    }else{
        console.log("Message failed, reschedule!");
    }
};

function handleGetEmail(connection,req,res) {
  var param = {
    email: req.query.email
  };
  log.debug('req.email:'+req.query.email);
  if ('undefined' == typeof param.email || param.email == '') {
    log.error('필수값 오류');
    res.statusCode = 201;
    res.send({
      status: 'fail',
      msg: '이메일은 필수입니다.',
      results: 'false'
    });
  }
  var query_str = 'SELECT COUNT(email) count FROM members WHERE email = ?';
  var query_param = [];
  query_param.unshift(param.email);
  var count = 0;
  connection.query(query_str, query_param, function handleSql(err, row){
    log.info('[user] handleGetEmail() select count... row='+JSON.stringify(row));
    //deferred.resolve(row[0].count);
    count = row[0].count;
    log.info('[user] handleGetEmail() select count... count='+count);
    if (count < 1) {
      res.statusCode = 201;
      res.send({
        status: 'fail',
        msg: '',
        results: 'false'
      });  
    } else {
      res.statusCode = 201;
      res.send({
        status: 'ok',
        msg: '',
        results: 'true'
      });  
    }
    connection.release();
  });
}

exports.post = function(req,res){
    handleConnection(handlePost,req,res);
};

exports.put = function(req,res){
    handleConnection(handlePut,req,res);
};

exports.postLogin = function(req,res){
    handleConnection(handlePostLogin,req,res);
};

exports.postReset = function(req,res){
    handleConnection(handlePostReset,req,res);
};

exports.getEmail = function(req,res){
    handleConnection(handleGetEmail,req,res);
};
