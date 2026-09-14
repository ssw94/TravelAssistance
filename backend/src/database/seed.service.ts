import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';

import { User } from '../users/entities/user.entity';
import { UserProfile } from '../users/entities/user-profile.entity';
import { Destination } from '../destinations/entities/destination.entity';
import { DestinationImage } from '../destinations/entities/destination-image.entity';
import { DestinationActivity } from '../destinations/entities/destination-activity.entity';
import { Trip } from '../trips/entities/trip.entity';
import { ItineraryDay } from '../itineraries/entities/itinerary-day.entity';
import { ItineraryItem } from '../itineraries/entities/itinerary-item.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { Review } from '../reviews/entities/review.entity';
import { Notification } from '../notifications/entities/notification.entity';
import {
  UserRole,
  TravelStyle,
  TripStatus,
  ActivityType,
  BookingType,
  BookingStatus,
  ExpenseCategory,
  NotificationType,
  ReviewStatus,
} from '../common/enums';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserProfile) private readonly profileRepo: Repository<UserProfile>,
    @InjectRepository(Destination) private readonly destRepo: Repository<Destination>,
    @InjectRepository(DestinationImage) private readonly imgRepo: Repository<DestinationImage>,
    @InjectRepository(DestinationActivity) private readonly actRepo: Repository<DestinationActivity>,
    @InjectRepository(Trip) private readonly tripRepo: Repository<Trip>,
    @InjectRepository(ItineraryDay) private readonly dayRepo: Repository<ItineraryDay>,
    @InjectRepository(ItineraryItem) private readonly itemRepo: Repository<ItineraryItem>,
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Expense) private readonly expenseRepo: Repository<Expense>,
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Notification) private readonly notifRepo: Repository<Notification>,
  ) {}

  async seed() {
    this.logger.log('🌱 Starting comprehensive database seed...');

    // 1. Seed Users
    const salt = await bcrypt.genSalt(10);
    const adminPassHash = await bcrypt.hash('Admin@123456', salt);
    const demoPassHash = await bcrypt.hash('Sachin@123', salt);

    let admin = await this.userRepo.findOne({ where: { email: 'admin@travelassistance.com' } });
    if (!admin) {
      admin = this.userRepo.create({
        email: 'admin@travelassistance.com',
        firstName: 'System',
        lastName: 'Admin',
        passwordHash: adminPassHash,
        role: UserRole.ADMIN,
        isActive: true,
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      });
      await this.userRepo.save(admin);
      const adminProfile = this.profileRepo.create({
        user: admin,
        preferredCurrency: 'INR',
        language: 'en',
        bio: 'Super administrator managing travel content and safety verifications.',
      });
      await this.profileRepo.save(adminProfile);
    }

    let demoUser = await this.userRepo.findOne({ where: { email: 'sachin@travelassistance.com' } });
    if (!demoUser) {
      demoUser = this.userRepo.create({
        email: 'sachin@travelassistance.com',
        firstName: 'Sachin',
        lastName: 'Sharma',
        passwordHash: demoPassHash,
        role: UserRole.USER,
        isActive: true,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      });
      await this.userRepo.save(demoUser);
      const demoProfile = this.profileRepo.create({
        user: demoUser,
        preferredCurrency: 'INR',
        preferredTravelStyle: TravelStyle.STANDARD,
        favoriteDestinations: ['Goa', 'Kerala', 'Paris'],
        language: 'en',
        bio: 'Travel explorer, foodie, and beach lover.',
      });
      await this.profileRepo.save(demoProfile);
    }

    // 2. Seed Destinations
    const destinationsData = [
      {
        name: 'Goa',
        country: 'India',
        state: 'Goa',
        city: 'Panaji',
        description: 'Sun-drenched golden beaches, Portuguese heritage villas, spice plantations, and electrifying nightlife.',
        overview: 'Goa is India\'s coastal paradise offering a sublime blend of serene white sand shores in South Goa and lively bustling shacks with water sports in North Goa. Rich in colonial architecture, vibrant flea markets, and mouthwatering seafood curries.',
        coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200',
        rating: 4.85,
        reviewCount: 142,
        startingBudget: 12000,
        currency: 'INR',
        bestTimeToVisit: 'November to February',
        bestSeasons: ['Winter', 'Spring'],
        travelTypes: ['Beach', 'Nightlife', 'Heritage', 'Culinary'],
        suggestedDuration: '4-6 days',
        weatherInfo: { averageTemp: '28°C', condition: 'Sunny & Pleasant', humidity: '65%' },
        popularAttractions: ['Calangute Beach', 'Fort Aguada', 'Basilica of Bom Jesus', 'Dudhsagar Falls', 'Palolem Beach'],
        recommendedHotels: ['Taj Exotica Resort & Spa', 'W Goa', 'Alila Diwa'],
        recommendedRestaurants: ['Gunpowder', 'Fisherman\'s Wharf', 'Thalassa Greek Taverna'],
        transportationInfo: 'Scooter rentals at ₹400-600/day, GoaMiles app cabs, and prepaid airport taxis.',
        safetyTips: 'Swim only in designated zones marked with green flags. Keep helmet strapped when riding rented two-wheelers.',
        localTips: 'Head to Butterfly Beach by local boat early morning for dolphin sightings.',
        latitude: 15.2993,
        longitude: 74.1240,
        isTrending: true,
        isFeatured: true,
        gallery: [
          { url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200', caption: 'Goa Palm Beach Sunset', isHero: true },
          { url: 'https://images.unsplash.com/photo-1587922546307-776227941871?w=1200', caption: 'Portuguese Architecture in Fontainhas' },
          { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200', caption: 'South Goa Pristine Shores' },
        ],
        activities: [
          { name: 'Scuba Diving & Snorkeling at Grand Island', description: 'Crystal clear underwater exploration with certified PADI divemasters.', estimatedCost: 3500, duration: '4 hours', category: 'Watersports' },
          { name: 'Mandovi River Sunset Luxury Cruise', description: 'Enjoy Goan folk dance performances and scenic river sunset views.', estimatedCost: 1200, duration: '2 hours', category: 'Sightseeing' },
          { name: 'Fontainhas Latin Heritage Walking Tour', description: 'Explore narrow pastel-colored streets, historic bakeries, and art galleries.', estimatedCost: 800, duration: '2.5 hours', category: 'Heritage' },
        ],
      },
      {
        name: 'Kerala',
        country: 'India',
        state: 'Kerala',
        city: 'Alleppey & Munnar',
        description: 'Misty green tea estates, peaceful backwaters houseboats, Ayurvedic healing, and coconut fringed coastlines.',
        overview: 'Affectionately known as God\'s Own Country, Kerala features tranquil backwater networks in Alleppey, emerald tea gardens and cool mountain breezes in Munnar, and dense tiger sanctuaries in Thekkady.',
        coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200',
        rating: 4.90,
        reviewCount: 98,
        startingBudget: 16000,
        currency: 'INR',
        bestTimeToVisit: 'September to March',
        bestSeasons: ['Winter', 'Autumn', 'Monsoon'],
        travelTypes: ['Nature', 'Romantic', 'Relaxation', 'Culinary'],
        suggestedDuration: '5-7 days',
        weatherInfo: { averageTemp: '24°C', condition: 'Crisp & Breezy', humidity: '72%' },
        popularAttractions: ['Alleppey Backwaters', 'Eravikulam National Park', 'Mattupetty Dam', 'Periyar Wildlife Sanctuary', 'Athirappilly Waterfalls'],
        recommendedHotels: ['Spice Tree Munnar', 'Kumarakom Lake Resort', 'Brunton Boatyard Kochi'],
        recommendedRestaurants: ['Kashi Art Cafe', 'Grand Pavilion', 'Paragon Restaurant'],
        transportationInfo: 'Private AC chauffeur vehicles are the most comfortable way to traverse between hill stations and backwaters.',
        safetyTips: 'Book government-licensed houseboats for safety and quality assurance.',
        localTips: 'Order traditional hot Kerala Sadhya served on banana leaves for lunch in Kochi.',
        latitude: 9.4981,
        longitude: 76.3388,
        isTrending: true,
        isFeatured: true,
        gallery: [
          { url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200', caption: 'Traditional Alleppey Houseboat', isHero: true },
          { url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200', caption: 'Lush Munnar Tea Terraces' },
        ],
        activities: [
          { name: 'Overnight Houseboat Backwaters Cruise', description: 'Drift along calm palm-lined lagoons with authentic freshly prepared meals.', estimatedCost: 9500, duration: '20 hours', category: 'Cruise' },
          { name: 'Munnar Tea Estate Guided Trek', description: 'Walk through rolling green estates and learn artisanal tea processing.', estimatedCost: 600, duration: '3 hours', category: 'Trekking' },
        ],
      },
      {
        name: 'Jaipur',
        country: 'India',
        state: 'Rajasthan',
        city: 'Jaipur',
        description: 'Grand hilltop forts, opulent royal palaces, vibrant bazaars, and legendary Rajasthani hospitality.',
        overview: 'The iconic Pink City forms India’s Golden Triangle. Home to monumental UNESCO World Heritage forts like Amer and Nahargarh, the whimsical Hawa Mahal facade, and exquisite block-print textiles.',
        coverImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200',
        rating: 4.75,
        reviewCount: 110,
        startingBudget: 10000,
        currency: 'INR',
        bestTimeToVisit: 'October to March',
        bestSeasons: ['Winter', 'Autumn'],
        travelTypes: ['Heritage', 'Culture', 'Shopping', 'Culinary'],
        suggestedDuration: '3-4 days',
        weatherInfo: { averageTemp: '22°C', condition: 'Sunny & Pleasant', humidity: '45%' },
        popularAttractions: ['Amer Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Nahargarh Fort', 'Jal Mahal'],
        recommendedHotels: ['Rambagh Palace', 'Samode Haveli', 'ITC Rajputana'],
        recommendedRestaurants: ['1135 AD', 'LMB Johari Bazaar', 'Padao Open Air Cafe'],
        transportationInfo: 'Jaipur Metro connects major transit hubs. E-rickshaws are ideal for navigating Old City markets.',
        safetyTips: 'Negotiate guide fees upfront and verify official tourist badges.',
        localTips: 'Watch the sunset from Padao Restaurant at Nahargarh Fort for a sparkling view of the entire city.',
        latitude: 26.9124,
        longitude: 75.7873,
        isTrending: true,
        isFeatured: false,
        gallery: [
          { url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200', caption: 'Amer Fort Reflection', isHero: true },
          { url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200', caption: 'Hawa Mahal Palace of Winds' },
        ],
        activities: [
          { name: 'Amer Fort Sound & Light Show', description: 'Witness the heroic saga of Rajput warriors illuminated against the royal ramparts.', estimatedCost: 500, duration: '1.5 hours', category: 'Heritage' },
          { name: 'Chokhi Dhani Cultural Village Experience', description: 'Folk dances, camel rides, puppetry, and a lavish traditional Rajasthani dinner.', estimatedCost: 1600, duration: '4 hours', category: 'Culture' },
        ],
      },
      {
        name: 'Paris',
        country: 'France',
        state: 'Île-de-France',
        city: 'Paris',
        description: 'The City of Light: world-class museums, timeless architecture, romantic Seine walks, and haute cuisine.',
        overview: 'Paris captivates visitors with iconic landmarks including the Eiffel Tower, the Louvre Museum, and Notre-Dame. Stroll along charming boulevards, savor buttery croissants at sidewalk bistros, and experience Parisian haute couture.',
        coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200',
        rating: 4.92,
        reviewCount: 310,
        startingBudget: 85000,
        currency: 'EUR',
        bestTimeToVisit: 'April to October',
        bestSeasons: ['Spring', 'Summer', 'Autumn'],
        travelTypes: ['Romantic', 'Heritage', 'Culture', 'Culinary'],
        suggestedDuration: '5-7 days',
        weatherInfo: { averageTemp: '19°C', condition: 'Mild & Sunny', humidity: '58%' },
        popularAttractions: ['Eiffel Tower', 'Louvre Museum', 'Arc de Triomphe', 'Montmartre & Sacré-Cœur', 'Seine River'],
        recommendedHotels: ['The Ritz Paris', 'Hotel Plaza Athénée', 'CitizenM Paris Gare de Lyon'],
        recommendedRestaurants: ['Le Gabriel', 'Café de Flore', 'L\'As du Fallafel'],
        transportationInfo: 'The Paris Metro is fast, affordable, and reaches every quarter of the city.',
        safetyTips: 'Beware of pickpockets around high-density tourist hubs like the Eiffel Tower and Metro Line 1.',
        localTips: 'Book museum tickets online in advance to skip hours of queues.',
        latitude: 48.8566,
        longitude: 2.3522,
        isTrending: true,
        isFeatured: true,
        gallery: [
          { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200', caption: 'Eiffel Tower at Twilight', isHero: true },
          { url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200', caption: 'Louvre Pyramid Courtyard' },
        ],
        activities: [
          { name: 'Seine River Sunset Dinner Cruise', description: 'Gourmet 3-course French dining while gliding past illuminated monuments.', estimatedCost: 7500, duration: '2.5 hours', category: 'Cruise' },
          { name: 'Louvre Masterpieces Guided Tour', description: 'Skip-the-line VIP tour covering the Mona Lisa, Venus de Milo, and Winged Victory.', estimatedCost: 5500, duration: '3 hours', category: 'Culture' },
        ],
      },
      {
        name: 'Tokyo',
        country: 'Japan',
        state: 'Kanto',
        city: 'Tokyo',
        description: 'Neon-lit skyscrapers, ancient Shinto shrines, futuristic robotics, and unmatched culinary perfection.',
        overview: 'Tokyo seamlessly blends ultramodern technology with timeless traditions. Discover bustling crossings in Shibuya, tranquil gardens in Shinjuku Gyoen, world-renowned sushi in Tsukiji, and anime subcultures in Akihabara.',
        coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200',
        rating: 4.95,
        reviewCount: 280,
        startingBudget: 90000,
        currency: 'JPY',
        bestTimeToVisit: 'March to May & September to November',
        bestSeasons: ['Spring', 'Autumn'],
        travelTypes: ['Adventure', 'Culture', 'Culinary', 'City'],
        suggestedDuration: '6-8 days',
        weatherInfo: { averageTemp: '18°C', condition: 'Clear Skies', humidity: '52%' },
        popularAttractions: ['Shibuya Crossing', 'Sensō-ji Temple', 'Tokyo Skytree', 'TeamLab Planets', 'Meiji Jingu Shrine'],
        recommendedHotels: ['Park Hyatt Tokyo', 'Aman Tokyo', 'Trunk Hotel Shibuya'],
        recommendedRestaurants: ['Sukiyabashi Jiro', 'Ichiran Ramen Shibuya', 'Gonpachi Nishi-Azabu'],
        transportationInfo: 'Tokyo JR Yamanote line and subway network are the most punctual transit systems in the world.',
        safetyTips: 'Tokyo is one of the safest cities globally. Keep cash on hand as some smaller izakayas only accept cash.',
        localTips: 'Grab high-quality bento meals from convenience stores (7-Eleven/Lawson) for scenic bullet train rides.',
        latitude: 35.6762,
        longitude: 139.6503,
        isTrending: true,
        isFeatured: true,
        gallery: [
          { url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200', caption: 'Tokyo Tower and Skyline', isHero: true },
          { url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200', caption: 'Historic Senso-ji Temple' },
        ],
        activities: [
          { name: 'TeamLab Planets Immersive Digital Art', description: 'Walk through water and body-immersive digital light exhibits.', estimatedCost: 2800, duration: '2 hours', category: 'Culture' },
          { name: 'Mount Fuji & Lake Kawaguchi Day Tour', description: 'Panoramic views of Mt. Fuji, pagoda lookouts, and hot spring baths.', estimatedCost: 7500, duration: '8 hours', category: 'Sightseeing' },
        ],
      },
      {
        name: 'Bali',
        country: 'Indonesia',
        state: 'Bali',
        city: 'Ubud & Seminyak',
        description: 'Tropical volcanic paradise, iconic emerald rice terraces, sacred sea temples, and world-class surf breaks.',
        overview: 'Bali is an enchanting island blending serene spiritual retreats in Ubud with chic beach lounges and surf culture in Canggu and Seminyak. Famous for cliffside temples like Uluwatu and scenic waterfalls.',
        coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200',
        rating: 4.88,
        reviewCount: 220,
        startingBudget: 35000,
        currency: 'IDR',
        bestTimeToVisit: 'April to October',
        bestSeasons: ['Summer', 'Spring', 'Autumn'],
        travelTypes: ['Beach', 'Nature', 'Romantic', 'Adventure'],
        suggestedDuration: '5-7 days',
        weatherInfo: { averageTemp: '29°C', condition: 'Tropical Warm', humidity: '70%' },
        popularAttractions: ['Tegallalang Rice Terraces', 'Uluwatu Temple', 'Mount Batur', 'Sacred Monkey Forest', 'Seminyak Beach'],
        recommendedHotels: ['Four Seasons Resort Sayan', 'Potato Head Suites', 'Maya Ubud'],
        recommendedRestaurants: ['Locavore NXT', 'Naughty Nuri\'s', 'La Lucciola'],
        transportationInfo: 'Grab and Gojek ride-hailing apps work seamlessly across South Bali.',
        safetyTips: 'Exchange currency only at authorized money changers with glass counters.',
        localTips: 'Watch the hypnotic Kecak fire dance at Uluwatu Cliff during sunset.',
        latitude: -8.4095,
        longitude: 115.1889,
        isTrending: true,
        isFeatured: true,
        gallery: [
          { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200', caption: 'Ubud Jungle & Rice Terraces', isHero: true },
          { url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200', caption: 'Pura Ulun Danu Bratan Water Temple' },
        ],
        activities: [
          { name: 'Mount Batur Sunrise Volcano Hike', description: 'Early morning trek to watch the sunrise above the clouds with volcanic breakfast.', estimatedCost: 3200, duration: '6 hours', category: 'Trekking' },
          { name: 'Nusa Penida Island Speedboat Day Tour', description: 'Visit Kelingking T-Rex cliff, Angel\'s Billabong, and swim with manta rays.', estimatedCost: 4500, duration: '8 hours', category: 'Adventure' },
        ],
      },
    ];

    for (const d of destinationsData) {
      let dest = await this.destRepo.findOne({ where: { name: d.name } });
      if (!dest) {
        const { gallery, activities, ...destFields } = d;
        const newDest = this.destRepo.create(destFields as Partial<Destination>);
        const savedDest = await this.destRepo.save(newDest);

        if (gallery && gallery.length > 0) {
          const imgs = gallery.map((g) => this.imgRepo.create({ ...g, destination: savedDest }));
          await this.imgRepo.save(imgs);
        }

        if (activities && activities.length > 0) {
          const acts = activities.map((a) => this.actRepo.create({ ...a, destination: savedDest }));
          await this.actRepo.save(acts);
        }
      }
    }

    // 3. Seed Sample Trip for Demo User
    const goaDest = await this.destRepo.findOne({ where: { name: 'Goa' } });
    let demoTrip = await this.tripRepo.findOne({ where: { name: 'Goa Beach & Heritage Getaway' } });

    if (!demoTrip && goaDest && demoUser) {
      const today = dayjs();
      const startDate = today.add(5, 'day').format('YYYY-MM-DD');
      const endDate = today.add(10, 'day').format('YYYY-MM-DD');

      demoTrip = this.tripRepo.create({
        name: 'Goa Beach & Heritage Getaway',
        destination: 'Goa, India',
        destinationEntity: goaDest,
        startDate,
        endDate,
        numberOfTravelers: 2,
        travelStyle: TravelStyle.STANDARD,
        status: TripStatus.CONFIRMED,
        budget: 45000,
        currency: 'INR',
        notes: 'Annual getaway with family. Planned seaside activities, historical fort visits, and seafood dining.',
        coverImageUrl: goaDest.coverImage,
        user: demoUser,
      });

      const savedTrip = await this.tripRepo.save(demoTrip);

      // Create Days
      const daysData = [
        { dayNumber: 1, date: startDate, title: 'Day 1 - Arrival & Candolim Relaxation', summary: 'Hotel check-in and sunset seafood dinner' },
        { dayNumber: 2, date: today.add(6, 'day').format('YYYY-MM-DD'), title: 'Day 2 - North Goa Forts & Water Sports', summary: 'Fort Aguada and Baga beach sports' },
        { dayNumber: 3, date: today.add(7, 'day').format('YYYY-MM-DD'), title: 'Day 3 - Old Goa Heritage & River Cruise', summary: 'Colonial churches and evening cruise' },
        { dayNumber: 4, date: today.add(8, 'day').format('YYYY-MM-DD'), title: 'Day 4 - South Goa Beaches & Scuba', summary: 'Palolem beach & coastal dining' },
        { dayNumber: 5, date: endDate, title: 'Day 5 - Fontainhas & Return Flight', summary: 'Latin quarter walk and souvenir shopping' },
      ];

      for (const d of daysData) {
        const day = this.dayRepo.create({
          trip: savedTrip,
          dayNumber: d.dayNumber,
          date: d.date,
          title: d.title,
          summary: d.summary,
        });
        const savedDay = await this.dayRepo.save(day);

        // Add activities for Day 1
        if (d.dayNumber === 1) {
          const items = [
            this.itemRepo.create({
              itineraryDay: savedDay,
              startTime: '11:00',
              endTime: '12:00',
              title: 'Check-in at Taj Fort Aguada',
              description: 'Freshen up and enjoy sea-view balcony welcome drink',
              type: ActivityType.CHECKIN,
              location: 'Sinquerim Beach',
              estimatedCost: 0,
              isCompleted: true,
              orderIndex: 0,
            }),
            this.itemRepo.create({
              itineraryDay: savedDay,
              startTime: '13:30',
              endTime: '15:00',
              title: 'Lunch at Fisherman\'s Wharf',
              description: 'Authentic Goan prawn curry and garlic naan',
              type: ActivityType.DINING,
              location: 'Panaji Riverside',
              estimatedCost: 1800,
              isCompleted: true,
              orderIndex: 1,
            }),
            this.itemRepo.create({
              itineraryDay: savedDay,
              startTime: '16:30',
              endTime: '19:00',
              title: 'Sunset Walk at Candolim Beach',
              description: 'Stroll along gentle waves and enjoy fresh tender coconuts',
              type: ActivityType.RELAXATION,
              location: 'Candolim Beach',
              estimatedCost: 200,
              isCompleted: false,
              orderIndex: 2,
            }),
          ];
          await this.itemRepo.save(items);
        }

        // Add activities for Day 2
        if (d.dayNumber === 2) {
          const items = [
            this.itemRepo.create({
              itineraryDay: savedDay,
              startTime: '09:00',
              endTime: '11:30',
              title: 'Fort Aguada & Lighthouse Exploration',
              description: 'Historic 17th-century Portuguese fortress with panoramic Arabian sea views',
              type: ActivityType.SIGHTSEEING,
              location: 'Aguada Fort',
              estimatedCost: 300,
              isCompleted: false,
              orderIndex: 0,
            }),
            this.itemRepo.create({
              itineraryDay: savedDay,
              startTime: '15:00',
              endTime: '17:30',
              title: 'Parasailing & Jet Ski at Baga Beach',
              description: 'High-adrenaline water sports with certified instructors',
              type: ActivityType.ACTIVITY,
              location: 'Baga Beach Watersports Hub',
              estimatedCost: 3200,
              isCompleted: false,
              orderIndex: 1,
            }),
          ];
          await this.itemRepo.save(items);
        }
      }

      // Seed Bookings
      const flightBooking = this.bookingRepo.create({
        user: demoUser,
        trip: savedTrip,
        bookingType: BookingType.FLIGHT,
        title: 'IndiGo Flight 6E-204 (BOM → GOI)',
        provider: 'IndiGo Airlines',
        confirmationNumber: '6E-GOA-78921',
        startDateTime: new Date(`${startDate}T08:30:00Z`),
        endDateTime: new Date(`${startDate}T09:50:00Z`),
        cost: 9500,
        currency: 'INR',
        status: BookingStatus.CONFIRMED,
        notes: 'Terminal 2 departure. Check-in luggage 15kg included.',
        details: { origin: 'Mumbai (BOM)', destination: 'Goa (GOI)', seatNumber: '12F, 12E' },
      });

      const hotelBooking = this.bookingRepo.create({
        user: demoUser,
        trip: savedTrip,
        bookingType: BookingType.HOTEL,
        title: 'Taj Fort Aguada Resort & Spa',
        provider: 'Taj Hotels',
        confirmationNumber: 'TAJ-AGUADA-5542',
        startDateTime: new Date(`${startDate}T14:00:00Z`),
        endDateTime: new Date(`${endDate}T11:00:00Z`),
        cost: 24000,
        currency: 'INR',
        status: BookingStatus.CONFIRMED,
        notes: 'Sea View King Room with complimentary buffet breakfast.',
        details: { roomType: 'Superior Sea View Room', contactPhone: '+918326645858' },
      });

      await this.bookingRepo.save([flightBooking, hotelBooking]);

      // Seed Expenses
      const sampleExpenses = [
        this.expenseRepo.create({
          user: demoUser,
          trip: savedTrip,
          title: 'Roundtrip Flight Tickets',
          amount: 19000,
          currency: 'INR',
          category: ExpenseCategory.TRANSPORTATION,
          date: startDate,
          paymentMethod: 'Credit Card',
          notes: 'IndiGo flight for 2 passengers',
        }),
        this.expenseRepo.create({
          user: demoUser,
          trip: savedTrip,
          title: 'Resort Advance Deposit',
          amount: 12000,
          currency: 'INR',
          category: ExpenseCategory.ACCOMMODATION,
          date: startDate,
          paymentMethod: 'UPI',
          notes: '50% advance booking payment',
        }),
        this.expenseRepo.create({
          user: demoUser,
          trip: savedTrip,
          title: 'Seafood Lunch at Fisherman\'s Wharf',
          amount: 1800,
          currency: 'INR',
          category: ExpenseCategory.FOOD,
          date: startDate,
          paymentMethod: 'Debit Card',
        }),
      ];
      await this.expenseRepo.save(sampleExpenses);
    }

    // 4. Seed Reviews
    if (goaDest && demoUser) {
      const existingReview = await this.reviewRepo.findOne({
        where: { user: { id: demoUser.id }, destination: { id: goaDest.id } },
      });
      if (!existingReview) {
        const review = this.reviewRepo.create({
          user: demoUser,
          destination: goaDest,
          rating: 5,
          title: 'Pure Bliss and Unbeatable Sunsets!',
          comment: 'Goa never fails to amaze. The food at South Goa shacks was extraordinary, and riding along the coastal roads in the morning breeze was the highlight of our trip!',
          status: ReviewStatus.APPROVED,
          helpfulVotes: 24,
        });
        await this.reviewRepo.save(review);
      }
    }

    // 5. Seed Notifications
    if (demoUser) {
      const notifs = [
        this.notifRepo.create({
          user: demoUser,
          title: '🌴 Upcoming Trip in 5 Days!',
          message: 'Your trip to Goa is just around the corner. Check your day-by-day itinerary and pack your sunscreen!',
          type: NotificationType.TRIP_ALERT,
          isRead: false,
          actionLink: '/trips',
        }),
        this.notifRepo.create({
          user: demoUser,
          title: '✈️ Flight Booking Confirmed',
          message: 'IndiGo flight 6E-204 from BOM to GOI has been successfully verified.',
          type: NotificationType.BOOKING_REMINDER,
          isRead: true,
          actionLink: '/bookings',
        }),
      ];
      await this.notifRepo.save(notifs);
    }

    this.logger.log(' Database seed completed successfully!');
  }
}
