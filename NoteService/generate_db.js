/* Insert User Entries */
var conn = new Mongo();
var db = conn.getDB("assignment2");

var username = ["Tom", "Kevin", "Amy", "Jack", "Bob", "Frank"]
var password = ["123456", "234561", "345612", "456123", "561234", "612345"]

db.userList.remove({});
var prefix = '/icons/'
for(let i=0; i < username.length; i++) {
    // be friends with each other
    var temp = prefix+username[i]+'.jpg'

    db.userList.insert(
        {
            'name':username[i], 
            'password':password[i],
            'icon':temp,
        }
    )
}

/* Find user ids */
var user_info = {}

var users = db.userList.find({});
for (let i=0; i < username.length; i++){
    var uname = users[i]["name"]
    var _ids = users[i]['_id'].toString()
    var _id = _ids.split("\"")[1]
    user_info[uname] = _id
}

/* Insert Media Entries, emulate uploading actions */
db.noteList.remove({});
db.noteList.insert({'userId':user_info['Tom'], 'lastsavedtime':'20:12:10 Tue Nov 15 2022', 'title':'assignment2', 'content':'an iNotes app based on react', 'inttime':'1'});
db.noteList.insert({'userId':user_info['Tom'], 'lastsavedtime':'20:12:10 Tue Nov 17 2022', 'title':'assignment3', 'content':'SUIIIIII', 'inttime':'2'});