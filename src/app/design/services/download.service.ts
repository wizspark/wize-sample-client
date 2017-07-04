import { Injectable } from '@angular/core';
//import * as fileSave from 'file-saver';
//const fileSaver = require('file-saver');

@Injectable()
export class DownloadService {

    getFileName(contentDispositionHeader: string) {
        let fileName;
        if (contentDispositionHeader && contentDispositionHeader.indexOf('attachment') !== -1) {
            let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            let matches = filenameRegex.exec(contentDispositionHeader);
            if (matches && matches[1]) {
                fileName = matches[1].replace(/['"]/g, '');
            }
        }
        return fileName;
    }

    downloadFile(data: any, fileName: string, fileType: string) {
        let blob = new Blob([data], {type: fileType});
        //fileSaver.saveAs(blob, fileName);
    }
}
