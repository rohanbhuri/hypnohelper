import { Component, OnInit, NgZone } from '@angular/core';
import { Howl } from 'howler';

@Component({
  selector: 'app-setup-steps',
  templateUrl: './setup-steps.component.html',
  styleUrls: ['./setup-steps.component.scss']
})
export class SetupStepsComponent implements OnInit {

  selectedTiming;
  songs;
  currentlyPlaying;
  selectedStep = '1';
  selectedMicType;

  music30mins = [
    {
      src: '../../../assets/music/Le Castle Vania - John Wick Medley.mp3',
      howl: undefined
    },
    {
      src: '../../../assets/music/Interstellar Main Theme - Extra Extended - Soundtrack by  Hans Zimmer.mp3',
      howl: undefined
    },
    {
      src: '../../../assets/music/OFFICIAL - Westworld Soundtrack - Paint It Black - Ramin Djawadi.mp3',
      howl: undefined
    },
    {
      src: '../../../assets/music/The Dark Knight - Main Theme (Piano Version) + Sheet Music.mp3',
      howl: undefined
    },
    {
      src: '../../../assets/music/Thor Ragnarok - Official Trailer Song (Magic Sword - In The Face Of Evil).mp3',
      howl: undefined
    },
    {
      src: '../../../assets/music/Wonder Womans Wrath - Wonder Woman Soundtrack - Rupert Gregson-Williams [Official].mp3',
      howl: undefined
    },
  ];

  music60mins = [
    {
      src: '../../../assets/music/Le Castle Vania - John Wick Medley.mp3',
      howl: undefined
    },
    {
      src: '../../../assets/music/Interstellar Main Theme - Extra Extended - Soundtrack by  Hans Zimmer.mp3',
      howl: undefined
    },
    {
      src: '../../../assets/music/OFFICIAL - Westworld Soundtrack - Paint It Black - Ramin Djawadi.mp3',
      howl: undefined
    },
    {
      src: '../../../assets/music/The Dark Knight - Main Theme (Piano Version) + Sheet Music.mp3',
      howl: undefined
    },
    {
      src: '../../../assets/music/Thor Ragnarok - Official Trailer Song (Magic Sword - In The Face Of Evil).mp3',
      howl: undefined
    },
    {
      src: '../../../assets/music/Wonder Womans Wrath - Wonder Woman Soundtrack - Rupert Gregson-Williams [Official].mp3',
      howl: undefined
    },
  ];

  constructor(
    public ngZone: NgZone
  ) { }

  ngOnInit() {
    this.selectTracks('30');
    this.selectMicrophoneType('build-in');
  }

  selectStep(selectedStep) {
    this.selectedStep = selectedStep;
  }

  selectMicrophoneType(selectedMicType) {
    this.selectedMicType = selectedMicType;
  }

  selectTracks(selectedTracks) {
    this.musicCleanUp();
    if (selectedTracks === '30') {
      this.selectedTiming = '30';
      this.songs = this.music30mins;
    }
    if (selectedTracks === '60') {
      this.selectedTiming = '60';
      this.songs = this.music30mins;
    }
  }


  playTrack(i) {
    //  pause all music and unload
    if (this.songs) {
      this.songs.forEach(element => {
        if (element.howl) {
          element.howl.unload();
          element.howl = undefined;
        }
      });
    }
    // load selected music
    if (!this.songs[i].howl && this.currentlyPlaying !== i) {
      this.songs[i].howl = new Howl({
        src: [this.songs[i].src]
      });
    }

    // Play and pause selected music
    if (this.currentlyPlaying === i) {
      this.currentlyPlaying = undefined;
    } else {
      this.songs[i].howl.once('load', () => {
        this.songs[i].howl.play();
        this.ngZone.run(() => {
          this.currentlyPlaying = i;
        });
      });
    }
  }

  musicCleanUp() {
    if (this.songs) {
      this.songs.forEach(element => {
        if (element.howl) {
          element.howl.unload();
          element.howl = undefined;
          this.currentlyPlaying = undefined;
        }
      });
    }
  }
}
