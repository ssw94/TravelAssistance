import { Injectable } from '@nestjs/common';
import {
  ILlmProvider,
  AssistantContext,
  AssistantResponse,
  AssistantPlanSuggestion,
} from '../interfaces/llm-provider.interface';

@Injectable()
export class SmartPlannerProvider implements ILlmProvider {
  async generateResponse(
    message: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    context: AssistantContext,
  ): Promise<AssistantResponse> {
    const text = message.toLowerCase();
    const currency = context.userPreferredCurrency || 'INR';

    // 1. Goa Trip Planning
    if (text.includes('goa')) {
      const plan: AssistantPlanSuggestion = {
        destination: 'Goa, India',
        durationDays: 5,
        estimatedBudget: 28500,
        currency,
        highlights: [
          'Calangute & Baga beach water sports',
          'Historic Fort Aguada & Chapora Fort exploration',
          'Old Goa Portuguese churches (Basilica of Bom Jesus)',
          'South Goa serene beaches (Palolem & Butterfly Beach)',
          'Mandovi River sunset cruise & seaside dining',
        ],
        packingList: [
          'Breathable cotton & linen outfits',
          'Swimwear, rash guards & sunglasses',
          'High SPF sunscreen & lip balm',
          'Comfortable flip flops & waterproof sandals',
          'Waterproof phone pouch for beach sports',
        ],
        bestTimeToVisit: 'November to February (Pleasant winter sun & beach weather)',
        dayByDayPlan: [
          {
            dayNumber: 1,
            title: 'Arrival & North Goa Beach Vibe',
            activities: [
              { time: '11:00', title: 'Hotel Check-in & Freshen Up', type: 'CHECKIN', cost: 0, location: 'Calangute / Candolim' },
              { time: '13:00', title: 'Seafood Lunch at Beach Shack', type: 'DINING', cost: 1200, location: 'Souza Lobo, Calangute' },
              { time: '16:00', title: 'Sunset & Water Sports at Baga Beach', type: 'ACTIVITY', cost: 2500, location: 'Baga Beach' },
              { time: '20:00', title: 'Dinner & Live Music', type: 'DINING', cost: 1800, location: 'Tito\'s Lane' },
            ],
          },
          {
            dayNumber: 2,
            title: 'Heritage, Forts & Ocean Views',
            activities: [
              { time: '09:00', title: 'Fort Aguada & Lighthouse Tour', type: 'SIGHTSEEING', cost: 400, location: 'Sinquerim' },
              { time: '12:00', title: 'Goan Thali Lunch', type: 'DINING', cost: 900, location: 'Panaji Heritage Zone' },
              { time: '15:00', title: 'Chapora Fort (Dil Chahta Hai point)', type: 'SIGHTSEEING', cost: 200, location: 'Vagator' },
              { time: '18:30', title: 'Sunset Drinks at Thalassa', type: 'RELAXATION', cost: 2200, location: 'Siolim' },
            ],
          },
          {
            dayNumber: 3,
            title: 'Old Goa Churches & Spice Plantation',
            activities: [
              { time: '09:30', title: 'Basilica of Bom Jesus & Se Cathedral', type: 'SIGHTSEEING', cost: 300, location: 'Old Goa' },
              { time: '12:30', title: 'Sahakari Spice Farm Tour & Buffet', type: 'ACTIVITY', cost: 1600, location: 'Ponda' },
              { time: '17:00', title: 'Mandovi River Luxury Cruise', type: 'RELAXATION', cost: 1500, location: 'Panaji Jetty' },
            ],
          },
          {
            dayNumber: 4,
            title: 'South Goa Serenity & Scuba Diving',
            activities: [
              { time: '08:00', title: 'Grand Island Boat Ride & Scuba Diving', type: 'ACTIVITY', cost: 4500, location: 'Grand Island' },
              { time: '14:00', title: 'Coastal Lunch at Martin\'s Corner', type: 'DINING', cost: 1800, location: 'Betalbatim' },
              { time: '17:00', title: 'Sunset at Palolem Crescent Beach', type: 'RELAXATION', cost: 500, location: 'Palolem' },
            ],
          },
          {
            dayNumber: 5,
            title: 'Fontainhas Latin Quarter & Departure',
            activities: [
              { time: '10:00', title: 'Walking Tour in Fontainhas Latin Quarter', type: 'SIGHTSEEING', cost: 0, location: 'Fontainhas, Panaji' },
              { time: '12:30', title: 'Souvenir & Cashew Shopping', type: 'SHOPPING', cost: 2000, location: 'Panaji Market' },
              { time: '15:00', title: 'Airport / Station Transfer', type: 'TRANSIT', cost: 1200, location: 'Dabolim / Mopa' },
            ],
          },
        ],
      };

      return {
        reply: `🌴 I've designed a balanced 5-day Goa itinerary tailored to your budget! It covers the best of lively North Goa beaches, Portuguese colonial heritage in Old Goa, spice plantations, and the serene coastal beauty of South Goa with an estimated cost of ₹28,500.`,
        planSuggestion: plan,
        quickReplies: [
          'Add this plan to my trips',
          'What are the best seafood restaurants in Goa?',
          'What water sports should I book?',
        ],
      };
    }

    // 2. Kerala & Packing
    if (text.includes('kerala') || text.includes('pack')) {
      const plan: AssistantPlanSuggestion = {
        destination: 'Kerala (God\'s Own Country)',
        durationDays: 5,
        estimatedBudget: 35000,
        currency,
        highlights: [
          'Munnar tea gardens & misty viewpoints',
          'Alleppey traditional houseboat backwater cruise',
          'Periyar wildlife safari at Thekkady',
          'Kochi Fort & Chinese fishing nets heritage walk',
        ],
        packingList: [
          'Lightweight woolens/sweaters for Munnar (chilly evenings ~14°C)',
          'Breathable cotton shirts/dresses for Alleppey and Kochi',
          'Mosquito repellent & insect balm for backwaters',
          'Comfortable trekking/walking shoes for tea garden trails',
          'Slip-on footwear for temples & houseboats',
          'Universal power adapter & power bank for photography',
        ],
        bestTimeToVisit: 'September to March (Crisp hill station weather & calm backwaters)',
        dayByDayPlan: [
          {
            dayNumber: 1,
            title: 'Kochi Arrival & Colonial Heritage',
            activities: [
              { time: '10:00', title: 'Fort Kochi & Chinese Fishing Nets', type: 'SIGHTSEEING', cost: 300, location: 'Fort Kochi' },
              { time: '13:00', title: 'Kerala Sadhya Feast Lunch', type: 'DINING', cost: 800, location: 'Mattancherry' },
              { time: '16:00', title: 'Kathakali Dance Performance', type: 'ACTIVITY', cost: 900, location: 'Kerala Cultural Centre' },
            ],
          },
          {
            dayNumber: 2,
            title: 'Scenic Drive to Munnar & Tea Estates',
            activities: [
              { time: '08:00', title: 'Scenic Hill Drive via Cheeyappara Waterfalls', type: 'TRANSIT', cost: 1800, location: 'Kochi to Munnar' },
              { time: '14:00', title: 'Tea Plantation Walk & Tata Tea Museum', type: 'ACTIVITY', cost: 600, location: 'Munnar' },
              { time: '17:30', title: 'Sunset at Top Station Viewpoint', type: 'RELAXATION', cost: 200, location: 'Top Station' },
            ],
          },
          {
            dayNumber: 3,
            title: 'Munnar Wilderness to Thekkady',
            activities: [
              { time: '09:00', title: 'Eravikulam National Park (Nilgiri Tahr)', type: 'SIGHTSEEING', cost: 800, location: 'Eravikulam' },
              { time: '14:00', title: 'Transfer to Thekkady Spice Hills', type: 'TRANSIT', cost: 1500, location: 'Thekkady' },
              { time: '16:30', title: 'Periyar Lake Wildlife Boat Safari', type: 'ACTIVITY', cost: 1200, location: 'Periyar' },
            ],
          },
          {
            dayNumber: 4,
            title: 'Alleppey Backwaters Houseboat Cruise',
            activities: [
              { time: '12:00', title: 'Check-in to Luxury Alleppey Houseboat', type: 'CHECKIN', cost: 9500, location: 'Alleppey Backwaters' },
              { time: '13:30', title: 'Traditional Karimeen Fry Lunch on Board', type: 'DINING', cost: 0, location: 'Backwaters' },
              { time: '16:30', title: 'Village Canoe Ride & Paddy Fields', type: 'ACTIVITY', cost: 800, location: 'Kuttanad' },
            ],
          },
          {
            dayNumber: 5,
            title: 'Marari Beach Relaxation & Kochi Departure',
            activities: [
              { time: '09:00', title: 'Morning Coconut Groves Walk at Marari Beach', type: 'RELAXATION', cost: 0, location: 'Marari' },
              { time: '13:00', title: 'Spice & Banana Chips Shopping in Kochi', type: 'SHOPPING', cost: 1500, location: 'Ernakulam' },
              { time: '16:00', title: 'Kochi Airport Transfer', type: 'TRANSIT', cost: 1000, location: 'Cochin Intl Airport' },
            ],
          },
        ],
      };

      return {
        reply: `🌿 For Kerala in December, expect pleasant daytime temperatures (27°C - 30°C) near backwaters and coastal Kochi, but Munnar hill station gets chilly in early mornings and evenings (12°C - 16°C). I have prepared both a custom packing guide and a full 5-day itinerary!`,
        planSuggestion: plan,
        quickReplies: [
          'Create a trip from this Kerala plan',
          'What is the best type of houseboat in Alleppey?',
          'Suggest ayurvedic spa treatments',
        ],
      };
    }

    // 3. Jaipur & Rajasthan
    if (text.includes('jaipur') || text.includes('rajasthan')) {
      const plan: AssistantPlanSuggestion = {
        destination: 'Jaipur (The Pink City)',
        durationDays: 3,
        estimatedBudget: 18000,
        currency,
        highlights: [
          'Amer Fort elephant views and Sheesh Mahal mirror work',
          'Hawa Mahal & City Palace photography',
          'Nahargarh Fort sunset overlooking Jaipur skyline',
          'Authentic Dal Baati Churma & Johari Bazaar jewelry shopping',
        ],
        packingList: [
          'Comfortable walking shoes with good grip for fort climbs',
          'Sun hat, sunglasses & sunscreen',
          'Modest attire suitable for palaces and temples',
          'Camera with wide-angle lens for architectural splendor',
        ],
        bestTimeToVisit: 'October to March (Royal desert winter season)',
        dayByDayPlan: [
          {
            dayNumber: 1,
            title: 'Royal Heritage & City Core',
            activities: [
              { time: '09:00', title: 'Hawa Mahal Morning Photo Stop', type: 'SIGHTSEEING', cost: 200, location: 'Badi Choupad' },
              { time: '10:30', title: 'City Palace & Chandra Mahal Museum', type: 'SIGHTSEEING', cost: 700, location: 'City Palace' },
              { time: '13:30', title: 'Rajasthani Thali Lunch at LMB', type: 'DINING', cost: 900, location: 'Johari Bazaar' },
              { time: '15:30', title: 'Jantar Mantar Astronomical Observatory', type: 'SIGHTSEEING', cost: 300, location: 'Pink City' },
              { time: '18:00', title: 'Bapu Bazaar Textile & Jutti Shopping', type: 'SHOPPING', cost: 1500, location: 'Bapu Bazaar' },
            ],
          },
          {
            dayNumber: 2,
            title: 'Grand Forts of the Aravallis',
            activities: [
              { time: '08:30', title: 'Amer Fort & Sheesh Mahal Tour', type: 'SIGHTSEEING', cost: 800, location: 'Amer' },
              { time: '12:00', title: 'Panna Meena Ka Kund Stepwell', type: 'SIGHTSEEING', cost: 100, location: 'Amer Stepwell' },
              { time: '14:00', title: 'Lunch at 1135 AD inside Amer', type: 'DINING', cost: 1800, location: 'Amer Fort' },
              { time: '16:30', title: 'Nahargarh Fort Sunset & Padao Cafe', type: 'RELAXATION', cost: 600, location: 'Nahargarh' },
            ],
          },
          {
            dayNumber: 3,
            title: 'Stepwells, Crafts & Chokhi Dhani',
            activities: [
              { time: '09:30', title: 'Albert Hall Museum & Pigeon Square', type: 'SIGHTSEEING', cost: 300, location: 'Ram Niwas Garden' },
              { time: '12:30', title: 'Jaipur Blue Pottery Workshop & Shopping', type: 'ACTIVITY', cost: 1200, location: 'Civil Lines' },
              { time: '17:30', title: 'Chokhi Dhani Village Cultural Evening & Feast', type: 'ACTIVITY', cost: 1800, location: 'Tonk Road' },
            ],
          },
        ],
      };

      return {
        reply: `🏰 Here is an exhilarating 3-day royal Jaipur itinerary! Experience the monumental Amer Fort, the astronomical marvel of Jantar Mantar, glorious sunset viewpoints at Nahargarh, and the culinary treasures of Rajasthan.`,
        planSuggestion: plan,
        quickReplies: [
          'Add Jaipur trip to my planner',
          'Where to find authentic Dal Baati Churma?',
          'What are the best boutique heritage hotels?',
        ],
      };
    }

    // 4. Mumbai / Near Mumbai Family Friendly Recommendations
    if (text.includes('mumbai') || text.includes('near mumbai') || text.includes('family')) {
      return {
        reply: `👨‍👩‍👧‍👦 Here are top-rated family-friendly weekend getaways near Mumbai:
1. **Lonavala & Khandala** (2 hrs): Tiger Point, Bhushi Dam, Karla Caves & fresh chikki shopping.
2. **Alibaug Coastal Retreat** (1 hr via Mandwa Ro-Ro ferry): Nagaon watersports, Kolaba Fort walking trail, and peaceful beach villas.
3. **Mahabaleshwar & Panchgani** (5 hrs): Strawberry picking farms, Mapro Garden, Arthur's Seat & boating on Venna Lake.
4. **Matheran Eco Hill Station** (2.5 hrs): Asia's only automobile-free hill town with mini toy train rides and horseback viewpoints.
5. **Daman & Silvassa** (3 hrs): Coastal forts, quiet Devka beach, and Portuguese colonial charm.

Would you like me to build a customized 2-day or 3-day itinerary for any of these destinations?`,
        quickReplies: [
          'Plan a 2-day Alibaug trip',
          'Plan a 3-day Mahabaleshwar trip',
          'Show beach destinations under ₹20,000',
        ],
      };
    }

    // General Smart Assistant Default
    return {
      reply: `✨ Hello! I am your AI Travel Assistant. I can help you:
- **Design comprehensive day-by-day itineraries** for any destination with exact timings and costs
- **Estimate travel budgets** and optimize expenses across transport, stays, and food
- **Provide packing checklists** and seasonal weather guides
- **Suggest hidden gems, local restaurants, and safety tips**

Tell me your dream destination, budget, or dates, and I'll craft the perfect journey for you!`,
      quickReplies: [
        'Plan a 5-day Goa trip under ₹30,000',
        'What should I pack for Kerala in December?',
        'Suggest family-friendly places near Mumbai',
        'What can I do in Jaipur in 3 days?',
      ],
    };
  }
}
