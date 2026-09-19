(function () {
  // Troque pelo número fixo do WhatsApp da marmitaria (código do país + DDD, só números)
  const NUMERO_WHATSAPP = "5585985379717";

  const form = document.getElementById('orderForm');
  const confirmBox = document.getElementById('confirmBox');

  const nome = document.getElementById('nome');
  const telefone = document.getElementById('telefone');
  const email = document.getElementById('email');
  const endereco = document.getElementById('endereco');
  const data = document.getElementById('data');

  const erroNome = document.getElementById('erro-nome');
  const erroTelefone = document.getElementById('erro-telefone');
  const erroEmail = document.getElementById('erro-email');
  const erroEndereco = document.getElementById('erro-endereco');
  const erroData = document.getElementById('erro-data');
  const erroProteina = document.getElementById('erro-proteina');

  // Máscara simples de telefone brasileiro
  telefone.addEventListener('input', function () {
    let v = telefone.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) {
      v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    } else if (v.length > 5) {
      v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (v.length > 2) {
      v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    } else if (v.length > 0) {
      v = v.replace(/(\d{0,2})/, '($1');
    }
    telefone.value = v.trim().replace(/-$/, '');
  });

  function validaNome() {
    const ok = nome.value.trim().length >= 3;
    nome.setAttribute('aria-invalid', String(!ok));
    erroNome.classList.toggle('show', !ok);
    return ok;
  }

  function validaTelefone() {
    const digits = telefone.value.replace(/\D/g, '');
    const ok = digits.length === 10 || digits.length === 11;
    telefone.setAttribute('aria-invalid', String(!ok));
    erroTelefone.classList.toggle('show', !ok);
    return ok;
  }

  function validaData() {
    const ok = !isNaN(Date.parse(data.value));
    data.setAttribute('aria-invalid', String(!ok));
    erroData.classList.toggle('show', !ok);
    return ok;
  }

  function validaEmail() {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    email.setAttribute('aria-invalid', String(!ok));
    erroEmail.classList.toggle('show', !ok);
    return ok;
  }

  function validaEndereco() {
    const ok = endereco.value.trim().length >= 5;
    endereco.setAttribute('aria-invalid', String(!ok));
    erroEndereco.classList.toggle('show', !ok);
    return ok;
  }

  function validaProteina() {
    const ok = !!form.querySelector('input[name="proteina"]:checked');
    erroProteina.classList.toggle('show', !ok);
    return ok;
  }

  nome.addEventListener('blur', validaNome);
  telefone.addEventListener('blur', validaTelefone);
  email.addEventListener('blur', validaEmail);
  endereco.addEventListener('blur', validaEndereco);
  data.addEventListener('blur', validaData);
  form.querySelectorAll('input[name="proteina"]').forEach(function (radio) {
    radio.addEventListener('change', validaProteina);
  });

  function montaMensagemWhatsapp() {
    const proteina = form.querySelector('input[name="proteina"]:checked').value;
    const acompanhamentos = Array.from(
      form.querySelectorAll('input[name="acompanhamento"]:checked')
    ).map(function (el) { return el.value; });

    const linhas = [
      "Novo pedido!",
      "Nome: " + nome.value.trim(),
      "Telefone: " + telefone.value.trim(),
      "E-mail: " + email.value.trim(),
      "Endereço: " + endereco.value.trim(),
      "Data: " + data.value.trim(),
      "Proteína: " + proteina,
      "Acompanha: " + (acompanhamentos.length ? acompanhamentos.join(", ") : "nenhum")
    ];

    return linhas.join("\n");
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const okProteina = validaProteina();
    const okNome = validaNome();
    const okTelefone = validaTelefone();
    const okEmail = validaEmail();
    const okEndereco = validaEndereco();
    const okData = validaData();

    if (!(okProteina && okNome && okTelefone && okEmail && okEndereco && okData)) {
      const primeiroErro = form.querySelector('[aria-invalid="true"]') ||
        (!okProteina ? form.querySelector('input[name="proteina"]') : null);
      if (primeiroErro) primeiroErro.focus();
      return;
    }

    document.getElementById('resumoNome').textContent = nome.value.trim();
    document.getElementById('resumoTelefone').textContent = telefone.value.trim();
    document.getElementById('resumoEmail').textContent = email.value.trim();
    document.getElementById('resumoEndereco').textContent = endereco.value.trim();

    form.classList.add('hide');
    confirmBox.classList.add('show');

    const mensagem = montaMensagemWhatsapp();
    const link = "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(mensagem);
    window.open(link, "_blank");
  });

  document.getElementById('novoPedido').addEventListener('click', function () {
    form.reset();
    [nome, telefone, email, endereco, data].forEach(function (el) {
      el.removeAttribute('aria-invalid');
    });
    [erroNome, erroTelefone, erroEmail, erroEndereco, erroData, erroProteina].forEach(function (el) {
      el.classList.remove('show');
    });
    confirmBox.classList.remove('show');
    form.classList.remove('hide');
    nome.focus();
  });
})();
