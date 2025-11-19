document.addEventListener('DOMContentLoaded', () => {
    
    // === CONFIG ===
    const username = '0bl1vyx'; 
    const repoName = 'label-portfolio';
    const branch = 'main';
    
    // === 1. CUSTOM CURSOR LOGIC ===
    const cursor = document.querySelector('.custom-cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Hover effect for interactive elements
    // Using 'mouseover' with delegation for dynamically added elements
    document.body.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .hover-trigger, .masonry-item')) {
            cursor.classList.add('hovered');
        } else {
            cursor.classList.remove('hovered');
        }
    });

    // === 2. PRELOADER REMOVAL ===
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.getElementById('preloader').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('preloader').style.display = 'none';
            }, 800);
        }, 2000); // Artificial 2s delay for cinematic effect
    });

    // === 3. GITHUB FETCHING LOGIC (THE CORE REQUEST) ===
    const container = document.getElementById('project-container');

    async function loadProjects() {
        const apiUrl = `https://api.github.com/repos/${username}/${repoName}/contents/projects?ref=${branch}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('GitHub API Limit or Error');
            const files = await response.json();

            // Filter only image files
            const imageFiles = files.filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i));

            // Clear container
            container.innerHTML = '';

            // Process files
            for (const imgFile of imageFiles) {
                // 1. Identify the matching .txt file name
                const baseName = imgFile.name.substring(0, imgFile.name.lastIndexOf('.'));
                const txtFileName = baseName + '.txt';
                
                // 2. Find if that txt file exists in the file list
                const txtFileObj = files.find(f => f.name === txtFileName);

                let title = baseName.replace(/-/g, ' '); // Fallback Title
                let desc = "High-quality label design project."; // Fallback Desc

                // 3. If .txt exists, fetch its content
                if (txtFileObj) {
                    try {
                        const txtRes = await fetch(txtFileObj.download_url);
                        const txtContent = await txtRes.text();
                        
                        // 4. PARSE LOGIC: First line = Title, Rest = Description
                        const lines = txtContent.split('\n');
                        if (lines.length > 0) {
                            // Remove empty lines at start/end
                            const cleanLines = lines.filter(line => line.trim() !== "");
                            if (cleanLines.length > 0) {
                                title = cleanLines[0];
                                desc = cleanLines.slice(1).join('<br>'); // Join rest with line breaks
                            }
                        }
                    } catch (err) {
                        console.warn(`Could not load text for ${baseName}`);
                    }
                }

                // 5. Create the Card HTML
                const card = document.createElement('div');
                card.className = 'masonry-item group relative rounded-none overflow-hidden bg-[#111] cursor-none reveal-element';
                
                card.innerHTML = `
                    <div class="relative overflow-hidden">
                        <img src="${imgFile.download_url}" alt="${title}" class="w-full h-auto block transition duration-[1.5s] ease-out group-hover:scale-110 grayscale group-hover:grayscale-0">
                        <div class="absolute inset-0 bg-black/40 group-hover:opacity-0 transition-opacity duration-500"></div>
                    </div>
                    <div class="p-5 border-x border-b border-white/10 bg-[#0a0a0a] relative z-10">
                        <span class="text-accent text-[10px] font-bold uppercase tracking-widest mb-2 block">Packaging</span>
                        <h3 class="text-xl text-white font-heading font-bold group-hover:text-accent transition-colors">${title}</h3>
                    </div>
                `;

                // Add Click Event
                card.addEventListener('click', () => openModal(imgFile.download_url, title, desc));
                
                container.appendChild(card);
            }

            initScrollReveal();

        } catch (error) {
            console.error(error);
            container.innerHTML = '<div class="text-gray-500 p-10">Github API limit reached or folder empty.</div>';
        }
    }

    // === 4. MODAL SYSTEM ===
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');

    window.openModal = (src, title, desc) => {
        modalImg.src = src;
        modalTitle.innerText = title;
        modalDesc.innerHTML = desc; // Use innerHTML to support <br> from text file
        modal.classList.remove('hidden');
        requestAnimationFrame(() => modal.classList.remove('opacity-0'));
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = () => {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modalImg.src = '';
        }, 500);
        document.body.style.overflow = 'auto';
    };

    // === 5. UTILS ===
    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal-element').forEach(el => observer.observe(el));
    }

    // === 6. REVIEWS RENDER ===
    const reviewsTrack = document.getElementById('reviews-track');
    const reviews = [
        {text: "Best designer I've worked with on Fiverr.", author: "James K."},
        {text: "The compliance knowledge saved us from a lawsuit.", author: "EliteSupps"},
        {text: "Clean, modern, and sells product.", author: "Sarah J."},
        {text: "Understood the assignment immediately.", author: "VapeCo"},
    ];
    
    // Duplicate for infinite scroll
    const fullReviews = [...reviews, ...reviews, ...reviews];
    
    reviewsTrack.innerHTML = fullReviews.map(r => `
        <div class="flex items-center gap-4 px-8 py-4 border border-white/10 rounded-full bg-white/5 mx-4 flex-shrink-0">
            <div class="text-accent"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
            <p class="text-sm text-gray-300 font-light">"${r.text}" <span class="text-white font-bold ml-2">— ${r.author}</span></p>
        </div>
    `).join('');

    // Start
    loadProjects();
});