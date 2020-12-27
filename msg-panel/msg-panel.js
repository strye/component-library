let template = document.createElement('template');
template.innerHTML = /*html*/`
	<style>
        /*@import url("/style/main.css");*/
        :host {display:block;}
        h1 {margin-bottom: 18px;font-size:1.4em;padding:4px 18px;}
    </style>
    <div id="msgPanel" class="msg hidden">
		<h3 id="msgTitle"></h3>
		<div id="msgText"></div>
		<div id="buttons">
			<button id="ok_bt">Ok</button>
			<button id="cancel_bt">Cancel</button>
			<button id="yes_bt">Yes</button>
			<button id="no_bt">No</button>
		</div>
	</div>
`;

class MessagePanel extends HTMLElement {
    static get is() { return 'msg-panel'; }
    static get observedAttributes() { return ['msg-title','msg-text','msg-type']; }
    constructor() {
		super();
		this._msgType = "Inform"; // Inform; YesNo; Warning; Confirm;
        this._msgTitle = "";
        this._msgText = "";

        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
	}
    get title() { return this._msgTitle; }
    set title(val) {
        this._msgTitle = val;
        if (val) { this.setAttribute('msg-title', val); } 
        else { this.removeAttribute('msg-title'); }
		this.render()
    }
    get text() { return this._msgText; }
    set text(val) {
        this._msgText = val;
        if (val) { this.setAttribute('msg-text', val); } 
        else { this.removeAttribute('msg-text'); }
		this.render()
    }
    get msgType() { return this._msgType; }
    set msgType(val) {
		let newType = val;
		if (!val) newType = "Inform";
        this._msgType = newType;
        this.setAttribute('msg-type', newType);
		this.render()
    }

	resetMessage(title, text, type='Inform') {
        this._msgType = type;
        this.setAttribute('msg-type', type);

		this._msgTitle = title;
        if (title) { this.setAttribute('msg-title', title); } 
        else { this.removeAttribute('msg-title'); }

		this._msgText = text;
        if (text) { this.setAttribute('msg-text', text); } 
		else { this.removeAttribute('msg-text'); }
		
		this.render();
	}
	clearMessage() {}

    render() {
		let self = this, msgTp = self._msgType.toLocaleLowerCase();
        let msgPanel = self.shadowRoot.querySelector("#msgPanel"),
		msgTitle = self.shadowRoot.querySelector("#msgTitle"),
		msgText = self.shadowRoot.querySelector("#msgText"),
		ok_bt = self.shadowRoot.querySelector("#ok_bt"),
		yes_bt = self.shadowRoot.querySelector("#yes_bt"),
		no_bt = self.shadowRoot.querySelector("#no_bt"),
		cancel_bt = self.shadowRoot.querySelector("#cancel_bt");

		msgTitle.innerText = this._msgTitle;
		msgText.innerText = this._msgText;
        //this.shadowRoot.querySelector("#msgTitle").innerText = this._msgTitle;

		// Inform Message (Ok)
		ok_bt.classList.toggle("msg-info", (msgTp === "inform" || msgTp === "confirm"));

		// Yes or No box (Yes, No)
		yes_bt.classList.toggle("msg-confirm", msgTp === "yesno");
		no_bt.classList.toggle("msg-confirm", msgTp === "yesno");
		
		// Confirmation Box (Ok, Cancel)
		cancel_bt.classList.toggle("msg-confirm", msgTp === "confirm");

		// Warning (ok)
		cancel_bt.classList.toggle("msg-warning", msgTp === "warning");

		// Alert (ok)
		cancel_bt.classList.toggle("msg-alert", msgTp === "confirm");



		// Inform Message (Ok)
		msgPanel.classList.toggle("msg-info", (msgTp === "inform" || msgTp === "confirm"));

		// Yes or No box (Yes, No)
		msgPanel.classList.toggle("msg-confirm", msgTp === "yesno");
		
		// Confirmation Box (Ok, Cancel)
		msgPanel.classList.toggle("msg-confirm", msgTp === "confirm");

		// Warning (ok)
		msgPanel.classList.toggle("msg-warning", msgTp === "warning");

		// Alert (ok)
		msgPanel.classList.toggle("msg-alert", msgTp === "confirm");



		switch (self._msgType.toLocaleLowerCase()) {
            case "inform":

                ok_bt.classList.toggle("msg-info", true);
                yes_bt.classList.toggle("msg-info", true);
                no_bt.classList.toggle("msg-info", true);
                cancel_bt.classList.toggle("msg-info", true);
                break;
            case "yesno":
                adMn.classList.remove("hidden");
                add.classList.add("active")
                edMn.classList.add("hidden");
                det.classList.remove("active")
                break;
			case "warning":
                adMn.classList.remove("hidden");
                add.classList.add("active")
                edMn.classList.add("hidden");
                det.classList.remove("active")
                break;
            default:
                edMn.classList.add("hidden");
                det.classList.remove("active")
                adMn.classList.add("hidden");
                add.classList.remove("active")
                break;
        }
        if (menu1.dirty) {
            det.classList.add("dirty")
        } else {
            det.classList.remove("dirty")
        }

    }


    connectedCallback() {
		if (this.getAttribute('msg-title')) this._msgTitle = this.getAttribute('msg-title');
		if (this.getAttribute('msg-text')) this._msgText = this.getAttribute('msg-text');
		if (this.getAttribute('msg-type')) this._msgType = this.getAttribute('msg-type');
		this.render()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'msg-title') { 
            this._elmTitle = newValue
            this.render()
        }
        if (name === 'msg-text') { 
            this._msgText = newValue
            this.render()
        }
        if (name === 'msg-type') { 
            this._msgType = newValue
            this.render()
        }
    }


}  // END MessagePanel

customElements.define(MessagePanel.is, MessagePanel);
    
export default MessagePanel;    