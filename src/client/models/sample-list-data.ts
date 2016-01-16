export interface SampleItem {
    id: number;
    name: string;
}

export class SampleListManager {
    private list: SampleItem[] = [
            { id: 1, name: "Item #1" },
            { id: 2, name: "Item #2" },
            { id: 3, name: "Item #3" },
            { id: 4, name: "Item #4" },
        ];
        
    getData(): SampleItem[] {
        return this.list;
    }
    
    getItem(id: string): SampleItem {
        var filteredList = this.list.filter((v, i, a) => v.id.toString() == id);
        
        if (filteredList && filteredList.length >= 1)
            return filteredList[0];
        else
            return null;
    }
}