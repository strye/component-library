let template = document.createElement('template');
template.innerHTML = /*html*/`
    <style>
        :host {
            text-align: left;
            position: relative; 
		}
		header {
			padding: 16px;
			background-color: var(--secondary-bg-color);
            color: var(--secondary-fn-color);
            height:60px;
			margin:0;
			box-shadow: 0 5px 10px #888;
		}
		header h1 {font-size: 24px; padding: 0; margin: 0 8px;width:80%;float:left;}

		.menu .nav-menu {float:right}
		
		.menu div a {float:right; border: 2px solid #d33;}

		::slotted(a) {color:var(--secondary-fn-color)}
		::slotted(a:hover) {background-color: var(--nike-yellow);color:#000;}


		.menu-home {padding-right: 32px;height: 32px; width: 32px;}
		/*nav a {padding:3px 8px;margin:0 2px;font-style: italic;color:#eee;}*/
		.menu a:hover {background-color: var(--nike-yellow);color:#000;}

		.msg {
			position: fixed;
			top:0;
			width:90%;
			z-index: 1000;
			transition: display: 2s;
			transition-timing-function: ease;
		}
		.msg-info {}
		.msg-warning {}
		.msg-confirm {}
		.msg-alert {}

        .clearfix{clear: both;}
		.hidden { display: none;}

	</style>
	<header>
		<h1>Web Scratchpad <span id="pageTitle"></span></h1>
		<nav class="menu">
	        <a href="/"><img src="/images/house.png" class="menu-home"/></a>
			<slot name="navMenu" class="nav-menu"></slot>
		</nav>
		<div class="clearfix"></div>
    </header>
    


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


class PageHeader extends HTMLElement {
    static get is() {
        return 'page-header';
    }
    constructor() {
        super();

        this._msgType = "Inform"; // Inform; YesNo; Warning; Confirm;
        this._pageTitle = "";

        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['page-title'];
    }

    render() {
        let titleEl = this.shadowRoot.querySelector("#pageTitle");
        titleEl.innerText = this._pageTitle;
    }



    setMsgBox() {
        let self = this, msgTp = self._msgType.toLocaleLowerCase();
        let msgPanel = self.shadowRoot.querySelector("#msgPanel"),
			msgTitle = self.shadowRoot.querySelector("#msgTitle"),
			msgText = self.shadowRoot.querySelector("#msgText"),
			ok_bt = self.shadowRoot.querySelector("#ok_bt"),
			yes_bt = self.shadowRoot.querySelector("#yes_bt"),
			no_bt = self.shadowRoot.querySelector("#no_bt"),
			cancel_bt = self.shadowRoot.querySelector("#cancel_bt");


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
        this._pageTitle = this.getAttribute('page-title');
        this.render()
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (name === 'page-title') { 
            this._pageTitle = newValue
            this.render()
        }
    }

    get pageTitle(){
        return this._pageTitle;
    }
    set pageTitle(val){
		this._pageTitle = val;
        if (val) {
            this.setAttribute('page-title', val);
        } else {
            this.removeAttribute('page-title');
        }
		this.render()
    }

}  // END PageHeader

customElements.define(PageHeader.is, PageHeader);

export default PageHeader;
