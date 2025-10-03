document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  // Lire le thème stocké
  let theme = localStorage.getItem("theme") || "auto";
  applyTheme(theme);

  btn.addEventListener("click", () => {
    if (theme === "dark") theme = "light";
    else theme = "dark";
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  });

  function applyTheme(mode) {
    if (mode === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      btn.textContent = "🌙";
    } else if (mode === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      btn.textContent = "☀️";
    }
  }
});



const students = [
  {
    name: "Albert Einstein",
    photo: "img/einstein.png",
    role: "Physicien théoricien — Prix Nobel 1921 ",
    email: "albert.einstein@groscerveau.com",
    github: "https://github.com/albert-einstein",
    web: "https://fr.wikipedia.org/wiki/Albert_Einstein",
    tech: ["Physique quantique", "Relativité générale"],
    bio: "L’imagination est plus importante que le savoir."
  },
  {
    name: "Alice Liddell",
    photo: "img/alice.jpg",
    role: "Adaptation aux environnements étranges",
    email: "alice.liddell@jolienana.com",
    github: "https://github.com/alice-liddell",
    web: "https://fr.wikipedia.org/wiki/Alice_Liddell",
    tech: ["Rabbit Hole", "Wonderland", "Clock Searcher"],
    bio: "Curiouser and curiouser !"
  },
  {
    name: "Nigel Delajungle",
    photo: "img/nigel.png",
    role: "Explorateur, naturaliste et présentateur de documentaires animaliers",
    email: "nigel.delajungle@cocotier.com",
    github: "https://github.com/GitEnMain",
    web: "pages/raspberry/raspberry.html",
    tech: ["Multilingue animalier", "Écologie & biologie", "Docker"],
    bio: "Smashing !"
  },
  {
    name: "Mohamed mhbvl6",
    photo: "img/kidbuu.png",
    role: "Ingénieur en informatqiue",
    email: "cars60@gmail.com",
    github: "https://github.com/GitEnMain/CIEL2.git",
    web: "pages/resistance/resistance.html",
    tech: ["Automobile", "Porsche", "Boxe Anglaise"],
    bio: "gt3rs."
  },
  {
    name: "Gaëtan THE-AGAG",
    photo: "img/Java_Logo_Gaetan.png",
    role: "Développeur Java & Spigot",
    email: "the-agag@exemple.com",
    github: "https://github.com/THE-AGAG",
    web: "pages/Processeur/processeur.html",
    tech: ["Java", "Spigot", "Bukkit", "Maven", "Git"],
    bio: "Créateur de plugins / Mods Minecraft."
  },
  {
    name: "Cyril | B2spirit66",
    photo: "img/cropped-bonnibel 2.jpg",
    role: "Étudiant BTS CIEL",
    github: "https://github.com/B2spirit66",
    web: "pages/diode/index.html",
    tech: ["pentesting", "modder", "Docker"],
    bio: "want to do pentesting."
  },
  {
    name: "Anto",
    photo: "img/antonin-upjv_pic.PNG",
    role: "Étudiant BTS CIEL",
    email: "antonin.lespagnol@etud.u-picardie.fr",
    github: "https://github.com/antonin-upjv",
    web: "pages/Apple_M4_SoC/Apple_M4_index.html",
    tech: ["UX", "UI", "Pixelmator Pro"],
    bio: "Hobbyist UX/UI designer"
  },
  {
    name: "Mamadou Mams05",
    photo: "img/fcb.jpg",
    role: "Étudiant BTS CIEL",
    email: "mthiam@eduhdf.fr",
    github: "https://github.com/mams05",
    web: "pages/condensateur/condensateur.html",
    tech: ["sport", "manga", "serie"],
    bio: "Visca Barca"
  },
  {
    name: "Artur Tutur9",
    photo: "img/logopdp.png",
    role: "Étudiant BTS CIEL",
    email: "acatteau2@eduhdf.fr",
    github: "https://github.com/Tutur9",
	  web: "pages/DS1307/DS1307.html",
    tech: ["Recherche", "d'", "Argent"],
    bio: "Recherche d'argent."
  },
  {
    name: "Krys Orzo12",
    photo: "img/Dragon Ball Z.png",
    role: "Étudiant BTS CIEL",
    email: "",
    github: "https://github.com/orzo12",
	  web: "pages/Buzzer/buzzer.html",
    tech: "",
    bio: "j'aime DBZ"
  },
  {
    name: "Bryan RaizoFR",
    photo: "img/minecraft-zombie-w1LVvw1-600.jpg",
    role: "Étudiant BTS CIEL",
    email: "bryancramer51@gmail.com",
    github: "https://github.com/raizoFR",
    tech: ["DBZ", "dormir", "manger"],
    bio: "Veut bosser en devops.",
	  web: "pages/capteur_de_distance/capteur.html",
  },
  {
    name: "Valentin Valentin760",
    photo: "img/Paris_Saint-Germain_Logo.svg.png",
    role: "Étudiant BTS CIEL",
    email: "valentin.banquet@sfr.fr",
    github: "https://github.com/Valentin760",
    web: "pages/Hacheur/hacheur_electronique.html",
    tech: [""],
    bio: ""
  },
  {
    name: "Adrien (aAdri1)",
    photo: "img/Shrek.jpg",
    role: "Étudiant BTS CIEL",
    email: "a.pottier2006@gmail.com",
    github: "https://github.com/aAdri1",
    tech: ["Python", "HTML", "Docker"],
    bio: "Veut bosser en devops.",
    web: "pages/Potentiometre/potentiomettre.html",
  },
  {
    name: "Lucas zwakss1",
    photo: "img/fish.jpg",
    role: "Étudiant BTS CIEL",
    email: "",
    github: "https://github.com/zwakss1",
    web:"pages/transistor/transistor.html",
    tech: ["Python", "HTML", "Docker"],
    bio: "Master sur pokemon Unite."
  },
];


const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const sanitize = (s='') => String(s).replace(/[<>]/g, ch => ({'<':'&lt;','>':'&gt;'}[ch]));

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).slice(0,2);
  return parts.map(p => p[0] ? p[0].toUpperCase() : '').join('');
}

function colorFrom(name) {
 
  let h=0; for (let i=0;i<name.length;i++) h = (h*31 + name.charCodeAt(i))>>>0;
  const hue = h % 360;
  return `linear-gradient(135deg, hsl(${hue} 90% 55%), hsl(${(hue+60)%360} 90% 55%))`;
}

function cardTemplate(p){
  const name = sanitize(p.name || 'Inconnu');
  const role = sanitize(p.role || 'Étudiant(e) BTS CIEL');
  const tech = (p.tech||[]).slice(0,5).map(t=>`<span class="tag">${sanitize(t)}</span>`).join('');

  const img = p.photo ? `<img src="${sanitize(p.photo)}" alt="Photo de ${name}" onerror="this.remove();this.closest('.avatar').dataset.fallback='1'">` : '';
  const email = p.email ? `<a class="btn" href="mailto:${sanitize(p.email)}" title="Envoyer un email">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 6h18v12H3z" stroke="currentColor" stroke-width="2"/>
      <path d="M3 7l9 6 9-6" stroke="currentColor" stroke-width="2"/>
    </svg> Email</a>` : '';
  const gh = p.github ? `<a class="btn" target="_blank" rel="noopener" href="${sanitize(p.github)}" title="Profil GitHub">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a12 12 0 00-3.79 23.39c.6.11.82-.26.82-.58l-.02-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.35-1.76-1.35-1.76-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.26 1.86 1.26 1.08 1.85 2.83 1.31 3.52 1 .11-.79.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.23a11.46 11.46 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.64.25 2.86.12 3.16.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.47 5.93.43.37.82 1.11.82 2.24l-.01 3.32c0 .32.21.7.82.58A12 12 0 0012 .5z"/>
    </svg> GitHub</a>` : '';
  const web = p.web ? `<a class="btn" href="${sanitize(p.web)}" title="Page Web">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
      <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" stroke="currentColor" stroke-width="2"/>
    </svg> Web</a>` : '';
  

  return `
    <article class="card" tabindex="0">
      <div class="card-head">
        <div class="avatar" style="background:${colorFrom(name)}" data-name="${name}">${img || `<span>${initials(name)}</span>`}</div>
        <div>
          <h3>${name}</h3>
          <div class="role">${role}</div>
        </div>
      </div>
      <div class="tags">${tech || ''}</div>
      <div class="bio">${sanitize(p.bio || '')}</div>

      <div class="card-footer">
        <div class="btn-row space-between">${email} ${gh}</div>
        <div class="btn-row center">${web}</div>
      </div>
    </article>`;
}

function render(list){
  const el = document.getElementById('list');
  el.innerHTML = list.map(cardTemplate).join('');
  document.getElementById('empty').hidden = list.length !== 0;
}

function filter(q){
  const s = q.trim().toLowerCase();
  if(!s) return students;
  return students.filter(p => {
    const hay = [p.name, p.role, p.bio, ...(p.tech||[])].join(' ').toLowerCase();
    return hay.includes(s);
  });
}


window.addEventListener('keydown', (e)=>{
  if(e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)){
    e.preventDefault(); document.getElementById('q').focus();
  }
});

document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('q').addEventListener('input', (e)=> render(filter(e.target.value)));
  render(students);
});


document.addEventListener('error', (e)=>{
  const img = e.target;
  if(img.tagName === 'IMG'){
    const wrap = img.closest('.avatar');
    if(wrap){
      const name = wrap.dataset.name || '';
      wrap.innerHTML = `<span>${initials(name)}</span>`;
      wrap.style.background = colorFrom(name);
    }
  }
}, true);

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  // Lire le thème stocké
  let theme = localStorage.getItem("theme") || "auto";
  applyTheme(theme);

  btn.addEventListener("click", () => {
    if (theme === "dark") theme = "light";
    else theme = "dark";
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  });

  function applyTheme(mode) {
    if (mode === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      btn.textContent = "🌙";
    } else if (mode === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      btn.textContent = "☀️";
    }
  }
});
