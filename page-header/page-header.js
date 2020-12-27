let template = document.createElement('template');
template.innerHTML = /*html*/`
    <style>
		@import url("../styles/page-header.css");
        :host {
            text-align: left;
            position: relative; 
		}
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
    
	<slot name="msgPanel" class="msg hidden"></slot>
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


    connectedCallback() {
        this._pageTitle = this.getAttribute('page-title');
        this.render()
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'page-title') { 
            this._pageTitle = newVal
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
