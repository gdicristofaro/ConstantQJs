import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import AudioFile, { fileFormatter } from '../constantq/AudioFile';

/**
 * displays recent files and is charge of committing to local storage
 */
@Component({
    selector: 'recommended-files',
    templateUrl: './recommendedfiles.component.html'
})
export class RecommendedFilesComponent {
    // the default initial recent files if not previously populated
    private static ITEMS : AudioFile[] = [
        {
            filename: "C maj wav",
            url: "/assets/audio/Cmaj.wav",
            size: 1.8 * 1024 * 1024
        },
        {
            filename: 'Prelude in E Minor',
            url: 'https://archive.org/download/PeludiumEMollOp.28Nr.4largo/Peludium%20e-moll%20op.28%20nr.4%28largo%29.mp3',
            size: 2.2 * 1024 * 1024
        },
        {
            filename: 'cello suite',
            url: 'https://archive.org/download/CelloSuiteNo.1I.Preluderostropovich/1-01Bach_CelloSuite1InGBwv1007-1.Prelude.mp3',
            size: 2.4 * 1024 * 1024
        },
        {
            filename: 'choral',
            url: 'https://ia902808.us.archive.org/2/items/acidplanet-audio-00352632/00352632.mp3',
            size: 1 * 1024 * 1024
        }
    ];

    // the subject where the selected file is notified
    @Input()
    public selectedFile: BehaviorSubject<AudioFile>;
    

    // a list of audio file items sorted and displayed to user
    get items() {
        return RecommendedFilesComponent.ITEMS;
    }

    // formats item to be displayed to user
    format(item: AudioFile) {
        return fileFormatter(item);
    }

    /**
     * handles when a user selects a recent file
     * @param item the selected audio file
     */
    onClick(item: AudioFile) {
        this.selectedFile.next(item);
    }
}