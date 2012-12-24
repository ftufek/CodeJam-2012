
/*
 * GET mset main page
 */

exports.welcome = function(req, res){
  res.render('mset', { title: 'MSET' });
};

exports.trading = function(req, res){
  res.render('trading', {});
};

exports.scheduling = function(req, res){
  res.render('scheduling', {});
};

exports.reporting = function(req, res){
  res.render('reporting', {});
};
