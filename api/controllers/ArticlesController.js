/**
 * ArticlesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    list:function(req, res){
        Articles.find({}).exec(function(err, articles){
            if(err){
                res.send(500, {error: 'Database Error'});
            }
            res.view('list', {articles:articles});
        });
    },
    create: async function(req, res){
        var sub = req.body.subject;
        var title = req.body.title;
        var body = req.body.body;

        let subjects = {}; 
        let existingSub = await Users.findOne({subject: sub});
        if(existingSub){
            subjects = existingSub;
        }else{
            subjects = await Users.create({subject:sub}).fetch();
        }
        

        if(!subjects){
            res.send(500, {error: 'Database Error'});
        }else{
             await Articles.create({title:title, body:body,subj:subjects.subject,creator:subjects.id}).exec(function(err){
                if(err){
                    res.send(500, {error: 'Database Error'});
                }
    
                res.redirect('/articles/list');
            });
        }

        
    },
    delete: function(req, res){
        Articles.destroy({id:req.params.id}).exec(function(err){
            if(err){
                res.send(500, {error: 'Database Error'});
            }

            res.redirect('/articles/list');
        });

        return false;
    },
  
};

