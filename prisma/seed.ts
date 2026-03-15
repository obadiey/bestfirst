import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
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
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        role: "INVITER",
        location: "San Francisco, CA",
        occupation: "Software Engineer",
        interests: "hiking, cooking, photography",
        credits: 500,
      },
    }),
    prisma.user.create({
      data: {
        email: "marcus@demo.com",
        name: "Marcus Williams",
        age: 31,
        bio: "Architect with a passion for art, good wine, and deep conversations. Weekend warrior on the ski slopes.",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
        role: "INVITER",
        location: "New York, NY",
        occupation: "Architect",
        interests: "architecture, wine, skiing",
        credits: 500,
      },
    }),
    prisma.user.create({
      data: {
        email: "james@demo.com",
        name: "James Park",
        age: 26,
        bio: "Music producer and coffee enthusiast. I think the best dates are the ones where you lose track of time.",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
        role: "INVITER",
        location: "Los Angeles, CA",
        occupation: "Music Producer",
        interests: "music, coffee, surfing",
        credits: 500,
      },
    }),
    prisma.user.create({
      data: {
        email: "daniel@demo.com",
        name: "Daniel Rivera",
        age: 29,
        bio: "ER doctor who needs more fun in his life. Love spontaneity, good food, and people who make me laugh.",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel",
        role: "INVITER",
        location: "Chicago, IL",
        occupation: "Emergency Physician",
        interests: "running, comedy, travel",
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
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
        role: "INVITEE",
        location: "San Francisco, CA",
        occupation: "Product Designer",
        interests: "cooking, yoga, art galleries",
        credits: 0,
      },
    }),
    prisma.user.create({
      data: {
        email: "maya@demo.com",
        name: "Maya Johnson",
        age: 25,
        bio: "Grad student studying marine biology. Love the outdoors, live music, and a good cocktail bar.",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
        role: "INVITEE",
        location: "San Francisco, CA",
        occupation: "Graduate Student",
        interests: "ocean, music, dancing",
        credits: 0,
      },
    }),
    prisma.user.create({
      data: {
        email: "olivia@demo.com",
        name: "Olivia Kim",
        age: 29,
        bio: "Marketing director who travels 3 months a year. Always looking for the next great adventure and story.",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
        role: "INVITEE",
        location: "New York, NY",
        occupation: "Marketing Director",
        interests: "travel, photography, wine",
        credits: 0,
      },
    }),
    prisma.user.create({
      data: {
        email: "emma@demo.com",
        name: "Emma Torres",
        age: 26,
        bio: "Startup founder building something cool. I like people who are passionate about what they do.",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
        role: "INVITEE",
        location: "Los Angeles, CA",
        occupation: "Startup Founder",
        interests: "entrepreneurship, hiking, sushi",
        credits: 0,
      },
    }),
  ]);

  console.log(`Created ${inviters.length} inviters and ${invitees.length} invitees`);

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
        winnerId: inviters[0].id, // Alex won this
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
        winnerId: inviters[1].id, // Marcus won this
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
        winnerId: inviters[2].id, // James won this
        image: "",
      },
    }),
    // Custom experience (already created by an inviter)
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
        createdById: inviters[3].id, // Daniel created this
        winnerId: inviters[3].id,
        image: "",
      },
    }),
  ]);

  console.log(`Created ${experiences.length} experiences`);

  // Create some opt-ins for the ASSIGNED experiences
  const assignedExperiences = experiences.filter((e) => e.status === "ASSIGNED");

  // Sophie and Maya opt into the Le Bernardin dinner (Alex's)
  await prisma.optIn.createMany({
    data: [
      {
        userId: invitees[0].id, // Sophie
        experienceId: assignedExperiences[0].id,
        message: "I love fine dining! This sounds amazing.",
      },
      {
        userId: invitees[1].id, // Maya
        experienceId: assignedExperiences[0].id,
        message: "I've always wanted to try Le Bernardin!",
      },
    ],
  });

  // Olivia opts into the helicopter tour (Marcus's)
  await prisma.optIn.create({
    data: {
      userId: invitees[2].id, // Olivia
      experienceId: assignedExperiences[1].id,
      message: "A helicopter tour? Count me in!",
    },
  });

  // Emma and Sophie opt into the comedy show (James's)
  await prisma.optIn.createMany({
    data: [
      {
        userId: invitees[3].id, // Emma
        experienceId: assignedExperiences[2].id,
        message: "Comedy is my love language 😂",
      },
      {
        userId: invitees[0].id, // Sophie
        experienceId: assignedExperiences[2].id,
        message: "Love a good laugh! Sounds fun.",
      },
    ],
  });

  // Some bids on OPEN experiences
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
  console.log("\nAll passwords are handled by cookie-based mock auth (no password needed)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
