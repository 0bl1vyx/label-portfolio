document.addEventListener('DOMContentLoaded', () => {
    
    // ================= CONFIGURATION =================
    // REPLACE THIS WITH YOUR EXACT GITHUB USERNAME
    const username = '0bl1vyx'; 
    const repoName = 'label-portfolio';
    const branch = 'main'; // or 'master' check your repo
    // =================================================

    const container = document.getElementById('project-container');
    const apiUrl = `https://api.github.com/repos/${username}/${repoName}/contents/projects?ref=${branch}`;
    
    // 1. Fetch and Build Projects Automatically
    async function loadProjects() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Failed to fetch projects');
            const files = await response.json();

            // Filter for images
            const imageFiles = files.filter(file => 
                file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
            );

            // Process each image
            for (const imgFile of imageFiles) {
                // Try to find matching text file
                const baseName = imgFile.name.split('.').slice(0, -1).join('.');
                const txtFile = files.find(f => f.name === baseName + '.txt');
                
                let title = baseName.replace(/-/g, ' '); // Default title
                let desc = "Label Design"; // Default desc

                // If text file exists, fetch its content
                if (txtFile) {
                    const txtResponse = await fetch(txtFile.download_url);
                    const txtContent = await txtResponse.text();
                    const lines = txtContent.split('\n');
                    title = lines[0] || title;
                    desc = lines.slice(1).join(' ').trim() || desc;
                }

                createProjectCard(imgFile.download_url, title, desc);
            }
            
            // Initialize animations after loading
            initScrollReveal();

        } catch (error) {
            console.error('Error loading projects:', error);
            container.innerHTML = `<p class="text-center text-red-400">Error loading projects. Make sure your GitHub username is correct in js/script.js</p>`;
        }
    }

    function createProjectCard(imgUrl, title, desc) {
        const card = document.createElement('div');
        card.className = 'masonry-item group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-purple-500/30 transition-all duration-300 reveal-element';
        
        card.innerHTML = `
            <div class="relative">
                <img src="${imgUrl}" alt="${title}" class="w-full h-auto block">
                
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 class="text-xl font-bold text-white transform translate-y-4 group-hover:translate-y-0 transition duration-300 capitalize">${title}</h3>
                    <p class="text-gray-300 text-sm mt-1 transform translate-y-4 group-hover:translate-y-0 transition duration-300 delay-75 line-clamp-2">${desc}</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    }

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

    // Navbar Glass Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-black/90', 'shadow-lg');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('bg-black/90', 'shadow-lg');
            navbar.classList.add('bg-transparent');
        }
    });

    loadProjects();
});
