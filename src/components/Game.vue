<template>
  <div id="game">
    <div class="game">
      <div class="game__settings">
        <select v-model="player.difficulty" required :disabled="disabled">
          <option disabled value>Pick game mode</option>
          <option v-for="(setting, key) in settings" :value="key" :key="key">
            {{
            key | normalize
            }}
          </option>
        </select>
        <input
          type="text"
          placeholder="Enter your name"
          class="name"
          :value="player.name"
          @input="player.name = $event.target.value"
          :disabled="disabled"
          required
        />

        <button v-if="message" @click="playAgain" class="btn">PLAY AGAIN</button>
        <button v-else @click="play" class="btn">PLAY</button>
        <p v-if="message">{{ message }}!</p>

        <div
          class="game__field"
          v-if="field"
          :style="{
            display: 'grid',
            gridGap: 0,
            gridTemplateColumns: 'repeat(' + field + ', 30px)',
            justifyContent: 'center',
            margin: '30px auto'
          }"
        >
          <div class="field" v-for="field in field ** 2" :key="field"></div>
        </div>
      </div>
    </div>
    <div class="stats">
      <h2>Leader board</h2>
      <ul class="stats__table">
        <li v-for="winner in winners" :key="winner.id">{{winner.winner}} - {{winner.date}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import shuffle from "@/lib/shuffle";
import post from "@/lib/post";
export default {
  name: "Game",
  data() {
    return {
      winnersURL: "https://starnavi-frontend-test-task.herokuapp.com/winners",
      settingsURL:
        "https://starnavi-frontend-test-task.herokuapp.com/game-settings",
      settings: "",
      winners: "",
      player: {
        name: "",
        difficulty: ""
      },
      delay: "",
      field: "",
      disabled: false,
      message: ""
    };
  },
  async created() {
    const getSettings = axios.get(this.settingsURL);
    const getWinenrs = axios.get(this.winnersURL);

    axios.all([getSettings, getWinenrs]).then(
      axios.spread((settings, winners) => {
        this.settings = settings.data;
        this.winners = winners.data;
      })
    );
  },
  methods: {
    play() {
      const difficulty = this.settings[this.player.difficulty];
      this.delay = difficulty.delay;
      this.field = difficulty.field;
      this.disabled = !this.disabled;

      setTimeout(this.start, 0);
      setTimeout(this.click, 0);
    },
    start() {
      let count = this.field ** 2,
        field = this.$el.querySelectorAll(".field"),
        arr = [];

      for (let i = 0; i < count; i++) {
        arr.push(i);
      }
      arr = shuffle(arr);

      field[arr[count - 1]].classList.add("blue");
      count--;

      let timer = setInterval(() => {
        if (
          this.$el.querySelectorAll(".red").length ==
          Math.ceil(field.length / 2) - 1
        ) {
          clearInterval(timer);
          field[arr[count]].classList.add("red");
          this.message = "Computer wins";
          post(this.winnersURL, "Computer", this.winners);
          return;
        } else if (
          this.$el.querySelectorAll(".green").length ==
          Math.ceil(field.length / 2)
        ) {
          clearInterval(timer);
          let name = this.player.name || "player";
          this.message = name + " wins";
          post(this.winnersURL, this.player.name, this.winners);
          return;
        }

        if (
          field[arr[count]].classList.contains("blue") &&
          !field[arr[count]].classList.contains("green")
        ) {
          field[arr[count]].classList.add("red");
        }
        field[arr[count - 1]].classList.add("blue");
        count--;
      }, this.delay);
    },
    click() {
      const gameField = document.querySelector(".game__field");
      gameField.addEventListener("click", e => {
        let target = e.target;
        if (
          !target.classList.contains("blue") ||
          target.classList.contains("red")
        )
          return;
        target.classList.add("green");
      });
    },
    playAgain() {
      this.disabled = !this.disabled;
      this.delay = this.field = this.player.name = this.message = "";
    }
  },
  filters: {
    normalize(value) {
      const modeIndex = value.indexOf("Mode");
      const mode = value.slice(modeIndex).toLowerCase();
      return value.slice(0, modeIndex) + " " + mode;
    }
  }
};
</script>

<style lang="scss">
@mixin rounded-input($w, $bg, $mr: 0) {
  margin-right: $mr;
  border: none;
  border-radius: 5px;
  outline: transparent;
  padding: 10px;
  width: $w;
  background: $bg;
}

#game {
  display: flex;
  justify-content: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

select {
  @include rounded-input(141px, #ccc, 5px);
}

.name {
  @include rounded-input(125px, #e3e3e3, 5px);
}

.btn {
  @include rounded-input(100px, #5f5e5e);
  cursor: pointer;
  color: #ffffff;
}

.game,
.stats {
  padding: 15px;
  border: 2px solid #ccc;
}

.game {
  border-right: none;
}

h2 {
  margin: 0;
}

.field {
  padding: 15px;
  box-shadow: inset 0px 0px 0px 1px #cccccc;
  &:hover {
    cursor: pointer;
  }
}

.blue {
  background-color: #0000ff;
}

.red {
  background-color: #c41c1c;
}

.green {
  background-color: #047404;
}

.stats {
  text-align: left;
  &__table {
    padding: 0;
    li {
      margin-bottom: 5px;
      border-radius: 5px;
      list-style: none;
      padding: 10px;
      background: #cccccc;
    }
  }
}
</style>