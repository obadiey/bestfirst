import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
  await prisma.profilePrompt.deleteMany();
  await prisma.profilePhoto.deleteMany();
  await prisma.optIn.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing data");

  // Create demo users - Inviters
  const inviters = await Promise.all([
    prisma.user.create({
      data: {
        email: "alex@demo.com",
        name: "Alex Chen",
        age: 28,
        bio: "Software engineer who loves trying new restaurants and hiking on weekends. Looking for someone adventurous.",
        photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
        role: "INVITER",
        location: "San Francisco, CA",
        occupation: "Software Engineer",
        interests: "hiking, cooking, photography",
        phone: "+1 555 010 1001",
        credits: 500,
      },
    }),
    prisma.user.create({
      data: {
        email: "marcus@demo.com",
        name: "Marcus Williams",
        age: 31,
        bio: "Architect with a passion for art, good wine, and deep conversations. Weekend warrior on the ski slopes.",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        role: "INVITER",
        location: "New York, NY",
        occupation: "Architect",
        interests: "architecture, wine, skiing",
        phone: "+1 555 010 1002",
        credits: 500,
      },
    }),
    prisma.user.create({
      data: {
        email: "james@demo.com",
        name: "James Park",
        age: 26,
        bio: "Music producer and coffee enthusiast. I think the best dates are the ones where you lose track of time.",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
        role: "INVITER",
        location: "Los Angeles, CA",
        occupation: "Music Producer",
        interests: "music, coffee, surfing",
        phone: "+1 555 010 1003",
        credits: 500,
      },
    }),
    prisma.user.create({
      data: {
        email: "daniel@demo.com",
        name: "Daniel Rivera",
        age: 29,
        bio: "ER doctor who needs more fun in his life. Love spontaneity, good food, and people who make me laugh.",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        role: "INVITER",
        location: "Chicago, IL",
        occupation: "Emergency Physician",
        interests: "running, comedy, travel",
        phone: "+1 555 010 1004",
        credits: 500,
      },
    }),
  ]);

  // Create demo users - Invitees
  const invitees = await Promise.all([
    prisma.user.create({
      data: {
        email: "sophie@demo.com",
        name: "Sophie Laurent",
        age: 27,
        bio: "Product designer by day, amateur chef by night. I believe life is too short for boring dates.",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
        role: "INVITEE",
        location: "San Francisco, CA",
        occupation: "Product Designer",
        interests: "cooking, yoga, art galleries",
        phone: "+1 555 010 2001",
        credits: 0,
      },
    }),
    prisma.user.create({
      data: {
        email: "maya@demo.com",
        name: "Maya Johnson",
        age: 25,
        bio: "Grad student studying marine biology. Love the outdoors, live music, and a good cocktail bar.",
        photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        role: "INVITEE",
        location: "San Francisco, CA",
        occupation: "Graduate Student",
        interests: "ocean, music, dancing",
        phone: "+1 555 010 2002",
        credits: 0,
      },
    }),
    prisma.user.create({
      data: {
        email: "olivia@demo.com",
        name: "Olivia Kim",
        age: 29,
        bio: "Marketing director who travels 3 months a year. Always looking for the next great adventure and story.",
        photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
        role: "INVITEE",
        location: "New York, NY",
        occupation: "Marketing Director",
        interests: "travel, photography, wine",
        phone: "+1 555 010 2003",
        credits: 0,
      },
    }),
    prisma.user.create({
      data: {
        email: "emma@demo.com",
        name: "Emma Torres",
        age: 26,
        bio: "Startup founder building something cool. I like people who are passionate about what they do.",
        photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
        role: "INVITEE",
        location: "Los Angeles, CA",
        occupation: "Startup Founder",
        interests: "entrepreneurship, hiking, sushi",
        phone: "+1 555 010 2004",
        credits: 0,
      },
    }),
  ]);

  console.log(`Created ${inviters.length} inviters and ${invitees.length} invitees`);

  // Add profile photos for demo users
  const photoSets: Record<string, string[]> = {
    [inviters[0].id]: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&h=800&fit=crop",
    ],
    [inviters[1].id]: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&h=800&fit=crop",
    ],
    [inviters[2].id]: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=600&h=800&fit=crop",
    ],
    [inviters[3].id]: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop",
    ],
    [invitees[0].id]: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop",
    ],
    [invitees[1].id]: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&h=800&fit=crop",
    ],
    [invitees[2].id]: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
    ],
    [invitees[3].id]: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&h=800&fit=crop",
    ],
  };

  for (const [userId, urls] of Object.entries(photoSets)) {
    await prisma.profilePhoto.createMany({
      data: urls.map((url, i) => ({ userId, url, order: i })),
    });
  }

  // Add profile prompts for demo users
  const promptSets: Record<string, { prompt: string; answer: string }[]> = {
    [inviters[0].id]: [
      { prompt: "My ideal first date", answer: "Exploring a new neighborhood, stumbling into a great restaurant, and talking until they kick us out." },
      { prompt: "I geek out on", answer: "Trail maps, sourdough bread science, and finding the perfect camera angle." },
    ],
    [inviters[1].id]: [
      { prompt: "The way to my heart is", answer: "A great bottle of wine and an even better conversation about life, dreams, and everything in between." },
      { prompt: "A perfect Sunday looks like", answer: "Farmer's market in the morning, sketching in Central Park, cooking dinner together." },
    ],
    [inviters[2].id]: [
      { prompt: "My simple pleasures", answer: "Morning espresso on the balcony, vinyl records on a Sunday, and finding new hole-in-the-wall cafes." },
      { prompt: "Something that surprises people about me", answer: "I was a competitive swimmer in college and I still swim laps at 6am most mornings." },
    ],
    [inviters[3].id]: [
      { prompt: "I'm looking for", answer: "Someone who can make me laugh after a 12-hour shift. Bonus points if you appreciate bad hospital puns." },
      { prompt: "My most spontaneous moment", answer: "Booked a one-way ticket to Tokyo after a rough week. Best decision I ever made." },
    ],
    [invitees[0].id]: [
      { prompt: "My ideal first date", answer: "A cooking class where we make a mess and laugh about it, then eat what we made over candlelight." },
      { prompt: "I'll pick the restaurant if you", answer: "Promise to try whatever I order. I have great taste, trust me." },
      { prompt: "My love language is", answer: "Acts of service and quality time. Make me a playlist and I'm yours." },
    ],
    [invitees[1].id]: [
      { prompt: "A life goal of mine", answer: "Swimming with whale sharks in every ocean. Two down, three to go." },
      { prompt: "The way to my heart is", answer: "Live music, good tacos, and someone who asks real questions." },
    ],
    [invitees[2].id]: [
      { prompt: "My most spontaneous moment", answer: "Extended a work trip to Bali by two weeks and learned to surf. Still terrible at it, still love it." },
      { prompt: "I geek out on", answer: "Street photography, hidden speakeasies, and building the perfect travel itinerary." },
      { prompt: "A perfect Sunday looks like", answer: "Brunch at a new spot, getting lost in a museum, then sunset drinks somewhere with a view." },
    ],
    [invitees[3].id]: [
      { prompt: "I'm looking for", answer: "Someone who has their own thing going on and wants a partner in crime, not a project." },
      { prompt: "Something that surprises people about me", answer: "I was pre-med before pivoting to tech. I can still name all 206 bones in the body." },
    ],
  };

  for (const [userId, prompts] of Object.entries(promptSets)) {
    await prisma.profilePrompt.createMany({
      data: prompts.map((p, i) => ({ userId, prompt: p.prompt, answer: p.answer, order: i })),
    });
  }

  console.log("Created profile photos and prompts");

  // Create curated experiences
  const now = new Date();
  const nextWeek = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d;
  };

  const experiences = await Promise.all([
    // OPEN experiences (inviters can bid)
    prisma.experience.create({
      data: {
        title: "Ice Skating at Rockefeller Center",
        description:
          "A classic NYC winter date. Private session with hot chocolate and a cozy corner reserved just for you two.",
        category: "Adventure",
        location: "Rockefeller Center, NYC",
        dateTime: nextWeek(7),
        minimumBid: 80,
        status: "OPEN",
        image: "",
      },
    }),
    prisma.experience.create({
      data: {
        title: "Omakase Dinner at Sushi Nakazawa",
        description:
          "12-course omakase experience at one of NYC's top sushi bars. Intimate counter seating for two.",
        category: "Dining",
        location: "Sushi Nakazawa, West Village, NYC",
        dateTime: nextWeek(5),
        minimumBid: 150,
        status: "OPEN",
        image: "",
      },
    }),
    prisma.experience.create({
      data: {
        title: "Sunset Cocktails at a Speakeasy",
        description:
          "Hidden speakeasy with craft cocktails, jazz, and candlelight. Table reserved with a bottle of champagne.",
        category: "Drinks",
        location: "Please Don't Tell, East Village, NYC",
        dateTime: nextWeek(4),
        minimumBid: 60,
        status: "OPEN",
        image: "",
      },
    }),
    prisma.experience.create({
      data: {
        title: "Museum + Coffee Walking Tour",
        description:
          "Private guided tour of the MoMA followed by coffee at a hidden gem cafe nearby. Art and conversation.",
        category: "Culture",
        location: "MoMA, Midtown Manhattan",
        dateTime: nextWeek(6),
        minimumBid: 50,
        status: "OPEN",
        image: "",
      },
    }),
    prisma.experience.create({
      data: {
        title: "Ski Day at Hunter Mountain",
        description:
          "Full day ski pass for two with lodge lunch included. Transportation arranged from the city.",
        category: "Adventure",
        location: "Hunter Mountain, NY",
        dateTime: nextWeek(10),
        minimumBid: 120,
        status: "OPEN",
        image: "",
      },
    }),
    prisma.experience.create({
      data: {
        title: "Cooking Class: Pasta from Scratch",
        description:
          "Learn to make fresh pasta together with a professional Italian chef. Includes wine pairing and dinner.",
        category: "Dining",
        location: "Sur La Table, Chelsea, NYC",
        dateTime: nextWeek(8),
        minimumBid: 70,
        status: "OPEN",
        image: "",
      },
    }),
    prisma.experience.create({
      data: {
        title: "Rooftop Jazz Night",
        description:
          "Intimate jazz performance on a heated rooftop overlooking the skyline. Includes two drinks and appetizers.",
        category: "Entertainment",
        location: "Le Bain, Meatpacking District",
        dateTime: nextWeek(3),
        minimumBid: 90,
        status: "OPEN",
        image: "",
      },
    }),
    prisma.experience.create({
      data: {
        title: "Botanical Garden & Wine Tasting",
        description:
          "Stroll through the Brooklyn Botanic Garden followed by a curated wine tasting at a nearby vineyard bar.",
        category: "Outdoors",
        location: "Brooklyn Botanic Garden",
        dateTime: nextWeek(9),
        minimumBid: 55,
        status: "OPEN",
        image: "",
      },
    }),

    // ASSIGNED experiences (already won, invitees can opt in)
    prisma.experience.create({
      data: {
        title: "Candlelit Dinner at Le Bernardin",
        description:
          "Tasting menu at a 3-star Michelin restaurant. An unforgettable dining experience for two.",
        category: "Dining",
        location: "Le Bernardin, Midtown, NYC",
        dateTime: nextWeek(6),
        minimumBid: 200,
        status: "ASSIGNED",
        winnerId: inviters[0].id,
        image: "",
      },
    }),
    prisma.experience.create({
      data: {
        title: "Helicopter Tour + Dinner",
        description:
          "15-minute helicopter tour over Manhattan followed by dinner at a waterfront restaurant.",
        category: "Adventure",
        location: "Downtown Manhattan Heliport",
        dateTime: nextWeek(11),
        minimumBid: 300,
        status: "ASSIGNED",
        winnerId: inviters[1].id,
        image: "",
      },
    }),
    prisma.experience.create({
      data: {
        title: "Comedy Show + Late Night Bites",
        description:
          "VIP tickets to a standup show at Comedy Cellar followed by late-night food at a classic NYC diner.",
        category: "Entertainment",
        location: "Comedy Cellar, Greenwich Village",
        dateTime: nextWeek(4),
        minimumBid: 75,
        status: "ASSIGNED",
        winnerId: inviters[2].id,
        image: "",
      },
    }),
    prisma.experience.create({
      data: {
        title: "Sunrise Hike & Breakfast",
        description:
          "I know a beautiful trail with an amazing sunrise view. I'll pack breakfast and coffee. Just bring good energy!",
        category: "Outdoors",
        location: "Bear Mountain, NY",
        dateTime: nextWeek(5),
        minimumBid: 0,
        status: "ASSIGNED",
        isCustom: true,
        createdById: inviters[3].id,
        winnerId: inviters[3].id,
        image: "",
      },
    }),
  ]);

  console.log(`Created ${experiences.length} experiences`);

  // Create dual-role demo user
  const sam = await prisma.user.create({
    data: {
      email: "sam@demo.com",
      name: "Sam Taylor",
      age: 28,
      bio: "Photographer and foodie who loves being on both sides of a great date. Sometimes I plan, sometimes I go with the flow.",
      photo: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=400&h=400&fit=crop&crop=face",
      role: "INVITER",
      location: "New York, NY",
      occupation: "Photographer",
      interests: "photography, food, travel, art",
      phone: "+1 555 010 3000",
      credits: 500,
    },
  });

  await prisma.profilePhoto.createMany({
    data: [
      { userId: sam.id, url: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=600&h=800&fit=crop", order: 0 },
      { userId: sam.id, url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop", order: 1 },
    ],
  });

  await prisma.profilePrompt.createMany({
    data: [
      { userId: sam.id, prompt: "My simple pleasures", answer: "Golden hour light, a good espresso, and finding beauty in unexpected places.", order: 0 },
      { userId: sam.id, prompt: "I'm looking for", answer: "Someone equally comfortable at a gallery opening and a taco truck at 2am.", order: 1 },
    ],
  });

  console.log("Created dual-role user: Sam Taylor");

  // Create some opt-ins for the ASSIGNED experiences
  const assignedExperiences = experiences.filter((e) => e.status === "ASSIGNED");

  await prisma.optIn.createMany({
    data: [
      {
        userId: invitees[0].id,
        experienceId: assignedExperiences[0].id,
        message: "I love fine dining! This sounds amazing.",
      },
      {
        userId: invitees[1].id,
        experienceId: assignedExperiences[0].id,
        message: "I've always wanted to try Le Bernardin!",
      },
    ],
  });

  await prisma.optIn.create({
    data: {
      userId: invitees[2].id,
      experienceId: assignedExperiences[1].id,
      message: "A helicopter tour? Count me in!",
    },
  });

  await prisma.optIn.createMany({
    data: [
      {
        userId: invitees[3].id,
        experienceId: assignedExperiences[2].id,
        message: "Comedy is my love language",
      },
      {
        userId: invitees[0].id,
        experienceId: assignedExperiences[2].id,
        message: "Love a good laugh! Sounds fun.",
      },
    ],
  });

  await prisma.bid.create({
    data: { userId: sam.id, experienceId: experiences[6].id, amount: 100 },
  });

  await prisma.optIn.create({
    data: {
      userId: sam.id,
      experienceId: assignedExperiences[1].id,
      message: "This sounds incredible! I'd love to join.",
    },
  });

  await prisma.bid.createMany({
    data: [
      { userId: inviters[0].id, experienceId: experiences[0].id, amount: 100 },
      { userId: inviters[1].id, experienceId: experiences[0].id, amount: 120 },
      { userId: inviters[2].id, experienceId: experiences[1].id, amount: 160 },
      { userId: inviters[3].id, experienceId: experiences[2].id, amount: 70 },
      { userId: inviters[0].id, experienceId: experiences[3].id, amount: 55 },
    ],
  });

  console.log("Created demo bids and opt-ins");
  console.log("\n--- Demo Accounts ---");
  console.log("Inviters (login with email):");
  inviters.forEach((u) => console.log(`  ${u.name}: ${u.email}`));
  console.log("\nInvitees (login with email):");
  invitees.forEach((u) => console.log(`  ${u.name}: ${u.email}`));
  console.log("\nDual-role (login with email):");
  console.log(`  ${sam.name}: ${sam.email} (has both bids and opt-ins, try switching roles!)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
