document.addEventListener("DOMContentLoaded", function () {
  const chat = document.getElementById("assistantChat");
  const choices = document.getElementById("assistantChoices");
  const inputWrap = document.getElementById("assistantInputWrap");
  const input = document.getElementById("assistantInput");
  const send = document.getElementById("assistantSend");
  const restart = document.getElementById("assistantRestart");
  const whatsapp = document.getElementById("assistantWhatsApp");

  if (!chat || !choices || !inputWrap || !input || !send || !restart || !whatsapp) {
    return;
  }

  const state = {
    step: 0,
    procedure: "",
    goal: "",
    urgency: "",
    name: "",
    phone: "",
  };

  const steps = [
    {
      question: "Olá, eu sou a assistente da Harmonny. Qual procedimento você deseja avaliar?",
      type: "choices",
      options: ["Botox", "Preenchimento labial", "Bioestimuladores", "Fios de PDO", "Limpeza de pele", "Outro"],
      save: "procedure",
    },
    {
      question: "Perfeito. Qual é seu principal objetivo com o tratamento?",
      type: "choices",
      options: ["Rejuvenescimento", "Definir os lábios", "Melhorar a firmeza da pele", "Cuidar da pele", "Harmonizar o rosto"],
      save: "goal",
    },
    {
      question: "Quando você gostaria de realizar sua avaliação?",
      type: "choices",
      options: ["Ainda hoje", "Nesta semana", "Neste mês", "Só quero saber valores"],
      save: "urgency",
    },
    {
      question: "Para eu enviar seu atendimento para a secretária, qual é seu nome?",
      type: "input",
      save: "name",
    },
    {
      question: "Agora me passe seu WhatsApp com DDD.",
      type: "input",
      save: "phone",
    },
  ];

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function addMessage(text, role) {
    const bubble = document.createElement("div");
    bubble.className = `assistant-message ${role}`;
    bubble.innerHTML = text;
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
  }

  function renderChoices(options) {
    choices.innerHTML = "";
    options.forEach(function (option) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "assistant-choice";
      button.textContent = option;
      button.addEventListener("click", function () {
        handleAnswer(option);
      });
      choices.appendChild(button);
    });
  }

  function clearInputs() {
    choices.innerHTML = "";
    inputWrap.classList.add("d-none");
    input.value = "";
  }

  function askCurrentStep() {
    clearInputs();
    const current = steps[state.step];
    addMessage(current.question, "bot");

    if (current.type === "choices") {
      renderChoices(current.options);
    } else {
      inputWrap.classList.remove("d-none");
      input.focus();
    }
  }

  function buildWhatsAppMessage() {
    const message = [
      "Olá, vim pelo site da Harmonny e quero agendar avaliação.",
      `Nome: ${state.name}`,
      `WhatsApp: ${state.phone}`,
      `Procedimento: ${state.procedure}`,
      `Objetivo: ${state.goal}`,
      `Urgência: ${state.urgency}`,
    ].join("\n");

    return `https://wa.me/558398674169?text=${encodeURIComponent(message)}`;
  }

  function finishFlow() {
    clearInputs();
    addMessage(
      "Perfeito. Já organizei suas informações para a equipe. Agora é só enviar para a secretária continuar seu atendimento.",
      "bot"
    );
    whatsapp.href = buildWhatsAppMessage();
    whatsapp.classList.remove("d-none");
    restart.classList.remove("d-none");
  }

  function handleAnswer(answer) {
    const current = steps[state.step];
    state[current.save] = answer;
    addMessage(escapeHtml(answer), "user");
    state.step += 1;

    if (state.step < steps.length) {
      askCurrentStep();
    } else {
      finishFlow();
    }
  }

  function submitTextAnswer() {
    const value = input.value.trim();
    if (!value) {
      return;
    }
    handleAnswer(value);
  }

  function restartFlow() {
    state.step = 0;
    state.procedure = "";
    state.goal = "";
    state.urgency = "";
    state.name = "";
    state.phone = "";
    chat.innerHTML = "";
    whatsapp.classList.add("d-none");
    restart.classList.add("d-none");
    askCurrentStep();
  }

  document.getElementById("assistantModal")?.addEventListener("shown.bs.modal", function () {
    if (!chat.children.length) {
      restartFlow();
    }
  });

  send.addEventListener("click", submitTextAnswer);
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      submitTextAnswer();
    }
  });
  restart.addEventListener("click", restartFlow);
});
