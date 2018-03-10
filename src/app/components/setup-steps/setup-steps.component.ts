import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
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

  progress = 0;

  availableRecordingDevices = [];

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
    if (this.selectedStep === '2') {
      this.getRecordingDevices();
    }
    if (this.selectedStep === '3') {
      this.testRecordingDevice();
    }
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
      this.progress = 0;
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
      this.progress = 0;
    } else {
      this.songs[i].howl.once('load', () => {
        this.songs[i].howl.play();
        this.ngZone.run(() => {
          this.currentlyPlaying = i;
        });
        setInterval(() => {
          this.ngZone.run(() => {
            this.progress = (this.songs[i].howl.seek() / this.songs[i].howl._duration) * 100;
          });
        }, 1000);
      });
    }
  }

  musicCleanUp() {
    this.progress = 0;
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

  getRecordingDevices() {
    navigator.mediaDevices.enumerateDevices().then((data) => {
      data.forEach(element => {
        console.log(element.kind);
        if (element.kind === 'audioinput') {
          this.availableRecordingDevices.push(element);
        }
      });
      console.log(this.availableRecordingDevices);
    }).catch((err) => {
      console.log(err);
    });
  }


  testRecordingDevice() {
    const audio = document.querySelector('audio');

    const constraints = {
      audio: true,
      video: false
    };

    function handleError(error) {
      console.log('navigator.getUserMedia error: ', error);
    }

    navigator.mediaDevices.getUserMedia(constraints).
      then(this.handleSuccess).catch(handleError);

  }

  handleSuccess(stream) {
    const audio = document.querySelector('audio');

    const constraints = {
      audio: true,
      video: false
    };

    const audioTracks = stream.getAudioTracks();
    console.log('Got stream with constraints:', constraints);
    console.log('Using audio device: ' + audioTracks[0].label);
    stream.oninactive = () => {
      console.log('Stream ended');
    };
    audio.srcObject = stream;
    console.log(stream);    
    setInterval(() => {
    }, 1000);
  }

}
