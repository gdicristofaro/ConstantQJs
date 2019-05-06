import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { AppComponent } from './app.component';
import { AudioPlayerComponent } from './audioplayer/audioplayer.component';
import { AudioVisualizerComponent } from './audiovisualizer/audiovisualizer.component';
import { FileSelectorComponent } from './fileselector/fileselector.component';
import { RecommendedFilesComponent } from './recommendedfiles/recommendedfiles.component';
import { PlayTimePipe } from './playtime.pipe';
import { MegabytesPipe } from './megabytes.pipe';
import { UrlSelectorComponent } from './urlselector/urlselector.component';


@NgModule({
  declarations: [
    AppComponent,
    AudioPlayerComponent,
    AudioVisualizerComponent,
    FileSelectorComponent,
    RecommendedFilesComponent,
    PlayTimePipe,
    MegabytesPipe,
    UrlSelectorComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    ChartsModule,
    FormsModule,
    HttpClientModule,
    NgxDropzoneModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
