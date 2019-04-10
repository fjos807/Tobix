class App extends React.Component {
    constructor() {
        super()
        this.state = {
            messages: [],
        	ctx: {usr: 'tobix'}
        }
        this.sendMessage = this.sendMessage.bind(this)
    } 
    
    componentDidMount() {
    	this.sendMessage("");
    }

    sendMessage(text) {
    	if(text != "") 
	    	this.setState({
	            messages: [...this.state.messages, {"usr": "user", "text": text}]
	        })
    	
        var ctxStr = JSON.stringify(this.state.ctx);
    	fetch(`http://localhost:9080/WatsonAssistantChat/chatbot/chatservice/?conversationMsg=${encodeURIComponent(text)}&conversationCtx=${encodeURIComponent(ctxStr)}`)
        .then((response) => {
          return response.json()
        })
        .then((myJsonResponse) => {
        	this.setState({
	            messages: [...this.state.messages, {"usr": myJsonResponse.context.usr, "text": myJsonResponse.response}],
        		ctx: myJsonResponse.context
	        })
        })
    }
    
    render() {
        return (
            <div className="app">
              <Title />
              <MessageList
                  messages={this.state.messages} />
              <SendMessageForm
                  sendMessage={this.sendMessage} />
            </div>
        );
    }
}

class MessageList extends React.Component {
    render() {
        return (
            <ul className="message-list">
                {this.props.messages.map((message, index) => {
                    return (
                    		<ul className="p-0">
        					<li>
        						<div className="row comments mb-2">
        							<div className="col-md-2 col-sm-2 col-3 text-center user-img">
        						    	<img id="profile-photo" src="http://nicesnippets.com/demo/man01.png" className="rounded-circle" />
        							</div>
        							<div className="col-md-9 col-sm-9 col-9 comment rounded mb-2">
        								<h4 className="m-0"><a href="#">{message.usr}</a></h4>
        							  
        							    <p className="mb-0 text-white">{message.text}</p>
        							</div>
        						</div>
        					</li>
        				</ul>
                      
                    )
                })}
            </ul>
        )
    }
}

class SendMessageForm extends React.Component {
    constructor() {
        super()
        this.state = {
            message: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    
    handleChange(e) {
        this.setState({
            message: e.target.value
        })
    }
    
    handleSubmit(e) {
        e.preventDefault()
        this.props.sendMessage(this.state.message)
        this.setState({
            message: ''
        })
    }
    handleSubmit2 = () => {
    	 this.props.sendMessage(this.state.message)
         this.setState({
             message: ''
         })
    }
    
    render() {
        return (
        		<div className="row comment-box-main p-3 rounded-bottom">
		  		<div className="col-md-9 col-sm-9 col-9 pr-0 comment-box">
				  <input type="text" className="form-control" onChange={this.handleChange} value={this.state.message} placeholder="comment ...."/>
		  		</div>
		  		<div className="col-md-3 col-sm-2 col-2 pl-0 text-center send-btn">
		  			<button className="btn btn-info" onClick={this.handleSubmit2}>Send</button>
		  		</div>
			</div>
                
        )
    }
}

function Title() {
  return <p className="title">Simple chat application</p>
}

ReactDOM.render(<App />, document.getElementById('root'));