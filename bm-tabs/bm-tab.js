(function() { 

let template = document.createElement('template');
template.innerHTML = /*html*/`
	<style>
        @import url("../styles/bm-tabs.css");
        :host {cursor: pointer}
    </style>
    <div id="tab" class="tab"><slot></slot></div>
`;

class BmTab extends HTMLElement {
    static get is() { return 'bm-tab'; }
    static get observedAttributes() { return ['tab-title', 'selected']; }
    constructor() {
        super();
        this._index = -1;
        this._value = null;
        this._title = "";
        this._selected = false;

        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
    }
    get title() { return this._title; }
    set title(val) { this.setAtProp('tab-caption', val) }
    get index() { return this._index; }
    set index(val) { this._index = val; }

    get tabValue() { return this._value; }
    set tabValue(val) { this.setAtProp('tab-value', val); }

    get selected() { return this._selected; }
    set selected(val) { this.setAtProp('selected', val) }
    setAtProp(attrName, val) {
        if (val) { this.setAttribute(attrName, val); } 
        else { this.removeAttribute(attrName); }
		this.render()
    }


    render() {
        let tab = this.shadowRoot.querySelector("#tab");
        tab.title = this._title;
        tab.classList.toggle('active-tab', this._selected);
    }


    connectedCallback() {
        let self = this;
        if (this.getAttribute('tab-value')) self._value = this.getAttribute('tab-value');
        this._selected = this.getAttribute('selected') ? true: false;
        if (this.getAttribute('tab-caption')) self._title = this.getAttribute('tab-caption');

        self.shadowRoot.querySelector("#tab").addEventListener('click', evt => {
            self.dispatchEvent(new CustomEvent('selected', {
                bubbles: true,
                composed: true,
                detail: self
            }));
        });

        self.render()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'tab-value') { this._value = newValue }
        if (name === 'tab-caption') { this._title = newValue }
        if (name === 'selected') { this._selected = newValue ? true: false; }
        this.render()
    }


}  // END BmTab

customElements.define(BmTab.is, BmTab);
//export default BmTab;

})();
