// Espera o DOM carregar totalmente
document.addEventListener("DOMContentLoaded", () => {

    // 1. Inicialização do Fundo VANTA.JS (Efeito NET geométrico neon)
    // Documentação: https://www.vantajs.com/?effect=net
    VANTA.NET({
        el: "#vanta-bg", // ID do elemento container
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        // Cores configuradas para o tema Dark Neon Laranja
        color: 0xff4500, // Cor das linhas e pontos (Laranja Primary)
        backgroundColor: 0x050509, // Cor do fundo (Bg Dark)
        points: 10.00, // Quantidade de pontos
        maxDistance: 20.00, // Distância de conexão
        spacing: 16.00 // Espaçamento
    })

    // 2. Lógica do Cursor Personalizado
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-dot-outline');
    
    // Posições reais do mouse
    let mouseX = 0;
    let mouseY = 0;
    
    // Posições suavizadas (para o outline)
    let exX = 0;
    let exY = 0;

    // Mostra o cursor quando o mouse se move pela primeira vez
    let cursorVisible = false;

    window.addEventListener('mousemove', (e) => {
        if(!cursorVisible) {
            dot.style.opacity = 1;
            outline.style.opacity = 1;
            cursorVisible = true;
        }
        
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // O ponto central segue instantaneamente
        dot.style.top = mouseY + 'px';
        dot.style.left = mouseX + 'px';
    });

    // Função de animação para o "outline" seguir com atraso (suavização)
    function animateOutline() {
        // Cálculo de interpolação (suavização)
        // A cada frame, movemos 15% da distância restante
        exX += (mouseX - exX) * 0.15;
        exY += (mouseY - exY) * 0.15;
        
        outline.style.top = exY + 'px';
        outline.style.left = exX + 'px';
        
        requestAnimationFrame(animateOutline);
    }
    animateOutline(); // Inicia o loop de animação

    // Efeito de Hover em links e botões
    const hoverables = document.querySelectorAll('a, button, .btn-neon, .logo');
    hoverables.forEach(el => {
        el.addEventListener('mouseover', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseout', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

    // Esconde o cursor se sair da janela
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = 0;
        outline.style.opacity = 0;
        cursorVisible = false;
    });


   // 3. Efeito Matrix/Cyberpunk de Frases Rotativas (Efeito Scramble)
    const scrambleElement = document.getElementById("scramble-text");
    
    // Suas frases personalizadas sobre você:
    const phrases = [
        "Graduated in Computer Science from Cesar School",
        "Desenvolvedor focado em Performance e UI/UX",
        "Criando interfaces modernas e interativas",
        "Entusiasta de Cybersegurança e Web Avançada"
    ];

    class TextScrambler {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 30);
                const end = start + Math.floor(Math.random() * 30);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scrambled">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Inicializa a rotação de frases se o elemento existir
    if (scrambleElement) {
        const scrambler = new TextScrambler(scrambleElement);
        let phraseIndex = 0;

        const nextPhrase = () => {
            // Avança para a próxima frase do array de forma infinita
            phraseIndex = (phraseIndex + 1) % phrases.length;
            scrambler.setText(phrases[phraseIndex]).then(() => {
                // Tempo que a frase fica estática na tela antes de mudar de novo (3 segundos)
                setTimeout(nextPhrase, 3000); 
            });
        };

        // Começa o ciclo depois de 4 segundos (tempo do usuário ler a primeira frase)
        setTimeout(nextPhrase, 4000);
    }

    // Inicializa a digitação com um pequeno delay para o fundo carregar
    setTimeout(typeEffect, 1000);

});