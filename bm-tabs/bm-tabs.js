let template = document.createElement('template');
template.innerHTML = /*html*/`
	<style>
        @import url("tabs.css");
        :host {display: block;}
    </style>
    <div class="tab-conatiner">
        <slot></slot>
    </div>
`;

class BmTabs extends HTMLElement {
    static get is() { return 'bm-tabs'; }
    //static get observedAttributes() { return ['elm-title']; }
    constructor() {
        super();
        this._tabs = []
        this._selectedIdx = -1;

        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
    }

    setActive(idx) {
        this._tabs.forEach(tab => {
            tab.selected = (tab.index === idx)
        });
    }
    tabChange(detail) {
        if (this._selectedIdx === detail.index) return;

        // Set Active Tab, reset others to false;
        this._selectedIdx = detail.index;
        this._tabs.forEach(tab => {
            tab.selected = (tab.index === detail.index)
        });

        // Bubble up the event with the proper context
        this.dispatchEvent(new CustomEvent('changed', {
            bubbles: true,
            composed: true,
            detail: { index: detail.index, value: detail.tabValue }
        }));
    }
    setupTabs() {
        let self = this, children = this.childNodes;
        let index = 0;
        children.forEach(tab => {
            if(tab.nodeName.toLowerCase() === 'bm-tab') {
                tab.index = index;
                if (tab.selected) this._selectedIdx = index;
                index++;
                this._tabs.push(tab);
                tab.addEventListener('selected', evt => { self.tabChange(evt.detail) })
            }
        });
    }

    connectedCallback() {
        this.setupTabs()
    }

    // attributeChangedCallback(name, oldValue, newValue) {
    // }


}  // END BmTabs

customElements.define(BmTabs.is, BmTabs);
    
export default BmTabs;    