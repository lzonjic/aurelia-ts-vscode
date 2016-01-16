import {autoinject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {SampleItem, SampleListManager} from '../../models/sample-list-data';

@autoinject
export class SampleList {
    heading: string = "Sample List";
    
    sampleList: Array<SampleItem>;
    
    constructor(private http: HttpClient, private dataMan: SampleListManager) {
        // http.configure(
        //     config => {
        //         config.useStandardConfiguration()
        //               .withBaseUrl('http://localhost:3000/api/');
        //     }
        // );
    }
    
    activate() {
        this.sampleList = this.dataMan.getData();
    }
}