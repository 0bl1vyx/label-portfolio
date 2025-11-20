document.addEventListener('DOMContentLoaded', () => {
    
    const username = '0bl1vyx'; 
    const repoName = 'label-portfolio';
    const branch = 'main';
    
    // === 1. CLIENT REVIEWS (Expanded, more natural-sounding) ===
    const reviewsTrack = document.getElementById('reviews-track');
    
    const reviewsData = [
        { name: "Olivia — BrightBox Co.", stars: 5, text: "Priyo delivered exactly what I briefed: clean dielines, accurate bleed, and a label that photographed perfectly for our Amazon listing." },
        { name: "Marcus — PureForm Supplements", stars: 5, text: "Highly professional. The nutrition panel was formatted to our spec and accepted by the contract manufacturer without changes." },
        { name: "Tara — Little Pantry", stars: 5, text: "Fast turnaround and great communication. The sticker die-cut was perfect for our jar lids — no trimming issues at print." },
        { name: "Hitesh — Urban Apothecary", stars: 4, text: "Designs are strong and production-ready. One revision round took longer than expected, but the finish options guide was very helpful." },
        { name: "EliteSupps", stars: 5, text: "Shelf presence improved immediately after relaunch. The foil setup and spot varnish notes saved our printer a lot of time." },
        { name: "David Chen", stars: 5, text: "Attention to regulatory details stands out — we felt confident sending files to multiple manufacturers." }, 
        { name: "VapeNation (EU line)", stars: 5, text: "Excellent EU-compliant layout and clear warnings formatting. Saved us from a reprint." },
        { name: "Samantha R. — Herb & Co", stars: 5, text: "Clear hierarchy and legible typography even at small sizes. Our label looks premium in-store." },
        { name: "Connor — FreshBrew", stars: 4, text: "Very good work overall. I asked for extra color variations late in the process — that added a little time, but the result was worth it." },
        { name: "Ava — KidsSnacks", stars: 5, text: "Friendly, quick, and extremely detail-focused. The dieline matched our pouch template perfectly." },
        { name: "J. Morales — Indie Skincare", stars: 5, text: "Provided editable sources and a short prepress checklist — the printer thanked us. Clarified finishing options clearly." },
        { name: "Blue Ridge Foods", stars: 5, text: "Converted our RGB mockups to spot-accurate CMYK files and included barcode placement guidance. No surprises at print." },
        { name: "Nico — LaunchPad (Kickstarter)", stars: 5, text: "Helped polish our campaign mockups and provided high-res renders used in the campaign video. Backers loved the premium look." },
        { name: "Local Deli", stars: 5, text: "Quick, reliable, and easy to work with. He understood our small-batch production needs and supplied the exact dieline specs." },
        { name: "Harper — Beverage Co.", stars: 5, text: "Excellent at translating brand tone into a label that works on shelf and in product photos. Print files were flawless." },
        { name: "Ravi — BarcodeWorks", stars: 4, text: "Solid design and technical knowledge. I requested additional file types (EPS) after delivery — happy to pay for the extras." }
    ];

    // Render Marquee
    const fullList = [...reviewsData, ...reviewsData]; 
    
    reviewsTrack.innerHTML = fullList.map(r => {
        let starsHtml = '';
        for(let i=0; i<5; i++) {
            if(i < r.stars) starsHtml += '<i class="fa-solid fa-star text-yellow-500"></i>';
            else starsHtml += '<i class="fa-solid fa-star text-gray-700"></i>';
        }
        return `
            <div class="w-[300px] bg-[#141414] border border-white/10 p-6 rounded-xl flex-shrink-0">
                <div class="flex gap-1 text-xs mb-3">${starsHtml}</div>
                <p class="text-gray-300 text-sm mb-4 leading-relaxed">"${r.text}"</p>
                <div class="flex items-center gap-3 border-t border-white/5 pt-3">
                    <div class="w-8 h-8 rounded-full bg-brand/20 text-brand flex items-center justify-center font-bold text-xs">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <div class="text-xs font-bold text-white">${r.name}</div>
                </div>
            </div>
        `;
    }).join('');

    // === 2. GITHUB LOADER ===
    const container = document.getElementById('project-container');

    async function loadProjects() {
        const apiUrl = `https://api.github.com/repos/${username}/${repoName}/contents/projects?ref=${branch}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('GitHub API Limit or Error');
            const files = await response.json();

            container.innerHTML = '';
            const imageFiles = files.filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i));

            if (imageFiles.length === 0) {
                container.innerHTML = '<div class="text-gray-500">No projects found in /projects folder.</div>';
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
                    } catch (e) { console.log("No text file"); }
                }

                const card = document.createElement('div');
                card.className = 'masonry-item group relative rounded-xl overflow-hidden bg-card border border-white/10 cursor-pointer reveal';
                card.innerHTML = `
                    <div class="relative overflow-hidden">
                        <img src="${imgFile.download_url}" alt="${title}" class="w-full h-auto block transition duration-700 group-hover:scale-105">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                            <div>
                                <span class="text-brand text-[10px] font-bold uppercase tracking-widest">Packaging</span>
                                <h3 class="text-white font-bold text-lg capitalize">${title}</h3>
                            </div>
                        </div>
                    </div>
                `;
                card.addEventListener('click', () => openModal(imgFile.download_url, title, desc));
                container.appendChild(card);
            }
            initScrollReveal();
        } catch (error) {
            console.error(error);
            container.innerHTML = '<div class="p-4 text-red-400 border border-red-900 bg-red-900/10 rounded">Error loading Github data.</div>';
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

    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
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
});
