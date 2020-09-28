(function() { 

    let template = document.createElement('template');
template.innerHTML = /*html*/`
    <style>
        @import url('../styles/left-menu.css');
        :host {
            text-align: left;
            position: relative; 
            display:flex;
        }
    </style>
    <slot name="mnfilter" id="fltrMn" class="cntr hidden"></slot>
    <slot name="mnlist" id="listMn" class="cntr hidden"></slot>
    <!--
    <div slot="mnfilter" id="fltrMn" class="cntr hidden"></div>
    <div slot="mnlist" id="listMn" class="cntr hidden"></div>
    -->
    <div class="tabs">
        <div id="fltrTab" class="tab"><div>Filter</div></div>
        <div id="listTab" class="tab"><div>List</div></div>
    </div>
`;


class LeftMenu extends HTMLElement {
    static get is() { return 'left-menu'; }
    constructor() {
        super();
        this._activeTab = 0; // 0=None; 1=Edit; 2=New

        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
    }

    setTabs() {
        let self = this;
        let fltr = self.shadowRoot.querySelector("#fltrTab"),
            fltrMn = self.shadowRoot.querySelector("#fltrMn"),
            lst = self.shadowRoot.querySelector("#listTab"),
            lstMn = self.shadowRoot.querySelector("#listMn");
            //menu1 = self.shadowRoot.querySelector("#menu1");

        switch (self._activeTab) {
            case 1: // Edit Open
                fltrMn.classList.remove("hidden");
                fltr.classList.add("active")
                lstMn.classList.add("hidden");
                lst.classList.remove("active")
                break;
            case 2: // New Open
                lstMn.classList.remove("hidden");
                lst.classList.add("active")
                fltrMn.classList.add("hidden");
                fltr.classList.remove("active")
                break;
            default: // Both closed
                fltrMn.classList.add("hidden");
                fltr.classList.remove("active")
                lstMn.classList.add("hidden");
                lst.classList.remove("active")
                break;
        }
    }

    connectedCallback() {
        let self = this;
        let fltr = self.shadowRoot.querySelector("#fltrTab"),
        lst = self.shadowRoot.querySelector("#listTab");

        fltr.addEventListener('click', e => {
            console.log("filter click")
            self._activeTab = (self._activeTab === 1) ? 0 : 1;
            self.setTabs()
        });

        lst.addEventListener('click', e => {
            console.log('list click')
            self._activeTab = (self._activeTab === 2) ? 0 : 2;
            self.setTabs()
        });

    }

}  // END LeftMenu

customElements.define(LeftMenu.is, LeftMenu);
//export default LeftMenu;

})();
