import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UploadParams, BlobService } from 'angular-azure-blob-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable({
    providedIn: 'root'
})
export class AzureBlobService {

    blobConfig: UploadParams = {
        sas: '',
        storageAccount: '',
        containerName: ''
    };

    getUrl:string=`https://${this.blobConfig.storageAccount}.blob.core.windows.net/${this.blobConfig.containerName}/?restype=container&comp=list`;

    constructor(private http: HttpClient, private blob: BlobService, private xmlToJsonSvc: NgxXml2jsonService) { }

    getBlobs(): Observable<any> {
        let options = {
            headers: new HttpHeaders().set('Content-Type', 'text/xml'),
            responseType: 'text' as 'text'
        }
        return this.http.get(this.getUrl, options).pipe(
            map(res => {
                let parser = new DOMParser();
                const xml = parser.parseFromString(res, 'text/xml');
                return this.xmlToJsonSvc.xmlToJson(xml);
            })
        );
    }

    uploadBlob(currentFile): Promise<any> {    
        return new Promise((resolve,reject)=>{
            let baseUrl = this.blob.generateBlobUrl(this.blobConfig, currentFile.name);
            let config = {
                baseUrl: baseUrl,
                sasToken: this.blobConfig.sas,
                blockSize: 1024 * 64, // OPTIONAL, default value is 1024 * 32
                file: currentFile,
                complete: () => {
                    resolve(currentFile.name);
                },
                error: (err) => {
                    reject(err)
                }
            };
            this.blob.upload(config);
        })

    }
}
