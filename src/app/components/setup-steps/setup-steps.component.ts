import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Howl } from 'howler';
import { Location } from '@angular/common';


@Component({
  selector: 'app-setup-steps',
  templateUrl: './setup-steps.component.html',
  styleUrls: ['./setup-steps.component.scss']
})
export class SetupStepsComponent implements OnInit {


  //////////////////////////////////////////////////////
  script;
  mic;
  instant;
  audioContext;
  deviceId;
  /////////////////////////////////////////////////////






  selectedTiming;
  songs;
  currentlyPlaying;
  selectedStep = '1';
  selectedMicType;

  selectedTrack;

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
    public ngZone: NgZone,
    public location: Location
  ) { }

  ngOnInit() {
    this.selectTracks('30');
    this.selectMicrophoneType('build-in');
  }

  selectStep(selectedStep) {
    this.selectedStep = selectedStep;
    if (this.selectedStep === '2') {
      this.musicCleanUp();
      this.getRecordingDevices();
    }
    if (this.selectedStep === '3') {
      setTimeout(() => {
        this.testRecordingDevice();
      }, 1);
    }
  }

  selectMicrophoneType(selectedMicType) {
    this.selectedMicType = selectedMicType;
    if (selectedMicType === 'headset') {
      this.deviceId = this.availableRecordingDevices[0].deviceId;
    }
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

  selectTrack(song) {
    this.selectedTrack = song.src;
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
    this.availableRecordingDevices = [];
    navigator.mediaDevices.enumerateDevices().then((data) => {
      data.forEach(element => {
        if (element.kind === 'audioinput' && element.deviceId !== 'default') {
          this.availableRecordingDevices.push(element);
        }
      });
    }).catch((err) => {
      console.log(err);
    });
    console.log(this.availableRecordingDevices);
  }


  testRecordingDevice() {
    const audio = document.querySelector('audio');
    const constraints = {
      audio: { deviceId: this.deviceId ? this.deviceId : false },
      video: false
    };

    try {
      this.audioContext = new AudioContext();
    } catch (e) {
      console.log('Web Audio API not supported.');
    }

    navigator.mediaDevices.getUserMedia(constraints).
      then(stream => {
        console.log('Audio Stream', stream);
        const audioTracks = stream.getAudioTracks();
        console.log('Got stream with constraints:', constraints);
        console.log('Using audio device: ' + audioTracks[0].label);
        stream.oninactive = () => {
          console.log('Stream ended');
        };

        audio.srcObject = stream;

        this.connectToSource(stream, (e) => {
          if (e) {
            alert(e);
            return;
          }
          this.SoundMeter();
        });

      }).catch(err => { console.log('navigator.getUserMedia error: ', err); });
  }

  SoundMeter() {
    console.log(this.mic);
    this.script.onaudioprocess = (event) => {
      const input = event.inputBuffer.getChannelData(0);
      let i;
      let sum = 0.0;
      let clipcount = 0;
      for (i = 0; i < input.length; ++i) {
        sum += input[i] * input[i];
        if (Math.abs(input[i]) > 0.99) {
          clipcount += 1;
        }
      }
      this.ngZone.run(() => {
        this.instant = Math.sqrt(sum / input.length).toFixed(2);
      });
      // console.log(this.instant);
    };

  }

  connectToSource(stream, callback) {
    console.log('SoundMeter connecting', stream);
    try {
      this.mic = this.audioContext.createMediaStreamSource(stream);
      this.script = this.audioContext.createScriptProcessor(2048, 1, 1);
      this.mic.connect(this.script);
      // necessary to make sample run, but should not be.
      this.script.connect(this.audioContext.destination);
      if (typeof callback !== 'undefined') {
        callback(null);
      }
    } catch (e) {
      console.error(e);
      if (typeof callback !== 'undefined') {
        callback(e);
      }
    }
  }

  getSoundMeterColor(instant) {
    if (instant > 0 && instant <= 0.25) {
      return '#ffda30';
    }
    if (instant > 0.25 && instant <= 0.6) {
      return '#5493fe';
    }
    if (instant > 0.6 && instant <= 1) {
      return '#ff6d6d';
    }
  }

}
