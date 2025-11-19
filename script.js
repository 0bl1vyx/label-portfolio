document.addEventListener('DOMContentLoaded', () => {
    
    // === CONFIG ===
    const username = '0bl1vyx'; 
    const repoName = 'label-portfolio';
    const branch = 'main';
    
    // === 1. SPOTLIGHT EFFECT (The "Insane" Part) ===
    // Tracks mouse movement on "spotlight-group" elements
    document.addEventListener('mousemove', (e) => {
        document.querySelectorAll('.spotlight-group, .spotlight-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // === 2. GITHUB PORTFOLIO LOADER ===
    const container = document.getElementById('project-container');

    async function loadProjects() {
        const apiUrl = `https://api.github.com/repos/${username}/${repoName}/contents/projects?ref=${branch}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('GitHub API Error');
            const files = await response.json();

            container.innerHTML = '';
            const imageFiles = files.filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i));

            if (imageFiles.length === 0) {
                container.innerHTML = '<div class="text-gray-500">No projects found.</div>';
                return;
            }

            // Loop through images
            for (const imgFile of imageFiles) {
                const baseName = imgFile.name.split('.').slice(0, -1).join('.');
                // Try to get description if text file exists (simplified for speed)
                let title = baseName.replace(/-/g, ' ');
                
                const card = document.createElement('div');
                // Add spotlight-card class for the hover effect
                card.className = 'masonry-item spotlight-card relative rounded-xl overflow-hidden bg-[#111] border border-white/10 cursor-pointer reveal-element group';
                
                card.innerHTML = `
                    <div class="relative z-10">
                        <img src="${imgFile.download_url}" alt="${title}" class="w-full h-auto block transition duration-700 group-hover:scale-105">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                            <div>
                                <h3 class="text-white font-bold text-lg capitalize">${title}</h3>
                                <p class="text-accent text-xs font-bold uppercase tracking-wider">View Project</p>
                            </div>
                        </div>
                    </div>
                    <div class="absolute inset-0 pointer-events-none z-20" style="background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.1), transparent 40%); opacity: 0; transition: opacity 0.5s;" class="spotlight-overlay"></div>
                `;

                // Manual spotlight opacity toggle for created elements
                card.addEventListener('mouseenter', () => card.querySelector('.spotlight-overlay').style.opacity = '1');
                card.addEventListener('mouseleave', () => card.querySelector('.spotlight-overlay').style.opacity = '0');
                
                // Click to Open Modal
                card.addEventListener('click', () => openModal(imgFile.download_url, title, "High-resolution packaging design compliant with FDA standards."));
                
                container.appendChild(card);
            }
            initScrollReveal();
        } catch (error) {
            console.error(error);
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
        modalDesc.innerText = desc;
        modal.classList.remove('hidden');
        // Small delay to allow display:flex to apply before opacity transition
        setTimeout(() => {
            modal.classList.remove('opacity-0');
        }, 10);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    window.closeModal = () => {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modalImg.src = ''; // Clear memory
        }, 300);
        document.body.style.overflow = 'auto';
    };

    // === 4. REVIEWS ===
    const reviewsTrack = document.getElementById('reviews-track');
    const reviewsData = [
        { name: "James T.", text: "The jar label stood out immediately on Amazon." },
        { name: "Sarah J.", text: "Professional, and the 3D mockup was realistic." },
        { name: "Marco R.", text: "Understood the wine aesthetic perfectly." },
        { name: "EliteSupps", text: "Boosted our CTR by 20%." },
        { name: "Elena B.", text: "The final print file was perfect." },
        { name: "VapeNation", text: "Sick designs for our e-liquid line." },
    ];

    function renderReviews() {
        const fullList = [...reviewsData, ...reviewsData, ...reviewsData]; // Triple for length
        reviewsTrack.innerHTML = fullList.map(r => `
            <div class="bg-[#111] border border-white/10 p-6 rounded-xl w-[300px] flex-shrink-0">
                <div class="text-yellow-500 text-xs mb-2"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
                <p class="text-gray-300 text-sm mb-3">"${r.text}"</p>
                <div class="text-white font-bold text-xs text-accent">- ${r.name}</div>
            </div>
        `).join('');
    }

    // === 5. SCROLL REVEAL ===
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

    // Run
    loadProjects();
    renderReviews();
    
    // Navbar Glass Effect Trigger
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 50) {
            nav.classList.add('bg-black/80', 'backdrop-blur-xl', 'border-white/10');
            nav.classList.remove('border-white/0');
        } else {
            nav.classList.remove('bg-black/80', 'backdrop-blur-xl', 'border-white/10');
            nav.classList.add('border-white/0');
        }
    });
});