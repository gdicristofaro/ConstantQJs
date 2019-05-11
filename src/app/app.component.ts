import { Component, OnInit, ViewChild } from '@angular/core';
import AudioPlayback from './constantq/AudioPlayback';
import { BehaviorSubject, Subscription, of } from 'rxjs';
import { map, tap, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import AudioFile, { FileSource, UrlSource } from './constantq/AudioFile';
import { getFreqRange, Note, noteToString, Pitch, PitchData } from './constantq/Pitch';
import ConstantQData from './constantq/ConstantQData';
import ConstantQDataUtil, {ConstantQMessage} from './constantq/ConstantQDataUtil';
import ConstantQ from './constantq/ConstantQ';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatExpansionPanel } from '@angular/material';

/**
 * This is the main entry point angular component.  This component is
 * responsible for rendering child compnents, and orchestrates loading
 * and analyzing audio files.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // how frequently the visualization of the audio should be refreshed in milliseconds
  private static MS_REFRESH = 100;

  // whether or not audio is loading
  loadingMessage: string = undefined;
  loadingPercentage: number = undefined;
  loadingModal: NgbModalRef = undefined;
  graphMax: number;
  audioLoadSub: Subscription;
  positionSub: Subscription;
  selectedSub: Subscription;
  title: string = undefined;

  @ViewChild("expansionPanel") expansionPanel: MatExpansionPanel;

  minPitch : Pitch = ConstantQ.DEFAULT_MIN_FREQ;
  maxPitch : Pitch = ConstantQ.DEFAULT_MAX_FREQ;
  fps : number = ConstantQ.DEFAULT_FPS;

  noteLetters : string[];

  /**
   * whether or not to show controls
   * @returns true if there is a playback component that has audio
   */
  get showControls() {
    return (this.playback && this.playback.hasSource);
  }

  onMinPitch(min:Pitch) { this.minPitch = min; }
  onMaxPitch(max:Pitch) { this.maxPitch = max; }
  onFps(fps:number) { this.fps = fps; }

  /**
   * the rxjs BehaviorSubject that defines what the selected file is
   * and when it changes (to be altered by audio searcher / recent files component 
   * and utilized by playback component)
   */
  selectedFile = new BehaviorSubject<AudioFile>(undefined);



  /**
   * when an audio file along with pertinent pitch data is loaded, this method handles result
   * @param buff      the audio buffer
   * @param pitchData the pitch data if exists
   */
  private onFinishedLoading(buff: AudioBuffer, pitchData: ConstantQData) {
    this.playback = new AudioPlayback(buff, AppComponent.MS_REFRESH);
    this.expansionPanel.close();

    if (pitchData && pitchData.lowPitch && pitchData.highPitch) {
      let noteLetters = getFreqRange(
        pitchData.lowPitch.note, pitchData.lowPitch.octave, 
        pitchData.highPitch.note, pitchData.highPitch.octave)
      .map(n => `${noteToString(n.note)}${n.octave}`)
      .reduce((prev, cur) => [...prev, cur, ""], []);

      this.noteLetters = noteLetters.slice(0, noteLetters.length - 2);
    }
    
    if (pitchData) {
      // determine max value for graph
      const maxVal = pitchData.constQData.reduce(
        (prevVal, curArr) => {
          return curArr.reduce((prev, curVal) => {
            if (curVal > prev)
              return curVal;
            else
              return prev;
          }, prevVal);
        }, 0);
  
      // round graph max to nearest number
      var log10 = 0;
      var alteredMax = maxVal;
      while (alteredMax < 1) {
        log10 += 1;
        alteredMax *= 10;
      }
      this.graphMax = Math.ceil(alteredMax) / Math.pow(10, log10);  

      if (this.positionSub)
        this.positionSub.unsubscribe();

      this.positionSub = this.playback.positionListener.subscribe(pos => {
        this.curPitches.next(pitchData.getData(pos));
      });
    }

    if (this.loadingModal)
      this.loadingModal.close("dismiss");

    this.audioLoadSub.unsubscribe();
    this.audioLoadSub = undefined;
  }

  /**
   * 
   * @param data the constant q data message received
   * @param buff the pertinent audio buffer
   */
  private onConstantQMsg(data : ConstantQMessage, buff: AudioBuffer) {
    if (data.status === "Loading") {
      this.loadingMessage = data.message;
      this.loadingPercentage = data.completion;
    }
    else if (data.status === "Complete") {
      const constQData: ConstantQData = data.data;
      this.onFinishedLoading(buff, constQData);
    }
    else if (data.status === "Error") {
      // on error get pitch data and apply to position listener
      // synchronous version
      const pitchData = ConstantQDataUtil.process(buff);
      this.onFinishedLoading(buff, pitchData);
    }
  }


  /**
   * when the selected file changes, this function is called
   * @param file  the new selected file
   */
  onFileChange(file: AudioFile) {
    // if an actual file, load it and set as playback
    if (file && ((<UrlSource> file).url || (<FileSource> file).file) && !this.audioLoadSub) {
      // pause playback if exists (to avoid playback issues)
      if (this.playback)
        this.playback.pause();

      this.title = file.filename;
      // set up loading modal and variables
      this.loadingMessage = "Loading Audio File";
      this.loadingPercentage = undefined;
      this.loadingModal = this.modalService.open(this.modal, 
        { backdrop: 'static', keyboard: false });

      const audioBuffer = (<FileSource> file).file ?
        AudioPlayback.getFileBufferNode((<FileSource> file).file) :
        AudioPlayback.getHttpBufferNode(this.http, (<UrlSource> file).url);
        
      this.audioLoadSub = audioBuffer.pipe(
        mergeMap(buffer => ConstantQDataUtil.messageProcessing(
            buffer, this.minPitch, this.maxPitch, 
            ConstantQ.DEFAULT_BINS, ConstantQ.DEFAULT_THRESH, this.fps)
          .pipe(map(message => {return {buffer, message}; })))
        ).subscribe(data => this.onConstantQMsg(data.message, data.buffer),
        err => {
          console.error(err);
          this.loadingMessage = undefined;
          this.loadingPercentage = undefined;

          if (this.loadingModal)
            this.loadingModal.close("dismiss");
        });
    }
  }


  /**
   * the control in charge of audio playback
   */
  playback: AudioPlayback = undefined;

  /**
   * the pitches to be visualized by the audio visualizer
   */
  curPitches: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(undefined);

  /**
   * the actual modal dom element
   */
  @ViewChild('modal') private modal;

  constructor(private http: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    // // when the selected file change and the file actually exists, properly load
    this.selectedSub = this.selectedFile.subscribe((file) => {
      this.onFileChange(file);
    });
  }

  ngOnDestroy() {
    for (let sub of [this.selectedSub, this.audioLoadSub, this.positionSub]) {
      if (sub)
        sub.unsubscribe();
    }
  }
}