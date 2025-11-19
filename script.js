document.addEventListener('DOMContentLoaded', () => {
    
    // ================= CONFIG =================
    const username = '0bl1vyx'; 
    const repoName = 'label-portfolio';
    const branch = 'main';
    // ==========================================

    // --- 1. INFINITE REVIEWS SYSTEM ---
    const reviewsTrack = document.getElementById('reviews-track');
    
    // 20 Unique Reviews
    const reviewsData = [
        { name: "James T.", country: "USA", text: "Priyo is a genius. The jar label stood out immediately on Amazon.", stars: 5 },
        { name: "Sarah Jenkins", country: "UK", text: "Fast, professional, and the 3D mockup was incredibly realistic.", stars: 4 },
        { name: "Marco Rossi", country: "Italy", text: "Understood the wine aesthetic perfectly. Classy and elegant design.", stars: 5 },
        { name: "EliteSupps", country: "Australia", text: "Best label designer on Fiverr. Boosted our CTR by 20%.", stars: 3 },
        { name: "Elena B.", country: "Germany", text: "Very patient with my revisions. The final print file was perfect.", stars: 5 },
        { name: "David Chen", country: "Canada", text: "Clean, modern, and compliant with FDA regulations. Highly recommend.", stars: 5 },
        { name: "Sophie M.", country: "France", text: "J'adore! The cosmetic packaging looks so expensive now.", stars: 5 },
        { name: "Mike Ross", country: "USA", text: "Delivered 2 days early. The source files were organized and easy to use.", stars: 5 },
        { name: "OrganicRoots", country: "USA", text: "Captured our eco-friendly vibe perfectly. Will order again.", stars: 4 },
        { name: "Lars Jensen", country: "Denmark", text: "Minimalist design at its finest. Priyo knows visual hierarchy.", stars: 5 },
        { name: "Kenta Y.", country: "Japan", text: "Very professional communication. High quality work.", stars: 5 },
        { name: "BeardCo", country: "UK", text: "Made our beard oil bottles look masculine and premium. Thanks!", stars: 5 },
        { name: "Maria G.", country: "Spain", text: "Beautiful use of colors. The gradient work is stunning.", stars: 5 },
        { name: "Tom Baker", country: "USA", text: "Straightforward process. No headaches. Great result.", stars: 5 },
        { name: "VapeNation", country: "USA", text: "Sick designs for our e-liquid line. Totally compliant too.", stars: 4 },
        { name: "Anna S.", country: "Sweden", text: "Elegant typography. He has a great eye for fonts.", stars: 5 },
        { name: "CoffeeBros", country: "Brazil", text: "The coffee bag design helps us sell more beans. Amazing ROI.", stars: 5 },
        { name: "PetTreats", country: "USA", text: "Cute and professional. Exactly what we needed for our dog treats.", stars: 5 },
        { name: "FitLife", country: "UK", text: "The protein powder label looks better than the big brands.", stars: 3 },
        { name: "Lucas P.", country: "Argentina", text: "Great value for money. High-end agency quality.", stars: 5 }
    ];

    function renderReviews() {
        // We render the list TWICE to create the infinite seamless loop
        // The CSS translates -50%, so it scrolls through exactly one full set
        const fullList = [...reviewsData, ...reviewsData]; 
        
        reviewsTrack.innerHTML = fullList.map((review, index) => `
            <div class="review-card">
                <div class="flex gap-1 text-yellow-400 text-xs mb-3">
                    <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                </div>
                <p class="text-gray-300 text-sm mb-4 leading-relaxed">"${review.text}"</p>
                <div class="flex items-center gap-3 border-t border-white/5 pt-3">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold text-white border border-white/10">
                        ${review.name.charAt(0)}
                    </div>
                    <div>
                        <div class="text-xs font-bold text-white">${review.name}</div>
                        <div class="text-[10px] text-gray-500">${review.country}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // --- 2. GITHUB PROJECTS LOADER ---
    const container = document.getElementById('project-container');
    
    async function loadProjects() {
        const apiUrl = `https://api.github.com/repos/${username}/${repoName}/contents/projects?ref=${branch}`;
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('GitHub API Error');
            const files = await response.json();

            container.innerHTML = '';

            // Filter images
            const imageFiles = files.filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i));

            if (imageFiles.length === 0) {
                container.innerHTML = '<div class="text-center text-gray-500 p-10">No images found. Upload to /projects folder.</div>';
                return;
            }

            for (const imgFile of imageFiles) {
                const baseName = imgFile.name.split('.').slice(0, -1).join('.');
                const txtFile = files.find(f => f.name === baseName + '.txt');
                
                let title = baseName.replace(/-/g, ' ');
                let desc = "Packaging Design";

                if (txtFile) {
                    const txtRes = await fetch(txtFile.download_url);
                    const txtContent = await txtRes.text();
                    const lines = txtContent.split('\n');
                    title = lines[0] || title;
                    desc = lines.slice(1).join(' ').trim() || desc;
                }

                const card = document.createElement('div');
                card.className = 'masonry-item group relative rounded-2xl overflow-hidden border border-white/10 bg-[#111] reveal-element cursor-pointer';
                
                // Modern Card HTML
                card.innerHTML = `
                    <div class="relative overflow-hidden">
                        <img src="${imgFile.download_url}" alt="${title}" class="w-full h-auto block group-hover:scale-110 transition duration-700 ease-in-out">
                        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <div class="transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                            <span class="text-brand-purple text-xs font-bold uppercase tracking-wider mb-1 block">Label Design</span>
                            <h3 class="text-xl font-bold text-white capitalize mb-1">${title}</h3>
                            <p class="text-gray-300 text-xs line-clamp-2">${desc}</p>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            }
            
            initScrollReveal();

        } catch (error) {
            console.error(error);
            container.innerHTML = `<div class="text-red-400 text-center p-10 border border-red-500/20 rounded-lg bg-red-900/10">
                <p>Error loading portfolio. Check console.</p>
            </div>`;
        }
    }

    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal-element').forEach(el => observer.observe(el));
    }

    // Initialize
    renderReviews();
    loadProjects();

    // Navbar Scroll
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 50) {
            nav.classList.add('shadow-lg', 'bg-black/80');
        } else {
            nav.classList.remove('shadow-lg', 'bg-black/80');
        }
    });
});
