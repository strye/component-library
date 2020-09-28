
const template = document.createElement('template');
template.innerHTML = /*html*/`
<style>
	@import url("../styles/display-card.css");
	:host {
        display: inline-block;
		text-align: center;
		position: relative; 
	}
</style>
<div id="card" class="card">
	<div class="card-bg"></div>
	<div class="card-title" id="cardTitle"></div>
	<div class="card-desc" id="cardDesc"></div>
</div>
`;


class DisplayCard extends HTMLElement {
    static get is() {
        return 'display-card';
    }
    constructor() {
        super();

		this._cardId = 0;
		this._cardTitle = "";
		this._cardDesc = "";
		this._cardLink = "";

        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['card-title', 'card-desc', 'card-id', 'card-link'];
    }

    render() {
        let titleEl = this.shadowRoot.querySelector("#cardTitle");
        titleEl.innerText = this._cardTitle;
        let descEl = this.shadowRoot.querySelector("#cardDesc");
        descEl.innerText = this._cardDesc;
	}
	
	cardPress(evt) {
		let self = this;
		if (self._cardLink && self._cardLink.length > 0) { 
			location.href = self._cardLink; 
		} else {
			self.dispatchEvent(new CustomEvent('click', {
				bubbles: true,
				composed: true,
				detail: self
			}));
		}
		evt.stopPropagation();
	}

    connectedCallback() {
		let self = this;
        this._cardId = this.getAttribute('card-id');
        this._cardTitle = this.getAttribute('card-title');
		this._cardDesc = this.getAttribute('card-desc');
		this._cardLink = this.getAttribute('card-link');
		
		this.shadowRoot.getElementById('card').addEventListener('click', evt => { self.cardPress(evt); })

        this.render()
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'card-id') { this._cardId = newVal; this.render(); }
        if (attrName === 'card-title') { this._cardTitle = newVal; this.render(); }
        if (attrName === 'card-desc') { this._cardDesc = newVal; this.render(); }
        if (attrName === 'card-link') { this._cardLink = newVal; this.render(); }
    }

	setAtProp(attrName, val) {
        if (val) { this.setAttribute(attrName, val); } 
        else { this.removeAttribute(attrName); }
		this.render()
    }
	//this.setAtProp('selected', val)
    get cardId(){ return this._cardId; }
    set cardId(val){ this.setAtProp('card-id', val); }
    get cardTitle(){ return this._cardTitle; }
    set cardTitle(val){ this.setAtProp('card-title', val) }
    get cardDesc(){ return this._cardDesc; }
    set cardDesc(val){ this.setAtProp('card-desc', val) }
    get cardLink(){ return this._cardLink; }
    set cardLink(val){ this.setAtProp('card-link', val) }

}  // END DisplayCard

customElements.define(DisplayCard.is, DisplayCard);

export default DisplayCard;

