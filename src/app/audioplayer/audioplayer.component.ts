import { Component, OnInit, Input } from '@angular/core';
import AudioPlayback from '../constantq/AudioPlayback';

/**
 * This component is responsible for rendering playback controls as well
 * as displaying the current playback time.
 */
@Component({
    templateUrl: 'audioplayer.component.html',
    selector: 'audio-player'
})
export class AudioPlayerComponent implements OnInit {
    // whether or not audio is playing (based on playback isPlaying)
    get isPlaying() {
        return this.playback.isPlaying
    }

    get curPosition() {
        return (this.playback) ? this.playback.currentPosition : undefined;
    }

    set curPosition(value) {
        console.log("setting current position");
        if (this.playback)
            this.playback.currentPosition = value;
    }

    ngOnInit(): void { }

    @Input() playback: AudioPlayback;

    /**
     * toggle playback to either play/pause
     */
    togglePlay() {
        if (this.playback.hasSource) {
            if (this.playback.isPlaying)
                this.playback.pause();
            else
                this.playback.play();
        }
    }
}