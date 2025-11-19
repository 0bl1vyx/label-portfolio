document.addEventListener('DOMContentLoaded', () => {
    
    // ================= SETTINGS =================
    const username = '0bl1vyx'; 
    const repoName = 'label-portfolio';
    const branch = 'main';
    // ============================================

    // 1. Project Loader (GitHub API)
    const container = document.getElementById('project-container');
    
    async function loadProjects() {
        const apiUrl = `https://api.github.com/repos/${username}/${repoName}/contents/projects?ref=${branch}`;
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('GitHub API Error');
            const files = await response.json();

            // Clean container
            container.innerHTML = '';

            const imageFiles = files.filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i));

            if (imageFiles.length === 0) {
                container.innerHTML = '<div class="text-center text-gray-500 p-10">No images found in /projects folder yet. Upload some!</div>';
                return;
            }

            for (const imgFile of imageFiles) {
                // Find matching .txt
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
                card.className = 'masonry-item group relative rounded-2xl overflow-hidden border border-white/10 bg-[#111] reveal-element';
                card.innerHTML = `
                    <img src="${imgFile.download_url}" alt="${title}" class="w-full h-auto block group-hover:scale-105 transition duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <h3 class="text-lg font-bold text-white translate-y-4 group-hover:translate-y-0 transition duration-300 capitalize">${title}</h3>
                        <p class="text-gray-300 text-xs mt-1 translate-y-4 group-hover:translate-y-0 transition duration-300 delay-75 line-clamp-2">${desc}</p>
                    </div>
                `;
                container.appendChild(card);
            }
            
            initScrollReveal();

        } catch (error) {
            console.error(error);
            container.innerHTML = `<div class="text-red-500 text-center p-10 border border-red-500/20 rounded-lg bg-red-500/5">
                <h3 class="font-bold">Connection Error</h3>
                <p class="text-sm">Could not fetch projects. Check if your repo is Public and username is correct.</p>
                <p class="text-xs mt-2 opacity-50">Repo: github.com/${username}/${repoName}</p>
            </div>`;
        }
    }

    // 2. Seamless Marquee Logic
    function initMarquee() {
        const marquee = document.querySelector('.marquee-content');
        // Clone content to make it loop seamlessly
        marquee.innerHTML += marquee.innerHTML;
    }

    // 3. Scroll Animations
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

    // 4. Navbar Logic
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 50) {
            nav.classList.add('shadow-lg', 'bg-black/80');
            nav.classList.remove('bg-transparent');
        } else {
            nav.classList.remove('shadow-lg', 'bg-black/80');
            nav.classList.add('bg-transparent');
        }
    });

    // Init
    loadProjects();
    initMarquee();
});
