let template = document.createElement('template');
template.innerHTML = /*html*/`
	<style>
        /*@import url("/style/main.css");*/
        :host {border:2px solid var(--color-dark);}
        h1 {margin-bottom: 18px;font-size:1.4em;padding:4px 18px;}
    </style>
    <h1 id="elmTitle"></h1>
    <div>
        <slot></slot>
    </div>
`;

class BmTabs extends HTMLElement {
    static get is() { return 'bm-tabs'; }
    static get observedAttributes() { return ['elm-title']; }
    constructor() {
        super();
        this._tabs = []

        this._elmTitle = "";

        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
    }
    get title() { return this._elmTitle; }
    set title(val) {
        this._elmTitle = val;
        if (val) { this.setAttribute('elm-title', val); } 
        else { this.removeAttribute('elm-title'); }
		this.render()
    }


    render() {
        let elmTitle = this.shadowRoot.querySelector("#elmTitle");
        elmTitle.innerText = this._elmTitle;
    }

    setupTabs() {
        let self = this, children = this.childNodes;
        let index = 0;
        children.forEach(tab => {
            if(tab.nodeName.toLowerCase() === 'bm-tab') {
                tab.index = index;
                index++;
                this._tabs.push(tab);
                tab.addEventListener('selected', evt => {
                    console.log(evt.detail.index, 'cliiik')
                })
            }
        });
    }

    connectedCallback() {
        this._elmTitle = this.getAttribute('elm-title');
        this.setupTabs()
        this.render()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'elm-title') { 
            this._elmTitle = newValue
            this.render()
        }
    }


}  // END BmTabs

customElements.define(BmTabs.is, BmTabs);
    
export default BmTabs;    