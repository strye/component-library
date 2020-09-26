let template = document.createElement('template');
template.innerHTML = /*html*/`
	<style>
        /*@import url("/style/main.css");*/
        :host {border:2px solid var(--color-dark);}
    </style>
    <div id="tab"><slot></slot></div>
`;

class BmTab extends HTMLElement {
    static get is() { return 'bm-tab'; }
    static get observedAttributes() { return ['tab-title', 'tab-index', 'selected']; }
    constructor() {
        super();
        this._index = 0;
        this._title = "";
        this._selected = false;

        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
    }
    get title() { return this._title; }
    set title(val) { this.setAtProp('tab-caption', '_title', val) }
    get index() { return this._index; }
    set index(val) { this.setAtProp('selected', '_index', val) }
    get selected() { return this._selected; }
    set selected(val) { this.setAtProp('selected', '_selected', val) }
    setAtProp(attrName, prop, val) {
        this[prop] = val;
        if (val) { this.setAttribute(attrName, val); } 
        else { this.removeAttribute(attrName); }
		this.render()
    }


    render() {
        let tabTitle = this.shadowRoot.querySelector("#tab");
        tabTitle.title = this._title;
    }


    connectedCallback() {
        let self = this;
        self._title = this.getAttribute('tab-caption');
        if (this.getAttribute('tab-index')) self._index = this.getAttribute('tab-index');
        if (this.getAttribute('selected')) self._selected = this.getAttribute('selected');

        self.shadowRoot.querySelector("#tab").addEventListener('click', evt => {
            self._selected = true;
            self.dispatchEvent(new CustomEvent('selected', {
                bubbles: true,
                composed: true,
                detail: self
            }));
        });

        self.render()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'tab-caption') { this._title = newValue }
        if (name === 'tab-index') { this._index = newValue }
        if (name === 'selected') { this._selected = newValue }
        this.render()
    }


}  // END BmTab

customElements.define(BmTab.is, BmTab);
    
export default BmTab;    