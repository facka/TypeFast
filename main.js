// VueJS Basic templating example
const app = new Vue({
    el: '#app',
    data: () => {
      return {
        keyWord: 'BriteCore',
        text: [],
        fine: true,
        changingWord: false,
        index: 0,
        time: 0,
        endTime: 0,
        charsTime: [],
        historicTimes: [],
        historicSwitchTimes: [],
        
      };
    },
    beforeCreate: function() {
      console.log('Before Create!!');
    },
    created: function() {
      this.synth = new Tone.FMSynth().toMaster();
      this.notes = [
        'C4','D4','E4','F4','G4','A4','B4',
        'C5','D5','E5','F5','G5','A5','B5'
      ];
      console.log('Created!!');
    },
    beforeUpdate: function() {
      console.log('Before update!!');
    },
    updated: function() {
      console.log('Updated!!');
    },
    beforeMount: function() {
      console.log('Before mount!!');
    },
    mounted: function() {
      console.log('mounted!!');
      this.focusInput();
    },
    watch: {
      index() {
        console.log('Index changed ', this.index);
      }
    },
    methods: {
      reset: function() {
        var timeInterval = 1 / app.index;
        for (var i = 0; i < app.index; i++) {
          app.synth.triggerAttackRelease(app.notes[app.index-i], '32n', i*timeInterval); 
        }
        app.text.length = 0;
        app.index = 0;
        app.endTime = 0;
        app.fine = true;
        app.charsTime.length = 0;
      },
      enableChangeWord: function() {
        app.changingWord = true;
      },
      closeChangeWord: function() {
        app.reset();
        app.changingWord = false;
      },
      focusInput: function() {
        console.log(document.getElementById('hiddeninput'));
        document.getElementById('hiddeninput').focus();
      },
      keypress: function(event) {
        if(event && event.keyCode == 13) {
          event.preventDefault();
          return;
        }
        if(event && event.key == 'Shift') {
          return;
        }
        if (event && event.keyCode === 8) {
          app.reset();
          event.preventDefault();
        } else {
          if(app.index == app.keyWord.length) {
            event.preventDefault();
            return;
          }
           if (event.key.length !== 1 || !/[A-Za-z]/g.test(event.key)) {
             event.preventDefault();
             return;
           }
           if (app.index == 0) {
             app.time = new Date();
           }
           if (app.keyWord[app.index] !== event.key) {
             app.fine = false;
             app.text.push(event.key);
             app.synth.triggerAttackRelease('C3', '32n');
             return;
           } else {
             if (!app.fine) {
               app.synth.triggerAttackRelease('C3', '32n');
               event.preventDefault();    
               return;
             }
             var now = new Date();
             if (app.keyWord.length-1 == app.index && (app.text.join('')+event.key) == app.keyWord) {
               app.endTime = now - app.time;
             }
             app.fine = true;
             app.charsTime[app.index] = now - app.time;
             if (!app.historicTimes[app.index] || app.charsTime[app.index] < app.historicTimes[app.index]) {
                app.historicTimes[app.index] = app.charsTime[app.index]; 
             }
             if (app.index > 0 && ( !app.historicSwitchTimes[app.index] || (app.charsTime[app.index] - app.charsTime[app.index-1] < app.historicSwitchTimes[app.index]))) {
                app.historicSwitchTimes[app.index] = app.charsTime[app.index] - app.charsTime[app.index-1]; 
             }
             app.text.push(event.key);
             app.index++;
             app.synth.triggerAttackRelease(app.notes[app.index], '64n'); 
           }
        }
      }
    },
    computed: {
      keyWordAsArray: function() {
        var arr = [];
        for (var i=0; i < this.keyWord.length; i++) {
          arr.push(this.keyWord[i]);
        }
        return arr; 
      }
    }
});