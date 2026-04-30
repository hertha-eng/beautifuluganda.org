#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_FILE="$ROOT_DIR/js/generated-blog-cards.js"

slugify() {
    printf '%s' "$1" \
        | tr '[:upper:]' '[:lower:]' \
        | sed "s/[’']/ /g" \
        | sed 's/[^a-z0-9]/-/g' \
        | sed 's/-\{2,\}/-/g' \
        | sed 's/^-//' \
        | sed 's/-$//'
}

json_escape() {
    printf '%s' "$1" \
        | sed 's/\\/\\\\/g' \
        | sed 's/"/\\"/g'
}

display_date() {
    date -d "$1" +"%B %-d, %Y"
}

publish_date_for_index() {
    local index="$1"
    local slot
    local days=0
    local n
    local gaps=(2 7 1 4 3 7 2 5 1 6 4 2 8 3 5 2 4 7 2 6)

    # Spread publication dates irregularly from January 29, 2025 onward,
    # while avoiding obvious category-by-category clumps in the sorted feed.
    slot=$(( (index * 37 + 11) % 100 ))

    for ((n = 0; n < slot; n++)); do
        days=$((days + gaps[n % ${#gaps[@]}]))
    done

    date -d "2025-01-29 + ${days} day" +%F
}

author_info_for() {
    local category="$1"
    local title="$2"
    local index="$3"
    local lower
    local pick
    local is_national=0

    lower="$(title_lc "$title")"
    pick=$((index % 6))

    case "$index" in
        0|7|13|21|28|34|42|49|57|66|74|83|95) is_national=1 ;;
    esac

    case "$lower" in
        *visa*|*checklist*|*cost*|*packing*|*best*time*|*vs*|*safety*|*itinerary*|*road*trip*|*public*transport*)
            if [ "$is_national" -eq 1 ]; then
                case "$pick" in
                    0|3) printf 'David Mwesigwa|Uganda|Independent Travel Writer' ;;
                    1|4) printf 'Miriam Nansubuga|Uganda|Trip Planning Contributor' ;;
                    *) printf 'Peter Kisembo|Uganda|Practical Travel Writer' ;;
                esac
            else
                case "$pick" in
                    0) printf 'Hannah Bretton|Scotland|Guest Tourist Contributor' ;;
                    1) printf 'Njeri Wambui|Kenya|Regional Travel Columnist' ;;
                    2) printf 'Tinashe Moyo|Zimbabwe|Safari Logistics Writer' ;;
                    3) printf 'Sophie Lambert|France|Long-Form Travel Contributor' ;;
                    4) printf 'Rohan Mehta|India|Independent Route Planner' ;;
                    *) printf 'Marina Costa|Brazil|Practical Travel Features Writer' ;;
                esac
            fi
            ;;
        *stories*from*real*tourists*)
            if [ "$is_national" -eq 1 ]; then
                case "$pick" in
                    0|3) printf 'Samuel Kintu|Uganda|Community Story Contributor' ;;
                    1|4) printf 'Grace Atuhairwe|Uganda|Travel Features Contributor' ;;
                    *) printf 'Lydia Tumwine|Uganda|Travel Features Contributor' ;;
                esac
            else
                case "$pick" in
                    0) printf 'Hannah Bretton|Scotland|Guest Tourist Contributor' ;;
                    1) printf 'Laura Bennett|England|Returning Visitor Contributor' ;;
                    2) printf 'Noah Mensah|Ghana|Travel Memoir Contributor' ;;
                    3) printf 'Isabelle Moreau|Belgium|Guest Journey Writer' ;;
                    4) printf 'Asha Raman|Singapore|Long-Haul Travel Diarist' ;;
                    *) printf 'Santiago Vega|Argentina|Travel Narrative Contributor' ;;
                esac
            fi
            ;;
        *)
            if [ "$is_national" -eq 1 ]; then
                case "$category" in
                    wildlife)
                        case "$pick" in
                            0|3) printf 'Daniel Kato|Uganda|Wildlife Contributor' ;;
                            1|4) printf 'Amina Nabirye|Uganda|Safari Writer' ;;
                            *) printf 'Grace Atuhairwe|Uganda|Conservation Features Writer' ;;
                        esac
                        ;;
                    waterfalls)
                        case "$pick" in
                            0|3) printf 'Irene Nakato|Uganda|Nature Contributor' ;;
                            1|4) printf 'Joel Mukiibi|Uganda|Adventure Writer' ;;
                            *) printf 'Samuel Mugerwa|Uganda|Independent Travel Writer' ;;
                        esac
                        ;;
                    adventure)
                        case "$pick" in
                            0|3) printf 'Trevor Ssemanda|Uganda|Adventure Contributor' ;;
                            1|4) printf 'Claire Atwine|Uganda|Mountain Travel Writer' ;;
                            *) printf 'Brian Nuwagaba|Uganda|Outdoor Features Contributor' ;;
                        esac
                        ;;
                    islands)
                        case "$pick" in
                            0|3) printf 'Patricia Namuli|Uganda|Island Travel Contributor' ;;
                            1|4) printf 'Mark Byaruhanga|Uganda|Leisure Travel Writer' ;;
                            *) printf 'Evelyn Nantongo|Uganda|Guest Travel Contributor' ;;
                        esac
                        ;;
                    culture)
                        case "$pick" in
                            0|3) printf 'Sarah Nankya|Uganda|Culture Contributor' ;;
                            1|4) printf 'Josephine Namubiru|Uganda|Heritage Writer' ;;
                            *) printf 'Moses Walugembe|Uganda|Local History Contributor' ;;
                        esac
                        ;;
                    cities)
                        case "$pick" in
                            0|3) printf 'Timothy Sserwanja|Uganda|City Guide Contributor' ;;
                            1|4) printf 'Esther Nakiyingi|Uganda|Urban Travel Writer' ;;
                            *) printf 'Alex Twinomujuni|Uganda|Independent Travel Contributor' ;;
                        esac
                        ;;
                    travel-tips)
                        case "$pick" in
                            0|3) printf 'David Mwesigwa|Uganda|Independent Travel Writer' ;;
                            1|4) printf 'Miriam Nansubuga|Uganda|Trip Planning Contributor' ;;
                            *) printf 'Peter Kisembo|Uganda|Practical Travel Writer' ;;
                        esac
                        ;;
                    *)
                        printf 'David Mwesigwa|Uganda|Independent Travel Writer'
                        ;;
                esac
            else
                case "$category" in
                    wildlife)
                        case "$pick" in
                            0) printf 'Kato Omondi|Kenya|Wildlife Features Correspondent' ;;
                            1) printf 'Lerato Nkosi|South Africa|Conservation Travel Journalist' ;;
                            2) printf 'Noah Mensah|Ghana|Safari Features Writer' ;;
                            3) printf 'Hannah Bretton|Scotland|Wildlife Journey Contributor' ;;
                            4) printf 'Sabine Vogel|Germany|Nature Reporting Contributor' ;;
                            *) printf 'Camille Dufour|France|Conservation Travel Contributor' ;;
                        esac
                        ;;
                    waterfalls)
                        case "$pick" in
                            0) printf 'Thandiwe Dlamini|Eswatini|Scenic Travel Writer' ;;
                            1) printf 'Jonas Keller|Germany|Outdoor Destination Contributor' ;;
                            2) printf 'Rita Fernandes|Portugal|Landscape Travel Writer' ;;
                            3) printf 'Njeri Wambui|Kenya|Regional Travel Columnist' ;;
                            4) printf 'Marina Costa|Brazil|Lakes and Journeys Contributor' ;;
                            *) printf 'Tariro Chuma|Zimbabwe|Independent Safari Planner' ;;
                        esac
                        ;;
                    adventure)
                        case "$pick" in
                            0) printf 'Asha Patel|Tanzania|Trail and Trekking Writer' ;;
                            1) printf 'Marco Rinaldi|Italy|Adventure Travel Correspondent' ;;
                            2) printf 'Rohan Mehta|India|Expedition Features Writer' ;;
                            3) printf 'Clara Jensen|Denmark|Outdoor Escapes Contributor' ;;
                            4) printf 'Tinashe Moyo|Zimbabwe|Adventure Route Writer' ;;
                            *) printf 'Sophie Lambert|France|Long-Form Travel Contributor' ;;
                        esac
                        ;;
                    islands)
                        case "$pick" in
                            0) printf 'Ruth Mbeki|South Africa|Coastal Escapes Writer' ;;
                            1) printf 'Laura Bennett|England|Guest Tourist Contributor' ;;
                            2) printf 'Clara Jensen|Denmark|Slow Travel Contributor' ;;
                            3) printf 'Noella Uwase|Rwanda|Regional Leisure Writer' ;;
                            4) printf 'Marta Soler|Spain|Island Retreats Contributor' ;;
                            *) printf 'Ethan Cole|Canada|Travel Features Contributor' ;;
                        esac
                        ;;
                    culture)
                        case "$pick" in
                            0) printf 'Noella Uwase|Rwanda|Regional Culture Writer' ;;
                            1) printf 'Elena Petrova|Bulgaria|Heritage Travel Contributor' ;;
                            2) printf 'Isabelle Moreau|Belgium|Culture Features Contributor' ;;
                            3) printf 'Santiago Vega|Argentina|History and Culture Writer' ;;
                            4) printf 'Asha Raman|Singapore|Arts Travel Contributor' ;;
                            *) printf 'Maya Johnson|United States|Cultural Journeys Contributor' ;;
                        esac
                        ;;
                    cities)
                        case "$pick" in
                            0) printf 'Kevin Otieno|Kenya|City Breaks Columnist' ;;
                            1) printf 'Rita Fernandes|Portugal|Urban Culture Contributor' ;;
                            2) printf 'Lucia Bianchi|Italy|City Stories Contributor' ;;
                            3) printf 'Megan Price|Wales|Weekend Travel Writer' ;;
                            4) printf 'Farai Moyo|Zimbabwe|Urban Discovery Contributor' ;;
                            *) printf 'Tendai Chikore|Zimbabwe|City Pulse Writer' ;;
                        esac
                        ;;
                    travel-tips)
                        case "$pick" in
                            0) printf 'Njeri Wambui|Kenya|Regional Travel Columnist' ;;
                            1) printf 'Hannah Bretton|Scotland|Guest Tourist Contributor' ;;
                            2) printf 'Tariro Chuma|Zimbabwe|Independent Safari Planner' ;;
                            3) printf 'Sophie Lambert|France|Long-Form Travel Contributor' ;;
                            4) printf 'Rohan Mehta|India|Independent Route Planner' ;;
                            *) printf 'Marina Costa|Brazil|Practical Travel Features Writer' ;;
                        esac
                        ;;
                    *)
                        printf 'Hannah Bretton|Scotland|Guest Tourist Contributor'
                        ;;
                esac
            fi
            ;;
    esac
}

tag_for_category() {
    case "$1" in
        wildlife) printf 'Wildlife' ;;
        waterfalls) printf 'Waterfalls & Lakes' ;;
        adventure) printf 'Adventure' ;;
        islands) printf 'Islands & Relaxation' ;;
        culture) printf 'Culture' ;;
        cities) printf 'Cities' ;;
        travel-tips) printf 'Travel Guide' ;;
        *) printf 'Travel Guide' ;;
    esac
}

keywords_for() {
    local category="$1"
    local title="$2"
    local base
    case "$category" in
        wildlife) base="uganda wildlife safari gorillas chimpanzees birding national parks" ;;
        waterfalls) base="uganda waterfalls lakes nile jinja bunyonyi mutanda kazinga travel" ;;
        adventure) base="uganda adventure hiking trekking mountains rafting trails travel" ;;
        islands) base="uganda islands lake victoria romance relaxation beaches travel" ;;
        culture) base="uganda culture history religion food traditions heritage travel" ;;
        cities) base="uganda cities kampala entebbe jinja fort portal nightlife urban travel" ;;
        travel-tips) base="uganda travel guide itinerary planning safari tips destination advice" ;;
        *) base="uganda travel guide" ;;
    esac
    printf '%s %s' "$base" "$(printf '%s' "$title" | tr '[:upper:]' '[:lower:]' | sed "s/[’']/ /g")"
}

title_lc() {
    printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | sed "s/[’']/ /g"
}

image_for() {
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
        *lake*victoria*|*ssese*|*private*islands*|*honeymoon*)
            printf 'images/ssese-islands.webp'
            ;;
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

cat > "$OUTPUT_FILE" <<'EOF'
(function () {
    const generatedCards = [
EOF

index=0
while IFS='|' read -r category title summary; do
    [ -n "$title" ] || continue
    slug="$(slugify "$title")"
    date_value="$(publish_date_for_index "$index")"
    display="$(display_date "$date_value")"
    image="blog pages/images/${slug}.webp"
    tag="$(tag_for_category "$category")"
    keywords="$(keywords_for "$category" "$title")"
    IFS='|' read -r author_name author_country author_role <<< "$(author_info_for "$category" "$title" "$index")"
    title_json="$(json_escape "$title")"
    summary_json="$(json_escape "$summary")"
    image_json="$(json_escape "$image")"
    tag_json="$(json_escape "$tag")"
    keywords_json="$(json_escape "$keywords")"
    href_json="$(json_escape "blog pages/${slug}.html")"
    category_json="$(json_escape "$category")"
    display_json="$(json_escape "$display")"
    alt_json="$(json_escape "$title")"
    author_name_json="$(json_escape "$author_name")"
    author_country_json="$(json_escape "$author_country")"
    author_role_json="$(json_escape "$author_role")"

    if [ "$index" -gt 0 ]; then
        printf ',\n' >> "$OUTPUT_FILE"
    fi

    cat >> "$OUTPUT_FILE" <<EOF
        {
            image: "${image_json}",
            alt: "${alt_json}",
            category: "${category_json}",
            tag: "${tag_json}",
            keywords: "${keywords_json}",
            date: "${date_value}",
            displayDate: "${display_json}",
            authorName: "${author_name_json}",
            authorCountry: "${author_country_json}",
            authorRole: "${author_role_json}",
            title: "${title_json}",
            text: "${summary_json}",
            buttonLabel: "Read More",
            buttonHref: "${href_json}"
        }
EOF
    index=$((index + 1))
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

cat >> "$OUTPUT_FILE" <<'EOF'
    ];

    window.ExploreUgandaGeneratedBlogCards = generatedCards;

    if (!window.ExploreUgandaDefaultContent || !window.ExploreUgandaDefaultContent.blog) {
        return;
    }

    const existingCards = window.ExploreUgandaDefaultContent.blog.cards || [];
    const merged = [...existingCards];

    generatedCards.forEach((card) => {
        if (!merged.some((existing) => existing.buttonHref === card.buttonHref)) {
            merged.push(card);
        }
    });

    window.ExploreUgandaDefaultContent.blog.cards = merged;
})();
EOF
