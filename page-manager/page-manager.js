(function() { 

let template = document.createElement('template');
template.innerHTML = /*html*/`
	<style>
        :host {display:block;}
        /*:host > ::slotted(:not(slot):not(.selected)) { display: none !important; }*/
    </style>
    <slot></slot>
    <div id="mainContent"></div>
`;

class PageManager extends HTMLElement {
    static get is() { return 'page-manager'; }
    constructor() {
        super();
        this._pages= {};
        this._activePage= 'home';
    
        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));

        this._contentDiv = this.shadowRoot.getElementById('mainContent')
    }
    get pages() { return this._pages; }

    get activePage() { return this._activePage; }
    set activePage(val) { this._activePage = val; }

	updateState(pageId) {
		// Remove and store last element
        this.pages[this._activePage].elm = this._contentDiv.removeChild(this.shadowRoot.getElementById(this.activePage));
        this.pages[this._activePage].selected = false;
		// update state
        this._activePage = pageId;
        this.pages[pageId].selected = true;
	}
	switchPage(pageId) {
		//console.log('switchPage', pageId);
		this.updateState(pageId);
		window.history.pushState(this._activePage, null, "");
		this.render();
	}
	render() {
		if (this.pages[this._activePage]) { this._contentDiv.append(this.pages[this._activePage].elm) }
	}
	setupWindowState() {
		let self = this;
		window.history.replaceState(self._activePage,null,"");
		window.onpopstate = function (event) {
			if (event.state) { 
				self.updateState(event.state);
				self.render();
			} 
		};
	}

    connectedCallback() {
        let elements = this.shadowRoot.querySelector('slot').assignedNodes().filter(n=> (n.nodeType === 1));
        if (elements.length>0) this._activePage = elements[0].getAttribute('id');
        elements.forEach(node => {
            let page = {
                id: node.getAttribute('id'),
                name: node.localName,
                elm: node.parentElement.removeChild(node),
                selected: node.classList.contains('selected')
            }
            if (page.selected) this._activePage = page.id;
            this._pages[page.id] = page;
        }); 

        this._contentDiv.append(this.pages[this._activePage].elm)
		this.setupWindowState();
		this.render();
    }

}  // END PageManager

customElements.define(PageManager.is, PageManager);
//export default PageManager;

})();
