(function() { 

let template = document.createElement('template');
template.innerHTML = /*html*/`
    <div></div>
`;

class DataManager extends HTMLElement {
    static get is() { return 'data-manager'; }
    static get observedAttributes() { return ['elm-title']; }
    constructor() {
        super();
		this.verbose=true;
		this.ready = false;

		this._data= [];
		this._rowFields= [
			{name: "id-DONT_ENTER", type: "int",                        code: "id", canEdit: false, class: "fld-id", grp: "key",        label:"Id"},
			{name: "TI", type: "text",                                  code: "ti", canEdit: true, class: "fld-text-sm", grp: "act",    label:"TI"},
			{name: "ACTIVATION", type: "text",                          code: "act", canEdit: true, class: "fld-text", grp: "act",      label:"TI Activation"},

			{name: "HAS_DEPENDENCY", type: "text",                      code: "dep", canEdit: true, class: "fld-bool", grp: "fnd",      label:"Dependant On"},
			{name: "NEED_BY_DATE", type: "text",                        code: "nbd", canEdit: true, class: "fld-dt", grp: "fnd",        label:"Need By Date"},

			{name: "BUCKET", type: "text",                              code: "bkt", canEdit: true, class: "fld-num", grp: "bkt",             label:"Bucket"},
			{name: "BUCKET_CONTEXT", type: "textarea",                      code: "bktcntx", canEdit: true, class: "fld-ta", grp: "bkt",      label:"Bucket Context"},
		];
		this._keyField= 'id-DONT_ENTER';
		this._updateQ= {};
		this._editMode= true;

		this._changeEvent = new Event("change", {
			bubbles: true,
			cancelable: false,
		});

        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
	}
	get data() { return this._data; }
	//set data(val) { this._data = val; }

	get rowFields() { return this._rowFields; }
	//set rowFields(val) { this._rowFields = val; }

	get keyField() { return this._keyField; }
	//set keyField(val) { this._keyField = val; }

	get updateQ() { return this._updateQ; }
	set updateQ(val) { this._updateQ = val; }

    // get title() { return this._elmTitle; }
    // set title(val) {
    //     this._elmTitle = val;
    //     if (val) { this.setAttribute('elm-title', val); } 
    //     else { this.removeAttribute('elm-title'); }
	// 	this.render()
    // }


        // CUSTOM METHODS
        refresh(filter){
            let comms = this.shadowRoot.querySelector("#comms");
            comms.sendRefreshEvent(filter);
        }

        getItem(id){
            let res = null, keyFld = this.keyField;
            this._data.forEach(comp => {
                if(comp[keyFld] === id) res = comp;
            });
            return res;
        }
        _removeItem(id) {
            let res = false, keyFld = this.keyField;
            this._data.forEach((comp,idx) => {
                if(comp[keyFld] === id) {
                    this._data.splice(idx,1);
                    res = true;
                }
            });
            return res;
        }
        editEvent(id, fld, newV, oldV){
            let comms = this.shadowRoot.querySelector("#comms");
            let evt = {
                id: id, 
                field: fld, 
                newValue: newV, 
                oldValue: oldV
            }
            if (this.verbose) console.log(evt);
            this.processItemEvent(evt)

            comms.sendEditEvent(evt)
        }
        commitUpdates() {
            let comms = this.shadowRoot.querySelector("#comms");

            for (const key in this._updateQ) {
                if (this._updateQ.hasOwnProperty(key)) {
                    const qItem = this._updateQ[key];

                    let match = true;
                    this.rowFields.forEach(fld => {
                        if (qItem.original[fld.name] != qItem.update[fld.name]) {
                            match = false
                        }
                    });
                    if (match) {
                        // Remove from q and clean dirty flag
                    } else {
                        comms.sendUpdateEvent(qItem)
                    }
                }
            }

            //this.render()
        }
        processItemEvent(evt) {
            if (this.verbose) console.log(evt);
            //processItemEvent({id: id, field: fld, newValue: newV, oldValue: oldV})
            let item = this.getItem(evt.id);

            // Prep updated record
            let udPacket = {}
            this.rowFields.forEach(fld => {
                udPacket[fld.name] = item[fld.name]
            });

            udPacket[evt.field] = evt.newValue;
            let dirty = true;

            // Check Queue
            let key = `row_${evt.id}`,
                qItem = this._updateQ[key];

            if (qItem) {
                let match = true;
                this.rowFields.forEach(fld => {
                    if (qItem.original[fld.name] != udPacket[fld.name]) {
                        match = false
                    }
                });
                if (match) {
                    dirty = false;
                    delete this._updateQ[key];
                } else {
                    qItem.update = udPacket;
                }
            } else {
                let orgD = {}
                this.rowFields.forEach(fld => {
                    orgD[fld.name] = item[fld.name]
                });

                qItem = {original: orgD, update: udPacket }
                this._updateQ[key] = qItem
            }


            // Update list
            item[evt.field] = evt.newValue;
            let dirtyKey = `${evt.field}_dirty`;

            if (this.verbose) console.log(dirtyKey, dirty)
            item[dirtyKey] = dirty;

            this.dispatchEvent(this._changeEvent);
            this.dispatchEvent(new CustomEvent('item.change', { 
                bubbles: true, 
                detail: { itemId: evt.id }
            }))

        }

        prepData(dirtyFlag){
            let self = this;
            self._data.forEach(comp => {
                comp.editMode = self._editMode;
                if (dirtyFlag) {
                    self._rowFields.forEach(fld => {
                        let key = `${fld.name}_dirty`;
                        comp[key] = false;
                    });
                }
            });
        }
        resetRow(item) {
            let row = this.getItem(item[this._keyField])
            this._rowFields.forEach(fld => {
                if (fld.name != this._keyField) {
                    row[fld.name] = item[fld.name]
                    let key = `${fld.name}_dirty`;
                    row[key] = false;
                }
            });
            //this.render()
        }


        deleteItem(id) {
            if (this.verbose) console.log("delete", id)

        }

        addItem(item) {
            if (this.verbose) console.log("add", item)

        }

        hasPendingChanges() {
            return (this._updateQ && Object.keys(this._updateQ).length > 0);
        }

	// LIFECYCLE EVENTS
	connectedCallback() {
		let self = this;
		if (self.getAttribute('edit-mode')) self._editMode = (self.getAttribute('edit-mode').toLowerCase() === 'true');
		if (self.getAttribute('verbose')) self.verbose = (self.getAttribute('verbose').toLowerCase() === 'true')

		let comms = self.shadowRoot.querySelector("#comms");
		comms.addEventListener('list', e => {
			if(self.verbose) console.log("list event", e.detail.list.length)
			self._data = e.detail.list;
			self.prepData()
			self.dispatchEvent(self._changeEvent);
		});
		comms.addEventListener('item', e => {
			self.resetRow(e.detail.item)
			self.dispatchEvent(self._changeEvent);
			self.dispatchEvent(new CustomEvent('item.change', { 
				bubbles: true, 
				detail: { item: e.detail.item[this._keyField] }
			}))
		});
		comms.addEventListener('item.edit', e => {
			if(self.verbose) console.log("item.edit event cap", e.detail.evt)

			self.processItemEvent(e.detail.evt);
			self.dispatchEvent(self._changeEvent);
			self.dispatchEvent(new CustomEvent('item.change', { 
				bubbles: true, 
				detail: { itemId: e.detail.evt.id }
			}))
		});
		comms.addEventListener('item.updated', e => {
			if(self.verbose) console.log("item.updated", e.detail.item)
			self.resetRow(e.detail.item)
			self.dispatchEvent(self._changeEvent);
			self.dispatchEvent(new CustomEvent('item.change', { 
				bubbles: true, 
				detail: { itemId: e.detail.item[this._keyField] }
			}))
		});

		comms.addEventListener('item.add', e => {
			if(self.verbose) console.log("item.add", e.detail.item)
			self._data.push(e.detail.item);
			self.dispatchEvent(self._changeEvent);
			self.dispatchEvent(new CustomEvent('item.add', { 
				bubbles: true, 
				detail: { itemId: e.detail.item[this._keyField] }
			}))
		});
		comms.addEventListener('item.delete', e => {
			if(self.verbose) console.log("item.delete", e.detail.itemId)
			// self.resetRow(e.detail.item)
			let row = this._removeItem(e.detail.itemId);
			self.dispatchEvent(self._changeEvent);
			self.dispatchEvent(new CustomEvent('item.delete', { 
				bubbles: true, 
				detail: { itemId: e.detail.itemId }
			}));
		});


		comms.socketSetup();
		this.ready = true;
	}

	disconnectedCallback() {
		this._data = [];
	}

    attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'edit-mode' && newValue != this._editMode) {
			self._editMode = (newValue.toLowerCase() === 'true');
		}
		if (name === 'verbose') {
			this.verbose = (newValue.toLowerCase() === 'true')
			self.shadowRoot.querySelector("#comms").verbose = this.verbose;
		}
    }


}  // END DataManager

customElements.define(DataManager.is, DataManager);
export default DataManager;

})();
