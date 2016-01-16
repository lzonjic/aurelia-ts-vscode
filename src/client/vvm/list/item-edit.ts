import {autoinject} from 'aurelia-framework';
import {SampleItem, SampleListManager} from '../../models/sample-list-data';

@autoinject
export class ItemEdit {
    heading: string;
    
    data: SampleItem;
    
    constructor(private dataMan: SampleListManager) {
    }
    
    activate(params) {
        this.data = this.dataMan.getItem(params.id);
    }
}