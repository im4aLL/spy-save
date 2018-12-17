import {
    BrowserStorage
} from "./BrowserStorage";

import { sleep } from "./Sleep";

class ClassicSave {
    constructor() {
        this.data = [];
        this.tempData = [];
        this.cronJobTimer = 10000;

        this.browserStorage = new BrowserStorage();

        this.cronJob();
    }

    generateRow(value) {
        return {
            key: `${+ new Date}` + Math.random().toString(36).substr(2, 9),
            value
        };
    }

    add(value) {
        this.data = [...this.data, this.generateRow(value)];

        this.saveToStorage();
    }

    saveToStorage() {
        this.browserStorage.setItem('temp', this.data);
    }

    getData() {
        return this.data;
    }

    removeKeys(keys) {
        this.data.forEach((d, index) => {
            if (keys.includes(d.key)) {
                this.tempData = [...this.tempData, this.data[index]];

                delete this.data[index];
            }
        });

        this.data = [...this.data.filter(d => d)];
        
        this.saveToStorage();
    }

    reQueueFailedKeys(keys) {
        if (this.tempData.length === 0) {
            return false;
        }

        this.tempData.forEach((d, index) => {
            if (keys.includes(d.key)) {
                this.data = [...this.data, this.tempData[index]];

                this.saveToStorage();

                delete this.tempData[index];
            }
        });

        this.tempData = [...this.tempData.filter(d => d)];
    }

    cronJob() {
        setInterval(() => {
            this.sendToServer(keys => {
                this.reQueueFailedKeys(keys);
            });
        }, this.cronJobTimer);
    }

    sendToServer(callback) {
        if (this.data.length === 0) {
            console.log('Nothing to send');

            return false;
        }

        const keys = this.getKeys(this.data);
        console.log('Sending to server');
        console.log(keys);
        this.removeKeys(keys);

        sleep(4000).then(() => {
            if (typeof callback === 'function') {
                callback.call(this, keys);
            }
        });
    }

    getKeys(data) {
        let array = [];
        const dataArray = [...data];

        dataArray.forEach(element => {
            array.push(element.key);
        });

        return array;
    }
}

const classicSave = new ClassicSave();

setTimeout(() => {
    classicSave.add('Something');
}, 3000);

setTimeout(() => {
    classicSave.add('Else');
}, 6000);

setTimeout(() => {
    classicSave.add('Final');
}, 9000);

// setTimeout(() => {
//     classicSave.add('1');
//     classicSave.add('2');
// }, 3500);

// console.log(classicSave.getData());