import { type Provider } from "@shared/schema";

let _id = 1;
const id = () => _id++;

export const mockProviders: Provider[] = [
    // ─── Traiteurs ───────────────────────────────────────────────────────────
    {
        id: id(), category: "traiteur", name: "Traiteur El Andalous",
        description: "Spécialiste des grands banquets marocains traditionnels avec plus de 20 ans d'expérience. Cuisine authentique, présentation raffinée.",
        city: "Casablanca", priceMin: 150, priceMax: 350,
        images: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800"],
        packages: [
            { name: "Essentiel", price: 150, features: ["Menu 3 plats", "Service buffet", "50 personnes min"] },
            { name: "Prestige", price: 250, features: ["Menu 5 plats", "Service à table", "Décoration incluse"] },
            { name: "Royal", price: 350, features: ["Menu 7 plats", "Chef privé", "Décor + animation"] },
        ],
        rating: 5, contactInfo: "+212 6 00 11 22 33",
    },
    {
        id: id(), category: "traiteur", name: "Saveurs de Marrakech",
        description: "Cuisine du terroir marrakchi revisitée. Tajines, couscous royaux et pâtisseries orientales pour un mariage mémorable.",
        city: "Marrakech", priceMin: 180, priceMax: 400,
        images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800"],
        packages: [
            { name: "Essentiel", price: 180, features: ["Menu 3 plats", "Pain maison", "Jus naturels"] },
            { name: "Premium", price: 280, features: ["Menu 5 plats", "Pâtisseries", "Thé à la menthe"] },
            { name: "Luxe", price: 400, features: ["Menu 7 plats", "Buffet desserts", "Animation culinaire live"] },
        ],
        rating: 5, contactInfo: "+212 6 01 23 45 67",
    },
    {
        id: id(), category: "traiteur", name: "La Table Fassi",
        description: "L'art culinaire de Fès — bastilla, harira royale et agneau méchoui pour une expérience gastronomique inoubliable.",
        city: "Fes", priceMin: 160, priceMax: 320,
        images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"],
        packages: [
            { name: "Classique", price: 160, features: ["Menu 3 plats", "Bastilla incluse"] },
            { name: "Grand", price: 220, features: ["Menu 5 plats", "Méchoui", "Desserts orientaux"] },
            { name: "Fassi Royal", price: 320, features: ["Menu 7 plats", "Chef live", "Décoration florale"] },
        ],
        rating: 4, contactInfo: "+212 5 35 60 00 11",
    },
    {
        id: id(), category: "traiteur", name: "Riad Cuisine Events",
        description: "Traiteur premium à Rabat pour réceptions et mariages. Cuisine fusion maroco-internationale.",
        city: "Rabat", priceMin: 200, priceMax: 450,
        images: ["https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800"],
        packages: [
            { name: "Signature", price: 200, features: ["Menu 4 plats", "Vins sans alcool"] },
            { name: "Excellence", price: 320, features: ["Menu 6 plats", "Chef étoilé"] },
            { name: "Prestige+", price: 450, features: ["Menu 8 plats", "Animation + desserts"] },
        ],
        rating: 5, contactInfo: "+212 5 37 70 88 99",
    },
    {
        id: id(), category: "traiteur", name: "Saveurs Tangéroises",
        description: "Traiteur avec influence méditerranéenne et marocaine. Idéal pour mariages modernes à Tanger.",
        city: "Tangier", priceMin: 140, priceMax: 300,
        images: ["https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800"],
        packages: [
            { name: "Mer & Terre", price: 140, features: ["Fruits de mer inclus", "3 plats"] },
            { name: "Fusion", price: 220, features: ["5 plats", "Buffet desserts"] },
            { name: "Luxe Méditerranée", price: 300, features: ["7 plats", "Chef privé", "Service VIP"] },
        ],
        rating: 4, contactInfo: "+212 6 39 11 22 33",
    },

    // ─── Halls ───────────────────────────────────────────────────────────────
    {
        id: id(), category: "hall", name: "Palais des Roses",
        description: "Salle de mariage majestueuse au cœur de Casablanca. Capacité 800 invités, décoration orientale luxueuse.",
        city: "Casablanca", priceMin: 20000, priceMax: 60000,
        images: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800"],
        packages: [
            { name: "Bronze", price: 20000, features: ["300 invités max", "Éclairage standard", "Parking"] },
            { name: "Or", price: 40000, features: ["600 invités max", "Décoration incluse", "VIP room"] },
            { name: "Platine", price: 60000, features: ["800 invités max", "Décor personnalisé", "Scène + son"] },
        ],
        rating: 5, contactInfo: "+212 5 22 30 00 01",
    },
    {
        id: id(), category: "hall", name: "Alhambra Wedding Palace",
        description: "Palais andalou aux jardins fleuris à Marrakech. Cadre de rêve pour un mariage royal.",
        city: "Marrakech", priceMin: 25000, priceMax: 80000,
        images: ["https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"],
        packages: [
            { name: "Jardin", price: 25000, features: ["Cérémonie en plein air", "200 personnes"] },
            { name: "Palais", price: 50000, features: ["Salle intérieure", "500 personnes", "Fontaine"] },
            { name: "Royal", price: 80000, features: ["Palais complet", "800 personnes", "Feux d'artifice inclus"] },
        ],
        rating: 5, contactInfo: "+212 5 24 44 55 66",
    },
    {
        id: id(), category: "hall", name: "Dar Al Andalous",
        description: "Riad traditionnel pour petits mariages intimes à Fès. Charme authentique et service personnalisé.",
        city: "Fes", priceMin: 15000, priceMax: 40000,
        images: ["https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800"],
        packages: [
            { name: "Intime", price: 15000, features: ["100 invités max", "Patio ouvert"] },
            { name: "Classique", price: 25000, features: ["200 invités", "Décoration incluse"] },
            { name: "Prestige", price: 40000, features: ["300 invités", "Hammam privatif"] },
        ],
        rating: 4, contactInfo: "+212 5 35 64 00 22",
    },
    {
        id: id(), category: "hall", name: "Salle Royale Atlantique",
        description: "Grande salle de réception à Rabat avec vue sur l'Atlantique. Moderne et élégante.",
        city: "Rabat", priceMin: 22000, priceMax: 70000,
        images: ["https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800"],
        packages: [
            { name: "Horizon", price: 22000, features: ["Vue mer", "300 invités"] },
            { name: "Grand Horizon", price: 45000, features: ["Terrasse privée", "500 invités"] },
            { name: "Prestige Atlantique", price: 70000, features: ["Tout inclus", "800 invités", "Soirée VIP"] },
        ],
        rating: 5, contactInfo: "+212 5 37 55 44 33",
    },
    {
        id: id(), category: "hall", name: "Villa Détroit",
        description: "Domaine privé avec jardin à Tanger, vue sur le détroit de Gibraltar. Cadre unique et inoubliable.",
        city: "Tangier", priceMin: 18000, priceMax: 55000,
        images: ["https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=800"],
        packages: [
            { name: "Vue Détroit", price: 18000, features: ["Jardin", "150 invités"] },
            { name: "Domaine", price: 35000, features: ["Villa complète", "350 invités"] },
            { name: "Luxe Détroit", price: 55000, features: ["Service VIP", "600 invités", "Piscine privée"] },
        ],
        rating: 4, contactInfo: "+212 6 39 88 77 66",
    },

    // ─── DJs ─────────────────────────────────────────────────────────────────
    {
        id: id(), category: "dj", name: "DJ MHD Marrakchi",
        description: "DJ professionnel spécialisé en musique orientale, chaâbi et moderne. Ambiance garantie toute la nuit !",
        city: "Casablanca", priceMin: 3000, priceMax: 8000,
        images: ["https://images.unsplash.com/photo-1571266028243-d220c6a8a0a0?w=800"],
        packages: [
            { name: "Basique", price: 3000, features: ["4h de set", "Sono incluse"] },
            { name: "Standard", price: 5000, features: ["6h de set", "Sono + lumières"] },
            { name: "Premium", price: 8000, features: ["8h de set", "Pack lumières pro", "MC inclus"] },
        ],
        rating: 5, contactInfo: "+212 6 65 11 22 33",
    },
    {
        id: id(), category: "dj", name: "Sound of Arabia",
        description: "Collectif de DJs spécialisés en mariages marocains. Oriental, gnaoua et fusion pour une soirée mémorable.",
        city: "Marrakech", priceMin: 4000, priceMax: 10000,
        images: ["https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800"],
        packages: [
            { name: "Solo", price: 4000, features: ["1 DJ", "5h", "Sono complète"] },
            { name: "Duo", price: 7000, features: ["2 DJs", "8h", "Jeu de lumières"] },
            { name: "Full Show", price: 10000, features: ["2 DJs + MC", "10h", "Animation"] },
        ],
        rating: 5, contactInfo: "+212 6 24 55 66 77",
    },
    {
        id: id(), category: "dj", name: "DJ Atlas",
        description: "Expert en musique traditionnelle fassi et moderne. Ambiance chaleureuse pour tout type de mariage.",
        city: "Fes", priceMin: 2500, priceMax: 7000,
        images: ["https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800"],
        packages: [
            { name: "Essentiel", price: 2500, features: ["4h", "Sono", "Playlist personnalisée"] },
            { name: "Premium", price: 5000, features: ["7h", "Lumières", "Animation"] },
            { name: "Ultimate", price: 7000, features: ["10h", "Full rig", "MC en option"] },
        ],
        rating: 4, contactInfo: "+212 6 35 88 99 00",
    },

    // ─── Cameramen ───────────────────────────────────────────────────────────
    {
        id: id(), category: "cameraman", name: "Lens & Love Photography",
        description: "Studio photo et vidéo spécialisé en mariages marocains. Capturer chaque moment précieux avec art.",
        city: "Casablanca", priceMin: 5000, priceMax: 15000,
        images: ["https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800"],
        packages: [
            { name: "Photo", price: 5000, features: ["8h photo", "200 photos retouchées", "Album numérique"] },
            { name: "Photo + Vidéo", price: 10000, features: ["8h photo+vidéo", "Film 5min", "Album + clé USB"] },
            { name: "Cinéma", price: 15000, features: ["Drone", "Film cinématique", "Timelapse", "Teaser 1min"] },
        ],
        rating: 5, contactInfo: "+212 6 66 11 22 33",
    },
    {
        id: id(), category: "cameraman", name: "Magic Moments Studio",
        description: "équipe de photographes et vidéastes à Marrakech. Style moderne et documentation artistique de votre mariage.",
        city: "Marrakech", priceMin: 6000, priceMax: 18000,
        images: ["https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=800"],
        packages: [
            { name: "Essentiel", price: 6000, features: ["6h", "150 photos", "Vidéo highlights 3min"] },
            { name: "Prestige", price: 12000, features: ["Journée entière", "500 photos", "Film 10min"] },
            { name: "Cinéma Royal", price: 18000, features: ["2 équipes", "Drone 4K", "Film + making-of"] },
        ],
        rating: 5, contactInfo: "+212 6 24 77 88 99",
    },
    {
        id: id(), category: "cameraman", name: "Fassi Vision",
        description: "Photographe de mariage à Fès avec 10 ans d'expérience. Photos authentiques et pleines d'émotion.",
        city: "Fes", priceMin: 4000, priceMax: 12000,
        images: ["https://images.unsplash.com/photo-1519741497674-611481863552?w=800"],
        packages: [
            { name: "Classique", price: 4000, features: ["6h photo", "100 photos HD"] },
            { name: "Complet", price: 8000, features: ["Journée", "300 photos", "Clips vidéo"] },
            { name: "Premium", price: 12000, features: ["2 photographes", "Drone", "Album imprimé"] },
        ],
        rating: 4, contactInfo: "+212 6 35 77 66 55",
    },
    {
        id: id(), category: "cameraman", name: "Atlantic Visuals",
        description: "Duo photo-vidéo à Rabat et Agadir. Spécialisés dans les mariages sur la côte atlantique.",
        city: "Rabat", priceMin: 5500, priceMax: 16000,
        images: ["https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800"],
        packages: [
            { name: "Starter", price: 5500, features: ["8h", "200 photos", "Vidéo 3min"] },
            { name: "Pro", price: 10000, features: ["Journée", "400 photos", "Film 8min", "Drone"] },
            { name: "Cinéma Atlantic", price: 16000, features: ["2 équipes", "Film 15min", "Effets cinéma"] },
        ],
        rating: 5, contactInfo: "+212 5 37 44 55 66",
    },
];
