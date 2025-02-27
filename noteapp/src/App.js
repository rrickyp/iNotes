import React from 'react'
import ReactDOM from 'react-dom/client';
import './App.css';
import $ from 'jquery';
class LoginButton extends React.Component{
	constructor(props){
		super(props)
		this.handleClick = this.handleClick.bind(this)
	}

	// step 4.2
	handleClick(){
    if(this.props.username === "" || this.props.password === "") {
      alert("Please enter username and password")
    }else {
      $.ajax({
        type: 'POST',
        url: 'http://localhost:3001/notes/signin',
        data: { name:this.props.username, password : this.props.password },
        dataType: 'JSON'
      }).done(msg=> {
        if(msg.msg!== "Login failure") {
          this.props.handleStatusChange(true, this.props.username, msg.icon, msg.notes)
          this.props.numNotes(msg.notes.length)
        }
        else {
          alert("Login failure")
        }
      })
    }

	}

	render(){
		return <button id="signin" onClick={()=>this.handleClick()}>Sign in</button>;
	}
}
class NoteButton extends React.Component {
  constructor(props){
	super(props)
	this.handleClick = this.handleClick.bind(this)
  this.state ={temptitle:this.props.notetitle, tempcontent:this.props.notecontent}
	}
  handleClick() {
    this.props.handleContentChange(true, this.props.notetitle, this.props.notecontent, this.props.lastsavedtime)
  }
  cancelClick() {
    var yesOrNo = window.confirm("Are you sure to quit editing the note?");
    if(yesOrNo) {
      this.props.handleContentChange(false, this.state.temptitle, this.state.tempcontent, this.props.lastsavedtime)
      this.props.changeClick(false)
    }
  }
  saveClick() {
    $.ajax({
      type: 'PUT',
      url: `http://localhost:3001/notes/savenote/${this.props.noteid}`,
      data: { noteContent:this.props.notecontent, noteTitles : this.props.notetitle},
      dataType: 'JSON'
    }).done(msg=> {
        this.props.handleContentChange(false, this.props.notetitle, this.props.notecontent, msg.lastsavedtime)
        this.props.handleTitleChange(this.props.notetitle)

    })
  }
  deleteClick() {
    $.ajax({
      type: 'DELETE',
      url: `http://localhost:3001/notes/deletenote/${this.props.noteid}`,
    }).done(msg=> {
      this.props.handleContentChange(false, "", "", "")
        this.props.handleTitleChange("")
        this.props.handleLengthChange(-1)
    })
  }
  render() {
    if(!this.props.isClicked) {
      return <div></div>
    }
    else {
      if(!this.props.isTyping) {
        return <div>
        <div id="subtop">
        <span>
          Last saved: {this.props.lastsavedtime}
        </span><button id="delete" onClick={()=> {this.deleteClick()}}>Delete</button>
          </div>
          <div id="titles">
        <textarea id="contentTitle" name="notetitle" rows="1" cols="50" value={this.props.notetitle} onChange={e => this.props.handleInputChange(e)} onFocus={()=> {
          this.handleClick()
        }}>
        </textarea>
      </div>
      <textarea id="contentcontent" name="notecontent" rows="20" cols="50"  value= {this.props.notecontent} onChange={e => this.props.handleInputChange(e)} onFocus={()=> {
          this.handleClick()
        }}>
      </textarea>
        </div>
      }
      else {
        return <div>
        <div id="subtop">
        <span><button id="cancelbtn" onClick={()=> this.cancelClick()}>Cancel</button>
      <button id="savebtn" onClick={()=> {this.saveClick()}}>Save</button></span>
          </div>
          <div id="titles">
        <textarea id="contentTitle" name="notetitle" rows="1" cols="50" value={this.props.notetitle} onChange={e => this.props.handleInputChange(e)} onFocus={()=> {
          this.handleClick()
        }}>
        </textarea>
      </div>
      <div id="contents">
        <textarea id="contentcontent" name="notecontent" rows="50" cols="70" value= {this.props.notecontent} onChange={e => this.props.handleInputChange(e)} onFocus={()=> {
          this.handleClick()
        }}/>
      </div>

        </div>
      }
    }
  }
}
class App extends React.Component {
  constructor(props) {
		super(props)
		this.state = {
			isLogin: false,
			loginName: "",
			inputUserName: "",
			inputUserPswd: "", 
      icon: "", 
      notes:[],
      noteid:"",
      notetitle:"",
      notecontent:"",
      lastsavedtime:"",
      isTyping:false, 
      isNew:false,
      tempnum:0,
      tempnotes:[],
      numofNotes:0,
      isClicked:false
		}
		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleContentChange = this.handleContentChange.bind(this)
		this.handleStatusChange = this.handleStatusChange.bind(this)
		this.handleTitleChange = this.handleTitleChange.bind(this)
		this.handleLengthChange = this.handleLengthChange.bind(this)
		this.handleSearch = this.handleSearch.bind(this)
		this.noteClick = this.noteClick.bind(this)
		this.newClick = this.newClick.bind(this)
		this.numNotes = this.numNotes.bind(this)
		this.changeClick = this.changeClick.bind(this)
	}
  changeClick(TrueOrFalse) {
    this.setState({isClicked:TrueOrFalse})
  }
  numNotes(num) {
    this.setState({numofNotes:num, tempnum:num})
  }
  noteClick(notesid) {
    this.handleContentChange(false, this.state.notetitle, this.state.notetitle, this.state.lastsavedtime)
    if(notesid!=="") {
      $.ajax({
        type: 'GET',
        url: `http://localhost:3001/notes/getnote?noteid=${notesid}`,
      }).done(msg=> {
        this.setState({noteid:notesid,lastsavedtime:msg.lastsavedtime, notetitle:msg.title, notecontent:msg.content ,isClicked:true})

      })
    }
  }
	handleInputChange(event){
		let target = event.target
		let name = target.name
		let value = target.value
    	this.setState({[name]: value})
	}
	handleStatusChange(newStatus, loginName, icons, note){
		this.setState({isLogin: newStatus, loginName: loginName, icon:icons, notes: note, tempnotes:note})
	}
  handleContentChange(typing, title, content, time) {
    this.setState({notetitle:title, notecontent:content, isTyping:typing, lastsavedtime:time})
  }
  handleTitleChange(title) {
    this.state.notes.map(item=> {
      if(item._id ===this.state.noteid) {
        item.title = title
      }
    })
  }
  handleLengthChange(num) {
    this.setState({numofNotes:this.state.numofNotes+num, tempnum:this.state.numofNotes+num})
  }
  handleSearch(e){
    let value = e.target.value
    if(value !== ""){
      $.ajax({
        type: 'GET',
        url: `http://localhost:3001/notes/searchnotes?searchstr=${value}`,
      }).done(msg=>{
        var searching = msg.searched
        var temp = 0;
        for(var test of searching) {
          if(test.lastsavedtime!== '') {
            temp++;
          }
        }
        this.setState({notes:searching, numofNotes:temp})
      })
    }
    else {
      this.setState({notes:this.state.tempnotes, numofNotes:this.state.tempnotes.length})
    }
  }
  newClick() {
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3001/notes/addnote',
      data: { noteContent:`Note content`, noteTitles : `Note title`},
      dataType: 'JSON'
    }).done(msg=> {
      this.setState({notetitle:`Note title`, notecontent:`Note content`, lastsavedtime:msg.lastsavedtime, noteid:msg._id, isTyping:true})
      var temps = this.state.notes;
      temps.unshift({
        _id:msg._id,
        title:`Note title`,
        lastsavedtime:msg.lastsavedtime
      })
      this.setState({notes:temps, tempnotes:temps, numofNotes:this.state.numofNotes+1, isClicked:true})
      this.handleContentChange(true, 'Note title', 'Note content', this.state.lastsavedtime)

    })
  }

  logout() {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3001/notes/logout',
    }).done(msg=> {
      this.setState({
        isLogin: false,
        loginName: "",
        inputUserName: "",
        inputUserPswd: "", 
        icon: "", 
        notes:[],
        noteid:"",
        notetitle:"",
        notecontent:"",
        lastsavedtime:"",
        tempnotes:[],
        isTyping:false,
        isClicked:false
      })
      
    })
  }
	render(){	
		if (!this.state.isLogin){
			return(
				<div id="loginPage">
          <h1 id="title">iNotes</h1>
          <div id="username" class="box">Username    <input
					type="text"
					name="inputUserName"
          class="input"
					value={this.state.inputUserName}
					onChange={e => this.handleInputChange(e)}>
          </input>
          </div>
          <div id="password" class="box">Password    <input
					type="password"
					name="inputUserPswd"
          class="input"
					value={this.state.inputUserPswd}
					onChange={e => this.handleInputChange(e)}></input>
          </div>
          <div>
          <LoginButton username={this.state.inputUserName}
								password={this.state.inputUserPswd}
							    handleStatusChange={this.handleStatusChange} numNotes={this.numNotes}/>
          </div>
					
				</div>
			)
		}
		else{
			return(
				<div id="loginPages">
					<h1 id="title">iNotes</h1>
          <div id="heading">
            <div id="navBar">
              <img id="icon" src={require(`.${this.state.icon}`)} alt={`${this.state.loginName} Icon`} width="40" height="40"/><span id="profile">{' '+this.state.loginName}</span><button id="logout" onClick={()=> {this.logout()}}>Logout</button>
            </div>
          </div>
          <div id="category">
          <input id="search" type="text" placeholder="search" onChange={e=>{this.handleSearch(e)}} size="30"/>
            <h2 id="subtitle">Notes {`(${this.state.numofNotes})`}</h2>
            {this.state.notes.map(item=> {
              return <div class="lists" id={item._id} key={item._id} onClick={()=> {this.noteClick(item._id)}}>{item.title}</div>
              // <NoteButton noteid={item._id} notetitle={item.title}></NoteButton>
            })}
          </div>
          <div id="content">
            <NoteButton isNew={this.state.isNew} handleStatusChange={this.handleStatusChange} userid={this.state.notes} noteid={this.state.noteid} notetitle={this.state.notetitle} notecontent={this.state.notecontent} lastsavedtime={this.state.lastsavedtime} handleInputChange={this.handleInputChange} handleContentChange={this.handleContentChange} handleTitleChange={this.handleTitleChange} handleLengthChange={this.handleLengthChange} numNotes={this.numNotes} changeClick={this.changeClick} isTyping={this.state.isTyping} isClicked={this.state.isClicked} icon={this.state.icon}></NoteButton>
            <button id="newButton" onClick={()=> {
              this.newClick()
            }}>New Note</button>
          </div>
				</div>

			)
		}
	}
}
export default App;