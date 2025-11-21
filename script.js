document.addEventListener('DOMContentLoaded', () => {
    
    const username = '0bl1vyx'; 
    const repoName = 'label-portfolio';
    const branch = 'main';
    
    // === 1. CLIENT REVIEWS (Updated List) ===
    const reviewsTrack = document.getElementById('reviews-track');
    
    const reviewsData = [
        { name: "Mike T. (Supplements)", stars: 5, text: "Priyo knows his stuff. The nutrition facts were formatted exactly to our spec and the metallic print file came back flawless." },
        { name: "Sarah J. (Skincare)", stars: 5, text: "I was worried about legibility on our 1 oz bottles — he nailed the hierarchy. The product looks premium on shelf." },
        { name: "GreenLeaf Organics", stars: 5, text: "Fast turnaround and zero print issues. The dieline matched our manufacturer's template perfectly." },
        { name: "VapeCo Europe", stars: 5, text: "Great understanding of EU warning requirements. Saved us a huge compliance headache." },
        { name: "Coffee Roasters Inc.", stars: 5, text: "Bag label pops and the PSD master file made it easy for us to tweak copy later." },
        { name: "Hitesh P.", stars: 5, text: "Professional quality — the 3D mockup helped us secure retail placement before printing." },
        { name: "Amanda B. (Candles)", stars: 5, text: "Beautiful typography and the foil stamping layer was exactly what we asked for." },
        { name: "FitLife", stars: 4, text: "Clean ingredients panel for a complicated formula. Minor tweaks after first round, but final result was solid." },
        { name: "TechAccessories", stars: 5, text: "Custom die-cut sticker cut perfectly — vector paths were delivered clean and ready." },
        { name: "David R.", stars: 5, text: "Excellent communication. He asked about paper and finish up-front which saved time later." },
        { name: "Nina L. (Beauty)", stars: 5, text: "Turned our vague brief into a luxe label — sales improved after the relaunch." },
        { name: "Organic Pantry", stars: 5, text: "Provided print-ready PDFs and a PSD master. Our printer ran it with no corrections." },
        { name: "Bold Brew", stars: 4, text: "Great design sense and speed. We requested an extra color option which was handled quickly." },
        { name: "KleanSkin Labs", stars: 5, text: "Regulatory layout was crisp and readable — compliance team approved on first review." }
    ];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const shuffledReviews = shuffleArray([...reviewsData]);
    const fullList = [...shuffledReviews, ...shuffledReviews]; // Duplicate for infinite scroll
    
    if (reviewsTrack) {
        reviewsTrack.innerHTML = fullList.map(r => {
            let starsHtml = '';
            for(let i=0; i<5; i++) {
                // Gold stars for < 5, Gray for empty if any
                starsHtml += `<i class="fa-solid fa-star ${i < r.stars ? 'text-yellow-400' : 'text-gray-700'} text-xs"></i>`;
            }
            
            // Added 'flex-shrink-0' and fixed width to prevent breaking
            return `
                <div class="w-[320px] md:w-[360px] bg-[#141414] border border-white/10 p-6 rounded-xl flex-shrink-0 hover:border-brand/30 transition duration-300 group select-none flex flex-col justify-between h-full">
                    
                    <div class="flex items-center justify-between mb-6">
                         <div class="flex gap-1">${starsHtml}</div>
                         <div class="text-[10px] font-bold text-[#a78bfa] bg-[#a78bfa]/10 px-2 py-1 rounded tracking-wider">VERIFIED</div>
                    </div>

                    <p class="text-gray-300 text-sm mb-8 leading-relaxed italic">"${r.text}"</p>
                    
                    <div class="flex items-center gap-3 border-t border-white/5 pt-4 mt-auto">
                        <div class="w-10 h-10 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-brand/20">
                            ${r.name.charAt(0)}
                        </div>
                        <div>
                            <div class="text-sm font-bold text-white">${r.name}</div>
                            <div class="text-[10px] text-gray-500">Label Design Client</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // === 2. GITHUB LOADER (Standard) ===
    const container = document.getElementById('project-container');

    async function loadProjects() {
        const apiUrl = `https://api.github.com/repos/${username}/${repoName}/contents/projects?ref=${branch}`;

        try {
            container.innerHTML = '<div class="col-span-full text-center py-20 text-gray-500 animate-pulse">Loading gallery...</div>';
            
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('GitHub API Limit');
            const files = await response.json();

            container.innerHTML = '';
            const imageFiles = files.filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i));

            if (imageFiles.length === 0) {
                container.innerHTML = '<div class="col-span-full text-center text-gray-500">Gallery updating.</div>';
                return;
            }

            for (const imgFile of imageFiles) {
                const baseName = imgFile.name.split('.').slice(0, -1).join('.');
                const txtFileName = baseName + '.txt';
                const txtFileObj = files.find(f => f.name === txtFileName);

                let title = baseName.replace(/-/g, ' ');
                let desc = "Premium Packaging Design.";

                if (txtFileObj) {
                    try {
                        const txtRes = await fetch(txtFileObj.download_url);
                        const txtContent = await txtRes.text();
                        const lines = txtContent.split('\n').filter(l => l.trim() !== '');
                        if (lines.length > 0) {
                            title = lines[0]; 
                            desc = lines.slice(1).join('<br>'); 
                        }
                    } catch (e) {}
                }

                const card = document.createElement('div');
                card.className = 'masonry-item group relative rounded-xl overflow-hidden bg-card border border-white/10 cursor-pointer reveal';
                card.innerHTML = `
                    <div class="relative overflow-hidden w-full bg-[#1a1a1a]">
                        <img src="${imgFile.download_url}" loading="lazy" alt="${title}" class="w-full h-auto block transition duration-700 group-hover:scale-105 group-hover:opacity-90">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                            <div class="transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                                <span class="text-brand text-[10px] font-bold uppercase tracking-widest mb-1 block">View Project</span>
                                <h3 class="text-white font-bold text-lg capitalize leading-tight">${title}</h3>
                            </div>
                        </div>
                    </div>
                `;
                card.addEventListener('click', () => openModal(imgFile.download_url, title, desc));
                container.appendChild(card);
            }
            setTimeout(initScrollReveal, 100);
        } catch (error) {
            container.innerHTML = `<div class="col-span-full text-center py-10 text-gray-500">Portfolio loading... <a href="https://www.fiverr.com/s/o8mxwNb" class="text-brand underline">Visit Fiverr</a></div>`;
        }
    }

    // === 3. UTILS ===
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');

    window.openModal = (src, title, desc) => {
        modalImg.src = src;
        modalTitle.innerText = title;
        modalDesc.innerHTML = desc;
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = () => {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modalImg.src = '';
        }, 300);
        document.body.style.overflow = 'auto';
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
    });

    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    window.toggleFaq = (element) => {
        const isActive = element.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
        if (!isActive) element.classList.add('active');
    };

    loadProjects();
    initScrollReveal();
});
