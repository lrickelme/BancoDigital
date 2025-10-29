"use strict";

const LOGIN_URL = "http://localhost:3001/auth/login";

const TIMEOUT_MS = 10000;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const submitBtn = document.getElementById("submit-btn");
  const msgEl = document.getElementById("form-msg");
  const demoBtn = document.getElementById("demo-btn");

  demoBtn.addEventListener("click", () => {
    document.getElementById("username").value = "demo@exemplo.com";
    document.getElementById("password").value = "demopassword";
    document.getElementById("bank").value = "caixa";
    msg("", "");
  });

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    msg("", "");

    const username = form.username.value.trim();
    const password = form.password.value;
    const bank = form.bank.value;

    if (!username || !password) {
      msg("Preencha usuário e senha.", "error");
      return;
    }

    if (!bank) {
      msg("Selecione um banco.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Entrando...";

    try {
      const result = await login({ username, password, bank });

      if (result?.token) {
        msg("Login efetuado com sucesso.", "success");
        localStorage.setItem("auth_token", result.token);
        window.location.href = "welcome.html";
      } else if (result?.error) {
        msg(result.error, "error");
      } else {
        msg("Resposta inesperada do servidor.", "error");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      msg(err?.message || "Erro de rede ao tentar logar.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Entrar";
    }
  });

  function msg(text = "", type = "") {
    msgEl.textContent = text;
    msgEl.className = type ? `msg ${type}` : "msg";
  }
});

async function login(credentials) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const resp = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      signal: controller.signal,
    });

    clearTimeout(id);

    if (resp.status === 204) return null;

    if (!resp.ok) {
      let errText = `Erro ${resp.status}`;

      try {
        const errJson = await resp.clone().json();
        errText = errJson.error || JSON.stringify(errJson);
      } catch {
        const text = await resp.clone().text();
        if (text) errText = text;
      }

      const error = new Error(errText);
      error.status = resp.status;
      throw error;
    }

    return await resp.json();
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("A requisição excedeu o tempo limite.");
    }
    throw err;
  }
}
