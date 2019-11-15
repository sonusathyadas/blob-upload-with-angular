import { Component, OnInit } from '@angular/core';
import { BlobService, UploadConfig, UploadParams } from 'angular-azure-blob-service'
import { AzureBlobService } from 'src/app/servcies/azure-blob.service';
import { isArray } from 'util';


@Component({
    selector: 'file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
    blobs: any[];
    messages:string[];
    constructor(private blob: BlobService, private azureSvc: AzureBlobService) { }

    ngOnInit() {
        this.getBlobs();
    }

    save(img) {
        this.messages=[];
        var fctrl: HTMLInputElement = document.getElementById("image") as HTMLInputElement;
        for (var i = 0; i < fctrl.files.length; i++) {
            this.azureSvc.uploadBlob(fctrl.files[i])
            .then(filename=>{
                this.messages.push("Uploading " + filename + " completed");
                this.getBlobs();
            },
            err=>{
                console.log(err);
            });
        }

    }

    getBlobs() {
        this.azureSvc.getBlobs()
            .subscribe(
                res => {
                    if( isArray(res.EnumerationResults.Blobs.Blob))
                        this.blobs = res.EnumerationResults.Blobs.Blob
                    else{
                        this.blobs=[];
                        this.blobs.push(res.EnumerationResults.Blobs.Blob)                        
                    }
                },
                err => console.log(err)
            )
    }

}
