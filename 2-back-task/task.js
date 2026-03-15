/* 課題に関するコードを以下に書く */

const button_html = function(choice) {
  return `<button class="jspsych-btn" style="font-size:24px; padding:16px 48px; min-width:140px; min-height:60px; touch-action:manipulation;">${choice}</button>`;
};

const instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>これから数字（1〜9）が1つずつ表示されます。</p>
    <p><strong>今の数字が2つ前の数字と同じときだけ</strong>、画面の「一致」ボタンをタップしてください。</p>
    <p>一致しないときは何もせず、そのまま次の試行を待ってください。</p>
    <p>準備ができたら、下のボタンをタップして開始してください。</p>
  `,
  choices: ["開始する"],
  button_html: button_html
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
  digits.push(jsPsych.randomization.randomInt(1, 9).toString());
}

const trial_variables = digits.map((digit, index, arr) => {
  const is_target = index >= 2 && digit === arr[index - 2];
  return {
    stimulus_digit: digit,
    is_target: is_target
  };
});

const nback_trial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    const d = jsPsych.evaluateTimelineVariable("stimulus_digit");
    return `<p style="font-size:80px; font-weight:bold; margin: 20px 0;">${d}</p>`;
  },
  choices: ["一致"],
  button_html: button_html,
  trial_duration: 1500,
  response_ends_trial: true,
  data: {
    task: "2-back",
    condition: "2-back"
  },
  on_finish: function(data) {
    const is_target = jsPsych.evaluateTimelineVariable("is_target");
    data.stimulus = jsPsych.evaluateTimelineVariable("stimulus_digit");
    data.correct_response = is_target ? "press" : "no_press";
    data.is_target = is_target;
    const pressed = data.response !== null;
    data.correct = (is_target && pressed) || (!is_target && !pressed);
  }
};

const trials_block = {
  timeline: [fixation, nback_trial],
  timeline_variables: trial_variables
};

const end_message = {
  type: jsPsychHtmlButtonResponse,
  stimulus: "<p>課題は終了です。ご協力ありがとうございました。</p>",
  choices: ["終了"],
  button_html: button_html
};

/*タイムラインの設定*/
const timeline = [fullscreen, instructions, trials_block, end_message];
