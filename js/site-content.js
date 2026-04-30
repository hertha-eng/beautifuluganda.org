window.ExploreUgandaDefaultContent = {
    home: {
        hero: {
            title: "Discover the Pearl of Africa",
            text: "Explore Uganda's wildlife, culture, and adventure. Your journey begins here.",
            primaryLabel: "Explore Destinations",
            primaryHref: "destinations.html",
            secondaryLabel: "Plan Your Trip",
            secondaryHref: "plan-trip.html"
        },
        featuredDestinations: [
            {
                image: "./images/gorilla.webp",
                alt: "Bwindi Impenetrable National Park gorilla trekking",
                title: "Bwindi Impenetrable National Park",
                text: "Home to mountain gorillas and lush rainforest.",
                buttonLabel: "View Details",
                buttonHref: "destinations.html#bwindi"
            },
            {
                image: "./images/murchison-falls.webp",
                alt: "Murchison Falls National Park waterfall view",
                title: "Murchison Falls National Park",
                text: "Experience breathtaking waterfalls and wildlife safaris.",
                buttonLabel: "View Details",
                buttonHref: "destinations.html#murchison"
            },
            {
                image: "./images/Lake-Bunyonyi-Uganda.webp",
                alt: "Lake Bunyonyi scenic view",
                title: "Lake Bunyonyi",
                text: "A serene lake surrounded by stunning hills and villages.",
                buttonLabel: "View Details",
                buttonHref: "destinations.html#bunyonyi"
            }
        ],
        topTours: [
            {
                image: "./images/gorilla-trek.webp",
                alt: "Gorilla trekking tour in Bwindi",
                title: "3-Day Gorilla Trekking Safari",
                text: "Explore Bwindi's gorilla habitats with expert guides.",
                buttonLabel: "Request This Trip",
                buttonHref: "plan-trip.html?destination=bwindi-impenetrable-national-park&tour=gorilla-trekking-tours&selection_destination=bwindi-impenetrable-national-park&selection_tours=gorilla-trekking-tours&selection_notes=Featured%20tour:%203-Day%20Gorilla%20Trekking%20Safari.%20Please%20include%20expert-guided%20gorilla%20trekking%20in%20Bwindi.#trip-form"
            },
            {
                image: "./images/wild-murchison.webp",
                alt: "Safari in Murchison Falls National Park",
                title: "Murchison Wildlife Adventure",
                text: "Safari through Murchison Falls National Park.",
                buttonLabel: "Request This Trip",
                buttonHref: "plan-trip.html?destination=murchison-falls-national-park&tour=boat-cruises-boat-safaris&tour=game-drives-wildlife-safaris&selection_destination=murchison-falls-national-park&selection_tours=boat-cruises-boat-safaris,game-drives-wildlife-safaris&selection_notes=Featured%20tour:%20Murchison%20Wildlife%20Adventure.%20Please%20include%20guided%20game%20drives%20and%20a%20Nile%20boat%20safari.#trip-form"
            },
            {
                image: "./images/lake-bunyonyi-hillside-view.jpg",
                alt: "Scenic hillside view over Lake Bunyonyi",
                title: "Lake Bunyonyi Cultural Tour",
                text: "Discover local communities and scenic beauty.",
                buttonLabel: "Request This Trip",
                buttonHref: "plan-trip.html?destination=lake-bunyonyi&tour=cultural-tours&tour=boat-cruises-boat-safaris&selection_destination=lake-bunyonyi&selection_tours=cultural-tours,boat-cruises-boat-safaris&selection_notes=Featured%20tour:%20Lake%20Bunyonyi%20Cultural%20Tour.%20Please%20include%20boat%20rides,%20village%20visits,%20and%20scenic%20experiences.#trip-form"
            }
        ],
        blogHighlights: [
            {
                image: "./images/bwindi.webp",
                alt: "Top 10 places to visit in Uganda",
                title: "Top 10 Places to Visit in Uganda",
                text: "Explore Uganda's most iconic destinations and experiences.",
                buttonLabel: "Read More",
                buttonHref: "blog.html"
            },
            {
                image: "./images/murchison-falls.webp",
                alt: "1-week Uganda safari itinerary",
                title: "1-Week Uganda Safari Itinerary",
                text: "Plan the perfect adventure across Uganda's parks and lakes.",
                buttonLabel: "Read More",
                buttonHref: "blog.html"
            },
            {
                image: "./images/safari-packing.webp",
                alt: "What to pack for a safari in Uganda",
                title: "What to Pack for a Safari",
                text: "Essential tips to make your trip safe and comfortable.",
                buttonLabel: "Read More",
                buttonHref: "blog.html"
            }
        ],
        cta: {
            title: "Ready to Explore Uganda?",
            buttonLabel: "Plan Your Trip Now",
            buttonHref: "plan-trip.html"
        }
    },
    destinations: {
        hero: {
            title: "Explore Uganda's Destinations",
            text: "From lush rainforests to serene lakes, discover the most breathtaking places Uganda has to offer."
        },
        cards: [
            {
                image: "images/bwindi.webp",
                alt: "Gorilla trekking in Bwindi Impenetrable National Park",
                title: "Bwindi Impenetrable National Park",
                text: "Home to mountain gorillas, dense rainforest, and unique wildlife experiences.",
                activities: ["Gorilla trekking", "Bird watching", "Guided forest hikes"],
                buttonLabel: "Plan This Stop",
                buttonHref: "plan-trip.html?destination=bwindi-impenetrable-national-park&tour=gorilla-trekking-tours&tour=birding-tours&tour=forest-walks-nature-walks&selection_destination=bwindi-impenetrable-national-park&selection_tours=gorilla-trekking-tours,birding-tours,forest-walks-nature-walks&selection_notes=Preferred%20activities:%20Gorilla%20trekking,%20Bird%20watching,%20Guided%20forest%20hikes.#trip-form"
            },
            {
                image: "images/murchison-falls.webp",
                alt: "Waterfall view at Murchison Falls National Park",
                title: "Murchison Falls National Park",
                text: "Experience the mighty Murchison Falls, boat safaris, and diverse wildlife.",
                activities: ["Game drives", "Boat safari on the Nile", "Hiking to the top of the falls"],
                buttonLabel: "Plan This Stop",
                buttonHref: "plan-trip.html?destination=murchison-falls-national-park&tour=game-drives-wildlife-safaris&tour=boat-cruises-boat-safaris&tour=hiking-trekking-tours&selection_destination=murchison-falls-national-park&selection_tours=game-drives-wildlife-safaris,boat-cruises-boat-safaris,hiking-trekking-tours&selection_notes=Preferred%20activities:%20Game%20drives,%20Boat%20safari%20on%20the%20Nile,%20Hiking%20to%20the%20top%20of%20the%20falls.#trip-form"
            },
            {
                image: "images/canoe-and-boatride.webp",
                alt: "Lake Bunyonyi view with hills and islands",
                title: "Lake Bunyonyi",
                text: "A serene and scenic lake surrounded by hills and local villages, perfect for relaxation and cultural experiences.",
                activities: ["Canoeing & boat rides", "Village visits", "Bird watching"],
                buttonLabel: "Plan This Stop",
                buttonHref: "plan-trip.html?destination=lake-bunyonyi&tour=canoeing-kayaking-tours&tour=cultural-tours&tour=birding-tours&selection_destination=lake-bunyonyi&selection_tours=canoeing-kayaking-tours,cultural-tours,birding-tours&selection_notes=Preferred%20activities:%20Canoeing%20and%20boat%20rides,%20Village%20visits,%20Bird%20watching.#trip-form"
            },
            {
                image: "images/queen-elizabeth-NP.webp",
                alt: "Savannah and elephants in Queen Elizabeth National Park",
                title: "Queen Elizabeth National Park",
                text: "One of Uganda's most popular parks, home to tree-climbing lions and a wide range of wildlife.",
                activities: ["Game drives", "Boat cruises on the Kazinga Channel", "Chimpanzee tracking in Kyambura Gorge"],
                buttonLabel: "Plan This Stop",
                buttonHref: "plan-trip.html?destination=queen-elizabeth-national-park&tour=game-drives-wildlife-safaris&tour=boat-cruises-boat-safaris&tour=chimpanzee-tracking-tours&selection_destination=queen-elizabeth-national-park&selection_tours=game-drives-wildlife-safaris,boat-cruises-boat-safaris,chimpanzee-tracking-tours&selection_notes=Preferred%20activities:%20Game%20drives,%20Boat%20cruises%20on%20the%20Kazinga%20Channel,%20Chimpanzee%20tracking%20in%20Kyambura%20Gorge.#trip-form"
            },
            {
                image: "images/kibale.webp",
                alt: "Chimpanzees in Kibale Forest National Park",
                title: "Kibale Forest National Park",
                text: "Known for its incredible primate population, including chimpanzees, and lush tropical forest.",
                activities: ["Chimpanzee trekking", "Bird watching", "Nature walks"],
                buttonLabel: "Plan This Stop",
                buttonHref: "plan-trip.html?destination=kibale-national-park&tour=chimpanzee-tracking-tours&tour=birding-tours&tour=forest-walks-nature-walks&selection_destination=kibale-national-park&selection_tours=chimpanzee-tracking-tours,birding-tours,forest-walks-nature-walks&selection_notes=Preferred%20activities:%20Chimpanzee%20trekking,%20Bird%20watching,%20Nature%20walks.#trip-form"
            },
            {
                image: "images/lake-mburo-zebra.webp",
                alt: "Zebras in Lake Mburo National Park savannah",
                title: "Lake Mburo National Park",
                text: "A compact safari park known for zebras, antelopes, scenic lakes, and relaxed wildlife experiences.",
                activities: ["Game drives", "Boat trips on the lake", "Nature walks and birding"],
                buttonLabel: "Plan This Stop",
                buttonHref: "plan-trip.html?destination=lake-mburo-national-park&tour=game-drives-wildlife-safaris&tour=boat-cruises-boat-safaris&tour=forest-walks-nature-walks&selection_destination=lake-mburo-national-park&selection_tours=game-drives-wildlife-safaris,boat-cruises-boat-safaris,forest-walks-nature-walks&selection_notes=Preferred%20activities:%20Game%20drives,%20Boat%20trips%20on%20the%20lake,%20Nature%20walks%20and%20birding.#trip-form"
            },
            {
                image: "images/rwenzori.webp",
                alt: "Rwenzori Mountains landscape in Uganda",
                title: "Rwenzori Mountains National Park",
                text: "Home to dramatic mountain scenery, alpine trails, waterfalls, and unforgettable highland adventures.",
                activities: ["Hiking and trekking", "Mountaineering expeditions", "Scenic photography"],
                buttonLabel: "Plan This Stop",
                buttonHref: "plan-trip.html?destination=rwenzori-mountains-national-park&tour=hiking-trekking-tours&tour=mountaineering-climbing-expeditions&tour=photography-tours&selection_destination=rwenzori-mountains-national-park&selection_tours=hiking-trekking-tours,mountaineering-climbing-expeditions,photography-tours&selection_notes=Preferred%20activities:%20Hiking%20and%20trekking,%20Mountaineering%20expeditions,%20Scenic%20photography.#trip-form"
            },
            {
                image: "images/Kampala-Capital-City.webp",
                alt: "Kampala city skyline and urban attractions",
                title: "Kampala City",
                text: "Uganda's lively capital offers cultural landmarks, local markets, nightlife, and modern city experiences.",
                activities: ["City tours", "Cultural site visits", "Food and nightlife experiences"],
                buttonLabel: "Plan This Stop",
                buttonHref: "plan-trip.html?destination=kampala-city&tour=city-tours&tour=cultural-tours&tour=nightlife-entertainment-tours&selection_destination=kampala-city&selection_tours=city-tours,cultural-tours,nightlife-entertainment-tours&selection_notes=Preferred%20activities:%20City%20tours,%20Cultural%20site%20visits,%20Food%20and%20nightlife%20experiences.#trip-form"
            }
        ],
        cta: {
            title: "Plan Your Uganda Adventure Today!",
            buttonLabel: "Plan My Trip",
            buttonHref: "plan-trip.html"
        }
    },
    tours: {
        hero: {
            title: "Unforgettable Tours in Uganda",
            text: "Experience Uganda like never before with guided tours, safaris, and cultural adventures."
        },
        cards: [
            {
                image: "images/gorilla-trek.webp",
                alt: "Gorilla trekking in Bwindi",
                title: "3-Day Gorilla Trekking Safari",
                text: "Track mountain gorillas in Bwindi Impenetrable National Park with expert guides.",
                included: ["Gorilla trekking permit", "Park entry fees", "Accommodation and meals"],
                buttonLabel: "Request This Tour",
                buttonHref: "plan-trip.html?destination=bwindi-impenetrable-national-park&tour=gorilla-trekking-tours&selection_destination=bwindi-impenetrable-national-park&selection_tours=gorilla-trekking-tours&selection_notes=Package%20includes:%20Gorilla%20trekking%20permit,%20Park%20entry%20fees,%20Accommodation%20and%20meals.#trip-form"
            },
            {
                image: "images/murchison-safari.webp",
                alt: "Safari in Murchison Falls National Park",
                title: "Murchison Wildlife Adventure",
                text: "Explore Murchison Falls National Park on guided game drives and Nile boat safaris.",
                included: ["Game drives", "Boat safari on the Nile", "Guided hikes to the falls"],
                buttonLabel: "Request This Tour",
                buttonHref: "plan-trip.html?destination=murchison-falls-national-park&tour=boat-cruises-boat-safaris&tour=game-drives-wildlife-safaris&selection_destination=murchison-falls-national-park&selection_tours=boat-cruises-boat-safaris,game-drives-wildlife-safaris&selection_notes=Package%20includes:%20Game%20drives,%20Boat%20safari%20on%20the%20Nile,%20Guided%20hikes%20to%20the%20falls.#trip-form"
            },
            {
                image: "images/bunyonyi-tour.webp",
                alt: "Cultural tour at Lake Bunyonyi",
                title: "Lake Bunyonyi Cultural Tour",
                text: "Enjoy boat rides, village visits, and scenic views at Lake Bunyonyi.",
                included: ["Boat rides and village tours", "Local cultural activities", "Accommodation and meals"],
                buttonLabel: "Request This Tour",
                buttonHref: "plan-trip.html?destination=lake-bunyonyi&tour=cultural-tours&tour=boat-cruises-boat-safaris&selection_destination=lake-bunyonyi&selection_tours=cultural-tours,boat-cruises-boat-safaris&selection_notes=Package%20includes:%20Boat%20rides%20and%20village%20tours,%20Local%20cultural%20activities,%20Accommodation%20and%20meals.#trip-form"
            },
            {
                image: "images/queen-elizabeth-safari.webp",
                alt: "Game drive in Queen Elizabeth National Park",
                title: "Queen Elizabeth Safari Adventure",
                text: "Witness lions, elephants, and hippos on a game drive and boat cruise.",
                included: ["Game drives", "Boat cruise on Kazinga Channel", "Guided chimpanzee tracking"],
                buttonLabel: "Request This Tour",
                buttonHref: "plan-trip.html?destination=queen-elizabeth-national-park&tour=game-drives-wildlife-safaris&tour=chimpanzee-tracking-tours&tour=boat-cruises-boat-safaris&selection_destination=queen-elizabeth-national-park&selection_tours=game-drives-wildlife-safaris,chimpanzee-tracking-tours,boat-cruises-boat-safaris&selection_notes=Package%20includes:%20Game%20drives,%20Boat%20cruise%20on%20Kazinga%20Channel,%20Guided%20chimpanzee%20tracking.#trip-form"
            },
            {
                image: "images/kibale.webp",
                alt: "Chimpanzee tracking experience in Kibale Forest",
                title: "Kibale Chimpanzee Experience",
                text: "Enjoy a primate-focused adventure through Kibale's rich rainforest and birdlife habitats.",
                included: ["Chimpanzee tracking permit", "Guided forest walk", "Birding and nature experience"],
                buttonLabel: "Request This Tour",
                buttonHref: "plan-trip.html?destination=kibale-national-park&tour=chimpanzee-tracking-tours&tour=forest-walks-nature-walks&tour=birding-tours&selection_destination=kibale-national-park&selection_tours=chimpanzee-tracking-tours,forest-walks-nature-walks,birding-tours&selection_notes=Package%20includes:%20Chimpanzee%20tracking%20permit,%20Guided%20forest%20walk,%20Birding%20and%20nature%20experience.#trip-form"
            },
            {
                image: "images/rwenzori.webp",
                alt: "Hiking adventure in the Rwenzori Mountains",
                title: "Rwenzori Hiking Adventure",
                text: "Take on one of Uganda's most scenic mountain landscapes with guided trekking and photography stops.",
                included: ["Guided mountain trekking", "Scenic viewpoints and photo stops", "Accommodation and meals"],
                buttonLabel: "Request This Tour",
                buttonHref: "plan-trip.html?destination=rwenzori-mountains-national-park&tour=hiking-trekking-tours&tour=mountaineering-climbing-expeditions&tour=photography-tours&selection_destination=rwenzori-mountains-national-park&selection_tours=hiking-trekking-tours,mountaineering-climbing-expeditions,photography-tours&selection_notes=Package%20includes:%20Guided%20mountain%20trekking,%20Scenic%20viewpoints%20and%20photo%20stops,%20Accommodation%20and%20meals.#trip-form"
            },
            {
                image: "images/uganda-market-street-view.jpg",
                alt: "Kampala market street scene and urban sightseeing",
                title: "Kampala City Explorer",
                text: "Discover the capital's markets, landmarks, cultural sites, and lively entertainment scene.",
                included: ["Guided city tour", "Cultural and historical stops", "Food and nightlife suggestions"],
                buttonLabel: "Request This Tour",
                buttonHref: "plan-trip.html?destination=kampala-city&tour=city-tours&tour=cultural-tours&tour=nightlife-entertainment-tours&selection_destination=kampala-city&selection_tours=city-tours,cultural-tours,nightlife-entertainment-tours&selection_notes=Package%20includes:%20Guided%20city%20tour,%20Cultural%20and%20historical%20stops,%20Food%20and%20nightlife%20suggestions.#trip-form"
            },
            {
                image: "images/zebras-in-grassland.jpg",
                alt: "Zebras grazing during a Lake Mburo safari",
                title: "Lake Mburo Weekend Safari",
                text: "A relaxed short safari with wildlife viewing, a lake excursion, and easy nature experiences.",
                included: ["Game drive experience", "Boat excursion on the lake", "Guided walking safari"],
                buttonLabel: "Request This Tour",
                buttonHref: "plan-trip.html?destination=lake-mburo-national-park&tour=game-drives-wildlife-safaris&tour=boat-cruises-boat-safaris&tour=walking-safaris&selection_destination=lake-mburo-national-park&selection_tours=game-drives-wildlife-safaris,boat-cruises-boat-safaris,walking-safaris&selection_notes=Package%20includes:%20Game%20drive%20experience,%20Boat%20excursion%20on%20the%20lake,%20Guided%20walking%20safari.#trip-form"
            }
        ],
        cta: {
            title: "Book Your Uganda Adventure Today!",
            buttonLabel: "Plan My Trip",
            buttonHref: "plan-trip.html"
        }
    },
    souvenirs: {
        hero: {
            title: "Bring Home a Piece of Uganda",
            text: "Discover authentic Ugandan souvenirs, crafts, and local products to remember your adventure."
        },
        toolbar: {
            note: "Estimated market prices inspired by comparable listings from artisan shops and marketplaces.",
            currencyNote: "Approximate conversions shown for quick comparison."
        },
        cards: [
            {
                image: "images/woven-chairs-on-porch.jpg",
                alt: "Handwoven craftwork in Uganda",
                title: "Handcrafted Baskets",
                text: "Beautifully woven baskets made by local artisans. Perfect for home decor or gifts.",
                priceUgx: 165000,
                buttonLabel: "Add to Cart"
            },
            {
                image: "images/jewelry.webp",
                alt: "Ugandan beaded necklaces and bracelets",
                title: "Beaded Jewelry",
                text: "Colorful necklaces, bracelets, and earrings handcrafted by Ugandan artisans.",
                priceUgx: 65000,
                buttonLabel: "Add to Cart"
            },
            {
                image: "images/masks.webp",
                alt: "Traditional Ugandan wooden masks",
                title: "Traditional Masks",
                text: "Hand-carved wooden masks reflecting Uganda's rich cultural heritage.",
                priceUgx: 150000,
                buttonLabel: "Add to Cart"
            },
            {
                image: "images/coffee-tea.webp",
                alt: "Ugandan coffee and tea products",
                title: "Ugandan Coffee & Tea",
                text: "Premium coffee and tea products grown and packaged in Uganda.",
                priceUgx: 55000,
                buttonLabel: "Add to Cart"
            },
            {
                image: "images/traditional-dance-performance.jpg",
                alt: "Ugandan cultural performance and artistic expression",
                title: "Local Art & Paintings",
                text: "Original artworks by Ugandan artists, perfect as souvenirs or gifts.",
                priceUgx: 295000,
                buttonLabel: "Add to Cart"
            },
            {
                image: "images/logo.png",
                alt: "Explore Uganda branded t-shirt",
                title: "Explore Uganda T-Shirt",
                text: "A comfortable branded keepsake designed for travelers who want to carry the journey with them.",
                priceUgx: 85000,
                buttonLabel: "Add to Cart"
            }
        ],
        cta: {
            title: "Discover More Ugandan Crafts",
            buttonLabel: "Explore Souvenirs",
            buttonHref: "plan-trip.html"
        }
    },
    blog: {
        hero: {
            title: "Travel Tips & Guides for Uganda",
            text: "Get expert advice, itineraries, and tips to make the most of your journey in the Pearl of Africa."
        },
        listingIntro: {
            kicker: "Explore More Stories",
            title: "Browse All Articles",
            text: "Discover Uganda travel guides, safari ideas, culture stories, and practical tips to help you plan with confidence."
        },
        cards: [
            {
                image: "blog pages/images/lake-munyanyange-where-to-see-flamingos-in-uganda.webp",
                alt: "Lake Munyanyange and its famous flamingo sightings",
                category: "wildlife",
                tag: "Wildlife",
                keywords: "lake munyanyange flamingos uganda queen elizabeth national park birdwatching tourists crater lake birds",
                date: "2025-09-14",
                displayDate: "September 14, 2025",
                authorName: "Maya Johnson",
                authorCountry: "United States",
                authorRole: "Cultural Journeys Contributor",
                title: "Lake Munyanyange: Where to See Flamingos in Uganda",
                text: "Discover why travelers visit this shallow crater lake for seasonal flamingo views, birdlife, and a quieter side of Queen Elizabeth National Park.",
                buttonLabel: "Read More",
                buttonHref: "blog.html"
            },
            {
                image: "blog pages/images/top-10.webp",
                alt: "Top 10 places to visit in Uganda",
                category: "destinations",
                tag: "Destinations",
                keywords: "uganda destinations gorilla trekking lakes safari travel guide",
                date: "2025-11-18",
                displayDate: "November 18, 2025",
                authorName: "Lerato Nkosi",
                authorCountry: "South Africa",
                authorRole: "Conservation Travel Journalist",
                title: "Top 10 Places to Visit in Uganda",
                text: "Discover Uganda's most iconic destinations, from gorilla trekking to breathtaking lakes.",
                buttonLabel: "Read More",
                buttonHref: "blog.html"
            },
            {
                image: "blog pages/images/itinerary.webp",
                alt: "1-week Uganda safari itinerary",
                category: "itineraries",
                tag: "Itineraries",
                keywords: "uganda safari itinerary one week parks lakes travel plan",
                date: "2025-12-07",
                displayDate: "December 7, 2025",
                authorName: "Hannah Bretton",
                authorCountry: "Scotland",
                authorRole: "Guest Tourist Contributor",
                title: "1-Week Uganda Safari Itinerary",
                text: "Plan your perfect adventure across Uganda's national parks and scenic spots with this guide.",
                buttonLabel: "Read More",
                buttonHref: "blog.html"
            },
            {
                image: "blog pages/images/packing.webp",
                alt: "What to pack for a Uganda safari",
                category: "packing",
                tag: "Packing Tips",
                keywords: "uganda safari packing list travel essentials gorilla trekking",
                date: "2026-01-22",
                displayDate: "January 22, 2026",
                authorName: "Njeri Wambui",
                authorCountry: "Kenya",
                authorRole: "Regional Travel Columnist",
                title: "What to Pack for a Safari in Uganda",
                text: "Essential packing tips to ensure a safe and comfortable trip through Uganda's wildlife parks.",
                buttonLabel: "Read More",
                buttonHref: "blog.html"
            },
            {
                image: "blog pages/images/uganda-culture.webp",
                alt: "Exploring Ugandan culture",
                category: "culture",
                tag: "Culture",
                keywords: "ugandan culture traditions festivals music dance heritage",
                date: "2025-02-02",
                displayDate: "February 2, 2025",
                authorName: "Elena Petrova",
                authorCountry: "Bulgaria",
                authorRole: "Heritage Travel Contributor",
                title: "Exploring Ugandan Culture",
                text: "Learn about local traditions, music, dance, and festivals to enrich your travel experience.",
                buttonLabel: "Read More",
                buttonHref: "blog.html"
            },
            {
                image: "blog pages/images/safety.webp",
                alt: "Safety tips for traveling in Uganda",
                category: "safety",
                tag: "Safety",
                keywords: "uganda travel safety tips safe safari advice travelers",
                date: "2026-02-13",
                displayDate: "February 13, 2026",
                authorName: "Tinashe Moyo",
                authorCountry: "Zimbabwe",
                authorRole: "Safari Logistics Writer",
                title: "Safety Tips for Travelers in Uganda",
                text: "Important advice to stay safe and enjoy a worry-free adventure in Uganda.",
                buttonLabel: "Read More",
                buttonHref: "blog.html"
            },
            {
                image: "blog pages/images/unique-wildlife.webp",
                alt: "Unique Ugandan wildlife including gorillas and rare safari species",
                category: "destinations",
                tag: "Wildlife",
                keywords: "unique ugandan wildlife gorillas chimpanzees shoebill tree climbing lions golden monkeys safari",
                date: "2025-10-29",
                displayDate: "October 29, 2025",
                authorName: "Kato Omondi",
                authorCountry: "Kenya",
                authorRole: "Wildlife Features Correspondent",
                title: "Unique Wildlife in Uganda",
                text: "Explore the rare primates, iconic birds, and unforgettable safari species that make Uganda one of Africa's most rewarding wildlife destinations.",
                buttonLabel: "Read More",
                buttonHref: "blog.html"
            }
        ],
        cta: {
            title: "Start Planning Your Uganda Adventure",
            buttonLabel: "Plan My Trip",
            buttonHref: "plan-trip.html"
        }
    }
};
