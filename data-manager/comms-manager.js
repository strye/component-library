let template = document.createElement('template');
template.innerHTML = /*html*/`
    <div></div>
`;


class CommsManager extends HTMLElement {
	static get is() {
		return 'comms-manager';
	}
	constructor() {
		// If you define a constructor, always call super() first as it is required by the CE spec.
		super();

		this._channel= '/data';
		this._socket= io('/data');
		this.verbose=false;

		//const currentDocument = document.currentScript.ownerDocument;
		const shadowRoot = this.attachShadow({mode: 'open'});
		const template = owner.querySelector('#activation-comms-template');
		shadowRoot.appendChild(template.content.cloneNode(true));

	}
	get socket() { return this._socket; }
	get channel() { return this._channel; }


	// CUSTOM METHODS
	socketSetup(){
		if (this.verbose) console.log("Setting up Sockets");
		let self = this;
		self._socket = io(self._channel);
		self._socket.on('activation.list', function(list){
			if (self.verbose) console.log("activation.list: "+JSON.stringify(list.length))
			self.dispatchEvent(new CustomEvent('list', { 
				bubbles: true, 
				detail: { list: list }
			}))
		});
		self._socket.on('activation.item', function(item){
			if (self.verbose) console.log("activation.item: "+JSON.stringify(item))
			self.dispatchEvent(new CustomEvent('item', { 
				bubbles: true, 
				detail: { item: item } 
			}))
		});
		self._socket.on('activation.item.reset', function(item){
			if (self.verbose) console.log("activation.item.reset: "+JSON.stringify(item))
			self.dispatchEvent(new CustomEvent('item.reset', { 
				bubbles: true, 
				detail: { item: item } 
			}))
		});
		self._socket.on('activation.item.edit', function(evt){
			//evt = {id: id, field: fld, newValue: newV, oldValue: oldV}
			if (self.verbose) console.log("activation.item.edit: "+JSON.stringify(evt))
			self.dispatchEvent(new CustomEvent('item.edit', { 
				bubbles: true, 
				detail: { evt: evt } 
			}))
		});
		self._socket.on('activation.item.updated', function(item){
			// Update item and clear from queue
			if (self.verbose) console.log("activation.item.updated: "+JSON.stringify(item))
			self.dispatchEvent(new CustomEvent('item.updated', { 
				bubbles: true, 
				detail: { item: item } 
			}))
		});

		self._socket.on('activation.item.add', function(item){
			// Update item and clear from queue
			if (self.verbose) console.log("activation.item.add: "+JSON.stringify(item))
			self.dispatchEvent(new CustomEvent('item.add', { 
				bubbles: true, 
				detail: { item: item } 
			}))
		});
		self._socket.on('activation.item.delete', function(msg){
			// Update item and clear from queue
			if (self.verbose) console.log("activation.item.delete: "+JSON.stringify(item))
			self.dispatchEvent(new CustomEvent('item.delete', { 
				bubbles: true, 
				detail: { itemId: msg.id } 
			}))
		});
	}


	sendRefreshEvent(filter) {
		this._socket.emit('activation.get.with.filter',{filter:filter,options:null});
		if (this.verbose) console.log("refresh event sent")
		
	}
	sendUpdateEvent(packet) {
		this._socket.emit('activation.item.update', packet.update);
	}
	sendEditEvent(packet) {
		// packet = {id: ?, field: ?, newValue: ?, oldValue: ?}
		this._socket.emit('activation.item.edit',packet);
	}
	sendAddEvent(packet) {
		// packet = {id: ?, field: ?, newValue: ?, oldValue: ?}
		//this._socket.emit('activation.item.add',packet);
	}
	sendDeleteEvent(packet) {
		// packet = {id: ?, field: ?, newValue: ?, oldValue: ?}
		//this._socket.emit('activation.item.delete',packet);
	}
	sendPresenceEvent(id, fld) {
		//this._socket.emit('user.activity.grid', {page: 'foundation', row: id, field: fld });
	}

	// LIFECYCLE EVENTS
	//Invoked each time the custom element is appended into a document-connected element. This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
	connectedCallback() { }

	//Invoked each time the custom element is disconnected from the document's DOM.
	disconnectedCallback() {
		this._socket = null;
	}
}  // END CommsManager

customElements.define(CommsManager.is, CommsManager);
    
export default CommsManager;    