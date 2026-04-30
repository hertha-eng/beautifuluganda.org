#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BLOG_DIR="$ROOT_DIR/blog pages"

slugify() {
    printf '%s' "$1" \
        | tr '[:upper:]' '[:lower:]' \
        | sed "s/[’']/ /g" \
        | sed 's/[^a-z0-9]/-/g' \
        | sed 's/-\{2,\}/-/g' \
        | sed 's/^-//' \
        | sed 's/-$//'
}

escape_html() {
    printf '%s' "$1" \
        | sed 's/&/\&amp;/g' \
        | sed 's/</\&lt;/g' \
        | sed 's/>/\&gt;/g' \
        | sed 's/"/\&quot;/g'
}

seed_for_title() {
    cksum <<<"$1" | awk '{print $1}'
}

pick_variant() {
    local seed="$1"
    shift
    local count=$#
    local index=$((seed % count))
    local i=0
    for option in "$@"; do
        if [ "$i" -eq "$index" ]; then
            printf '%s' "$option"
            return
        fi
        i=$((i + 1))
    done
}

pick_for_title() {
    local title="$1"
    local offset="$2"
    shift 2
    local seed
    seed="$(seed_for_title "$title")"
    pick_variant $((seed + offset)) "$@"
}

title_lc() {
    printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | sed "s/[’']/ /g"
}

lead_image_for_category() {
    local category="$1"
    local title="$2"
    local lower
    lower="$(title_lc "$title")"

    case "$lower" in
        *bwindi*|*gorilla*) printf 'images/gorilla-trek.webp' ;;
        *chimpanzee*|*chimpanzees*|*kibale*) printf 'images/kibale.webp' ;;
        *ziwa*|*rhino*) printf 'images/ziwa-rhino.webp' ;;
        *golden*monkey*|*mgahinga*) printf 'images/golden-monkey-mgahinga.webp' ;;
        *lake*mburo*) printf 'images/lake-mburo-zebra.webp' ;;
        *budongo*) printf 'images/budongo-forest.webp' ;;
        *birding*|*shoebill*) printf 'images/shoebill.webp' ;;
        *murchison*falls*|*waterfalls*|*sipi*falls*|*aruu*falls*|*sezibwa*falls*)
            case "$lower" in
                *sipi*) printf 'images/sipi-falls.webp' ;;
                *aruu*) printf 'images/aruu-falls.webp' ;;
                *sezibwa*) printf 'images/sezibwa-falls.webp' ;;
                *) printf 'images/murchison-falls.webp' ;;
            esac
            ;;
        *murchison*|*safari*) printf 'images/murchison-safari.webp' ;;
        *queen*elizabeth*) printf 'images/queen-elizabeth-NP.webp' ;;
        *bunyonyi*) printf 'images/Lake-Bunyonyi-Uganda.webp' ;;
        *lake*mutanda*|*jinja*|*nile*|*rafting*) printf 'images/nile-rafting.webp' ;;
        *lake*victoria*|*ssese*|*private*islands*|*honeymoon*) printf 'images/ssese-islands.webp' ;;
        *ngamba*) printf 'images/ngamba-island-camp.webp' ;;
        *kazinga*) printf 'images/queen-elizabeth.webp' ;;
        *rwenzori*) printf 'images/rwenzori.webp' ;;
        *mount*elgon*|*elgon*) printf 'images/mount-elgon.webp' ;;
        *sabinyo*) printf 'images/mount-sabinyo.webp' ;;
        *amabere*|*crater*lakes*) printf 'images/fort-portal-crater-lake.webp' ;;
        *fort*portal*) printf 'images/fort-portal-town.webp' ;;
        *mabira*) printf 'images/mabira-forest.webp' ;;
        *moroto*) printf 'images/mount-moroto.webp' ;;
        *karamoja*) printf 'images/karamojong-dance.webp' ;;
        *kasubi*) printf 'images/kasubi-tombs.webp' ;;
        *namugongo*) printf 'images/namugongo-basilica.webp' ;;
        *museum*) printf 'images/uganda-museum-kampala.webp' ;;
        *bahai*|*bahá*|*kampala*) printf 'images/Kampala-Capital-City.webp' ;;
        *entebbe*) printf 'images/entebbe-aerial.webp' ;;
        *culture*|*tribes*|*festival*|*ndere*) printf 'images/happy_ugandans.webp' ;;
        *food*|*coffee*) printf 'images/coffee-tea.webp' ;;
        *instagram*|*photography*) printf 'images/gorilla-trek.webp' ;;
        *sunset*|*landscape*|*beautiful*|*pearl*of*africa*|*next*destination*|*best*kept*secret*)
            printf 'images/wild-murchison.webp'
            ;;
        *budget*|*backpacking*|*public*transport*|*mistakes*|*digital*nomad*)
            printf 'images/market-ug-meeting.webp'
            ;;
        *visa*|*checklist*|*packing*|*best*time*|*travel*tips*|*first-time*visitor*|*first*timers*|*road*trip*)
            printf 'images/home-hero.webp'
            ;;
        *family*|*solo*travel*|*romantic*) printf 'images/happy_ugandans.webp' ;;
        *)
            case "$category" in
                wildlife) printf 'images/gorilla-trek.webp' ;;
                waterfalls) printf 'images/murchison-falls.webp' ;;
                adventure) printf 'images/rwenzori.webp' ;;
                islands) printf 'images/ssese-islands.webp' ;;
                culture) printf 'images/happy_ugandans.webp' ;;
                cities) printf 'images/Kampala-Capital-City.webp' ;;
                travel-tips) printf 'images/home-hero.webp' ;;
                *) printf 'images/wild-murchison.webp' ;;
            esac
            ;;
    esac
}

image_alt_for_category() {
    printf '%s' "$2"
}

scene_line() {
    local category="$1"
    local title="$2"
    local lower
    lower="$(title_lc "$title")"
    case "$lower" in
        *"best national parks"*|*"top wildlife experiences"*|*"ultimate uganda safari itinerary"*|*"7-day uganda travel plan"*|*"14-day uganda adventure guide"*)
            pick_for_title "$title" 1 \
                "Picture the trip unfolding in chapters: misty forests one day, open savannah the next, then boat water flashing in the sun while elephants and hippos gather at the edge." \
                "These are the journeys that show Uganda at full stretch, where gorilla country, classic safari country, and quieter scenic stops all fit into one rewarding route." \
                "What makes this style of Uganda travel so compelling is the contrast, moving from rainforest hush to wide golden plains without the trip ever feeling repetitive."
            ;;
        *"best time"*|*"visa"*|*"packing"*|*"cost"*|*"budget"*|*"luxury"*|*"backpacking"*|*"first-time visitor"*|*"tips for first-timers"*|*"mistakes to avoid"*|*"travel checklist"*|*"public transport"*|*"digital nomads"*|*"road trip guide"*)
            pick_for_title "$title" 1 \
                "Readers usually come to this topic because they want the trip to feel smoother before they even land, with fewer surprises and more confidence about how Uganda works day to day." \
                "This kind of planning content matters because Uganda is wonderfully varied, and a little clarity around seasons, movement, money, or pacing can shape the whole experience." \
                "Good preparation does not make the journey less exciting. It simply makes it easier to spend more time enjoying Uganda and less time second-guessing logistics."
            ;;
        *"uganda vs kenya"*|*"uganda vs rwanda"*|*"east africa travel"*)
            pick_for_title "$title" 1 \
                "Comparison guides matter because many travelers are not choosing whether to travel, but where to begin and what kind of East African experience will suit them best." \
                "These decisions often come down to pace, cost, scenery, wildlife style, and whether the traveler wants one headline moment or a broader mix of experiences." \
                "Uganda stands out in these conversations because it offers rainforest, savannah, lakes, mountains, and culture within one relatively compact journey."
            ;;
        *"instagram"*|*"photography"*|*"sunsets"*|*"landscapes"*)
            pick_for_title "$title" 1 \
                "This is the visual side of Uganda, where the light, terrain, and atmosphere do as much work as the headline attraction itself." \
                "For travelers who remember destinations through images, Uganda keeps offering scenes that shift beautifully through the day, from misty mornings to copper-colored evenings." \
                "The appeal here is not only in finding beautiful views, but in how different each one feels: dramatic, quiet, luminous, or unexpectedly intimate."
            ;;
        *"hidden gems"*|*"bucket list"*|*"best kept secret"*|*"next destination"*|*"10 reasons to visit"*|*"why uganda is called the pearl"*|*"why uganda should be your next destination"*)
            pick_for_title "$title" 1 \
                "This kind of story works because Uganda often surprises people most when they stop thinking of it as a single attraction and start seeing it as a whole travel mood." \
                "Travelers are drawn in by the country's variety, but they stay interested because the destinations feel textured, welcoming, and far less overworked than many better-known routes." \
                "The more readers imagine the full shape of a Uganda journey, the easier it becomes to understand why so many visitors feel they discovered something special rather than obvious."
            ;;
        *"real tourists"*|*"festivals"*|*"coffee tours"*|*"eco-tourism"*|*"family travel"*|*"solo travel"*|*"romantic"*)
            pick_for_title "$title" 1 \
                "This topic opens up the more personal side of Uganda travel, where the mood of the journey depends as much on how you travel as where you go." \
                "For many visitors, these are the details that make the trip feel more human: shared stories, music, food, slower mornings, and experiences shaped by personal style." \
                "Readers interested in this side of Uganda are usually looking for trips that feel more lived-in, more personal, and more memorable than a simple checklist can offer."
            ;;
        *)
            case "$category" in
        wildlife)
            pick_for_title "$title" 1 \
                "Think of early light on long grass, the hush before a guide points into the trees, and that heartbeat moment when the landscape suddenly turns alive." \
                "This is the side of Uganda where mist hangs low, bird calls echo through thick cover, and every bend in the trail feels like it could reveal something unforgettable." \
                "The mood here is pure safari anticipation: dusty tracks, distant movement in the bush, and the quiet thrill of knowing something extraordinary may be just ahead." \
                "Uganda's wildlife settings have a way of sharpening every sense, from the crunch of boots on forest soil to the sound of water and wind carrying through open plains."
            ;;
        waterfalls)
            pick_for_title "$title" 1 \
                "It is the kind of setting where spray catches the light, water shapes the whole soundscape, and even a short stop can feel cinematic." \
                "These places stay in people's memory because they mix movement and stillness so well: rushing water in one direction, deep quiet landscapes in another." \
                "Expect bright air, wide views, and the kind of scenery that makes travelers put the phone down for a second just to take it in properly." \
                "Uganda's lakes, rivers, and falls have a calming drama to them, whether you are watching a powerful cascade or gliding through gentler water."
            ;;
        adventure)
            pick_for_title "$title" 1 \
                "You feel it first in the terrain: steeper paths, changing weather, big views opening gradually, and that satisfying sense that every step is earning the experience." \
                "Adventure in Uganda rarely feels manufactured. It feels raw, scenic, and real, with landscapes that constantly shift from forest to ridge to open sky." \
                "This is where travel becomes physical in the best way, with boots, breath, altitude, and long views combining into something vivid and memorable." \
                "There is an energy to Uganda's adventure routes that keeps people engaged, because the ground underfoot is always changing and the scenery never settles into one mood."
            ;;
        islands)
            pick_for_title "$title" 1 \
                "The pace softens here. Water reflects the sky, boat rides replace long drives, and the whole experience feels lighter on the shoulders." \
                "These are the places people choose when they want beauty without pressure: slow mornings, softer horizons, and enough space to fully exhale." \
                "Uganda's island and lakeside escapes work because they feel restorative, with breezes, quiet shorelines, and sunsets that stretch the day a little longer." \
                "There is a calm rhythm to these destinations, where the journey often includes ferries, canoe rides, and the kind of scenery that encourages you to linger."
            ;;
        culture)
            pick_for_title "$title" 1 \
                "What makes these experiences memorable is not just what you see, but what you hear and feel: drums, storytelling, ritual, welcome, and the pulse of everyday life." \
                "Cultural travel in Uganda is full of texture, from the color of fabrics and performance spaces to the warmth of conversation and shared meals." \
                "These stories come alive through people, place, and tradition, making the experience feel much richer than a quick stop for photos." \
                "Uganda's cultural landmarks and traditions hold attention because they carry living meaning, not just history behind glass."
            ;;
        cities)
            pick_for_title "$title" 1 \
                "Urban Uganda is full of motion: taxis and bodas weaving through traffic, music floating out of doorways, and city views that change by the hour." \
                "These destinations work best when you lean into the rhythm around you, from markets and cafes to lakeside walks and rooftop evenings." \
                "The appeal here is contrast. One moment you are in a busy street lined with shops and food stalls, and the next you are in a quieter corner with a completely different mood." \
                "Cities in Uganda feel energetic without being one-dimensional, which is why so many travelers end up remembering the atmosphere as much as the attractions."
            ;;
        travel-tips)
            pick_for_title "$title" 1 \
                "For many travelers, the difference between a good Uganda trip and a great one comes down to timing, pacing, and knowing what to expect before arrival." \
                "Planning content matters here because Uganda offers so much variety, and the more clearly a traveler understands the options, the smoother the experience tends to be." \
                "Useful advice goes a long way in Uganda, especially when a single trip may include parks, cities, lakes, road travel, changing weather, and very different travel styles." \
                "Readers usually come to this kind of article because they want confidence, clarity, and a stronger sense of how a Uganda journey fits together on the ground."
            ;;
        *)
            printf 'Uganda has a way of drawing people in slowly at first and then all at once, through atmosphere, scenery, and the feeling that every region offers something different.'
            ;;
            esac
            ;;
    esac
}

why_line() {
    local category="$1"
    local title="$2"
    local lower
    lower="$(title_lc "$title")"
    case "$lower" in
        *"best national parks"*|*"top wildlife experiences"*|*"ultimate uganda safari itinerary"*|*"7-day uganda travel plan"*|*"14-day uganda adventure guide"*)
            pick_for_title "$title" 2 \
                "Readers love this kind of Uganda article because it helps them imagine how the country's best regions fit together instead of seeing each destination in isolation." \
                "The strongest safari planning stories work when they explain not only where to go, but what mood each park or stop brings to the wider journey." \
                "That is what makes Uganda so compelling for itinerary-minded travelers. The variety feels real, and each major stop adds a different rhythm to the trip."
            ;;
        *"best time"*|*"visa"*|*"packing"*|*"cost"*|*"budget"*|*"luxury"*|*"backpacking"*|*"first-time visitor"*|*"tips for first-timers"*|*"mistakes to avoid"*|*"travel checklist"*|*"public transport"*|*"digital nomads"*|*"road trip guide"*)
            pick_for_title "$title" 2 \
                "What readers usually want from this guide is reassurance that Uganda can be navigated confidently with the right information in hand." \
                "The value here is practical freedom. When travelers understand the basics clearly, they can make better choices about time, money, comfort, and route." \
                "This kind of article earns trust when it feels realistic, clear, and close to the way the trip actually unfolds on the ground."
            ;;
        *"uganda vs kenya"*|*"uganda vs rwanda"*|*"east africa travel"*)
            pick_for_title "$title" 2 \
                "Comparison pieces like this matter because travelers want to know which destination matches their priorities, not just which destination is most famous." \
                "The most useful comparisons are the ones that explain style as much as spectacle, because the right choice often depends on what kind of journey the traveler actually wants." \
                "Uganda usually enters this conversation strongly because it offers more contrast than many people expect before they begin researching."
            ;;
        *"instagram"*|*"photography"*|*"sunsets"*|*"landscapes"*)
            pick_for_title "$title" 2 \
                "Visual travel guides matter because scenery in Uganda is rarely one-note. Light, altitude, weather, and movement keep changing the feeling of the same place." \
                "This is why travelers who care about images often become some of Uganda's biggest advocates. The country gives them atmosphere, not just postcard views." \
                "The most memorable visual moments here usually come from contrast: bright water against dark hills, gold grass under storm clouds, or city lights after sunset."
            ;;
        *"hidden gems"*|*"bucket list"*|*"best kept secret"*|*"next destination"*|*"10 reasons to visit"*|*"why uganda is called the pearl"*|*"why uganda should be your next destination"*)
            pick_for_title "$title" 2 \
                "Readers respond to this kind of article when it makes Uganda feel not only desirable, but vivid and emotionally easy to imagine." \
                "The strongest inspiration pieces work because they balance practical appeal with atmosphere, helping a reader picture what it would actually feel like to be there." \
                "That is where Uganda is especially persuasive: it feels grand without feeling distant, and welcoming without feeling over-scripted."
            ;;
        *)
            case "$category" in
        wildlife)
            pick_for_title "$title" 2 \
                "People are drawn to this kind of Uganda experience because it offers the excitement of discovery without losing the sense of place around it." \
                "What visitors remember most is often the build-up as much as the sighting itself: the guide's voice lowering, the vehicle slowing, the forest or savannah suddenly feeling charged." \
                "Wildlife travel here feels immersive because the animals are only part of the story. The terrain, the air, the silence, and the scale all shape the memory."
            ;;
        waterfalls)
            pick_for_title "$title" 2 \
                "Travelers love this side of Uganda because water transforms the whole setting, making every viewpoint feel alive and every pause more meaningful." \
                "It is easy to understand the appeal once you are there: the constant movement of water gives the place energy, while the wider scenery creates room to slow down and look around." \
                "These destinations balance drama and calm beautifully, which is why they suit both photographers and travelers simply looking for a memorable atmosphere."
            ;;
        adventure)
            pick_for_title "$title" 2 \
                "Adventure-focused travelers often rank Uganda highly because the country gives real variety, from easier scenic walks to routes that feel properly demanding." \
                "There is a satisfying honesty to these experiences. They feel earned, scenic, and full of small moments that make the destination more memorable than a simple viewpoint ever could." \
                "The attraction is not only the summit, trail, or activity itself. It is the way the journey keeps changing in mood, weather, and scenery as you move through it."
            ;;
        islands)
            pick_for_title "$title" 2 \
                "These escapes appeal to people who want scenery with breathing room, somewhere the journey feels restorative rather than rushed." \
                "The charm often lies in the details: the stillness of early mornings, the sound of water against a boat, and the slower rhythm that settles in once you arrive." \
                "Travelers who spend time in Uganda's calmer corners often describe them as the part of the trip that gave everything else balance."
            ;;
        culture)
            pick_for_title "$title" 2 \
                "Readers interested in this topic are usually searching for the soul of a place, not only its landmarks, and Uganda offers that depth generously." \
                "The strongest cultural experiences are the ones that reveal how history, belief, art, and everyday life are still intertwined in the present." \
                "This is what gives the experience weight. It feels personal, grounded, and connected to how people actually live, celebrate, and remember."
            ;;
        cities)
            pick_for_title "$title" 2 \
                "City-focused travelers often discover that Uganda's urban destinations are at their best when you let them unfold gradually rather than rushing through them." \
                "There is always more texture than first appears, whether that means creative food scenes, lakeside pauses, street energy, or neighborhoods with very different personalities." \
                "That variety is what keeps these places interesting. The city shifts from morning to afternoon to night, giving the visit a natural momentum."
            ;;
        travel-tips)
            pick_for_title "$title" 2 \
                "Useful travel guidance helps readers picture the journey before it starts, which is especially valuable in a destination as varied as Uganda." \
                "The best planning advice makes a traveler feel steady and prepared, without draining the sense of excitement out of the trip." \
                "That balance matters because Uganda rewards well-planned travel, but it also leaves room for surprise, spontaneity, and moments you never quite expected."
            ;;
        *)
            printf 'What makes this experience memorable is the way it blends practical travel value with a strong sense of place.'
            ;;
            esac
            ;;
    esac
}

expect_line() {
    local category="$1"
    local title="$2"
    local lower
    lower="$(title_lc "$title")"
    case "$lower" in
        *"best national parks"*|*"top wildlife experiences"*|*"ultimate uganda safari itinerary"*|*"7-day uganda travel plan"*|*"14-day uganda adventure guide"*)
            pick_for_title "$title" 3 \
                "Expect the discussion to move between rainforest, savannah, water, and road time, because that contrast is exactly what gives Uganda itineraries their appeal." \
                "What many readers find most helpful is understanding which experiences feel intense, which feel scenic, and which ones create breathing space between the bigger wildlife highlights." \
                "A good Uganda route is rarely about one star attraction alone. It is about how the stops support each other and build momentum across the whole journey."
            ;;
        *"best time"*|*"visa"*|*"packing"*|*"cost"*|*"budget"*|*"luxury"*|*"backpacking"*|*"first-time visitor"*|*"tips for first-timers"*|*"mistakes to avoid"*|*"travel checklist"*|*"public transport"*|*"digital nomads"*|*"road trip guide"*)
            pick_for_title "$title" 3 \
                "Readers should expect practical answers that reduce uncertainty, especially around what changes seasonally and what stays fairly simple once you understand the basics." \
                "The most useful planning advice usually explains trade-offs clearly, such as comfort versus cost, flexibility versus structure, or speed versus scenery." \
                "What matters most here is helping a traveler feel prepared without making the destination seem harder than it really is."
            ;;
        *"uganda vs kenya"*|*"uganda vs rwanda"*|*"east africa travel"*)
            pick_for_title "$title" 3 \
                "Expect a comparison that goes beyond headline wildlife and looks at how each destination feels, moves, and fits different travel styles." \
                "The most helpful part for readers is often not the list of differences itself, but the clearer understanding of what they personally value most in a trip." \
                "Once those priorities are clear, the destination choice becomes far less confusing and much more exciting."
            ;;
        *"instagram"*|*"photography"*|*"sunsets"*|*"landscapes"*)
            pick_for_title "$title" 3 \
                "Expect the conversation to revolve around timing, atmosphere, and viewpoints, because the most compelling images in Uganda often depend on those details." \
                "Travelers should picture changing skies, layered terrain, and the kind of light that can make the same place feel dramatic one hour and gentle the next." \
                "The appeal is not only in beautiful scenes, but in how varied those scenes become across the country."
            ;;
        *)
            case "$category" in
        wildlife)
            pick_for_title "$title" 3 \
                "Expect movement, pauses, and a lot of anticipation. A wildlife day in Uganda can shift quickly from quiet observation to a sudden sighting that changes the whole mood of the trip." \
                "Visitors should expect long stretches of beautiful scenery as well as the headline moments, because the journey between sightings is often part of what makes the experience feel immersive." \
                "What surprises many first-time travelers is how emotional these moments can feel, especially when the setting is as dramatic as the wildlife itself."
            ;;
        waterfalls)
            pick_for_title "$title" 3 \
                "Visitors can expect scenery that changes with the light, the weather, and even the angle from which it is viewed, making return glances feel just as rewarding as first impressions." \
                "The experience often works best at a gentle pace, giving you time to walk, pause, photograph, and simply watch how the landscape moves around the water." \
                "Some travelers arrive expecting a quick stop and leave wishing they had built in more time, because these places have a way of making people slow down naturally."
            ;;
        adventure)
            pick_for_title "$title" 3 \
                "Expect a trip that engages the body as much as the eyes, with routes or activities that make the scenery feel earned rather than simply observed." \
                "The reward usually comes in layers: effort, changing viewpoints, better air, wider panoramas, and finally the kind of satisfaction that only active travel creates." \
                "Travelers who enjoy this style of trip tend to remember the progression of the experience, not just the highlight at the end."
            ;;
        islands)
            pick_for_title "$title" 3 \
                "Expect a softer rhythm, where the destination invites lingering rather than rushing, and where small moments become part of the appeal." \
                "The atmosphere is often shaped by the water itself, which changes the sound, pace, and feel of the whole day." \
                "These are the places where readers should imagine calm horizons, slower mornings, and enough stillness to notice details they might miss elsewhere."
            ;;
        culture)
            pick_for_title "$title" 3 \
                "Visitors should expect to learn through atmosphere as much as information, because the strongest cultural experiences are felt in sound, movement, and setting as much as in explanation." \
                "What makes this meaningful is that culture in Uganda is rarely presented as something distant. It is often visible in live performance, living tradition, language, food, and ritual." \
                "Readers can expect a richer visit when they approach these experiences with curiosity and enough time to listen rather than only move on."
            ;;
        cities)
            pick_for_title "$title" 3 \
                "Expect a destination with layers. The obvious sights matter, but so do the side streets, viewpoints, neighborhoods, cafes, and late-afternoon atmosphere around them." \
                "The pleasure of city travel here often comes from contrast, moving from busy to calm, modern to historic, practical to scenic within a surprisingly short distance." \
                "That variety gives urban Uganda its appeal, especially for readers who enjoy places that feel active, social, and full of small discoveries."
            ;;
        travel-tips)
            pick_for_title "$title" 3 \
                "Readers can expect the most value when practical planning is paired with realistic expectations about pace, distance, and how much Uganda offers in one trip." \
                "Helpful travel advice should make the country feel more accessible, not more intimidating, and that is especially true for first-time visitors." \
                "What matters most is clarity: understanding how seasons, transport, activities, budgets, and personal travel style shape the experience."
            ;;
        *)
            printf 'Visitors can expect a trip that combines memorable visuals with the kind of atmosphere that stays with people afterwards.'
            ;;
            esac
            ;;
    esac
}

planning_line() {
    local category="$1"
    local title="$2"
    local lower
    lower="$(title_lc "$title")"
    case "$lower" in
        *"best national parks"*|*"top wildlife experiences"*|*"ultimate uganda safari itinerary"*|*"7-day uganda travel plan"*|*"14-day uganda adventure guide"*)
            pick_for_title "$title" 4 \
                "When planning around multiple parks or major experiences, the key is pacing. Long drives, permit timing, and where to break the journey can shape the trip just as much as the headline attractions." \
                "Travelers usually enjoy Uganda's strongest itineraries more when they accept that not every highlight needs to be squeezed into one route." \
                "The best plans often choose rhythm over volume, balancing bigger wildlife moments with scenic recovery and realistic transfer days."
            ;;
        *"best time"*|*"visa"*|*"packing"*|*"cost"*|*"budget"*|*"luxury"*|*"backpacking"*|*"first-time visitor"*|*"tips for first-timers"*|*"mistakes to avoid"*|*"travel checklist"*|*"public transport"*|*"digital nomads"*|*"road trip guide"*)
            pick_for_title "$title" 4 \
                "The most useful planning approach is to focus first on the essentials that genuinely affect the trip: season, route, comfort level, and the experiences that matter most." \
                "Travelers benefit most when they make a few smart decisions early, because that clarity tends to simplify everything else later." \
                "Good planning here is not about over-controlling the trip. It is about creating enough structure for the journey to feel relaxed once it begins."
            ;;
        *"uganda vs kenya"*|*"uganda vs rwanda"*|*"east africa travel"*)
            pick_for_title "$title" 4 \
                "A smart comparison becomes most useful when readers start matching destinations to their actual priorities, whether that means primates, classic safari, road pacing, budget, or atmosphere." \
                "The best planning choice is usually the one that reflects the traveler's style rather than the one with the loudest reputation." \
                "That perspective helps readers choose confidently instead of getting stuck in destination research for too long."
            ;;
        *"instagram"*|*"photography"*|*"sunsets"*|*"landscapes"*)
            pick_for_title "$title" 4 \
                "Photogenic travel in Uganda usually rewards patience, early starts, weather awareness, and enough room in the route to return to a viewpoint when the light changes." \
                "Travelers who care about the visual side of the trip often benefit from slowing down rather than adding more stops." \
                "The strongest images tend to come from well-timed moments, not just famous names on an itinerary."
            ;;
        *)
            case "$category" in
        wildlife)
            pick_for_title "$title" 4 \
                "Planning well usually means thinking about permits, driving times, park routines, and how to match this experience with nearby highlights rather than trying to rush too much into one day." \
                "The best wildlife trips tend to leave room for patience, because the strongest moments are often the ones that arrive without warning after a quieter stretch." \
                "Travelers usually get more out of this kind of journey when they give it enough time, choose strong local guiding, and allow the destination to set the pace."
            ;;
        waterfalls)
            pick_for_title "$title" 4 \
                "A well-planned visit usually works best with time for walking, viewpoints, and one or two slower pauses rather than treating the stop as a quick photo opportunity." \
                "If possible, pair the experience with nearby scenery, culture, or a relaxed overnight stay, because water-focused destinations often reveal more when the schedule is not rushed." \
                "The most enjoyable plans are the ones that leave space for weather, changing light, and the simple pleasure of staying longer than expected."
            ;;
        adventure)
            pick_for_title "$title" 4 \
                "Preparation matters here, especially around weather, fitness, transport, and how the activity fits into the rest of the itinerary." \
                "The strongest adventure plans are realistic about effort and timing, giving the experience enough room to feel rewarding instead of compressed." \
                "Travelers often enjoy these trips most when they combine challenge with recovery, pairing active days with softer scenic or cultural stops."
            ;;
        islands)
            pick_for_title "$title" 4 \
                "These destinations usually work best when the itinerary reflects their pace, with enough time for boat schedules, relaxed arrivals, and unhurried time by the water." \
                "A good plan often includes less movement, not more, allowing the setting itself to become the main attraction." \
                "Readers who want the most from this kind of trip should think in terms of atmosphere and downtime as much as checklists."
            ;;
        culture)
            pick_for_title "$title" 4 \
                "Planning around cultural experiences often means checking performance times, opening hours, local etiquette, and how best to visit with attention rather than haste." \
                "The most rewarding visits usually happen when travelers give themselves enough time to observe, ask questions, and absorb the atmosphere around them." \
                "If this is a key part of the trip, it often pairs beautifully with nearby food experiences, markets, historic sites, or city exploration."
            ;;
        cities)
            pick_for_title "$title" 4 \
                "Urban travel goes best when the day has shape but still leaves room for wandering, traffic changes, and the possibility of stopping somewhere interesting along the way." \
                "It often helps to mix anchor experiences with unstructured time, because the mood of a city is easier to feel when every hour is not tightly planned." \
                "Readers usually enjoy these destinations more when they combine the major highlights with places locals actually spend time."
            ;;
        travel-tips)
            pick_for_title "$title" 4 \
                "The most useful takeaway is usually not one single tip, but the confidence that comes from seeing how the trip can be organized clearly and realistically." \
                "Uganda planning improves quickly when readers focus on pace, priorities, and season, rather than trying to fit every possible highlight into one route." \
                "Good preparation here is less about rigid control and more about making smart decisions early so the travel itself feels smoother."
            ;;
        *)
            printf 'Good planning usually makes the experience feel fuller, calmer, and easier to enjoy once you are there.'
            ;;
            esac
            ;;
    esac
}

closing_line() {
    local category="$1"
    local title="$2"
    local lower
    lower="$(title_lc "$title")"
    case "$lower" in
        *"best national parks"*|*"top wildlife experiences"*|*"ultimate uganda safari itinerary"*|*"7-day uganda travel plan"*|*"14-day uganda adventure guide"*)
            pick_for_title "$title" 5 \
                "What makes Uganda routes so memorable is the sequence of contrasts they create, one day immersive and green, the next wide, golden, and open." \
                "A well-shaped Uganda itinerary lingers in memory because it feels layered rather than repetitive, with each stop sharpening appreciation for the next." \
                "For travelers dreaming about the country's biggest highlights, this is exactly the kind of article that helps turn a wish list into a believable, exciting route."
            ;;
        *"best time"*|*"visa"*|*"packing"*|*"cost"*|*"budget"*|*"luxury"*|*"backpacking"*|*"first-time visitor"*|*"tips for first-timers"*|*"mistakes to avoid"*|*"travel checklist"*|*"public transport"*|*"digital nomads"*|*"road trip guide"*)
            pick_for_title "$title" 5 \
                "Good planning advice earns its place when it makes the destination feel more reachable, and that is exactly what Uganda deserves." \
                "For many readers, confidence is the real takeaway from a guide like this, because once the unknowns settle, the excitement rises quickly." \
                "This kind of clarity is what helps travelers move from browsing to booking with far less hesitation."
            ;;
        *"uganda vs kenya"*|*"uganda vs rwanda"*|*"east africa travel"*)
            pick_for_title "$title" 5 \
                "The point of a comparison like this is not to flatten destinations into a ranking, but to help readers recognize where their own best trip is most likely to happen." \
                "Once the differences are understood clearly, Uganda's strengths become much easier to appreciate on their own terms." \
                "That is often the moment when a reader stops comparing in the abstract and starts picturing a real itinerary."
            ;;
        *"instagram"*|*"photography"*|*"sunsets"*|*"landscapes"*)
            pick_for_title "$title" 5 \
                "Uganda stays with visually minded travelers because it keeps changing character, offering scenes that feel luminous, textured, and unexpectedly varied." \
                "For readers chasing atmosphere as much as beauty, this side of Uganda often becomes one of the strongest reasons to go." \
                "These are the articles that help people imagine not just where to point a camera, but why the country feels so striking in the first place."
            ;;
        *)
            case "$category" in
        wildlife)
            pick_for_title "$title" 5 \
                "For many visitors, these are the stories that define Uganda long after the flight home: the tracks, the silence, the sudden movement, and the feeling of seeing something truly wild in a place that still feels alive." \
                "This is the kind of Uganda memory that tends to stay vivid: not just because of what was seen, but because of how intensely the whole setting was felt." \
                "Few travel experiences combine atmosphere and emotion quite like this, which is why wildlife remains one of Uganda's strongest invitations to return."
            ;;
        waterfalls)
            pick_for_title "$title" 5 \
                "It is easy to see why travelers keep revisiting Uganda's water landscapes in memory. They feel cinematic without losing their calm, and dramatic without losing their beauty." \
                "These are the destinations that make people slow their breathing, steady their gaze, and simply stay with the scene for longer than planned." \
                "When readers imagine Uganda in its most scenic mood, it is often places like these that come first."
            ;;
        adventure)
            pick_for_title "$title" 5 \
                "Adventure in Uganda leaves a lasting impression because it engages effort, scenery, and emotion at the same time." \
                "This is the kind of experience that rewards people twice: once in the moment, and again later when they remember just how vivid it all felt." \
                "For travelers who like movement, challenge, and a sense of earned perspective, this side of Uganda is hard to forget."
            ;;
        islands)
            pick_for_title "$title" 5 \
                "What stays with most travelers is not just the view, but the pace of the place and the relief of being somewhere that lets the trip breathe." \
                "These quieter destinations remind visitors that some of Uganda's strongest moments are the restful ones." \
                "For anyone craving beauty with room to breathe, this part of Uganda often becomes the part they wish they had extended."
            ;;
        culture)
            pick_for_title "$title" 5 \
                "Cultural travel in Uganda lingers in the mind because it gives visitors something beyond scenery: connection, meaning, and a stronger sense of the people behind the place." \
                "These are the experiences that deepen a journey and make it feel more human, more grounded, and ultimately more memorable." \
                "For readers who want Uganda to feel personal rather than distant, this is often where the trip gains its richest meaning."
            ;;
        cities)
            pick_for_title "$title" 5 \
                "Urban travel here stays memorable because the atmosphere keeps moving, changing, and revealing different sides of itself throughout the day." \
                "These city experiences often surprise visitors most, because they show how much Uganda offers beyond parks and classic safari imagery." \
                "For readers who like destinations with rhythm, character, and constant motion, this side of Uganda is especially rewarding."
            ;;
        travel-tips)
            pick_for_title "$title" 5 \
                "The value of this kind of guide is simple: it helps readers move from vague interest to confident planning." \
                "When a traveler understands the practical side clearly, the exciting part of Uganda becomes easier to enjoy fully." \
                "That is what makes thoughtful planning worth it. It clears space for the trip itself to feel lighter, richer, and more memorable."
            ;;
        *)
            printf 'It is the kind of Uganda experience that keeps its shape in memory long after the trip is over.'
            ;;
            esac
            ;;
    esac
}

heading_one() {
    local category="$1"
    local title="$2"
    case "$category" in
        wildlife) pick_for_title "$title" 6 "The Moment The Landscape Starts Breathing" "Why This Part Of Uganda Feels So Alive" "Where The Wildness Becomes Real" ;;
        waterfalls) pick_for_title "$title" 6 "Where Water Changes The Mood Of The Journey" "Why These Views Hold People Still" "The Kind Of Scenery People Keep Talking About" ;;
        adventure) pick_for_title "$title" 6 "Where Effort Turns Into View" "Why Active Travelers Remember This Route" "What Makes The Journey Feel Earned" ;;
        islands) pick_for_title "$title" 6 "Where Uganda Slows Down Beautifully" "Why Travelers Stay Longer Than Planned" "The Quiet Side Of The Journey" ;;
        culture) pick_for_title "$title" 6 "Where Uganda Speaks In Story, Sound, And Memory" "Why This Experience Feels Deeper Than A Visit" "The Human Side Of The Journey" ;;
        cities) pick_for_title "$title" 6 "Where The City's Energy Starts To Make Sense" "Why Urban Uganda Works So Well" "The Rhythm That Pulls Visitors In" ;;
        travel-tips) pick_for_title "$title" 6 "Why This Guide Matters Before You Go" "What Smart Planning Changes" "The Difference Good Preparation Makes" ;;
        *) printf 'Why This Experience Stays With People' ;;
    esac
}

heading_two() {
    local category="$1"
    local title="$2"
    case "$category" in
        wildlife) pick_for_title "$title" 7 "What Visitors Feel On The Ground" "What Makes The Experience So Memorable" "What To Expect Beyond The Headline Moment" ;;
        waterfalls) pick_for_title "$title" 7 "What It Feels Like To Be There" "What Visitors Notice First" "Why The Atmosphere Matters As Much As The View" ;;
        adventure) pick_for_title "$title" 7 "How The Journey Builds Momentum" "What The Experience Feels Like In Real Time" "What To Expect On The Route" ;;
        islands) pick_for_title "$title" 7 "What The Pace Feels Like" "What Makes These Places So Restorative" "What Visitors Settle Into After Arrival" ;;
        culture) pick_for_title "$title" 7 "What Visitors Actually Connect With" "What Gives The Experience Its Weight" "How The Atmosphere Carries The Story" ;;
        cities) pick_for_title "$title" 7 "What Visitors Notice Once They Slow Down" "How The City Reveals Itself" "What Makes The Experience More Than A Checklist" ;;
        travel-tips) pick_for_title "$title" 7 "What Readers Should Keep In Mind" "What Visitors Can Realistically Expect" "How To Think About The Trip Clearly" ;;
        *) printf 'What Visitors Can Expect' ;;
    esac
}

heading_three() {
    local category="$1"
    local title="$2"
    case "$category" in
        wildlife) pick_for_title "$title" 8 "How To Plan It Well" "How To Get More Out Of The Experience" "Planning Details That Matter" ;;
        waterfalls) pick_for_title "$title" 8 "How To Slow Down And Enjoy It Properly" "When To Go And How To Shape The Visit" "Planning A Better Visit" ;;
        adventure) pick_for_title "$title" 8 "How To Prepare For The Best Experience" "Timing, Effort, And Pacing" "Planning The Adventure Well" ;;
        islands) pick_for_title "$title" 8 "How To Build Time Around The Atmosphere" "Planning For A Slower, Better Stay" "How To Let The Place Work On You" ;;
        culture) pick_for_title "$title" 8 "How To Visit With More Depth" "Planning A More Meaningful Experience" "How To Get More Than A Surface Visit" ;;
        cities) pick_for_title "$title" 8 "How To Shape A Better City Day" "Planning Without Losing Spontaneity" "How To Explore Without Rushing" ;;
        travel-tips) pick_for_title "$title" 8 "How To Use This Advice Well" "Planning With Confidence" "Turning Advice Into A Better Trip" ;;
        *) printf 'Planning Tips Before You Go' ;;
    esac
}

cta_title_for_category() {
    case "$1" in
        wildlife) printf 'Ready To Experience Uganda In The Wild?' ;;
        waterfalls) printf 'Ready To See Uganda At Its Most Scenic?' ;;
        adventure) printf 'Ready For A More Active Side Of Uganda?' ;;
        islands) printf 'Ready For A Slower, Softer Uganda Escape?' ;;
        culture) printf 'Ready To Experience Uganda More Deeply?' ;;
        cities) printf 'Ready To Explore Uganda Beyond The Safari?' ;;
        travel-tips) printf 'Ready To Turn Inspiration Into A Real Trip?' ;;
        *) printf 'Ready To Plan This Uganda Experience?' ;;
    esac
}

make_intro() {
    local title="$1"
    local summary="$2"
    local category="$3"
    local lead_image="$4"
    local lead_alt="$5"
    cat <<EOF
<article class="blog-post-full">
    <img src="${lead_image}" alt="$(escape_html "$lead_alt")" onerror="this.onerror=null;this.src='images/logo.png';">

    <p>
        ${summary} $(scene_line "$category" "$title")
    </p>

    <p>
        $(why_line "$category" "$title")
    </p>
</article>
EOF
}

make_section() {
    local title="$1"
    local category="$2"
    local heading="$3"
    local paragraph_one="$4"
    local paragraph_two="$5"
    local image="$6"
    local alt="$7"
    cat <<EOF
<article class="blog-post-full">
    <h2>$(escape_html "$heading")</h2>
    <img src="${image}" alt="$(escape_html "$alt")" onerror="this.onerror=null;this.src='images/logo.png';">

    <p>
        ${paragraph_one}
    </p>

    <p>
        ${paragraph_two}
    </p>
</article>
EOF
}

generate_page() {
    local title="$1"
    local summary="$2"
    local category="$3"
    local slug
    local safe_title
    local safe_summary
    local file_path
    local cta_title
    local lead_image
    local lead_alt
    local section_one_heading
    local section_two_heading
    local section_three_heading

    slug="$(slugify "$title")"
    safe_title="$(escape_html "$title")"
    safe_summary="$(escape_html "$summary")"
    file_path="$BLOG_DIR/$slug.html"
    cta_title="$(cta_title_for_category "$category")"
    lead_image="images/${slug}.webp"
    lead_alt="$(image_alt_for_category "$category" "$title")"
    section_one_heading="$(heading_one "$category" "$title")"
    section_two_heading="$(heading_two "$category" "$title")"
    section_three_heading="$(heading_three "$category" "$title")"

    cat > "$file_path" <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="../images/logo.png" type="image/png">
    <link rel="apple-touch-icon" href="../images/logo.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <title>${safe_title} | Explore Uganda Travel Guide</title>
    <meta name="description" content="${safe_summary}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="theme-color" content="#004d40">
    <link rel="canonical" href="https://lovableuganda.com/blog%20pages/${slug}.html">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${safe_title} | Explore Uganda Travel Guide">
    <meta property="og:description" content="${safe_summary}">
    <meta property="og:url" content="https://lovableuganda.com/blog%20pages/${slug}.html">
    <meta property="og:image" content="https://lovableuganda.com/blog%20pages/images/${slug}.webp">
    <meta property="og:image:alt" content="${safe_title} placeholder image">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safe_title} | Explore Uganda Travel Guide">
    <meta name="twitter:description" content="${safe_summary}">
    <meta name="twitter:image" content="https://lovableuganda.com/blog%20pages/images/${slug}.webp">
    <meta name="twitter:image:alt" content="${safe_title} placeholder image">

    <link rel="stylesheet" href="../css/base.css">
    <link rel="stylesheet" href="../css/header.css">
    <link rel="stylesheet" href="../css/footer.css">
    <link rel="stylesheet" href="css/blog-article.css">
</head>

<body>

<header>
    <div class="logo">
        <img src="../images/logo.png" alt="Explore Uganda logo" class="site-logo" />
        <h1>Explore Uganda</h1>
    </div>
    <nav>
        <ul>
            <li><a href="../index.html">Home</a></li>
            <li><a href="../destinations.html">Destinations</a></li>
            <li><a href="../tours.html">Tours</a></li>
            <li class="more-toggle">More</li>
            <li class="more-item"><a href="../souvenirs.html">Souvenirs</a></li>
            <li class="more-item active"><a href="../blog.html">Blog</a></li>
            <li class="more-item"><a href="../plan-trip.html">Plan My Trip</a></li>
            <li class="more-item"><a href="../contact.html">Contact</a></li>
        </ul>
    </nav>
    <div class="header-actions">
        <a class="back-button" href="../blog.html" data-fallback-href="../blog.html" aria-label="Go back to the previous page">
            <i class="fas fa-arrow-left"></i>
            <span>Back</span>
        </a>
        <a href="../plan-trip.html#trip-form" class="cta">Plan Your Trip</a>
    </div>
</header>

<section id="hero-blog">
    <h1>${safe_title}</h1>
    <p>${safe_summary}</p>
</section>

<main class="container">
$(make_intro "$title" "$summary" "$category" "$lead_image" "$lead_alt")
$(make_section "$title" "$category" "$section_one_heading" "$(scene_line "$category" "$title")" "$(why_line "$category" "$title")" "$lead_image" "$lead_alt")
$(make_section "$title" "$category" "$section_two_heading" "$(expect_line "$category" "$title")" "$(pick_for_title "$title" 9 "It is this mix of feeling, detail, and pace that often turns a simple stop into one of the strongest memories on the trip." "That is usually the moment readers understand why this part of Uganda keeps showing up in conversations long after the journey is over." "The result is an experience that feels vivid while you are there and surprisingly durable in memory afterwards.")" "$lead_image" "$lead_alt")
$(make_section "$title" "$category" "$section_three_heading" "$(planning_line "$category" "$title")" "$(pick_for_title "$title" 10 "For travelers building a wider route, this experience often works best when paired with nearby scenery, good overnight pacing, and enough room to enjoy the destination properly rather than rushing through it." "The strongest Uganda itineraries are rarely the most crowded ones. They are the ones that leave enough space for atmosphere, weather, conversation, and the small unscripted moments that make the trip feel real." "A little planning goes a long way here, especially when it protects the one thing travelers later wish they had more of: time to stay with the place.")" "$lead_image" "$lead_alt")
<article class="blog-post-full">
    <h2>Final Thoughts</h2>

    <p>
        $(closing_line "$category" "$title")
    </p>

    <p>
        For travelers who want Uganda to feel immersive rather than rushed, ${safe_title} captures exactly the kind of experience that can turn curiosity into lasting affection for the country.
    </p>
</article>
</main>

<section id="cta-blog">
    <h2>${cta_title}</h2>
    <p>${safe_summary}</p>
    <a href="../plan-trip.html#trip-form" class="btn">Plan Your Trip</a>
</section>

<footer>
    <div class="footer-about">
        <img src="../images/logo.png" alt="Explore Uganda logo" class="footer-logo" />
        <h2>Explore Uganda</h2>
        <p>Discover the Pearl of Africa. Your journey to Uganda’s wildlife, culture, and adventure begins here.</p>
    </div>

    <div class="footer-links">
        <h3>Quick Links</h3>
        <ul>
            <li><a href="../index.html">Home</a></li>
            <li><a href="../destinations.html">Destinations</a></li>
            <li><a href="../tours.html">Tours</a></li>
            <li><a href="../souvenirs.html">Souvenirs</a></li>
            <li><a href="../blog.html">Blog</a></li>
            <li><a href="../plan-trip.html">Plan My Trip</a></li>
            <li><a href="../contact.html">Contact</a></li>
        </ul>
    </div>

    <div class="footer-contact-social">
        <h3>Contact Us & Follow Us</h3>
        <ul>
            <li>Email: info@lovableuganda.com</li>
            <li>Phone: +256 757 714 664</li>
            <li>WhatsApp: <a href="https://wa.me/256773167457" target="_blank">+256 773 167 457</a></li>
            <li>Address: Kampala, Uganda</li>
        </ul>
        <div class="footer-social">
            <ul>
                <li><a href="#" target="_blank"><i class="fab fa-facebook-f"></i></a></li>
                <li><a href="#" target="_blank"><i class="fab fa-instagram"></i></a></li>
                <li><a href="#" target="_blank"><i class="fab fa-x-twitter"></i></a></li>
                <li><a href="#" target="_blank"><i class="fab fa-tiktok"></i></a></li>
                <li><a href="#" target="_blank"><i class="fab fa-youtube"></i></a></li>
            </ul>
        </div>
    </div>

    <div class="footer-subscribe">
        <h3>Subscribe to Our Newsletter</h3>
        <p>Stay updated with the latest news and offers.</p>
        <form>
            <input type="email" placeholder="Enter your email" required>
            <button type="submit">Subscribe</button>
        </form>
    </div>

    <p>&copy; 2026 Explore Uganda. All rights reserved.</p>
</footer>

<script>
    const backButton = document.querySelector('.back-button');
    const fallbackHref = backButton?.dataset.fallbackHref || '../blog.html';

    if (backButton) {
        try {
            const referrerUrl = document.referrer ? new URL(document.referrer) : null;
            const isInternalReferrer = referrerUrl && referrerUrl.origin === window.location.origin;
            const isDifferentPage = isInternalReferrer && referrerUrl.pathname !== window.location.pathname;

            backButton.href = isDifferentPage
                ? \`\${referrerUrl.pathname}\${referrerUrl.search}\${referrerUrl.hash}\`
                : fallbackHref;
        } catch (error) {
            backButton.href = fallbackHref;
        }

        backButton.addEventListener('click', (event) => {
            if (!document.referrer) {
                return;
            }

            try {
                const referrerUrl = new URL(document.referrer);
                const isInternalReferrer = referrerUrl.origin === window.location.origin;
                const isDifferentPage = referrerUrl.pathname !== window.location.pathname;

                if (isInternalReferrer && isDifferentPage && window.history.length > 1) {
                    event.preventDefault();
                    window.history.back();
                }
            } catch (error) {
                backButton.href = fallbackHref;
            }
        });
    }
</script>

<script>
    const moreToggle = document.querySelector('.more-toggle');
    const moreItems = document.querySelectorAll('.more-item');

    if (moreToggle) {
        moreToggle.addEventListener('click', () => {
            const isExpanded = moreToggle.textContent === 'Less';
            moreItems.forEach((item) => {
                item.style.display = isExpanded ? 'none' : 'block';
            });
            moreToggle.textContent = isExpanded ? 'More' : 'Less';
        });
    }
</script>

</body>
</html>
EOF

    printf 'Generated %s\n' "$file_path"
}

while IFS='|' read -r category title summary; do
    [ -n "$title" ] || continue
    generate_page "$title" "$summary" "$category"
done <<'EOF'
wildlife|Into the Mist: Trekking Gorillas in Bwindi Impenetrable National Park|A once-in-a-lifetime encounter with endangered mountain gorillas deep in ancient rainforest.
wildlife|Why Queen Elizabeth National Park Is Africa’s Most Underrated Safari Destination|Tree-climbing lions, boat safaris, and diverse ecosystems in one park.
wildlife|The Untamed Beauty of Kidepo Valley National Park: Africa’s Hidden Gem|Remote, wild, and less crowded than any major safari park.
wildlife|Tracking Chimpanzees in Kibale National Park: A Primate Lover’s Dream|Get face-to-face with our closest relatives in lush forest.
wildlife|Big Game Adventures in Murchison Falls National Park|Lions, elephants, giraffes, and the Nile in one epic safari.
wildlife|Rhino Tracking at Ziwa Rhino Sanctuary: Uganda’s Conservation Success Story|Walk alongside rhinos in the wild.
wildlife|Golden Monkey Encounters in Mgahinga Gorilla National Park|Rare primates in a volcanic landscape.
wildlife|A Walking Safari in Lake Mburo National Park: Nature Up Close|Experience wildlife on foot, not from a car.
wildlife|Secrets of the Forest: Exploring Budongo Forest Reserve|Ancient mahogany trees and chimpanzees.
wildlife|Birding Paradise: Why Uganda Is Africa’s Top Birdwatching Destination|Over 1,000 species including the iconic shoebill.
waterfalls|The Power of Nature at Murchison Falls|Watch the Nile explode through a narrow gorge.
waterfalls|Hiking the Magical Sipi Falls|Waterfalls, coffee tours, and stunning views.
waterfalls|Relaxing at Lake Bunyonyi: Africa’s Most Beautiful Lake?|Island-dotted paradise perfect for unwinding.
waterfalls|Discover the Source of the Nile in Jinja|Stand where the world’s longest river begins.
waterfalls|Adventure Awaits: White-Water Rafting on the River Nile|One of the best rafting experiences globally.
waterfalls|Hidden Beauty of Aruu Falls|Multi-tiered cascades perfect for photos.
waterfalls|Cultural Mysteries of Sezibwa Falls|A waterfall steeped in local legends.
waterfalls|Exploring the Shores of Lake Victoria|Beaches, islands, and fishing culture.
waterfalls|Canoeing Through Tranquility on Lake Mutanda|Scenic volcano views and calm waters.
waterfalls|Boat Safari Along the Kazinga Channel|Hippos, crocodiles, and elephants up close.
adventure|Climbing the Legendary Rwenzori Mountains: Africa’s Alps|Snow-capped peaks on the equator.
adventure|Hiking Mount Elgon: A Gentler Adventure|One of the largest volcanic mountains in the world.
adventure|Volcano Trekking on Mount Sabinyo|Stand in three countries at once.
adventure|Exploring the Crater Lakes of Fort Portal|Scenic landscapes and peaceful nature.
adventure|The Caves and Legends of Amabere Caves|Myths, waterfalls, and cultural history.
adventure|Ziplining Through Mabira Forest|Thrills above the rainforest canopy.
adventure|Adventure in Karamoja: Hiking Mount Moroto|Raw, authentic, and culturally rich.
adventure|Why Uganda Is Africa’s Best Hiking Destination|Diverse terrains from hills to glaciers.
adventure|Exploring the Hidden Trails of Eastern Uganda|Off-the-beaten-path adventures.
adventure|Top 10 Adventure Activities You Must Try in Uganda|From rafting to mountain climbing.
islands|Escape to the Ssese Islands: Uganda’s Tropical Paradise|White sands, palm trees, and serenity.
islands|Chimpanzees of Ngamba Island Chimpanzee Sanctuary|Conservation meets tourism.
islands|Island Hopping on Lake Victoria|Discover hidden island gems.
islands|Luxury Getaways on Uganda’s Private Islands|Exclusive and relaxing escapes.
islands|Why Uganda Is Perfect for a Romantic Honeymoon|Lakes, lodges, and sunsets.
culture|Discover the History of the Kasubi Tombs|A UNESCO site and Buganda heritage.
culture|Faith and History at Namugongo Martyrs Shrine|One of Africa’s biggest pilgrimage sites.
culture|Exploring the Uganda Museum|A journey through Uganda’s past.
culture|The Beauty of the Baháʼí Temple Kampala|Africa’s only Baháʼí temple.
culture|Cultural Performances at Ndere Centre|Music, dance, and storytelling.
culture|The Kingdom of Buganda: Culture and Traditions|Rich heritage and royal history.
culture|Karamoja: Experiencing Uganda’s Traditional Lifestyle|Authentic cultural immersion.
culture|Top Cultural Experiences Every Visitor Should Try|Food, dance, and traditions.
culture|Uganda’s 50+ Tribes: A Cultural Mosaic|Diversity and unity.
culture|Traditional Food Tour in Uganda|Taste local dishes and flavors.
cities|Exploring Kampala: Africa’s City of Seven Hills|A lively urban guide to history, culture, markets, and nightlife in Uganda’s capital.
cities|Top Things to Do in Entebbe|Lakeside relaxation, wildlife, gardens, and the gateway city experience.
cities|Why Jinja Is East Africa’s Adventure Capital|River thrills, laid-back charm, and nonstop outdoor activity.
cities|Nightlife in Kampala: Where to Go|Music, food, lounges, and late-night city energy.
cities|A Weekend in Fort Portal|Crater lakes, tea estates, and a calm western Uganda escape.
travel-tips|Why Uganda Is Called the Pearl of Africa|Understand the landscapes, wildlife, and culture behind the famous nickname.
travel-tips|10 Reasons to Visit Uganda in 2026|Fresh inspiration for travelers planning their next East African adventure.
travel-tips|Uganda vs Kenya vs Tanzania: Which Safari Is Best?|A practical comparison for travelers choosing their ideal safari destination.
travel-tips|Is Uganda Safe for Tourists? Everything You Need to Know|Clear, confidence-building advice for first-time visitors.
travel-tips|Best Time to Visit Uganda: A Seasonal Guide|Weather, trekking, wildlife, and timing tips for smarter trip planning.
travel-tips|Budget Travel in Uganda: A Complete Guide|See more of Uganda without overspending.
travel-tips|Luxury Travel in Uganda: Top Lodges and Experiences|Premium stays, private safaris, and unforgettable comfort.
travel-tips|Backpacking Uganda: The Ultimate Guide|Flexible routes, affordable transport, and practical advice for independent travelers.
travel-tips|Top Instagram Spots in Uganda|Scenic places that look as good on camera as they do in person.
travel-tips|A First-Time Visitor’s Guide to Uganda|The essential starting point for anyone planning a first Uganda trip.
travel-tips|Hidden Gems of Uganda You’ve Never Heard Of|Discover lesser-known places that deserve a spot on your itinerary.
travel-tips|Uganda Travel Bucket List: 25 Must-See Places|A wide-ranging roundup of iconic and surprising destinations.
travel-tips|Ultimate Uganda Safari Itinerary|A strong route idea for travelers who want a memorable wildlife-focused journey.
travel-tips|7-Day Uganda Travel Plan|A practical short itinerary for making the most of one week.
travel-tips|14-Day Uganda Adventure Guide|A longer route with more time for wildlife, culture, and scenery.
travel-tips|Best National Parks in Uganda Ranked|Compare Uganda’s top parks by wildlife, scenery, and travel style.
travel-tips|Top Wildlife Experiences in Uganda|The encounters that make Uganda stand out on the safari map.
travel-tips|Uganda Travel Tips for First-Timers|Straightforward advice to reduce stress and improve the experience.
travel-tips|Family Travel in Uganda|Ideas and planning tips for safe, enjoyable family adventures.
travel-tips|Solo Travel Guide to Uganda|Confidence-building tips for independent travelers.
travel-tips|Eco-Tourism in Uganda|Travel choices that support nature, conservation, and communities.
travel-tips|Uganda’s Best Sunsets|Where to end the day with unforgettable views.
travel-tips|Most Beautiful Landscapes in Uganda|A visual journey through the country’s scenic diversity.
travel-tips|Exploring Uganda’s Crater Lakes|A focused guide to one of the country’s most peaceful regions.
travel-tips|Uganda’s Best Hiking Trails|Routes and landscapes for every kind of walker.
travel-tips|Top Waterfalls in Uganda|A roundup of dramatic cascades and scenic viewpoints.
travel-tips|Uganda’s Best Birding Spots|Where bird lovers should go first.
travel-tips|Uganda Photography Guide|Helpful ideas for capturing wildlife, landscapes, and culture.
travel-tips|Adventure Travel in Uganda|A guide for visitors who want thrills and active experiences.
travel-tips|Uganda Travel Mistakes to Avoid|Common planning errors and how to stay ahead of them.
travel-tips|Uganda Visa & Entry Guide|A practical overview of arrival planning and entry basics.
travel-tips|Packing List for Uganda|The essentials for safaris, cities, trekking, and changing weather.
travel-tips|Uganda Safari Costs Explained|What affects price and how travelers can budget more clearly.
travel-tips|Gorilla Trekking Cost Guide|A simple breakdown of the factors behind this signature experience.
travel-tips|Best Lodges in Uganda|Noteworthy places to stay across the country.
travel-tips|Uganda Road Trip Guide|Planning advice for travelers exploring Uganda overland.
travel-tips|Traveling Uganda by Public Transport|A realistic look at buses, shared taxis, and getting around affordably.
travel-tips|Uganda for Digital Nomads|What remote workers should know about travel, pace, and practicalities.
travel-tips|Uganda Travel Myths Debunked|Separate common misconceptions from real on-the-ground experience.
travel-tips|Why Uganda Is Africa’s Best Kept Secret|A strong case for choosing Uganda before everyone else does.
travel-tips|Uganda Travel Stories from Real Tourists|First-hand inspiration and perspective from past visitors.
travel-tips|Uganda Festivals You Shouldn’t Miss|Cultural events and celebrations worth timing your trip around.
travel-tips|Uganda Coffee Tours Experience|Follow the journey from farm to cup in one of Africa’s coffee countries.
travel-tips|Wildlife Photography in Uganda|Ideas and preparation tips for capturing safari moments well.
travel-tips|Uganda Adventure vs Relaxation Travel|Choose the travel style that suits your trip goals best.
travel-tips|Uganda vs Rwanda Gorilla Trekking|Compare two leading gorilla destinations with confidence.
travel-tips|Uganda’s Most Romantic Destinations|Places that work beautifully for couples and honeymoon trips.
travel-tips|Uganda Travel Checklist|A final planning list to help travelers feel ready.
travel-tips|Ultimate Guide to East Africa Travel|Broader regional context with Uganda as a strong starting point.
travel-tips|Why Uganda Should Be Your Next Destination|A persuasive overview of everything that makes the country special.
EOF
