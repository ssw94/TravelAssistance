export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum TripStatus {
  PLANNING = 'PLANNING',
  CONFIRMED = 'CONFIRMED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TravelStyle {
  BUDGET = 'BUDGET',
  STANDARD = 'STANDARD',
  LUXURY = 'LUXURY',
  ADVENTURE = 'ADVENTURE',
  FAMILY = 'FAMILY',
  COUPLE = 'COUPLE',
  SOLO = 'SOLO',
  BUSINESS = 'BUSINESS',
}

export enum BookingType {
  FLIGHT = 'FLIGHT',
  HOTEL = 'HOTEL',
  TRAIN = 'TRAIN',
  BUS = 'BUS',
  ACTIVITY = 'ACTIVITY',
  CAR_RENTAL = 'CAR_RENTAL',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum ExpenseCategory {
  TRANSPORTATION = 'TRANSPORTATION',
  ACCOMMODATION = 'ACCOMMODATION',
  FOOD = 'FOOD',
  ACTIVITIES = 'ACTIVITIES',
  SHOPPING = 'SHOPPING',
  EMERGENCY = 'EMERGENCY',
  OTHER = 'OTHER',
}

export enum NotificationType {
  TRIP_ALERT = 'TRIP_ALERT',
  BOOKING_REMINDER = 'BOOKING_REMINDER',
  ITINERARY_ACTIVITY = 'ITINERARY_ACTIVITY',
  BUDGET_THRESHOLD = 'BUDGET_THRESHOLD',
  TRIP_COMPLETION = 'TRIP_COMPLETION',
  SYSTEM = 'SYSTEM',
}

export enum ReviewStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export enum ActivityType {
  TRANSIT = 'TRANSIT',
  CHECKIN = 'CHECKIN',
  SIGHTSEEING = 'SIGHTSEEING',
  DINING = 'DINING',
  ACTIVITY = 'ACTIVITY',
  RELAXATION = 'RELAXATION',
  SHOPPING = 'SHOPPING',
  OTHER = 'OTHER',
}

export interface UserProfile {
  id?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  preferredCurrency?: string;
  preferredTravelStyle?: TravelStyle;
  favoriteDestinations?: string[];
  language?: string;
  bio?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string;
  profile?: UserProfile;
  createdAt?: string;
}

export interface DestinationImage {
  id: string;
  url: string;
  caption?: string;
  isHero: boolean;
}

export interface DestinationActivity {
  id: string;
  name: string;
  description?: string;
  estimatedCost: number;
  duration: string;
  category?: string;
  imageUrl?: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  state?: string;
  city?: string;
  description: string;
  overview?: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  startingBudget: number;
  currency: string;
  bestTimeToVisit?: string;
  bestSeasons?: string[];
  travelTypes?: string[];
  suggestedDuration: string;
  weatherInfo?: {
    averageTemp: string;
    condition: string;
    humidity: string;
    rainyDaysPerMonth?: number;
  };
  popularAttractions?: string[];
  recommendedHotels?: string[];
  recommendedRestaurants?: string[];
  transportationInfo?: string;
  safetyTips?: string;
  localTips?: string;
  latitude?: number;
  longitude?: number;
  isTrending?: boolean;
  isFeatured?: boolean;
  gallery?: DestinationImage[];
  activities?: DestinationActivity[];
  reviews?: Review[];
}

export interface ItineraryItem {
  id: string;
  startTime: string;
  endTime?: string;
  title: string;
  description?: string;
  type: ActivityType;
  location?: string;
  transportation?: string;
  estimatedCost: number;
  currency: string;
  isCompleted: boolean;
  orderIndex: number;
  notes?: string;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  date: string;
  title?: string;
  summary?: string;
  items?: ItineraryItem[];
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  destinationEntity?: Destination;
  startDate: string;
  endDate: string;
  numberOfTravelers: number;
  travelStyle: TravelStyle;
  status: TripStatus;
  budget: number;
  currency: string;
  notes?: string;
  coverImageUrl?: string;
  itineraryDays?: ItineraryDay[];
  bookings?: Booking[];
  expenses?: Expense[];
  user?: User;
  createdAt?: string;
}

export interface Booking {
  id: string;
  bookingType: BookingType;
  title: string;
  provider: string;
  confirmationNumber?: string;
  startDateTime: string;
  endDateTime?: string;
  cost: number;
  currency: string;
  status: BookingStatus;
  notes?: string;
  trip?: { id: string; name: string };
  details?: Record<string, any>;
  createdAt?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  date: string;
  paymentMethod?: string;
  notes?: string;
  receiptUrl?: string;
  trip?: { id: string; name: string };
  createdAt?: string;
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  status: ReviewStatus;
  helpfulVotes: number;
  user?: { id: string; firstName: string; lastName: string; avatarUrl?: string };
  destination?: { id: string; name: string };
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  actionLink?: string;
  createdAt: string;
}

export interface AssistantPlanSuggestion {
  destination: string;
  durationDays: number;
  estimatedBudget: number;
  currency: string;
  highlights: string[];
  packingList?: string[];
  bestTimeToVisit?: string;
  dayByDayPlan: Array<{
    dayNumber: number;
    title: string;
    activities: Array<{
      time: string;
      title: string;
      type: string;
      cost: number;
      location?: string;
    }>;
  }>;
}

export interface AssistantResponse {
  reply: string;
  planSuggestion?: AssistantPlanSuggestion;
  quickReplies?: string[];
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
