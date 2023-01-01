var express = require('express')
var router = express.Router()
var sess;
router.post('/signin', (req, res)=> {
    var db = req.db;
    var user_col = db.get("userList");
    user_col.find({"name": req.body.name}, {}, function(error, data) {
        if(error === null) {
            if(data.length >0 && (req.body.password === data[0].password)) {
                req.session.userId = (data[0]._id).toString();
                sess = req.session.userId;
                var name = data[0].name;
                var icon = data[0].icon;
                var note_col = db.get("noteList");
                note_col.find({userId: req.session.userId}, {}, function(error, user_note) {
                    if(error ===  null) {
                        var notes = user_note.map((function(user) {
                            return {"_id":user._id.toString(), "lastsavedtime":user.lastsavedtime, "title":user.title};
                        }));
                        res.json({'name':name, 'icon':icon, 'notes':notes});
                    }
                    else {
                        res.send({msg:error});
                    }
                })
            }
            else {
                res.send({msg:'Login failure'});
            }
        }
        else {
            res.send({msg:error})
        }
    })
})
router.get('/logout', (req, res)=> {
    req.session.userId = null;
    sess = null;
    res.send("");

})
router.get('/getnote', (req, res)=>{
    var db = req.db;
    var note_col = db.get("noteList");

    note_col.find({'_id':req.query.noteid}, {}, function(error, data) {
        if(error === null) {
            res.json({'_id':data[0]._id, 'lastsavedtime':data[0].lastsavedtime, 'title':data[0].title, 'content':data[0].content})
        }
        else {
            res.send({msg:error});
        }
    })
})
function time_to_string(datetime) {
    return datetime.toTimeString().split(' ')[0] + ' ' + datetime.toDateString()
}
router.post('/addnote', (req, res)=> {
    var contents = req.body.noteContent;
    var titles = req.body.noteTitles;
    var db = req.db;
    var note_col = db.get("noteList");
    var date = new Date()
    note_col.insert({'userId':sess, 'lastsavedtime': time_to_string(date), 'title':titles, 'content': contents}).then((docs)=> {
        res.json({'lastsavedtime':time_to_string(date), '_id':docs._id})
    })


})

router.put('/savenote/:noteid', (req, res) => {
    var contents = req.body.noteContent;
    var titles = req.body.noteTitles;
    var db = req.db;
    var note_col = db.get("noteList");
    var date = new Date();
    note_col.update({'_id':req.params.noteid}, {$set:{'userId':sess, 'lastsavedtime':time_to_string(date), 'title':titles, 'content': contents }}, function(error, data) {
        if(error === null) {
            res.json({'lastsavedtime': time_to_string(date)});
        }
        else {
            res.send({msg:error});
        }
    })
})
router.get('/searchnotes', (req, res)=> {
    var db = req.db;
    var note_col = db.get("noteList");
    note_col.find({'userId':sess}, {}, function(error, results) {
        if(error === null) {
            var noteArr = results.map(function(nots) {
                if(nots.title.indexOf(req.query.searchstr)!=-1 ||nots.content.indexOf(req.query.searchstr)!=-1 ) {
                    return {'_id':nots._id, 'lastsavedtime':nots.lastsavedtime, 'title':nots.title}
                } else {
                    return {'_id':"", 'lastsavedtime':"", 'title':""}

                }
            })
            res.json({'searched':noteArr});
        }
        else {
            res.send({msg:error});
        }
    })
})
router.delete('/deletenote/:noteid', (req, res)=> {
    var db = req.db;
    var note_col = db.get("noteList");
    note_col.remove({'_id':req.params.noteid}, function(error, data) {
        if(error === null) {
            res.send("")
        }
        else {
            res.send({msg:error})
        }
    })
})
module.exports = router;