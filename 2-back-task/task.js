/* 課題に関するコードを以下に書く */

const instructions = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>これから数字（1〜9）が1つずつ表示されます。</p>
    <p><strong>今の数字が2つ前の数字と同じときだけ</strong>、下の「一致」ボタンを押してください。</p>
    <p>一致しないときは何も押さず、そのまま次の試行を待ってください。</p>
    <p>準備ができたら、キーボードの任意のキーを押して開始してください。</p>
  `
};

const fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size:48px;">+</p>',
  choices: "NO_KEYS",
  trial_duration: 500
};

const total_trials = 30;
const digits = [];
for (let i = 0; i < total_trials; i++) {
  digits.push(jsPsych.randomization.randomInt(1, 10).toString());
}

const trial_variables = digits.map((digit, index, arr) => {
  const is_target = index >= 2 && digit === arr[index - 2];
  return {
    stimulus_digit: digit,
    is_target: is_target,
    correct_response: is_target ? 0 : null
  };
});

const nback_trial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    const d = jsPsych.evaluateTimelineVariable("stimulus_digit");
    return `<p style="font-size:64px; font-weight:bold;">${d}</p>`;
  },
  choices: ["一致"],
  trial_duration: 1500,
  response_ends_trial: true,
  data: {
    task: "test",
    condition: "2-back"
  },
  on_finish: function(data) {
    const is_target = jsPsych.evaluateTimelineVariable("is_target");
    data.stimulus = jsPsych.evaluateTimelineVariable("stimulus_digit");
    data.correct_response = is_target ? 0 : null;
    data.is_target = is_target;
    const pressed = data.response !== null;
    data.correct = is_target ? pressed : !pressed;
  }
};

const trials_block = {
  timeline: [fixation, nback_trial],
  timeline_variables: trial_variables
};

const end_message = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<p>課題は終了です。ご協力ありがとうございました。</p><p>任意のキーを押して終了してください。</p>"
};

/*タイムラインの設定*/
const timeline = [fullscreen, instructions, trials_block, end_message];
