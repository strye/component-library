(function() { 

let template = document.createElement('template');
template.innerHTML = /*html*/`
	<style>
        /*@import url("/style/main.css");*/
        :host {display:block;}
        h1 {margin-bottom: 18px;font-size:1.4em;padding:4px 18px;}
    </style>
    <h1 id="elmTitle"></h1>
    <div>Test Element</div>
`;

class BmTemplate extends HTMLElement {
    static get is() { return 'bm-template'; }
    static get observedAttributes() { return ['elm-title']; }
    constructor() {
        super();
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

    connectedCallback() {
        this._elmTitle = this.getAttribute('elm-title');
        this.render()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'elm-title') { 
            this._elmTitle = newValue
            this.render()
        }
    }


}  // END BmTemplate

customElements.define(BmTemplate.is, BmTemplate);
//export default BmTemplate; 

})();
