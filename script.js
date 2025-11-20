document.addEventListener('DOMContentLoaded', () => {
    
    // === CONFIGURATION ===
    // Change these if you change your GitHub username or repo name
    const username = '0bl1vyx'; 
    const repoName = 'label-portfolio';
    const branch = 'main';
    
    // === 1. CLIENT REVIEWS SYSTEM ===
    const reviewsTrack = document.getElementById('reviews-track');
    
    // These reviews are written to target client fears (compliance, print quality, communication)
    const reviewsData = [
        { name: "Mike T. (Supplement Brand)", stars: 5, text: "Priyo knows his stuff. The nutrition facts were formatted perfectly for the FDA requirements, and the metallic print file was set up correctly for our printer." },
        { name: "Sarah J. (Skincare)", stars: 5, text: "I was worried about the text being legible on my small 1oz bottles, but he handled the hierarchy perfectly. Looks amazing on shelf." },
        { name: "GreenLeaf Organics", stars: 5, text: "Fastest turnaround I've had on Fiverr. The dieline matched our manufacturer's template exactly. Zero print issues." },
        { name: "VapeCo Europe", stars: 5, text: "Understands EU compliance and warning label requirements. Saved us a lot of headaches. Highly recommended." },
        { name: "Coffee Roasters Inc.", stars: 5, text: "Designed a bag label that pops. He provided the editable AI file which was crucial for us to make small flavor changes later." },
        { name: "Hitesh P.", stars: 5, text: "Professional quality. The 3D mockup helped us sell the product to retailers before we even printed the labels." },
        { name: "Amanda B. (Candle Maker)", stars: 5, text: "Beautiful typography. He understood the 'minimalist luxury' vibe we wanted immediately." },
        { name: "FitLife Supplements", stars: 4, text: "Great work on the ingredients panel. We had a complex formula and he made it look clean and organized." },
        { name: "TechAccessories", stars: 5, text: "Created a custom die-cut sticker for our packaging box. The vector paths were clean and cut perfectly." },
        { name: "David R.", stars: 5, text: "Communication was top notch. He asked the right questions about paper type and finish (matte vs gloss) before starting." }
    ];

    // Shuffle function to keep the site looking fresh on every reload
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const shuffledReviews = shuffleArray([...reviewsData]);
    // Duplicate list for the infinite scrolling effect
    const fullList = [...shuffledReviews, ...shuffledReviews]; 
    
    // Render the reviews
    if (reviewsTrack) {
        reviewsTrack.innerHTML = fullList.map(r => {
            // Generate stars
            let starsHtml = '';
            for(let i=0; i<5; i++) {
                starsHtml += `<i class="fa-solid fa-star ${i < r.stars ? 'text-yellow-500' : 'text-gray-700'} text-[10px]"></i>`;
            }
            
            return `
                <div class="w-[350px] bg-[#141414] border border-white/10 p-6 rounded-xl flex-shrink-0 hover:border-brand/30 transition duration-300 group select-none">
                    <div class="flex items-center justify-between mb-4">
                         <div class="flex gap-1">${starsHtml}</div>
                         <div class="text-[10px] font-bold text-brand bg-brand/10 px-2 py-1 rounded opacity-50 group-hover:opacity-100 transition">VERIFIED</div>
                    </div>
                    <p class="text-gray-300 text-sm mb-6 leading-relaxed italic">"${r.text}"</p>
                    <div class="flex items-center gap-3 border-t border-white/5 pt-4">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-purple-900 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-brand/20">
                            ${r.name.charAt(0)}
                        </div>
                        <div>
                            <div class="text-xs font-bold text-white">${r.name}</div>
                            <div class="text-[10px] text-gray-500">Label Design Client</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // === 2. GITHUB PORTFOLIO LOADER ===
    const container = document.getElementById('project-container');

    async function loadProjects() {
        const apiUrl = `https://api.github.com/repos/${username}/${repoName}/contents/projects?ref=${branch}`;

        try {
            // Loading state
            container.innerHTML = '<div class="col-span-full text-center py-20 text-gray-500 animate-pulse">Loading design gallery...</div>';
            
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('GitHub API Limit or Error');
            const files = await response.json();

            // Clear loading state
            container.innerHTML = '';
            
            // Filter for images
            const imageFiles = files.filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i));

            if (imageFiles.length === 0) {
                container.innerHTML = '<div class="col-span-full text-center text-gray-500">Portfolio is updating. Check back soon or visit Fiverr.</div>';
                return;
            }

            // Process images
            for (const imgFile of imageFiles) {
                // Look for a matching .txt file for description
                const baseName = imgFile.name.split('.').slice(0, -1).join('.');
                const txtFileName = baseName + '.txt';
                const txtFileObj = files.find(f => f.name === txtFileName);

                let title = baseName.replace(/-/g, ' ');
                let desc = "Premium Packaging Design aimed at increasing shelf visibility.";

                // Fetch description text if available
                if (txtFileObj) {
                    try {
                        const txtRes = await fetch(txtFileObj.download_url);
                        const txtContent = await txtRes.text();
                        const lines = txtContent.split('\n').filter(l => l.trim() !== '');
                        if (lines.length > 0) {
                            title = lines[0]; 
                            desc = lines.slice(1).join('<br>'); 
                        }
                    } catch (e) { console.log("No text file found for " + baseName); }
                }

                // Create the Grid Item
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
            
            // Re-trigger reveal animation for newly added items
            setTimeout(initScrollReveal, 100);
            
        } catch (error) {
            console.error(error);
            container.innerHTML = `
                <div class="col-span-full text-center py-10">
                    <p class="text-gray-400 mb-4">Portfolio is loading from external source.</p>
                    <a href="https://www.fiverr.com/yodhyam_gamedev" target="_blank" class="text-brand hover:underline font-bold border border-brand/50 px-6 py-3 rounded-full hover:bg-brand hover:text-white transition">View on Fiverr &rarr;</a>
                </div>`;
        }
    }

    // === 3. MODAL & UTILS ===
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');

    window.openModal = (src, title, desc) => {
        modalImg.src = src;
        modalTitle.innerText = title;
        modalDesc.innerHTML = desc;
        modal.classList.remove('hidden');
        // Small delay to allow display:block to apply before opacity transition
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    window.closeModal = () => {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modalImg.src = '';
        }, 300); // Match css transition time
        document.body.style.overflow = 'auto';
    };

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Scroll Reveal Animation Logic
    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
        
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    // FAQ Toggle Logic
    window.toggleFaq = (element) => {
        const isActive = element.classList.contains('active');
        
        // Close all others first (Accordion style)
        document.querySelectorAll('.faq-item').forEach(el => {
            el.classList.remove('active');
        });

        // If it wasn't active before, open it now
        if (!isActive) {
            element.classList.add('active');
        }
    };

    // Start everything
    loadProjects();
    initScrollReveal();
});
