export class Page {
    size;
    current;
    total;
    sizeList = [10, 20, 50, 100];

    constructor(total = 0, size = 10, current = 1) {
        this.total = total;
        this.size = size;
        this.current = current;
    }
    getQueryParam() {
        return { page: this.current, pageSize: this.size };
    }
    setSize(val) {
        this.size = val;
    }
    setCurrent(val) {
        this.current = val;
    }
    getSize() {
        return this.size;
    }
    getCurrent() {
        return this.current;
    }
    setTotal(val) {
        this.total = val;
    }
    unset() {
        this.current = 1;
    }
}
