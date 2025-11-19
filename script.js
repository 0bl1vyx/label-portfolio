document.addEventListener('DOMContentLoaded', () => {
    
    const username = '0bl1vyx'; 
    const repoName = 'label-portfolio';
    const branch = 'main';
    
    // === 1. CLIENT REVIEWS (Updated with your specific texts) ===
    const reviewsTrack = document.getElementById('reviews-track');
    
    const reviewsData = [
        { name: "Amazon Seller", stars: 5, text: "Exactly what I needed. Clean, modern, and 100% print-ready. My manufacturer approved it instantly." },
        { name: "Supplement Brand", stars: 5, text: "Best label designer I’ve worked with. He understands compliance better than most agencies." },
        { name: "Food Startup", stars: 5, text: "Professional, fast, and detail-oriented. Saved me days of back-and-forth with my print shop." },
        { name: "Sarah Jenkins", stars: 4, text: "Great design work. Took a little longer than expected for the revision, but the final result was perfect." },
        { name: "EliteSupps", stars: 5, text: "Boosted our shelf presence immediately. The metallic foil setup was perfect." },
        { name: "David Chen", stars: 5, text: "I appreciate the focus on FDA guidelines. It gives me peace of mind." }, 
        { name: "VapeNation", stars: 5, text: "Sick designs for our e-liquid line. Totally compliant with EU laws." }
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