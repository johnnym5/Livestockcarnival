export interface TimeBlock {
  id: string;
  timeRange: string;
  heading: string;
  details: string;
  location: string;
  track: string;
  activities: string[];
}

export interface DayProgram {
  dayNumber: number;
  dateString: string;
  title: string;
  timeBlocks: TimeBlock[];
}

export const CARNIVAL_PROGRAM: Record<string, DayProgram> = {
  // =========================================================================
  // DAY 1: Grand Opening, Presidential Commission & Livestock Parade
  // Date: 21 November 2026
  // =========================================================================
  day1: {
    dayNumber: 1,
    dateString: "Friday, 21 November 2026",
    title: "Grand Opening, Presidential Commission & Livestock Parade",
    timeBlocks: [
      {
        id: "d1-b1",
        timeRange: "08:00 - 10:00 AM",
        heading: "VIP Reception & Security",
        details: "VIP Arrival, Red Carpet Reception & Security Sweep by Police, Military & Agro-Rangers.",
        location: "State VIP Pavilion & Protocol Corridors",
        track: "Ceremony",
        activities: [
          "VIP Arrival & Red Carpet Reception",
          "Security Sweep by Police, Military & Agro-Rangers",
          "Protocol clearance for Diplomatic Corps & Governors"
        ]
      },
      {
        id: "d1-b2",
        timeRange: "10:00 - 12:30 PM",
        heading: "Opening Parade & Ribbon Cutting by Hon. Minister of Livestock",
        details: "Official opening of Livestock Pavilion & Grand Parade of prize dairy cattle, camels, and bulls.",
        location: "Main Arena & Central Runway",
        track: "Ceremony",
        activities: [
          "Ribbon Cutting by the Hon. Minister of Livestock Development",
          "Official Opening of the Livestock Pavilion",
          "Grand Parade of prize dairy cattle, Sahelian camels, and Bunaji bulls"
        ]
      },
      {
        id: "d1-b3",
        timeRange: "13:00 - 16:00 PM",
        heading: "E-Tagging & Vet Showcase",
        details: "Arena 1: RFID tracking demo. Tech Hub: Modern husbandry workshop. Open intake for entries.",
        location: "Arena 1, Tech Hub & Exhibition Pavilion",
        track: "Livestock",
        activities: [
          "Arena 1: RFID digital E-tagging and biosecurity tracking demo",
          "Tech Hub: Modern pastoralist husbandry workshop",
          "Open crafted, visual, culinary, needlework, and garden entries accepted"
        ]
      },
      {
        id: "d1-b4",
        timeRange: "17:00 - 21:00 PM",
        heading: "Cultural Heritage Night & Grand Durbar",
        details: "Kano Durbar Horsemen Display, Live Cultural Troupes, Animal Costume Parade Floats, Beer Garden & Karaoke Night, and Opening Fireworks.",
        location: "Durbar Track, Mainstage & Carnival Midway",
        track: "Entertainment",
        activities: [
          "Kano Durbar Horsemen Display & Royal Cavalry Pageantry",
          "Live Cultural Troupes performance",
          "Midway Opening & Live Cultural Acts",
          "Parade Floats featuring animal costumes",
          "Beer Garden Entertainment & Karaoke Night",
          "Opening Night Fireworks Display"
        ]
      }
    ]
  },

  // =========================================================================
  // DAY 2: Agro-Investment Summit, Pastoralist Forum & Concert Night 1
  // Date: 22 November 2026
  // =========================================================================
  day2: {
    dayNumber: 2,
    dateString: "Saturday, 22 November 2026",
    title: "Agro-Investment Summit, Pastoralist Forum & Concert Night 1",
    timeBlocks: [
      {
        id: "d2-b1",
        timeRange: "09:00 - 11:30 AM",
        heading: "Concurrent Forums & Queen/King NLC Pageant",
        details: "Marquee 1: Investors Roundtable. Hall B: Agropreneur Financing Workshop. Youth Rabbit Show Check-In.",
        location: "Marquee 1, Hall B, Event Tent & Youth Arena",
        track: "Agribusiness",
        activities: [
          "Marquee 1: Investors Roundtable & Sovereign Capital Briefing",
          "Hall B: Agropreneur Financing Workshop with commercial banks",
          "Event Tent: Youth Rabbit Show Check-In & Animal Inspection",
          "Youth Arena: Queen and King of National Livestock Carnival (NLC) Pageant"
        ]
      },
      {
        id: "d2-b2",
        timeRange: "12:00 - 15:00 PM",
        heading: "Live Auction, Tech Fair & Breed Competitions",
        details: "Auction Arena: Livestock Auction with RFID bidding. Exhibition: Meat/Dairy Tech. Cattle, Sheep & Goat Judging.",
        location: "Auction Arena, Exhibition Marquee & Show Rings",
        track: "Livestock",
        activities: [
          "Auction Arena: Live Livestock Auction with RFID digital bidding",
          "Exhibition: Meat & Dairy Technology Fair",
          "Main Show Ring: Cattle Formation & Conformation Judging",
          "Ring 2: Sheep and Goat Breed Competition (Balami, Uda, Yankasa, Maradi)"
        ]
      },
      {
        id: "d2-b3",
        timeRange: "15:30 - 18:00 PM",
        heading: "Pastoralist Forum & Specialized Goat Shows",
        details: "MACBAN & Kautal Hore Dialogue, Regional Cooperative Harmonization & Awards. Dairy & Meat Goat Shows.",
        location: "Conference Hall A & Goat Show Rings",
        track: "Agribusiness",
        activities: [
          "Conference Hall A: MACBAN & Kautal Hore Dialogue, Cooperative Harmonization & Awards",
          "Goat Show Ring: Youth Dairy & Meat Breeding Goat Check-In",
          "Show Ring 1: Dairy Goat Shows Jr. Does",
          "Show Ring 2: Dairy Goat Shows Sr. Does",
          "Show Ring 3: Goat Showmanship, Youth Market Goat Show & Meat Goat Show"
        ]
      },
      {
        id: "d2-b4",
        timeRange: "18:30 - 23:00 PM",
        heading: "Agritainment & Live Concert Night 1",
        details: "Parade Floats (Animal Costumes), Gala Dinner, Stand-Up Comedy, and Headlining Concert featuring Top Nigerian Artist #1.",
        location: "Central Track, Gala Pavilion & Mainstage Arena",
        track: "Entertainment",
        activities: [
          "Central Track: Parade Floats with animal costume pageantry",
          "Gala Pavilion: Executive Gala Dinner & Stand-Up Comedy Showcase",
          "Mainstage: Agritainment & Live Concert Night 1 featuring Top Nigerian Artist #1"
        ]
      }
    ]
  },

  // =========================================================================
  // DAY 3: Commercial B2B Matchmaking, Breed Awards & Grand Finale Concert
  // Date: 23 November 2026
  // =========================================================================
  day3: {
    dayNumber: 3,
    dateString: "Sunday, 23 November 2026",
    title: "Commercial B2B Matchmaking, Breed Awards & Grand Finale Concert",
    timeBlocks: [
      {
        id: "d3-b1",
        timeRange: "09:00 - 12:00 PM",
        heading: "Commercial B2B Matchmaking & Pet/Home Arts Shows",
        details: "Trade agreements, High Stakes Auction, Workshop for Children, Dog/Cat shows, Quilt & Home Arts judging.",
        location: "B2B Marquee, Auction Ring, Event Tent & Children's Pavilion",
        track: "Agribusiness",
        activities: [
          "B2B Marquee: Commercial B2B Matchmaking & B2B Supplier Meet",
          "Auction Arena: High Stakes Livestock Auction",
          "Children's Pavilion: Interactive Agro-Education Workshop for Children",
          "Arts Marquee: Open Crafted, Visual & Home Arts, and Gardening Judging",
          "Field Ring: Dog Show and Agility Showmanship Contest",
          "Event Tent: Cat Show Check-In, Cat Show & Showmanship Contest",
          "Public Hall: Traditional Quilt Judging (Open to Public)"
        ]
      },
      {
        id: "d3-b2",
        timeRange: "13:00 - 15:00 PM",
        heading: "Livestock Judging Awards & Trophy Presentation",
        details: "Exhibitor Recognition, Breed Champions Awards, & Pastoralist Cooperative Grants.",
        location: "Beef Show Ring & Presentation Dais",
        track: "Ceremony",
        activities: [
          "Beef Show Ring: Livestock Judging Awards",
          "Presentation Dais: Exhibitor Recognition & Breed Champions Awards",
          "Grant Ceremony: Pastoralist Cooperative Grants & Trophy Presentation"
        ]
      },
      {
        id: "d3-b3",
        timeRange: "15:30 - 17:30 PM",
        heading: "Closing Press Conference",
        details: "Communique Readout by Steering Committee & Media Q&A Session.",
        location: "Media Press Center",
        track: "Ceremony",
        activities: [
          "Media Center: Official Communique Readout by Steering Committee",
          "Economic Readout & Media Q&A Session"
        ]
      },
      {
        id: "d3-b4",
        timeRange: "18:00 - 23:00 PM",
        heading: "Grand Finale Concert & Laser Light Show",
        details: "Closing Festival Party featuring superstar Top Nigerian Artist #2, Laser Light Show, Closing Remarks & Fireworks.",
        location: "Mainstage Amphitheater & Carnival Grounds",
        track: "Entertainment",
        activities: [
          "Mainstage: Official Closing Remarks & Patrons Recognition",
          "Grand Finale Concert featuring superstar Top Nigerian Artist #2",
          "Carnival Grounds: Synchronized Laser Light Show & Fireworks Display",
          "Late-Night Entertainment & Commercial Bazaar"
        ]
      }
    ]
  }
};
