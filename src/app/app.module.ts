import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { AudioPlayerComponent } from './audioplayer/audioplayer.component';
import { AudioVisualizerComponent } from './audiovisualizer/audiovisualizer.component';
import { FileSelectorComponent } from './fileselector/fileselector.component';
import { RecommendedFilesComponent } from './recommendedfiles/recommendedfiles.component';
import { PlayTimePipe } from './playtime.pipe';
import { MegabytesPipe } from './megabytes.pipe';
import { UrlSelectorComponent } from './urlselector/urlselector.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatExpansionModule, MatCardModule, MatChipsModule, MatButtonModule,
        MatInputModule,MatSelectModule,MatDialogModule, MatSliderModule } 
        from '@angular/material';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    AudioPlayerComponent,
    AudioVisualizerComponent,
    FileSelectorComponent,
    RecommendedFilesComponent,
    PlayTimePipe,
    MegabytesPipe,
    UrlSelectorComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    FormsModule,
    HttpClientModule,
    NgxDropzoneModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    NgbModalModule,
    MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
