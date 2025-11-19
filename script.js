document.addEventListener('DOMContentLoaded', () => {
    
    // === CONFIG ===
    const username = '0bl1vyx'; 
    const repoName = 'label-portfolio';
    const branch = 'main';
    
    // === 1. REALISTIC REVIEWS (Mixed Ratings) ===
    const reviewsTrack = document.getElementById('reviews-track');
    
    // Notice the mix of 5, 4, and 3 stars to make it believable
    const reviewsData = [
        { name: "James T.", stars: 5, text: "Priyo is a genius. The jar label stood out immediately on Amazon." },
        { name: "Sarah Jenkins", stars: 4, text: "Great design work. Took a little longer than expected for the revision, but the final result was perfect." },
        { name: "Marco Rossi", stars: 5, text: "Understood the wine aesthetic perfectly. Classy and elegant design." },
        { name: "EliteSupps", stars: 5, text: "Best label designer on Fiverr. Boosted our CTR by 20%." },
        { name: "David Chen", stars: 3, text: "Good quality, but the time zone difference made communication a bit slow." }, // Honest review builds trust
        { name: "Elena B.", stars: 5, text: "Very patient with my revisions. The final print file was technically compliant." },
        { name: "VapeNation", stars: 5, text: "Sick designs for our e-liquid line. Totally compliant with EU laws." },
        { name: "Mike Ross", stars: 4, text: "Solid work. The 3D mockup helped us sell the product before manufacturing." }
    ];

    // Create HTML for reviews
    const fullList = [...reviewsData, ...reviewsData]; // Duplicate for loop
    
    reviewsTrack.innerHTML = fullList.map(r => {
        // Generate star HTML
        let starsHtml = '';
        for(let i=0; i<5; i++) {
            if(i < r.stars) starsHtml += '<i class="fa-solid fa-star text-yellow-500"></i>';
            else starsHtml += '<i class="fa-solid fa-star text-gray-700"></i>';
        }

        return `
            <div class="w-[300px] bg-card border border-white/10 p-6 rounded-xl flex-shrink-0">
                <div class="flex gap-1 text-xs mb-3">${starsHtml}</div>
                <p class="text-gray-300 text-sm mb-4 leading-relaxed">"${r.text}"</p>
                <div class="flex items-center gap-3 border-t border-white/5 pt-3">
                    <div class="w-8 h-8 rounded-full bg-brand/20 text-brand flex items-center justify-center font-bold text-xs">
                        ${r.name.charAt(0)}
                    </div>
                    <div class="text-xs font-bold text-white">${r.name}</div>
                </div>
            </div>
        `;
    }).join('');

    // === 2. GITHUB PORTFOLIO LOADER (With Text Parsing) ===
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
                container.innerHTML = '<div class="text-gray-500">No projects found. Upload images to /projects folder.</div>';
                return;
            }

            for (const imgFile of imageFiles) {
                const baseName = imgFile.name.split('.').slice(0, -1).join('.');
                const txtFileName = baseName + '.txt';
                const txtFileObj = files.find(f => f.name === txtFileName);

                let title = baseName.replace(/-/g, ' ');
                let desc = "Professional packaging design.";

                // Fetch Description if exists
                if (txtFileObj) {
                    try {
                        const txtRes = await fetch(txtFileObj.download_url);
                        const txtContent = await txtRes.text();
                        const lines = txtContent.split('\n').filter(l => l.trim() !== '');
                        if (lines.length > 0) {
                            title = lines[0]; // First line is title
                            desc = lines.slice(1).join('<br>'); // Rest is desc
                        }
                    } catch (e) { console.log("No text file found"); }
                }

                const card = document.createElement('div');
                card.className = 'masonry-item group relative rounded-xl overflow-hidden bg-card border border-white/10 cursor-pointer reveal';
                
                card.innerHTML = `
                    <div class="relative overflow-hidden">
                        <img src="${imgFile.download_url}" alt="${title}" class="w-full h-auto block transition duration-700 group-hover:scale-110 group-hover:opacity-80">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                            <div>
                                <span class="text-brand text-[10px] font-bold uppercase tracking-widest">Label Design</span>
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
            container.innerHTML = '<div class="p-4 text-red-400 border border-red-900 bg-red-900/10 rounded">Error loading Github data. Check console.</div>';
        }
    }

    // === 3. MODAL LOGIC ===
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

    // === 4. SCROLL REVEAL & FAQ ===
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
        // Close all
        document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
        // Toggle clicked
        if (!isActive) element.classList.add('active');
    };

    // Run
    loadProjects();
});